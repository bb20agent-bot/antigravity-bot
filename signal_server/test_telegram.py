import os
import requests
from dotenv import load_dotenv

def test_telegram():
    load_dotenv(override=True)
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    channel_id = os.getenv("TELEGRAM_CHANNEL_ID")

    print(f"Token: {bot_token}")
    print(f"Channel ID: {channel_id}")

    if not bot_token or not channel_id:
        print("Error: Missing credentials")
        return

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": channel_id,
        "text": "🚨 <b>[Test] Telegram alert test</b>",
        "parse_mode": "HTML"
    }

    print("Sending request to Telegram API...")
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_telegram()
