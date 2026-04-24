import os
import requests
from fastapi import FastAPI, Request, BackgroundTasks
from dotenv import load_dotenv
import uvicorn

app = FastAPI(title="VORA VIP TradingView Webhook Server")

def send_to_telegram(message_text: str):
    # 매 전송마다 .env를 다시 로드하여 최신 값을 가져오도록 함
    load_dotenv(override=True)
    TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
    TELEGRAM_CHANNEL_ID = os.getenv("TELEGRAM_CHANNEL_ID")

    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHANNEL_ID:
        print("Telegram credentials not found in environment variables.")
        return

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHANNEL_ID,
        "text": message_text,
        "parse_mode": "HTML" # HTML parse mode for bold tags if needed
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print("텔레그램 전송 성공:", response.json())
    except requests.exceptions.RequestException as e:
        print("텔레그램 전송 실패:", e)

@app.post("/api/webhook/tradingview")
async def receive_tradingview_webhook(request: Request, background_tasks: BackgroundTasks):
    try:
        # JSON 페이로드 파싱
        payload = await request.json()
        
        # 1. 데이터 수신 확인 및 로깅
        print("트레이딩뷰 시그널 수신:", payload)
        
        # 2. 메시지 포맷팅
        symbol = payload.get("symbol", "N/A")
        timeframe = payload.get("timeframe", "N/A")
        position = payload.get("position", "N/A")
        signal = payload.get("signal", "N/A")
        entry = payload.get("entry", "N/A")
        price_str = str(payload.get("price", "N/A"))
        
        # 수신가를 기준으로 진입가 레인지(-50 ~ +50) 자동 계산
        try:
            price_val = float(price_str)
            # 불필요한 소수점 0을 제거하기 위해 문자열 변환 사용
            min_price = f"{price_val - 50:g}"
            max_price = f"{price_val + 50:g}"
            entry_price = f"{min_price} ~ {max_price}"
        except (ValueError, TypeError):
            entry_price = "N/A"
        
        # 분봉 등 한글 표시를 위한 처리 (옵션)
        if timeframe.isdigit():
            timeframe = f"{timeframe}분봉"

        message = f"""🚨 <b>[VORA VIP 시그널] 진입 타점 포착!</b>

📌 종목: {symbol}
⏱️ 기준: {timeframe}
📈 포지션: {position}
🎯 신호: {signal}
🎯 진입: {entry}
💵 현재가: {price_str}
💵 진입가: {entry_price}"""

        # 3. 텔레그램 봇 API로 메시지 전송 로직 (Background로 실행하여 빠른 응답 반환)
        background_tasks.add_task(send_to_telegram, message)
        
        # 4. 트레이딩뷰 측에 성공 응답 반환
        return {"status": "success", "message": "Webhook received and processing"}
        
    except Exception as e:
        print("Error processing webhook:", e)
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
