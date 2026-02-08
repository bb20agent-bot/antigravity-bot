import requests

# n8n Webhook Test URL
url = "https://bb20agent.app.n8n.cloud/webhook-test/38d56da3-59c7-4dad-a982-c5a7f2efb940"

# 안티그래비티 전략 판단 데이터 (예시)
data = {
    "symbol": "BTCUSDT",
    "side": "BUY",
    "strategy": "Anti-Gravity_V1",
    "reason": "Bollinger Band Lower Touch"
}

response = requests.post(url, json=data)
print(f"전송 결과: {response.status_code}") # 200이면 성공