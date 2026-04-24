const http = require('http');
const payload = JSON.stringify({
    symbol: "ETH/USDT:USDT",
    side: "buy",
    amount_pct: 10
});
const options = {
    hostname: 'localhost',
    port: 80,
    path: '/api/webhook/trade-all',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': payload.length }
};
const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => process.stdout.write(d));
});
req.on('error', (e) => console.error(e));
req.write(payload);
req.end();
