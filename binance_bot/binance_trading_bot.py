import os
import time
import ccxt
import requests
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# 환경변수 설정
API_KEY = os.getenv('BINANCE_API_KEY')
API_SECRET = os.getenv('BINANCE_API_SECRET')
WEBHOOK_URL = os.getenv('GOOGLE_SHEET_WEBHOOK')
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')
# 설정값 (여기서 수정해 사용 가능)
# [주의] 이 값들은 투입 원금(ROE) 대비 손익 퍼센트입니다. 
ROE_SL_PERCENT = 5.0  # 투입 원금 대비 기본 손절 5% (지정된 격리 진입 금액 기준)
ROE_TP_PERCENT = 15.0 # 투입 원금 대비 기본 익절 15% (목표 RR 1:3 비율)
POLL_INTERVAL = 3     # 몇 초마다 포지션을 확인할지 (기본 3초)

if not API_KEY or not API_SECRET:
    print("API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.")
    exit(1)

# 바이낸스 선물 거래소 초기화 (ccxt)
exchange = ccxt.binance({
    'apiKey': API_KEY,
    'secret': API_SECRET,
    'enableRateLimit': True,
    'options': {
        'defaultType': 'future', # 선물 시장 기준
    }
})

# 기존에 SL/TP를 세팅한 포지션들의 식별자를 저장해 중복 주문을 방지
# (symbol, side) 구조를 가짐
processed_positions = set()

def log_to_google_sheet(data_dict):
    """구글 시트에 로그 기록"""
    if not WEBHOOK_URL:
        return
    try:
        response = requests.post(WEBHOOK_URL, json=data_dict, timeout=5)
        print(f"✅ 구글 시트 반영 완료")
    except Exception as e:
        print(f"❌ 구글 시트 기록 실패: {e}")

