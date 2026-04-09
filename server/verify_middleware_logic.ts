
import express from 'express';
// import fetch from 'node-fetch'; // No longer needed
import { Server } from 'http';

const adminAuth = (req: any, res: any, next: any) => {
    const adminToken = process.env.VORA_INTERNAL_API_TOKEN;
    if (!adminToken) {
        return res.status(500).json({ status: "error", message: "Internal API configuration missing" });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
        return res.status(401).json({ status: "error", message: "Unauthorized access" });
    }
    next();
};

const app = express();
app.use(express.json());

app.post('/api/admin/action/bot-deploy', adminAuth, (req, res) => {
    res.json({ status: "success", message: "Deployed" });
});

async function runTest() {
    const testToken = 'test-token-456';
    process.env.VORA_INTERNAL_API_TOKEN = testToken;

    const server = app.listen(3002);
    const url = 'http://localhost:3002/api/admin/action/bot-deploy';

    console.log('Test 1: No Token');
    const res1 = await fetch(url, { method: 'POST' });
    console.log('Status:', res1.status);

    console.log('Test 2: Invalid Token');
    const res2 = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer wrong' }
    });
    console.log('Status:', res2.status);

    console.log('Test 3: Valid Token');
    const res3 = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${testToken}` }
    });
    console.log('Status:', res3.status);

    server.close();
}

runTest().catch(console.error);
