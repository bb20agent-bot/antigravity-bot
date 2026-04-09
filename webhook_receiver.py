import os
import threading
import time
import requests
import ccxt
try:
    import MetaTrader5 as mt5
    MT5_AVAILABLE = True
except ImportError:
    mt5 = None
    MT5_AVAILABLE = False
from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# 1. 환경 변수 및 설정 로드 (.env 파일에서 API 키 불러오기)
load_dotenv()
app = FastAPI(title="Vora Fandom Trading Bridge")

# CORS 설정 (프론트엔드 통신 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 세부 도메인 지정 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 글로벌 상태 저장소 (프론트엔드 연동)
app_state = {
    "mode": "Autopilot",  # 'Safety Belt' or 'Autopilot'
    "seed_balance": 1000.0,
    "risk_pct": 1.0,
    "auto_sl_enabled": True,
    "telegram_enabled": True
}

# 2. 거래소 연결 초기화
def get_binance_client():
    return ccxt.binanceusdm({
        'apiKey': os.getenv('BINANCE_API_KEY'),
        'secret': os.getenv('BINANCE_SECRET'),
        'enableRateLimit': True,
    })

binance = get_binance_client()

def init_mt5():
    if not MT5_AVAILABLE:
        print("MT5 모듈이 설치되어 있지 않습니다. 바이낸스 모드로만 동작합니다.")
        return False
    if not mt5.initialize():
        print("MT5 초기화 실패")
        return False
    exness_account = os.getenv('EXNESS_ACCOUNT')
    if exness_account:
        authorized = mt5.login(
            int(exness_account),
            password=os.getenv('EXNESS_PASSWORD'),
            server=os.getenv('EXNESS_SERVER')
        )
        if authorized:
            print("MT5(Exness) 연결 성공!")
            return True
    return False

init_mt5()

def send_telegram_msg(msg: str):
    if not app_state["telegram_enabled"]:
        return
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    if token and chat_id:
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        try:
            requests.post(url, json={"chat_id": chat_id, "text": msg})
        except Exception as e:
            print(f"Telegram error: {e}")

# 3. 모델 정의
class TradingViewWebhook(BaseModel):
    passphrase: str
    asset_type: str
    symbol: str
    direction: str
    leverage: int
    risk_pct: float
    sl_distance: float
    tp_distance: float

class ApiKeys(BaseModel):
    binance_api: str = ""
    binance_secret: str = ""
    telegram_token: str = ""
    telegram_chat_id: str = ""
    # MT5 Keys 생략

class SettingsToggle(BaseModel):
    mode: str = None
    auto_sl_enabled: bool = None
    telegram_enabled: bool = None
    seed_balance: float = None
    risk_pct: float = None

class ManualTrade(BaseModel):
    asset_type: str
    symbol: str
    direction: str
    leverage: int
    sl_distance: float
    tp_distance: float

# 4. 프론트엔드 통신 API
@app.post("/api/keys")
async def save_api_keys(keys: ApiKeys):
    # 실제 구현 시 .env 업데이트 또는 Secure Storage 연동
    global binance
    os.environ['BINANCE_API_KEY'] = keys.binance_api
    os.environ['BINANCE_SECRET'] = keys.binance_secret
    binance = get_binance_client()
    return {"status": "success", "message": "API 키가 업데이트 되었습니다."}

@app.post("/api/settings/toggle")
async def update_settings(settings: SettingsToggle):
    # 전달된 설정값만 업데이트
    for key, value in settings.dict(exclude_unset=True).items():
        app_state[key] = value
    return {"status": "success", "state": app_state}

@app.post("/api/settings/trade")
async def execute_manual_trade(trade: ManualTrade):
    # 프론트엔드 대시보드(수동 트레이딩) 연동
    webhook_data = TradingViewWebhook(
        passphrase=os.getenv("WEBHOOK_PASSPHRASE", "default_pass"),
        asset_type=trade.asset_type,
        symbol=trade.symbol,
        direction=trade.direction,
        leverage=trade.leverage,
        risk_pct=app_state["risk_pct"],
        sl_distance=trade.sl_distance,
        tp_distance=trade.tp_distance
    )
    return await execute_trade(webhook_data, is_manual=True)

# ─── 리스크 연동 및 SL/TP 구현 ───
def calculate_position_size(asset_type, symbol, risk_pct, sl_distance, current_price):
    seed = app_state["seed_balance"]
    risk_amount = seed * (risk_pct / 100.0)
    
    if asset_type == "BINANCE":
        size = risk_amount / sl_distance
        return max(round(size, 3), 0.001)
    elif asset_type == "MT5":
        pip_value = 10 if "USD" in symbol else 1
        lot = risk_amount / (sl_distance * pip_value)
        return max(round(lot, 2), 0.01)
    return 0.1

