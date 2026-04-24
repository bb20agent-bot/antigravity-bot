const http = require('http');

const payload = JSON.stringify({
    script_code: "//@version=5\nstrategy('Test', overlay=true)\nif (ta.crossover(ta.sma(close, 10), ta.sma(close, 20)))\n    strategy.entry('Buy', strategy.long)",
    description: "A simple moving average crossover strategy.",
    win_rate: "54%",
    roi: "12%"
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/webhook/tradingview-video',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(payload);
req.end();
