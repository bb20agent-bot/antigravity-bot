async function test() {
    try {
        console.log("Triggering Real-time Trade Videos generation...");
        const res = await fetch('http://127.0.0.1:3001/api/internal/generate-trade-videos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                upgrade_details: "Updated Python Bot ROE_SL to 5.0% and optimized execution speed to reduce slippage."
            })
        });
        const data = await res.json();
        console.log("Response:", data);
    } catch (e) {
        console.error("Test failed:", e);
    }
}
test();
