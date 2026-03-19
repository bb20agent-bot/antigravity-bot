import requests

# Taker Buy/Sell Ratio (Whales/Takers)
ls_url = "https://fapi.binance.com/futures/data/takerlongshortRatio?symbol=BTCUSDT&period=5m&limit=2"
ls_data = requests.get(ls_url).json()

print("Taker L/S Ratio:", ls_data)
