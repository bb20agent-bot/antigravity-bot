import requests
import json
def get_whale_ratio(symbol="BTCUSDT", period="15m"):
    url = "https://fapi.binance.com/futures/data/topLongShortPositionRatio"
    params = {"symbol": symbol, "period": period, "limit": 1}
    response = requests.get(url, params=params)
    print("Whale Position:", json.dumps(response.json(), indent=2))

def get_whale_account_ratio(symbol="BTCUSDT", period="15m"):
    url = "https://fapi.binance.com/futures/data/topLongShortAccountRatio"
    params = {"symbol": symbol, "period": period, "limit": 1}
    response = requests.get(url, params=params)
    print("Whale Account:", json.dumps(response.json(), indent=2))

get_whale_ratio()
get_whale_account_ratio()