# ─── 듀얼 모드 분기 로직 (수동 진입 감지 백그라운드 스레드) ───
def monitor_manual_positions():
    while True:
        try:
            if app_state["mode"] == "Safety Belt" and app_state["auto_sl_enabled"]:
                # 현재 포지션을 감지
                positions = binance.fetch_positions()
                active_positions = [pos for pos in positions if float(pos["positionAmt"]) != 0]

                if not active_positions:
                    time.sleep(10)
                    continue

                # 모든 미체결 주문을 한 번에 가져와 메모리에서 필터링 (N+1 문제 해결)
                all_open_orders = binance.fetch_open_orders()

                for pos in active_positions:
                    symbol = pos["symbol"]
                    # 해당 심볼의 주문만 필터링
                    open_orders = [o for o in all_open_orders if o['symbol'] == symbol]
                    sl_exists = any(o['type'] == 'stopMarket' for o in open_orders)

                    if not sl_exists:
                        amt = float(pos["positionAmt"])
                        entry_price = float(pos["entryPrice"])
                        side = 'sell' if amt > 0 else 'buy'
                        # 안전벨트 모드: 1% 밖 하드 손절 걸기 등 (여기서는 대략 1% 차이)
                        sl_price = entry_price * 0.99 if amt > 0 else entry_price * 1.01
                        params = {'stopPrice': sl_price, 'reduceOnly': True}
                        
                        binance.create_order(symbol, 'stopMarket', side, abs(amt), None, params)
                        send_telegram_msg(f"🛡️ Safety Belt: {symbol} 수동 진입 감지. 안전 SL 자동설정 완료 ({sl_price})")
        except Exception as e:
            pass
        time.sleep(10)

threading.Thread(target=monitor_manual_positions, daemon=True).start()

async def execute_trade(data: TradingViewWebhook, is_manual=False):
    # 시세 확인 및 수량 계산
    if data.asset_type == "BINANCE":
        ticker = binance.fetch_ticker(data.symbol)
        current_price = ticker['last']
    else:
        tick = mt5.symbol_info_tick(data.symbol)
        current_price = tick.ask if data.direction == 'LONG' else tick.bid

    order_size = calculate_position_size(data.asset_type, data.symbol, app_state["risk_pct"], data.sl_distance, current_price)

    # ─── 모드 A (Safety Belt) ───
    if app_state["mode"] == "Safety Belt" and not is_manual:
        msg = f"🔔 [웹훅 신호 방어] {data.symbol} {data.direction} 신호 수신. Safety Belt 모드 (1Lot = 알림만)"
        send_telegram_msg(msg)
        return {"status": "ignored", "reason": "Safety Belt mode active", "msg": msg}

    # ─── 모드 B (Autopilot) 또는 수동 진입 ───
    if data.asset_type == "BINANCE":
        binance.set_leverage(data.leverage, data.symbol)
        
        side = 'buy' if data.direction == 'LONG' else 'sell'
        # 1) 진입
        order = binance.create_market_order(data.symbol, side, order_size)
        
        # 2) CCXT 자동 손절(SL), 익절(TP) 로직 작성
        sl_side = 'sell' if side == 'buy' else 'buy'
        sl_price = current_price - data.sl_distance if side == 'buy' else current_price + data.sl_distance
        tp_price = current_price + data.tp_distance if side == 'buy' else current_price - data.tp_distance
        
        sl_params = {'stopPrice': sl_price, 'reduceOnly': True}
        tp_params = {'stopPrice': tp_price, 'reduceOnly': True}
        
        sl_order = binance.create_order(data.symbol, 'stopMarket', sl_side, order_size, None, sl_params)
        tp_order = binance.create_order(data.symbol, 'takeProfitMarket', sl_side, order_size, None, tp_params)

        send_telegram_msg(f"🤖 Autopilot Binance 진입 완료\n코인: {data.symbol}\n방향: {side}\n수량: {order_size}\nSL: {sl_price}\nTP: {tp_price}")
        return {
            "status": "success", 
            "exchange": "BINANCE", 
            "order_id": order['id'], 
            "sl_order": sl_order['id'],
            "tp_order": tp_order['id']
        }

    elif data.asset_type == "MT5":
        order_type = mt5.ORDER_TYPE_BUY if data.direction == 'LONG' else mt5.ORDER_TYPE_SELL
        sl_price = current_price - data.sl_distance if data.direction == 'LONG' else current_price + data.sl_distance
        tp_price = current_price + data.tp_distance if data.direction == 'LONG' else current_price - data.tp_distance
        
        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": data.symbol,
            "volume": float(order_size), 
            "type": order_type,
            "price": current_price,
            "sl": sl_price,
            "tp": tp_price,
            "deviation": 20,
            "magic": 234000,
            "comment": "Vora Auto Trade",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }
        
        result = mt5.order_send(request)
        if result.retcode != mt5.TRADE_RETCODE_DONE:
            raise HTTPException(status_code=500, detail=f"MT5 Order Failed: {result.comment}")
            
        send_telegram_msg(f"🤖 Autopilot MT5 진입 완료: {data.symbol} {data.direction} {order_size}\nSL: {sl_price}\nTP: {tp_price}")
        return {"status": "success", "exchange": "MT5", "ticket": result.order}

# 웹훅 수신 라우터
@app.post("/webhook/user/{user_id}")
async def receive_webhook(user_id: str, data: TradingViewWebhook):
    if data.passphrase != os.getenv("WEBHOOK_PASSPHRASE", "vq23_pass"):
        raise HTTPException(status_code=401, detail="Unauthorized Webhook")
    
    print(f"[{user_id}] 🚀 웹훅 수신 완료: {data.symbol} {data.direction}")
    return await execute_trade(data)