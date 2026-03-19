import os
import time
import ccxt
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv

# ==========================================
# 환경 변수 로드
# ==========================================
load_dotenv()

# "계정 B" 전용 API (수동 계정 A와 분리됨)
API_KEY = os.getenv('BINANCE_AUTO_API_KEY')
API_SECRET = os.getenv('BINANCE_AUTO_API_SECRET')
WEBHOOK_PASSPHRASE = "VORA_SECRET_2026"  # 트레이딩뷰 JSON과 일치해야 함
PORT = 5001

app = Flask(__name__)

# ==========================================
# 바이낸스 선물 거래소 초기화 (ccxt)
# ==========================================
try:
    exchange = ccxt.binance({
        'apiKey': API_KEY,
        'secret': API_SECRET,
        'enableRateLimit': True,
        'options': {
            'defaultType': 'future', # 선물 시장 기준
        }
    })
    print("✅ 바이낸스 API 연결 준비 됨 (계정 B)")
except Exception as e:
    exchange = None
    print(f"❌ CCXT 바이낸스 자동매매 초기화 실패: {e}")

# ==========================================
# 웹훅 엔드포인트
# ==========================================
@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    
    # 1. 보안 인증: Passphrase 확인
    if not data or data.get('passphrase') != WEBHOOK_PASSPHRASE:
        print("⛔ 허가되지 않은 접근 시도 차단")
        return jsonify({"error": "Unauthorized"}), 401

    print(f"\n🔔 [Webhook 수신] {data}")
    
    # 2. 페이로드 파싱
    symbol = data.get('ticker', '')                     # ex) BTCUSDT
    action = data.get('action', '').lower()             # 'buy' or 'sell'
    contracts = float(data.get('contracts', 0))         # Pine Script에서 계산된 수량
    order_id = data.get('order_id', '')                 # ex) 'LONG', 'SHORT', 'Exit LONG'
    order_price = float(data.get('order_price', 0))     # 진입 당시 가격
    
    # 바이낸스 심볼 포맷 맞추기 (BTCUSDT -> BTC/USDT)
    formatted_symbol = symbol.replace('.P', '').replace('USDT', '/USDT')
    if '/' not in formatted_symbol and 'USDT' in formatted_symbol:
        formatted_symbol = formatted_symbol.replace('USDT', '/USDT')
        
    print(f"🚀 [주문 실행 시도] 심볼: {formatted_symbol} | 액션: {action.upper()} | 수량: {contracts} | 이름: {order_id}")
    
    # 3. 주문 실행 (계정 B)
    try:
        if exchange and contracts > 0:
            order = exchange.create_order(
                symbol=formatted_symbol,
                type='market',
                side=action,
                amount=contracts
            )
            print(f"✅ 바이낸스 실전 주문 완료! ID: {order['id']}")
            
            # 4. 🎥 [유튜브 쇼츠 수익화 연동] Vora 자동 영상 렌더링 API 트리거
            # 성공적으로 거래가 체결되면, 이 체결 기록을 바탕으로 즉시 숏폼 영상을 렌더링하고 업로드 프로세스를 시작합니다.
            try:
                url = "http://localhost:3001/api/internal/record-trade-video"
                payload = {
                    "symbol": formatted_symbol.replace('/', ''),
                    "side": action.upper(),  # BUY or SELL
                    "price": order_price,
                    "amount": contracts,
                    "order_id": order_id
                }
                requests.post(url, json=payload, timeout=5)
                print("👉 [수익화 파이프라인] Vora 자동 유튜브 쇼츠 렌더링(+Veo 연동) 트리거 완료!")
            except Exception as e:
                print(f"❌ 영상 렌더링 서버(3001번 포트) 요청 에러 (영향 없음): {e}")
                
        else:
            print("⚠️ API 설정 문제이거나 수량이 0 이하여서 주문을 스킵합니다.")
            
        return jsonify({"status": "success", "message": "Order processed"}), 200

    except Exception as e:
        print(f"❌ 파이썬 바이낸스 에러 발생: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("==================================================")
    print("🤖 VORA v7 전용 자동매매 Webhook 봇이 시작되었습니다 🤖")
    print(f"접속 포트: {PORT} / 대기 중...")
    if not API_KEY or API_KEY == "your_auto_api_key_here":
        print("⚠️ 경고: BINANCE_AUTO_API_KEY 가 .env에 아직 정확히 설정되지 않아 실매매가 팅길 수 있습니다!")
    print("==================================================")
    
    # 로컬 네트워크에서 수신하기 위해 0.0.0.0 으로 오픈
    app.run(host='0.0.0.0', port=PORT)