def send_telegram_message(message):
    """텔레그램으로 알림 전송"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML"
    }
    try:
        requests.post(url, json=payload, timeout=5)
    except Exception as e:
        print(f"❌ 텔레그램 알림 전송 실패: {e}")

def set_sl_tp_for_position(symbol, side, amount, entry_price, leverage):
    """새로운 포지션 발견 시 레버리지를 감안하여 원금(ROE) 기준 SL/TP를 설정합니다."""
    try:
        print(f"\n🚀 [새 포지션 감지] {symbol} | {side.upper()} | 진입가: {entry_price} | 수량: {amount} | 특이사항: 레버리지 {leverage}x")
        
        sl_price = 0
        tp_price = 0
        
        # 롱 포지션일 경우
        if side == 'long':
            # 롱 진입 시: 타겟가격 = 진입가격 - (진입가격 * (ROE_SL_PERCENT / 레버리지) / 100)
            sl_price = entry_price * (1 - ((ROE_SL_PERCENT / leverage) / 100))
            tp_price = entry_price * (1 + ((ROE_TP_PERCENT / leverage) / 100))
            
            # SL 세팅 (조건부 시장가 매도, 100% 수량)
            print(f"⏱️ 자동 설정 중... SL: {sl_price:.4f} / TP: {tp_price:.4f} (투자 원금 기준 SL -{ROE_SL_PERCENT}%, TP +{ROE_TP_PERCENT}%)")
            exchange.create_order(symbol, 'stop_market', 'sell', amount, sl_price, params={'stopPrice': sl_price, 'reduceOnly': True})
            
            # TP 세팅 (조건부 시장가 매도, 50% 수량)
            if ROE_TP_PERCENT > 0:
                tp_amount = amount * 0.5
                exchange.create_order(symbol, 'take_profit_market', 'sell', tp_amount, tp_price, params={'stopPrice': tp_price, 'reduceOnly': True})

        # 숏 포지션일 경우
        elif side == 'short':
            # 숏 진입 시: 타겟가격 = 진입가격 + (진입가격 * (ROE_SL_PERCENT / 레버리지) / 100)
            sl_price = entry_price * (1 + ((ROE_SL_PERCENT / leverage) / 100))
            tp_price = entry_price * (1 - ((ROE_TP_PERCENT / leverage) / 100))
            
            # SL 세팅 (조건부 시장가 매수, 100% 수량)
            print(f"⏱️ 자동 설정 중... SL: {sl_price:.4f} / TP: {tp_price:.4f} (투자 원금 기준 SL -{ROE_SL_PERCENT}%, TP +{ROE_TP_PERCENT}%)")
            exchange.create_order(symbol, 'stop_market', 'buy', amount, sl_price, params={'stopPrice': sl_price, 'reduceOnly': True})
            
            # TP 세팅 (조건부 시장가 매수, 50% 수량)
            if ROE_TP_PERCENT > 0:
                tp_amount = amount * 0.5
                exchange.create_order(symbol, 'take_profit_market', 'buy', tp_amount, tp_price, params={'stopPrice': tp_price, 'reduceOnly': True})
        
        # 처리 완료 로그 및 시트 반영
        print(f"✅ {symbol} {side.upper()} SL/TP 설정 완료!")
        
        # 텔레그램 알림 전송 (단순 텍스트 대신 Vora 영상 렌더링(Puppeteer) 서버 API로 전송)
        try:
            url = "http://localhost:3001/api/internal/record-trade-video"
            payload = {
                "symbol": symbol.replace('/', ''),
                "side": side.upper(),
                "price": entry_price,
                "amount": amount
            }
            requests.post(url, json=payload, timeout=5)
            print("👉 Vora 텔레그램 체결 영상 전송 서버 파이프라인 트리거 완료!")
        except Exception as e:
            print(f"❌ 체결 영상 렌더링 서버 요청 에러 (기본 텍스트로 대체 방지): {e}")
        
        log_to_google_sheet({
            "symbol": symbol,
            "action": f"{side.upper()}_AUTO_HEDGED",
            "price": entry_price,
            "quantity": amount,
            "message": f"Auto SL: {sl_price:.4f} / TP: {tp_price:.4f}"
        })

    except Exception as e:
        print(f"❌ SL/TP 설정 중 에러 발생: {e}")
        log_to_google_sheet({
            "symbol": symbol,
            "action": "ERROR",
            "message": f"Auto SL/TP Failed: {str(e)}"
        })

def check_positions():
    """현재 유지 중인 포지션을 가져와 새로운 포지션인지 확인합니다."""
    global processed_positions
    
    try:
        # 현재 보유중인 선물 포지션 가져오기
        balance = exchange.fetch_balance(params={'type': 'future'})
        positions = balance['info']['positions']
        
        current_active_positions = set()
        
        for pos in positions:
            symbol = pos['symbol']
            # 바이낸스 선물 API는 symbol에 /가 없으므로 변환 (예: BTCUSDT -> BTC/USDT)
            # ccxt 마켓 정보를 통해 맵핑하는 것이 가장 정확하지만, 간단히 / 추가로 처리 (마켓마다 다를 수 있음 주의)
            formatted_symbol = symbol.replace("USDT", "/USDT") if "USDT" in symbol else symbol
            
            position_amt = float(pos['positionAmt'])
            entry_price = float(pos['entryPrice'])
            leverage = float(pos.get('leverage', 1.0)) # 바이낸스 payload에 포함된 레버리지
            
            if position_amt != 0: # 포지션이 존재하는 경우
                side = 'long' if position_amt > 0 else 'short'
                amount = abs(position_amt)
                
                pos_key = (formatted_symbol, side)
                current_active_positions.add(pos_key)
                
                # 아직 SL/TP 처리를 한 적 없는 '새로운 포지션'이라면 설정 진행
                if pos_key not in processed_positions:
                    set_sl_tp_for_position(formatted_symbol, side, amount, entry_price, leverage)
                    processed_positions.add(pos_key)
        
        # 포지션이 종료(청산)되었다면 processed_positions에서 제거하여 
        # 나중에 같은 방향으로 또 진입했을 때 다시 인식할 수 있게 정리
        closed_positions = processed_positions - current_active_positions
        for closed_pos in closed_positions:
            processed_positions.remove(closed_pos)
            sym = closed_pos[0].replace("/", "") 
            sd = closed_pos[1]
            print(f"ℹ️ 포지션 종료 감지: {sym} {sd.upper()} (초기화 완료)")
            
            # 곧바로 Income History를 조회해 이 포지션의 PNL을 확인 후 Vora 서버로 전송
            try:
                # 안전하게 5분(300000ms) 전부터 조회
                since_ts = int((time.time() - 300) * 1000)
                income = exchange.fapiPrivateGetIncome({
                    'symbol': sym,
                    'incomeType': 'REALIZED_PNL',
                    'startTime': since_ts,
                    'limit': 20
                })
                # 오늘/최근 청산된 PNL 합산 (분할 청산 감안)
                recent_pnl = sum(float(i['income']) for i in income)
                
                url = "http://localhost:3001/api/internal/trade-log"
                payload = {
                    "symbol": sym,
                    "side": sd.upper(),
                    "pnl": recent_pnl,
                    "timestamp": int(time.time() * 1000)
                }
                requests.post(url, json=payload, timeout=5)
                print(f"👉 Vora 백엔드 플랫폼에 실시간 매매 로그 기록 완료 (PnL: {recent_pnl:.4f})")
            except Exception as e:
                print(f"백엔드 실적 로깅 실패: {e}")

    except Exception as e:
        print(f"Error checking positions: {e}")

if __name__ == '__main__':
    print("==================================================")
    print("🤖 수동매매 자동 SL/TP 설정 봇이 시작되었습니다 🤖")
    print(f"설정된 원금 손절(SL): {ROE_SL_PERCENT}% / 원금 익절(TP): {ROE_TP_PERCENT}% / 감지 주기: {POLL_INTERVAL}초")
    print("==================================================")
    
    # 봇이 켜질 때 이미 가지고 있던 포지션은 이미 수동으로 걸었을 거라 가정하고(또는 원치 않는 과거 포지션일 수 있으므로)
    # 초기 포지션 셋업만 해두고 아무 짓도 안 함. (선택사항, 아래 코드를 제거하면 봇 켜자마자 기존 포지션에도 다 걸어버림)
    try:
        init_balance = exchange.fetch_balance(params={'type': 'future'})
        for pos in init_balance['info']['positions']:
            amt = float(pos['positionAmt'])
            if amt != 0:
                sym = pos['symbol'].replace("USDT", "/USDT") if "USDT" in pos['symbol'] else pos['symbol']
                sd = 'long' if amt > 0 else 'short'
                processed_positions.add((sym, sd))
        if processed_positions:
            print(f"기존 포지션 감지 무시 (이미 SL/TP가 걸려있다고 가정): {processed_positions}")
    except Exception as e:
        print("초기 포지션 확인 중 에러", e)
        pass

    while True:
        check_positions()
        time.sleep(POLL_INTERVAL)
