import os
import requests
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')

def send_telegram_message(message):
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML"
    }
    try:
        response = requests.post(url, json=payload, timeout=5)
        if response.status_code == 200:
            print("✅ 텔레그램 발송 성공!")
        else:
            print(f"❌ 텔레그램 발송 실패: HTTP {response.status_code}\n{response.text}")
    except Exception as e:
        print(f"❌ 텔레그램 통신 오류: {e}")

if __name__ == "__main__":
    msg = (
        "🌅 <b>[05:00 테스트 알람] 프리마켓 분석 (수신된 이미지 데이터)</b>\n\n"
        "<b>[아시아 주요 지수 현황]</b>\n"
        "🇯🇵 <b>닛케이 225</b>: 53,900.00 (-4.23% 🔻)\n"
        "🇨🇳 <b>상해종합</b>: 4,063.57 (-1.43% 🔻)\n"
        "🇨🇳 <b>SZSE Component</b>: 13,884.37 (-0.98% 🔻)\n"
        "🇨🇳 <b>China A50</b>: 14,410.34 (-2.18% 🔻)\n"
        "🇭🇰 <b>항셍 지수</b>: 25,249.48 (-2.01% 🔻)\n\n"
        "💡 <i>전체적으로 아시아 증시가 강한 하락세를 보이고 있습니다. 숏(Short) 관점의 트레이딩 시나리오 점검이 필요합니다.</i>"
    )
    send_telegram_message(msg)
