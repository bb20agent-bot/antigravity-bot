import requests
import json

def test():
    urls = [
        "https://fapi.binance.com/futures/data/takerlongshortRatio?symbol=BTCUSDT&period=5m&limit=2",
        "https://fapi.binance.com/futures/data/topLongShortPositionRatio?symbol=BTCUSDT&period=5m&limit=2",
        "https://fapi.binance.com/fapi/v1/openInterest?symbol=BTCUSDT",
    ]
    for url in urls:
        print("URL:", url)
        try:
            res = requests.get(url, timeout=5).json()
            print(json.dumps(res, indent=2))
        except Exception as e:
            print("ERROR", e)

test()
