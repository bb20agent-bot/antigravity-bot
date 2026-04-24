async function seed() {
    const trades = [
        { symbol: "BTCUSDT", side: "LONG", pnl: 15.50 },
        { symbol: "ETHUSDT", side: "LONG", pnl: -2.30 },
        { symbol: "SOLUSDT", side: "SHORT", pnl: 4.80 },
        { symbol: "BNBUSDT", side: "SHORT", pnl: -1.20 },
        { symbol: "BTCUSDT", side: "LONG", pnl: 25.10 }
    ];

    for (let t of trades) {
        await fetch('http://127.0.0.1:3001/api/internal/trade-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...t, timestamp: Date.now() })
        });
    }
    console.log("✅ Seeded 5 mock trades for testing.");
}
seed();
