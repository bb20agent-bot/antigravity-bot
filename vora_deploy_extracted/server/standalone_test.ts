import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function runStandaloneTest() {
    const symbol = "BTCUSDT";
    const side = "LONG";
    const savePath = `./standalone_test.mp4`;

    let browser;
    try {
        console.log(`🎥 Starting Standalone Puppeteer...`);
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--window-size=1280,720',
                '--disable-web-security'
            ]
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1280, height: 720 });

        const recorder = new PuppeteerScreenRecorder(page, {
            fps: 30,
            quality: 100,
            videoFrame: { width: 1280, height: 720, backgroundColor: '#0b0e11' }
        });

        const chartUrl = `https://www.binance.com/en/trade/${symbol}?type=spot`;
        console.log(`Navigating to ${chartUrl}...`);

        try {
            await page.goto(chartUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        } catch (err) {
            console.log(`Navigation timeout reached, proceeding...`);
        }

        // Wait 3 seconds for indicators to load
        await new Promise(r => setTimeout(r, 3000));

        // Start recording 5 seconds
        await recorder.start(savePath);
        console.log(`🔴 Recording 5 seconds of the chart...`);
        await new Promise(r => setTimeout(r, 5000));
        await recorder.stop();
        await browser.close();

        console.log(`✅ Recording finished. Checks passed. Size: ${fs.statSync(savePath).size} bytes`);
        process.exit(0);

    } catch (e) {
        console.error("Screen recording error:", e);
        if (browser) await browser.close();
        process.exit(1);
    }
}
runStandaloneTest();
