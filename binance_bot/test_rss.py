import feedparser

print("--- RSS Feed Test ---")
COINTELEGRAPH_RSS = "https://cointelegraph.com/rss"
COINDESK_RSS = "https://www.coindesk.com/arc/outboundfeeds/rss/"

print("\nTesting Cointelegraph:")
feed1 = feedparser.parse(COINTELEGRAPH_RSS)
for entry in feed1.entries[:3]:
    print("-", entry.title)

print("\nTesting CoinDesk:")
feed2 = feedparser.parse(COINDESK_RSS)
for entry in feed2.entries[:3]:
    print("-", entry.title)
