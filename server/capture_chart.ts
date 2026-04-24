import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

async function capture() {
    console.log("📸 Starting Puppeteer to capture real Binance chart...");
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 600 });
    
    // TradingView BTCUSDT Chart
    await page.goto('https://www.tradingview.com/symbols/BTCUSDT/?exchange=BINANCE', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Hide cookie banners or popups if they appear
    await page.evaluate(() => {
        const cookieBanner = document.querySelector('#onetrust-consent-sdk') as HTMLElement;
        if (cookieBanner) cookieBanner.style.display = 'none';
        
        // Hide specific Binance overlays if any
        const guide = document.querySelector('.guide-overlay') as HTMLElement;
        if (guide) guide.style.display = 'none';
    }).catch(() => {});

    // Wait for the chart canvas to render completely
    await new Promise(r => setTimeout(r, 6000));
    
    // Save to the 'dist' folder so it's publicly accessible via PM2 on port 80
    const savePath = path.join(__dirname, '../dist/real_chart.png');
    await page.screenshot({ path: savePath });
    
    console.log(`✅ Chart captured successfully and saved to ${savePath}`);
    await browser.close();
}

capture().catch(e => {
    console.error(e);
    process.exit(1);
});
