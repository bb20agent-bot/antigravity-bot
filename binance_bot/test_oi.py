import requests

# Open Interest
oi_url = "https://fapi.binance.com/fapi/v1/openInterest?symbol=BTCUSDT"
oi_data = requests.get(oi_url).json()

# Top Trader Long/Short Ratio
ls_url = "https://fapi.binance.com/futures/data/topLongShortAccountRatio?symbol=BTCUSDT&period=5m&limit=1"
ls_data = requests.get(ls_url).json()

print("Open Interest:", oi_data)
print("Top Trader L/S Ratio:", ls_data)
