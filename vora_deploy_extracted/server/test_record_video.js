async function testRecording() {
    try {
        console.log("Triggering Real-time Trade Video Screen Recording...");
        const res = await fetch('http://127.0.0.1:3001/api/internal/record-trade-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                symbol: "BTCUSDT",
                side: "LONG",
                price: 69400.5,
                amount: 0.15
            })
        });
        const data = await res.json();
        console.log("Response:", data);
    } catch (e) {
        console.error("Test failed:", e);
    }
}
testRecording();
