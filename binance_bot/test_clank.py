import requests
try:
    url = "https://api.clankapp.com/v2/explorer/tx?limit=10"
    res = requests.get(url)
    print("Status:", res.status_code)
    print("Data:", res.json())
except Exception as e:
    print(e)
