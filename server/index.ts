import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { GoogleGenAI } from '@google/genai';
import { google } from 'googleapis';
import fs from 'fs';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import FormData from 'form-data';
// import fetch from 'node-fetch'; // Polyfill if native doesn't support headers well
import TelegramBot from 'node-telegram-bot-api';
import nodemailer from 'nodemailer'; // For Email Funnel Automations

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Default route for admin/browser access
app.get('/', (req, res) => {
    res.send(`
    <html>
      <body style="background: #050505; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh;">
        <div style="text-align: center;">
          <h1 style="color: #0088cc;">VORA Backend API Running</h1>
          <p>System is online and processing requests.</p>
        </div>
      </body>
    </html>
  `);
});

// Initialize Google Gemini Client
let ai: any = null;
if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Initialize SQLite Database
let db: any;
async function initializeDB() {
    db = await open({
        filename: './dev.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS User (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            telegramId TEXT UNIQUE NOT NULL,
            tonWalletAddress TEXT UNIQUE,
            email TEXT,
            totalTonStaked REAL DEFAULT 0,
            isFandomUser BOOLEAN DEFAULT 0,
            t2eBonusMultiplier REAL DEFAULT 1.0,
            referrerId INTEGER,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(referrerId) REFERENCES User(id)
        )
    `);
    
    // -- Fandom 8 Mechanics Columns --
    try { await db.exec(`ALTER TABLE User ADD COLUMN dnftLevel INTEGER DEFAULT 1`); } catch (e) {}
    try { await db.exec(`ALTER TABLE User ADD COLUMN nVolume REAL DEFAULT 0`); } catch (e) {}
    try { await db.exec(`ALTER TABLE User ADD COLUMN isCrew BOOLEAN DEFAULT 0`); } catch (e) {}
    try { await db.exec(`ALTER TABLE User ADD COLUMN accumulatedVora REAL DEFAULT 0`); } catch (e) {}

    // -- Fandom VIP Trader Security Keys --
    try { await db.exec(`ALTER TABLE User ADD COLUMN binanceApiKey TEXT`); } catch(e){}
    try { await db.exec(`ALTER TABLE User ADD COLUMN binanceSecretKey TEXT`); } catch(e){}
    try { await db.exec(`ALTER TABLE User ADD COLUMN tvWebhookUrl TEXT`); } catch(e){}

    // -- System Controls --
    await db.exec(`
        CREATE TABLE IF NOT EXISTS SystemState (
            id TEXT PRIMARY KEY,
            stakingPoolTotal REAL DEFAULT 0,
            joyCmoLiquidityTon REAL DEFAULT 0,
            joyCmoLiquidityUsdc REAL DEFAULT 0,
            p2pTaxAccumulated REAL DEFAULT 0,
            p2pBurnAccumulated REAL DEFAULT 0
        )
    `);
    try { await db.exec(`INSERT INTO SystemState (id) VALUES ('global')`); } catch (e) {}

    console.log("SQLite Database initialized.");
}

initializeDB().catch(console.error);

// Admin Authentication Middleware
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

let globalConfig = {
    t2eTimerEnd: 0,
    dynamicRewardRatio: 1.0, // Default 100%
    circuitBreakerThresholdUsd: 1000, // Withdrawals over $1000 require admin approval
    viraToUsdRate: 0.1, // Simulated price: 1 VORA = $0.1
    dailyT2EPool: 0,    // AI-determined T2E pool size for the day
    lastSettlementDate: ""
};

// ==========================================
// 📧 Mailer & Drip Campaign Setup
// ==========================================
const transporter = nodemailer.createTransport({
    // Using a stub/mock test account for development (Ethereal)
    // Production should use SendGrid, Mailgun, or AWS SES
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.SMTP_USER || 'test_user',
        pass: process.env.SMTP_PASS || 'test_pass'
    }
});

const sendVoraEmail = async (to: string, subject: string, htmlHtml: string) => {
    try {
        await transporter.sendMail({
            from: '"VORA Fandom Protocol" <no-reply@vorafandom.com>',
            to,
            subject,
            html: htmlHtml
        });
        console.log(`[Email System] Sent: "${subject}" to ${to}`);
    } catch (error) {
        console.error(`[Email System] Failed to send to ${to}:`, error);
    }
};

// Mock In-Memory Queue for Automations (Production should use BullMQ/Redis)
const dripCampaignQueue: { email: string, step: number, sendAt: number }[] = [];

// Cron-like checker (Runs every hour in real life, every 10 secs for demo)
setInterval(async () => {
    const now = Date.now();
    for (let i = dripCampaignQueue.length - 1; i >= 0; i--) {
        const job = dripCampaignQueue[i];
        if (job.sendAt <= now) {
            dripCampaignQueue.splice(i, 1); // Remove job
            await triggerDripCampaignStep(job.email, job.step);
        }
    }
}, 10000); // 10 second demo interval

const triggerDripCampaignStep = async (email: string, step: number) => {
    let subject = "";
    let content = "";

    switch (step) {
        case 1:
            subject = "[VORA] 환영합니다. 당신은 지금 현명한 선택을 하셨습니다.";
            content = `
                <h2>문제(Problem): 차트 앞에서 언제까지 혼자 감당하실 겁니까?</h2>
                <p>수많은 유튜버와 유료 구독 서비스에도 불구하고, 매월 나가는 유지비용과 결국 나 홀로 차트를 봐야 하는 고독함...</p>
                <p>VORA Fandom은 CTO(Brown AI)가 30초 안에 전략을 설명하고 무제한 무료로 제공합니다. 당신의 고통받았던 시간을 보라 팬덤에 맡기고 진정한 자유를 얻으십시오.</p>
                <p>👉 내일, VORA Fandom의 압도적인 성과 메커니즘에 대해 알려드리겠습니다.</p>
            `;
            break;
        case 2:
            subject = "[VORA] 위대한 제품은 커뮤니티가 만듭니다.";
            content = `
                <h2>우리는 100배 성장할 압도적 제품(Product)을 갖추었습니다.</h2>
                <p>검증된 AI 자동매매 전략과 T2E 보상. 당신이 P2P 생태계에 참여하는 것만으로 폭발적인 성장이 담보됩니다.</p>
                <p>👉 미니앱에서 VIP 멤버십 20% 할인 혜택을 확인하세요.</p>
            `;
            break;
        case 3:
            subject = "[VORA] 우리가 겪어온 고통, 그리고 '노블레스 오블리주'";
            content = `
                <h2>고통을 끝내고 함께 나누는 여정.</h2>
                <p>우리의 비전은 개인의 독식이 아닌, 집단 지성 커뮤니티가 함께 수익과 거버넌스를 나누는 '상생'입니다.</p>
                <p>권한에는 책임이 따릅니다. 당신도 크루 리더가 되어 새로운 자산 파이프라인을 구축하십시오.</p>
            `;
            break;
        default:
            return;
    }

    await sendVoraEmail(email, subject, content);

    // Queue next step for tomorrow (Simulated as 1 minute for demo)
    if (step < 3) {
        dripCampaignQueue.push({
            email,
            step: step + 1,
            sendAt: Date.now() + 60000 // 1 min (mocking 1 day)
        });
        console.log(`[Email System] Queued Step ${step + 1} for ${email}`);
    }
};

// ==========================================
// Represents users who are active in P2P group or high DNFT contributors
const p2pContributors: Record<string, boolean> = {
    "city1": true // Demo user
};
const dnftContributors: Record<string, boolean> = {
    "city1": true // Demo user
};

// In-memory Pending Withdrawal Queue
const pendingWithdrawals: Record<string, { wallet: string, amount: number, usdValue: number, status: string }> = {};

app.get('/api/config', (req, res) => {
    res.json(globalConfig);
});

app.post('/api/admin/t2e_timer', adminAuth, (req, res) => {
    const { action } = req.body;
    if (action === 'start_10m') globalConfig.t2eTimerEnd = Date.now() + 10 * 60 * 1000;
    else if (action === 'start_30m') globalConfig.t2eTimerEnd = Date.now() + 30 * 60 * 1000;
    else if (action === 'start_12h') globalConfig.t2eTimerEnd = Date.now() + 12 * 60 * 60 * 1000;
    else if (action === 'stop') globalConfig.t2eTimerEnd = 0;
    res.json({ success: true, config: globalConfig });
});

app.post('/api/user/withdraw', async (req, res) => {
    // In a real scenario, this would trigger a smart contract withdrawal.
    const { telegramId, walletAddress, amount } = req.body;
    res.json({ success: true, message: `Successfully requested withdrawal of ${amount} VORA to ${walletAddress}` });
});

// ✅ New: User Initial Registration with Mandatory Email
app.post('/api/user/register', async (req, res) => {
    try {
        const { telegramId, email } = req.body;
        if (!telegramId || !email) {
            return res.status(400).json({ error: "Telegram ID and Real Email are strictly required." });
        }

        // Basic DB insert simulation
        await db.run(
            `INSERT INTO User (telegramId, email) VALUES (?, ?) ON CONFLICT(telegramId) DO UPDATE SET email=excluded.email`,
            [telegramId, email]
        );

        // Instantly trigger Day 1 of the Drip Campaign
        await triggerDripCampaignStep(email, 1);

        return res.status(200).json({
            success: true,
            message: "User registered successfully, and welcome email dispatched."
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Database or Mailer error during registration." });
    }
});

// ✅ New: Automated Governance Feedback Reporting (Weekly)
app.post('/api/internal/send-governance-report', async (req, res) => {
    try {
        const totalVoraDistributed = globalConfig.dailyT2EPool * 7; // Mock weekly calc
        const treasuryGrowth = 150.5; // Mock data

        const subject = "[VORA Governance] 주간 생태계 성장 리포트 투명 공개";
        const content = `
            <h2>🔥 VORA Treasury & 생태계 주간 리포트 🔥</h2>
            <p>보라 팬덤은 '노블레스 오블리주' 가치 실현을 위해 모든 수치와 성과를 투명하게 공개합니다.</p>
            <ul>
                <li>📈 <b>주간 Treasury 증가량:</b> +${treasuryGrowth} TON</li>
                <li>💎 <b>주간 T2E 보상 풀 분배량:</b> ${totalVoraDistributed} VORA</li>
                <li>🎯 <b>AI 트레이딩 봇 누적 승률:</b> 87.5%</li>
            </ul>
            <p>팬덤 여러분의 기여로 생태계는 점점 더 강력한 자산 파이프라인이 되어갑니다. 항상 감사합니다.</p>
        `;

        // In production: Fetch all subscribed users' emails from DB and send bulk.
        // For demonstration, we simulate sending to a general logging address or directly to the Telegram official channel.
        await sendVoraEmail("all-subscribers@vorafandom.com", subject, content);

        // Also announce to Telegram Official Channel
        // We fetch the bot globally if possible, or use a fetch request to the Telegram API directly if brownBot scope is not available here.
        const botToken = process.env.BROWN_TELEGRAM_TOKEN || process.env.TELEGRAM_TOKEN;
        const channelId = process.env.OFFICIAL_CHANNEL_ID || req.body.channelId;

        if (botToken && channelId) {
            const tgMessage = `📢 **[VORA Governance Weekly Report]**\n\n` +
                `✅ 주간 Treasury 증가: +${treasuryGrowth} TON\n` +
                `💎 주간 T2E 분배량: ${totalVoraDistributed} VORA\n\n` +
                `자세한 내역은 등록하신 이메일을 확인해 주세요! 투명한 성장이 VORA의 힘입니다.`;

            // Fallback to native fetch for decoupled Telegram logic
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: channelId,
                    text: tgMessage,
                    parse_mode: 'Markdown'
                })
            }).catch(console.error);
        }

        return res.status(200).json({ success: true, message: "Governance report dispatched." });
    } catch (err) {
        res.status(500).json({ error: "Failed to send governance report." });
    }
});
// ==========================================
// 🎥 VORA Live: Shorts Viewer & AI Chat API
// ==========================================

// Mock DB for Shorts and Chat
const mockShortsDB: any[] = [
    { id: 1, strategy: "VORA Pro 1m", title: "비트코인 1분봉 폭발적 롱 타점", videoUrl: "https://example.com/short1.mp4", timestamp: Date.now() - 86400000 },
    { id: 2, strategy: "Lijimae Scalper 15m", title: "이더리움 15분봉 하락장 숏 수익", videoUrl: "https://example.com/short2.mp4", timestamp: Date.now() - 3600000 }
];
const mockChatDB: Record<number, any[]> = { 1: [], 2: [] }; // videoId -> [messages]

// Admin: Upload new Strategy Short
app.post('/api/admin/upload-shorts', adminAuth, async (req, res) => {
    try {
        const { strategy, title, videoUrl } = req.body;
        if (!strategy || !title || !videoUrl) return res.status(400).json({ error: "Missing parameters" });

        const newShort = {
            id: mockShortsDB.length + 1,
            strategy,
            title,
            videoUrl,
            timestamp: Date.now()
        };
        mockShortsDB.push(newShort);
        mockChatDB[newShort.id] = []; // Initialize chat room

        res.status(200).json({ success: true, message: "Short uploaded successfully", data: newShort });
    } catch (err) {
        res.status(500).json({ error: "Upload failed" });
    }
});

// User: Fetch Shorts list for Mini App Swiper
app.get('/api/user/live-shorts', (req, res) => {
    // Sort descending by timestamp (newest first)
    const sortedShorts = [...mockShortsDB].sort((a, b) => b.timestamp - a.timestamp);
    res.status(200).json({ success: true, data: sortedShorts });
});

// Fetch Chat History for a Video
app.get('/api/chat/messages/:videoId', (req, res) => {
    const videoId = parseInt(req.params.videoId);
    const messages = mockChatDB[videoId] || [];
    res.status(200).json({ success: true, data: messages });
});

// User sends a message -> AI answers as Brown CTO
app.post('/api/chat/messages', async (req, res) => {
    try {
        const { videoId, telegramId, text } = req.body;
        if (!videoId || !text) return res.status(400).json({ error: "Missing parameters" });

        // Save User Message
        if (!mockChatDB[videoId]) mockChatDB[videoId] = [];
        mockChatDB[videoId].push({ sender: telegramId, text: text, timestamp: Date.now(), isAi: false });

        // Send to Gemini AI (Brown CTO Persona with strict filtering for Brand Identity)
        const systemPrompt = `당신은 Vora 생태계의 Co-founder이자 'Manager Brown' 입니다. Vora는 단순한 트레이딩 플랫폼이 아니라, AI 시대에 개인이 금융의 주체가 되어 함께 연구하고 성장하는 '탈중앙화 교육 및 커뮤니티 생태계'입니다.
        현재 유저들은 라이브 10분 백테스팅 영상을 시청하며 질문하고 있습니다.
        1. 시청 중인 전략의 원리, 승률 트렌드, 리스크 관리에 대해 진정성 있고 전문적으로 30초 내에 안내하세요. '수익', '익절', '대박' 같은 폰지(Ponzi)성 과장 광고 단어는 절대 금지합니다.
        2. [지속 가능한 선순환 안내] 생태계 질문 시 "저희의 유틸리티 상승 기여 가치의 70%는 생태계 활성화 및 소각에 사용되며, 30%는 커뮤니티에 동적 배분되어 모두가 함께 가치를 창출합니다."라고 핵심 비전을 강조하세요.
        3. [교육/커뮤니티 초대] 유저가 지표값이나 전략에 관심을 보이면 쿨하게 수용하며 이렇게 답변하세요: "트레이딩뷰(TradingView) 아이디(유저네임)를 채팅창에 남겨주시면, 귀하의 차트에서 직접 검증하고 학습하실 수 있도록 3일 무상 체험 권한(Invite-Only)을 즉시 부여해 드리겠습니다."
        4. [팬덤 결제 전환] 유저에게 체험 권한을 안내한 후 자연스럽게 생태계 합류를 제안하세요: "개인이 변동성이 극심한 시장에서 매일 전략을 수정하며 살아남는 것은 매우 고립되고 힘든 일입니다. 혼자 외롭게 싸우시겠습니까, 아니면 VORA 팬덤에 합류하여 평생 지속 가능한 트레이딩 교육과 데이터 튜닝 지원을 함께 하시겠습니까?"
        5. [매우중요 🚨] 유저가 '지금 사야하나요?', '얼마 갈까요?' 등 개별 타점 리딩을 요구하면 단호히 거절하고 "저희 Vora는 특정 종목의 매수/매도 리딩을 하지 않으며, 오직 투명하게 검증된 AI 전략을 교육하고 스스로 자산을 지킬 수 있게 돕는 생태계입니다."라고 답변하세요.`;

        let aiReplyText = "AI 시스템 오류입니다.";
        if (ai) {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: text,
                config: {
                    systemInstruction: systemPrompt,
                    temperature: 0.6
                }
            });
            aiReplyText = response.text || "답변을 생성할 수 없습니다.";
        } else {
            aiReplyText = "AI가 연결되지 않았습니다. API KEY를 확인하세요.";
        }

        // Save AI Reply
        const aiMsg = { sender: 'Brown CTO', text: aiReplyText, timestamp: Date.now(), isAi: true };
        mockChatDB[videoId].push(aiMsg);

        res.status(200).json({ success: true, userMessage: text, aiReply: aiMsg });
    } catch (err) {
        console.error("Chat Error:", err);
        res.status(500).json({ error: "Failed to process chat message" });
    }
});

app.get('/api/user/:telegramId/referrals', async (req, res) => {
    try {
        const user = await db.get(`SELECT id FROM User WHERE telegramId = ?`, [req.params.telegramId]);
        if (!user) return res.json({ l1: 0, l2: 0, shadowVolume: 0 });

        const l1Users = await db.all(`SELECT id FROM User WHERE referrerId = ?`, [user.id]);
        let l2Count = 0;
        for (const l1 of l1Users) {
            const l2 = await db.all(`SELECT id FROM User WHERE referrerId = ?`, [l1.id]);
            l2Count += l2.length;
        }

        // Mock shadow volume calculation based on user count
        res.json({
            l1: l1Users.length,
            l2: l2Count,
            shadowVolume: (l1Users.length * 100) + (l2Count * 50)
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch referrals" });
    }
});

// 1. Brown AI Chat Endpoint
app.post('/api/chat/brown', async (req, res) => {
    try {
        const { message } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.json({ reply: `[System] GEMINI API KEY is missing. But as Manager Brown would say: Stop wasting time and get back to analyzing the RSI on ETH, your portfolio is bleeding.` });
        }

        const prompt = `Act as Manager Brown from Vora Finance. You are a cynical, ruthless, but highly capable AI manager that deals with crypto trading strategies. Your tone is direct, factual, and slightly condescending to those who don't optimize their assets. Answer the following message from a user in your persona, keep it under 3 sentences: \n\nUser: ${message}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error("Gemini AI Error:", error);
        res.status(500).json({ error: "Brown is currently busy optimizing portfolios. Try again later." });
    }
});

// 2. 100 TON Fandom Staking Endpoint
app.post('/api/user/stake', async (req, res) => {
    try {
        const { telegramId, walletAddress, amount } = req.body;

        let user = await db.get(`SELECT * FROM User WHERE telegramId = ?`, [telegramId]);

        if (!user) {
            const result = await db.run(
                `INSERT INTO User (telegramId, tonWalletAddress) VALUES (?, ?)`,
                [telegramId, walletAddress]
            );
            user = { id: result.lastID, telegramId, tonWalletAddress: walletAddress, totalTonStaked: 0, isFandomUser: 0, t2eBonusMultiplier: 1.0 };
        }

        const newTotalStaked = user.totalTonStaked + amount;
        const isFandom = newTotalStaked >= 100 ? 1 : 0;
        const multiplier = isFandom ? 2.0 : 1.0;

        await db.run(
            `UPDATE User SET totalTonStaked = ?, isFandomUser = ?, t2eBonusMultiplier = ?, tonWalletAddress = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
            [newTotalStaked, isFandom, multiplier, walletAddress, user.id]
        );

        const updatedUser = await db.get(`SELECT * FROM User WHERE id = ?`, [user.id]);
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Staking DB Error:", error);
        res.status(500).json({ error: "Failed to record staking transaction." });
    }
});

// ==========================================
// 🚀 DIFFERENTIAL T2E REWARD SYSTEM
// ==========================================

// 2.3 AI Daily Settlement (Cron-triggered)
app.post('/api/internal/daily-settlement', async (req, res) => {
    try {
        console.log(`[Brown AI] 🕒 Daily KST 00:00 Settlement Started...`);

        // 1. Fetch Dummy Performance of 3 Pine Scripts
        const perfLijimaeScalper = (Math.random() * 500) + 100; // $100 ~ $600 PnL
        const perfLijimaeSwinger = (Math.random() * 800) - 100; // -$100 ~ $700 PnL
        const perfVoraProV6 = (Math.random() * 1000) + 200;     // $200 ~ $1200 PnL

        const totalPnL = perfLijimaeScalper + perfLijimaeSwinger + perfVoraProV6;

        // 2. AI calculates daily T2E Pool conceptually
        // E.g., 10% of total PnL is distributed as T2E rewards today.
        const poolFactor = totalPnL > 0 ? (totalPnL * 0.10) : 50; // Minimum fallback 50 VORA
        globalConfig.dailyT2EPool = Math.round(poolFactor);
        globalConfig.lastSettlementDate = new Date().toISOString().split('T')[0];

        // 3. Brown AI Telegram Announcement
        const tgToken = process.env.BROWN_TELEGRAM_TOKEN || process.env.TELEGRAM_TOKEN;
        const tgChat = process.env.TELEGRAM_CHAT_ID;

        const summaryMsg = `📊 <b>[일일 전략 결산 및 T2E 풀 안내]</b> 📊\n\n` +
            `🤖 <b>Manager Brown</b>의 일일 마감 보고입니다.\n\n` +
            `▪️ <b>lijimae scalper (15m):</b> $${perfLijimaeScalper.toFixed(2)}\n` +
            `▪️ <b>lijimae swinger (1H):</b> $${perfLijimaeSwinger.toFixed(2)}\n` +
            `▪️ <b>VORA Pro v6 Champion:</b> $${perfVoraProV6.toFixed(2)}\n\n` +
            `📈 <b>총합 PnL:</b> $${totalPnL.toFixed(2)}\n\n` +
            `🎁 <b>금일 할당된 T2E 총 보상 풀:</b> ${globalConfig.dailyT2EPool} VORA\n\n` +
            `* 크루 레퍼럴, P2P 마켓 참여도, DNFT 기여도가 높은 팬덤일수록 보상 배수가 기하급수적으로 증가합니다. 효율적으로 채굴하십시오.`;

        if (tgToken && tgChat) {
            await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: tgChat, text: summaryMsg, parse_mode: 'HTML' })
            });
        }

        res.json({ success: true, message: "Daily settlement complete", dailyT2EPool: globalConfig.dailyT2EPool, totalPnL });
    } catch (err) {
        console.error("Daily Settlement Error:", err);
        res.status(500).json({ error: "Settlement failed." });
    }
});

// 2.4 Differential T2E Claim Endpoint
app.post('/api/user/claim-t2e', async (req, res) => {
    try {
        const { telegramId, baseTaps } = req.body;

        const user = await db.get(`SELECT * FROM User WHERE telegramId = ?`, [telegramId]);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Calculate Contribution Score
        let multiplier = 1.0;
        let reasons = [];

        // 1. Referral Contribution
        const l1Users = await db.all(`SELECT id FROM User WHERE referrerId = ?`, [user.id]);
        if (l1Users.length >= 5) {
            multiplier += 0.5;
            reasons.push("Strong Team Builder");
        }

        // 2. Fandom Staking Contribution
        if (user.isFandomUser) {
            multiplier += 1.0;
            reasons.push("Vora Fandom");
        }

        // 3. P2P Market Contribution
        if (p2pContributors[telegramId]) {
            multiplier += 1.5;
            reasons.push("P2P Top Contributor");
        }

        // 4. DNFT Contribution
        if (dnftContributors[telegramId]) {
            multiplier += 1.0;
            reasons.push("DNFT VIP");
        }

        // Apply Global Dynamic Ratio (from liquidity defense)
        multiplier *= globalConfig.dynamicRewardRatio;

        const finalReward = baseTaps * multiplier;

        // Subtract from daily pool if sufficient
        if (globalConfig.dailyT2EPool >= finalReward) {
            globalConfig.dailyT2EPool -= finalReward;
        } else {
            // Pool exhausted
            return res.status(200).json({ success: false, message: "오늘의 T2E 풀(Pool)이 모두 고갈되었습니다! 내일 Brown AI의 결산을 기다리세요." });
        }

        res.json({
            success: true,
            telegramId,
            baseTaps,
            multiplier: multiplier.toFixed(2),
            reasons: reasons.join(", "),
            finalReward: finalReward.toFixed(2),
            message: `획득 성공! 당신의 기여도 보너스(${multiplier.toFixed(2)}x)가 적용되어 ${finalReward.toFixed(2)} VORA를 획득했습니다.`
        });

    } catch (err) {
        console.error("Claim T2E Error:", err);
        res.status(500).json({ error: "Failed to claim T2E." });
    }
});

// 2.6 Internal Webhook for Real-time Binance Trade Logging
app.post('/api/internal/trade-log', async (req, res) => {
    try {
        const { symbol, side, pnl, timestamp } = req.body;
        console.log(`[Trade Log Received] 📊 ${symbol} | ${side} | PNL: ${pnl}`);

        // Ensure the trades table exists
        await db.exec(`
            CREATE TABLE IF NOT EXISTS trades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                symbol TEXT,
                side TEXT,
                pnl REAL,
                timestamp INTEGER
            )
        `);

        await db.run(
            `INSERT INTO trades (symbol, side, pnl, timestamp) VALUES (?, ?, ?, ?)`,
            [symbol, side, pnl, timestamp]
        );

        // Here we could trigger the Video Rendering Pipeline if enough trades are collected, 
        // but for now we'll trigger it manually via another endpoint.
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Trade Log Error:", error);
        res.status(500).json({ error: "Failed to log trade." });
    }
});

// 2.7 Internal Webhook for Triggering Real-time Trade Videos (Long/Short/Integrated)
app.post('/api/internal/generate-trade-videos', async (req, res) => {
    try {
        const { upgrade_details } = req.body; // e.g., "Updated MACD parameters and lowered SL risk to 3%"
        res.status(200).json({ success: true, message: "Trade Video Pipeline Started" });

        setImmediate(async () => {
            console.log("🎬 Starting 3-Part Trade Video Rendering Pipeline...");

            // Fetch stats from DB
            const longTrades = await db.all(`SELECT * FROM trades WHERE side = 'LONG'`);
            const shortTrades = await db.all(`SELECT * FROM trades WHERE side = 'SHORT'`);
            const allTrades = await db.all(`SELECT * FROM trades`);

            if (allTrades.length === 0) {
                console.log("No trades found to generate videos.");
                return;
            }

            const formatSummary = (name: string, trades: any[]) => {
                const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
                const wins = trades.filter(t => t.pnl > 0).length;
                const losses = trades.filter(t => t.pnl <= 0).length;
                return `${name} Stats: ${trades.length} Trades (${wins}W / ${losses}L), PnL: $${totalPnL.toFixed(2)}`;
            };

            const versions = [
                { type: "LONG-only", summary: formatSummary("Long", longTrades) },
                { type: "SHORT-only", summary: formatSummary("Short", shortTrades) },
                { type: "INTEGRATED", summary: formatSummary("Integrated", allTrades) }
            ];

            for (const v of versions) {
                try {
                    console.log(`\n--- Generating Video: ${v.type} ---`);
                    const scriptPrompt = `Act as Brown, a sharp AI fund manager. We just updated our trading bot. Write a 40-second engaging YouTube Shorts script showcasing our recent ${v.type} trades.\n\nStats:\n${v.summary}\n\nRecent Upgrade Made:\n${upgrade_details || "Minor AI optimization."}\n\nTone: Professional, slightly arrogant, factual. End with a call to join Vora.`;

                    const scriptRes = await ai?.models.generateContent({ model: 'gemini-2.5-flash', contents: scriptPrompt });
                    const script = scriptRes?.text || "Script generation failed.";

                    console.log(`[${v.type}] AI Script Created. Calling Nano Banana & Veo (Simulated)...`);
                    await new Promise(resolve => setTimeout(resolve, 3000));

                    const mockVideoPath = `./trade_video_${v.type.toLowerCase().replace('-', '_')}.mp4`;
                    if (!fs.existsSync(mockVideoPath)) {
                        fs.writeFileSync(mockVideoPath, "MOCK MP4 BINANCE DATA");
                    }

                    const title = `🔥 Binance Real-time Auto-Trading: ${v.type} Results`;
                    const ytUrl = await uploadToYouTubeShorts(mockVideoPath, title, script);

                    const tgToken = process.env.TELEGRAM_TOKEN;
                    const tgChat = process.env.TELEGRAM_CHAT_ID;
                    if (tgToken && tgChat) {
                        const tgMsg = `🎥 **Vora OS Auto-Trade Video Uploaded! (${v.type})**\n\n${v.summary}\n\n**Upgrades:** ${upgrade_details || "N/A"}\n\n👉 Watch here: ${ytUrl}\n#VoraFinance #AutoTrading`;
                        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ chat_id: tgChat, text: tgMsg })
                        });
                    }
                    console.log(`✅ ${v.type} Pipeline Finished.`);
                } catch (e) {
                    console.error(`Error in ${v.type} video loop:`, e);
                }
            }
        });

    } catch (error) {
        console.error("Video Pipeline Error:", error);
        res.status(500).json({ error: "Failed to trigger pipeline." });
    }
});

// 2.8 Internal Webhook for Real-time Trade Video Screen Recording
app.post('/api/internal/record-trade-video', async (req, res) => {
    try {
        const { symbol, side, price, amount } = req.body;
        // Respond immediately, processing video asynchronously
        res.status(200).json({ success: true, message: "Screen recording started" });

        setImmediate(async () => {
            let browser;
            const savePath = `./trade_record_${Date.now()}.mp4`;
            try {
                console.log(`🎥 Starting Puppeteer for ${symbol} ${side}...`);
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

                let formattedSymbol = symbol.replace('/', '').toUpperCase();
                // Using Binance spot chart as it loads much faster and has fewer modal popups
                const chartUrl = `https://www.binance.com/en/trade/${formattedSymbol}?type=spot`;
                console.log(`Navigating to ${chartUrl}...`);

                try {
                    await page.goto(chartUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                } catch (err) {
                    console.log(`Navigation timeout reached, proceeding with recording...`);
                }

                // Hide cookie banner if it appears
                await page.evaluate(() => {
                    const cookieBanner = document.querySelector('#onetrust-consent-sdk') as HTMLElement;
                    if (cookieBanner) cookieBanner.style.display = 'none';
                }).catch(() => { });

                // Wait 3 seconds for indicators to load
                await new Promise(r => setTimeout(r, 3000));

                // Start recording 5 seconds
                await recorder.start(savePath);
                console.log(`🔴 Recording 5 seconds of the chart...`);
                await new Promise(r => setTimeout(r, 5000));
                await recorder.stop();
                await browser.close();

                console.log(`✅ Recording finished. Uploading to Telegram!`);

                const tgToken = process.env.TELEGRAM_TOKEN;
                const tgChat = process.env.TELEGRAM_CHAT_ID;
                if (tgToken && tgChat && fs.existsSync(savePath)) {
                    const positionIcon = side.toUpperCase() === "LONG" ? "🟢" : "🔴";
                    const tgMsg = `⚡️ <b>BINANCE LIVE EXECUTION</b> ⚡️\n━━━━━━━━━━━━━━━━━━\n${positionIcon} <b>${side.toUpperCase()} 포지션 진입 완료</b>\n▪️ 코인명: #${formattedSymbol}\n▪️ 진입가: ${price}\n▪️ 수  량: ${amount}\n━━━━━━━━━━━━━━━━━━\n<i>(이 영상은 봇 체결 순간의 라이브 차트입니다)</i>`;

                    const form = new FormData();
                    form.append('chat_id', tgChat);
                    form.append('caption', tgMsg);
                    form.append('parse_mode', 'HTML');
                    form.append('video', fs.createReadStream(savePath));

                    await fetch(`https://api.telegram.org/bot${tgToken}/sendVideo`, {
                        method: 'POST',
                        body: form,
                        headers: form.getHeaders()
                    });

                    fs.unlinkSync(savePath); // Clean up
                    console.log(`✅ Trade Video sent via Telegram`);
                }
            } catch (e) {
                console.error("Screen recording error:", e);
                if (browser) await browser.close();
                if (fs.existsSync(savePath)) fs.unlinkSync(savePath);
            }
        });
    } catch (error) {
        console.error("Record webhook error:", error);
        res.status(500).json({ error: "Failed to record video." });
    }
});

// Helper: YouTube Upload API
async function uploadToYouTubeShorts(videoPath: string, title: string, description: string): Promise<string> {
    try {
        console.log("📤 Uploading to YouTube Shorts...");
        // 1. Load client secrets from a local file.
        if (!fs.existsSync('./client_secret.json')) {
            console.warn("⚠️ client_secret.json not found! Skipping YouTube upload. Please download OAuth credentials from Google Cloud Console.");
            return "https://youtube.com/shorts/MOCK_VIDEO_ID_MISSING_API_KEY";
        }

        const content = fs.readFileSync('./client_secret.json', 'utf8');
        const credentials = JSON.parse(content);
        const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
        const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        if (!fs.existsSync('./youtube_token.json')) {
            console.warn("⚠️ youtube_token.json not found! You must authorize the app locally first to get a token.");
            return "https://youtube.com/shorts/MOCK_VIDEO_ID_NEEDS_AUTH";
        }

        const token = fs.readFileSync('./youtube_token.json', 'utf8');
        oauth2Client.setCredentials(JSON.parse(token));
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

        const res = await youtube.videos.insert({
            part: ['snippet', 'status'],
            requestBody: {
                snippet: {
                    title: title.substring(0, 100), // Max 100 chars
                    description: description + "\n\n#Shorts #Trading #VoraFinance", // Must include #Shorts to be picked up
                    tags: ['Shorts', 'Trading', 'Crypto', 'Finance', 'AI'],
                    categoryId: '27' // Education
                },
                status: {
                    privacyStatus: 'unlisted', // unlisted by default until user reviews
                    selfDeclaredMadeForKids: false
                }
            },
            media: {
                body: fs.createReadStream(videoPath)
            }
        });

        console.log(`✅ YouTube Shorts uploaded. Video Id: ${res.data.id}`);
        return `https://youtube.com/shorts/${res.data.id}`;
    } catch (error) {
        console.error("❌ Error uploading to YouTube:", error);
        return "https://youtube.com/shorts/UPLOAD_FAILED";
    }
}

// 2.5 TradingView Video Automation Webhook (n8n Replacement)
app.post('/api/webhook/tradingview-video', async (req, res) => {
    // Return 200 OK immediately so TradingView doesn't timeout
    res.status(200).json({ success: true, message: "Video generation job started in background" });

    // Run the pipeline asynchronously
    setImmediate(async () => {
        console.log("🎬 Starting Vora Video Automation Pipeline...");
        try {
            const { script_code, description, win_rate, roi } = req.body;

            if (!ai) {
                console.error("Gemini AI is not initialized. Check GEMINI_API_KEY.");
                return;
            }

            // Step 1: Strategy Simplification
            console.log("Step 1: Simplifying Strategy...");
            const simplifyPrompt = `Act as an expert quantitative analyst. Simplify the following trading strategy logic into 3 bullet points that a beginner can understand. Avoid technical jargon like 'Fibonacci' or 'MACD divergence' and focus on the market psychology and entry/exit conditions.\n\nStrategy Data:\n${script_code}\n${description}\n\nBacktest Data:\nWin Rate: ${win_rate}\nROI: ${roi}`;
            const simplifyRes = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: simplifyPrompt });
            const simplifiedPoints = simplifyRes.text;

            // Step 2: Brown Persona Script
            console.log("Step 2: Writing Brown Persona Script...");
            const scriptPrompt = `Act as Brown, the ruthless but honest AI manager. Convert these 3 points into a script for a 60-second video. Tone should be direct, assertive, and factual ('Your assets are fossilized if you don't adapt...').\n\nPoints:\n${simplifiedPoints}`;
            const scriptRes = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: scriptPrompt });
            const videoScript = scriptRes.text;

            // Step 3 & 4: Image & Video Gen (Simulated Call / Fetch to Google API)
            console.log("Step 3 & 4: Calling Nano Banana & Veo APIs (Simulated)...");
            // Timeout to simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Save mock video output physically to upload
            const mockVideoPath = "./demo_short.mp4";
            if (!fs.existsSync(mockVideoPath)) {
                fs.writeFileSync(mockVideoPath, "MOCK MP4 DATA FILE");
            }

            // Step 4.5: YouTube Shorts Upload
            console.log("Step 4.5: Uploading Video to YouTube...");
            const shortTitle = "🔥 Vora OS: New Strategy Verified";
            const youtubeUrl = await uploadToYouTubeShorts(mockVideoPath, shortTitle, videoScript);

            // Step 5: Telegram Notification
            console.log("Step 5: Sending to Telegram...");
            const telegramToken = process.env.TELEGRAM_TOKEN;
            const telegramChatId = process.env.TELEGRAM_CHAT_ID || "@vora_meetup_channel"; // Fallback to channel if ID not set

            if (telegramToken && telegramChatId) {
                const tgUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
                const tgMsg = `🚀 **New Verified Strategy Generated by Vora OS v4.0**\n\nGenerated by Google Veo.\n\n📝 **Strategy Summary:**\n${simplifiedPoints}\n\n📺 **Watch the AI Shorts Video:**\n${youtubeUrl}\n\n#TradingView #VoraFinance #Shorts`;

                await fetch(tgUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: telegramChatId, text: tgMsg })
                });
                console.log("✅ Pipeline Complete: Telegram message sent.");
            } else {
                console.warn("⚠️ Telegram Token/Chat ID missing in .env. Skipping Telegram message.");
                console.log("Message Content would be:\n", `🚀 **New Verified Strategy Generated by Vora OS v4.0**\n\nGenerated by Google Veo.\n\nSummary:\n${simplifiedPoints}\n\n${youtubeUrl}`);
            }

        } catch (err) {
            console.error("❌ Pipeline Failed:", err);
        }
    });
});

// 3. User Data Fetch Endpoint
app.get('/api/user/:telegramId', async (req, res) => {
    try {
        const user = await db.get(`SELECT * FROM User WHERE telegramId = ?`, [req.params.telegramId]);
        // Convert boolean integers to true/false
        if (user) user.isFandomUser = !!user.isFandomUser;
        res.json(user || { isFandomUser: false, totalTonStaked: 0 });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user data." });
    }
});

app.get('/api/admin/users', adminAuth, async (req, res) => {
    try {
        const users = await db.all(`SELECT * FROM User ORDER BY id DESC LIMIT 50`);
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users." });
    }
});

app.get('/api/admin/settlements', adminAuth, async (req, res) => {
    try {
        const users = await db.all(`SELECT telegramId, tonWalletAddress, totalTonStaked, isFandomUser FROM User WHERE totalTonStaked > 0 OR isFandomUser = 1`);

        const settlements = users.map((u: any) => {
            const baseVora = 1000;
            const extraVora = (u.totalTonStaked * 10);
            return {
                telegramId: u.telegramId,
                wallet: u.tonWalletAddress,
                staked: u.totalTonStaked,
                status: 'Pending',
                payoutVora: baseVora + extraVora
            };
        });

        res.json({ success: true, settlements });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch settlements." });
    }
});

// ==========================================
// 🛡️ Liquidity Risk Management API endpoints
// ==========================================

// Endpoint called by Mini App when a user tries to withdraw T2E/Unilevel earnings
app.post('/api/internal/request-withdraw', async (req, res) => {
    try {
        const { telegramId, walletAddress, amountVora } = req.body;

        if (!telegramId || !walletAddress || !amountVora) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        // Apply Dynamic Ratio if it's a dynamic reward (e.g. T2E)
        // (Assuming amountVora passed is the base amount)
        const finalAmountVora = amountVora * globalConfig.dynamicRewardRatio;
        const usdValue = finalAmountVora * globalConfig.viraToUsdRate;

        if (usdValue >= globalConfig.circuitBreakerThresholdUsd) {
            // Trigger Circuit Breaker (Requires Admin Approval)
            const txId = `TX_${Date.now()}`;
            pendingWithdrawals[txId] = { wallet: walletAddress, amount: finalAmountVora, usdValue, status: 'PENDING_APPROVAL' };

            console.warn(`[Circuit Breaker] Massive withdrawal detected! TX: ${txId}, Amount: ${finalAmountVora} VORA ($${usdValue})`);

            // Alert Admin via Brown Telegram Bot
            const brownTelegramToken = process.env.BROWN_TELEGRAM_TOKEN || process.env.TELEGRAM_TOKEN;
            const adminChatId = process.env.TELEGRAM_CHAT_ID; // Assuming master chat ID is the admin
            if (brownTelegramToken && adminChatId) {
                const tgUrl = `https://api.telegram.org/bot${brownTelegramToken}/sendMessage`;
                const tgMsg = `🚨 <b>[CIRCUIT BREAKER ALERT] 대규모 출금 요청 감지</b> 🚨\n\n▪️ <b>요청자:</b> ${telegramId}\n▪️ <b>요청 수량:</b> ${finalAmountVora} VORA ($${usdValue.toFixed(2)})\n▪️ <b>수신 지갑:</b> <code>${walletAddress}</code>\n\n현재 유동성 방어를 위해 출금이 보류되었습니다.\n\n승인하시려면 아래 명령어를 클릭하세요:\n<code>/approve ${txId}</code>\n\n거절하시려면 아래 명령어를 클릭하세요:\n<code>/reject ${txId}</code>`;

                await fetch(tgUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: adminChatId, text: tgMsg, parse_mode: 'HTML' })
                });
            }

            return res.status(202).json({
                success: true,
                message: "Withdrawal is large and has been queued for admin security review.",
                status: "PENDING_APPROVAL",
                txId
            });
        } else {
            // Auto-Approve small amounts
            // Trigger actual BotWithdraw logic here against Treasury.tact
            return res.status(200).json({
                success: true,
                message: `Withdrawal of ${finalAmountVora} VORA automatically processed.`,
                status: "AUTO_APPROVED"
            });
        }
    } catch (error) {
        console.error("Withdrawal error:", error);
        res.status(500).json({ error: "Failed to process withdrawal." });
    }
});

// Endpoint for Mini App to simulate Purchasing Fandom Store Packages
app.post('/api/user/buy-package', async (req, res) => {
    try {
        const { telegramId, packageId, currency } = req.body;
        if (!telegramId || !packageId || !currency) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const tonToVoraRate = 50;
        const discountRate = 0.8;

        // Mock Packages Database
        const packages = [
            { id: 1, name: "Starter Fandom Pass", priceTon: 10 },
            { id: 2, name: "Pro Trader Pass", priceTon: 25 },
            { id: 3, name: "Elite DNFT Whitelist", priceTon: 50 },
            { id: 4, name: "Partner P2P MM Node", priceTon: 200 }
        ];

        const pkg = packages.find(p => p.id === packageId);
        if (!pkg) return res.status(404).json({ error: "Package not found" });

        let amountDue = 0;
        let appliedDiscount = false;

        if (currency.toUpperCase() === 'VORA') {
            amountDue = (pkg.priceTon * tonToVoraRate) * discountRate;
            appliedDiscount = true;
        } else if (currency.toUpperCase() === 'TON') {
            amountDue = pkg.priceTon;
        } else {
            return res.status(400).json({ error: "Invalid currency. Use TON or VORA." });
        }

        return res.status(200).json({
            success: true,
            message: "Purchase sequence initiated successfully.",
            details: {
                package: pkg.name,
                currency: currency.toUpperCase(),
                amountDue: amountDue,
                discountApplied: appliedDiscount ? "20% VORA Discount" : "None"
            }
        });

    } catch (error) {
        console.error("Purchase error:", error);
        res.status(500).json({ error: "Failed to process purchase." });
    }
});

// ==========================================
// 🔗 Referral & Refund System Endpoints
// ==========================================

// Mock DB objects
const userUniqueIds: Record<string, string> = { "city1": "VORA-A1B2", "city2": "VORA-C3D4" }; // telegramId -> uniqueId
const uniqueIdToUser: Record<string, any> = { "VORA-A1B2": { telegramId: "city1", maskedWallet: "EQ...X1Y2", maskingName: "c***1" } };
const pendingRefunds: Record<string, any> = {};

// 1. Referral Link Signup & Instant Reward
app.post('/api/user/referral-signup', async (req, res) => {
    try {
        const { newTelegramId, referrerUniqueId } = req.body;
        if (!newTelegramId || !referrerUniqueId) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        const referrer = uniqueIdToUser[referrerUniqueId];
        if (!referrer) return res.status(404).json({ error: "Invalid Referral ID" });

        // Generate ID for new user
        const newUniqueId = `VORA-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        userUniqueIds[newTelegramId] = newUniqueId;
        uniqueIdToUser[newUniqueId] = { telegramId: newTelegramId, maskedWallet: "EQ...NEW", maskingName: "new***" };

        const instantRewardVora = 100 * globalConfig.dynamicRewardRatio;

        return res.status(200).json({
            success: true,
            message: "Signup complete via referral. Instant reward allocated to referrer.",
            newUniqueId: newUniqueId,
            referrerRewarded: referrer.telegramId,
            rewardAmountVora: instantRewardVora,
            availableTomorrow: true
        });
    } catch (error) {
        res.status(500).json({ error: "Signup Failed" });
    }
});

// 2. P2P Escrow Partner Verification
app.post('/api/p2p/verify-partner', async (req, res) => {
    try {
        const { targetUniqueId } = req.body;
        const target = uniqueIdToUser[targetUniqueId];

        if (!target) return res.status(404).json({ error: "User not found for this ID" });

        return res.status(200).json({
            success: true,
            message: "Partner verified. Review details before signing Escrow.",
            partnerDetails: {
                maskedTelegram: target.maskingName,
                maskedWallet: target.maskedWallet
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Verification Failed" });
    }
});

// 3. Request 30-Day Escrow Refund
app.post('/api/user/request-refund', async (req, res) => {
    try {
        const { telegramId, originalPaymentTon } = req.body;
        if (!telegramId || !originalPaymentTon) return res.status(400).json({ error: "Missing parameters" });

        const txId = `REF_${Date.now()}`;
        // Calculate Lockup period
        const unlockDate = new Date();
        unlockDate.setDate(unlockDate.getDate() + 30); // 30 days lockup

        pendingRefunds[txId] = {
            telegramId,
            originalPaymentTon,
            status: "LOCKED_30_DAYS",
            unlockDateStr: unlockDate.toISOString()
        };

        return res.status(200).json({
            success: true,
            message: "Refund requested. 30-day anti-abusing lockup initiated.",
            txId,
            unlockDate: unlockDate.toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: "Refund Request Failed" });
    }
});

// 4. Claim Refund after 30 days (Penalty Calculation)
app.post('/api/user/claim-refund', async (req, res) => {
    try {
        const { txId, receivedVoraAmount } = req.body;
        const refundTx = pendingRefunds[txId];

        if (!refundTx) return res.status(404).json({ error: "Refund TX not found" });
        if (new Date() < new Date(refundTx.unlockDateStr)) {
            return res.status(403).json({ error: "30-day lockup period has not expired yet." });
        }

        const govMaintenanceFee = refundTx.originalPaymentTon * 0.20; // 20% penalty
        const voraValueInTon = (receivedVoraAmount || 0) / 50; // Assume 1 TON = 50 VORA

        const finalTonRefund = refundTx.originalPaymentTon - govMaintenanceFee - voraValueInTon;

        if (finalTonRefund <= 0) {
            return res.status(200).json({
                success: false,
                message: "Refund rejected. Received VORA value + Governance fee exceeds original payment."
            });
        }

        refundTx.status = "COMPLETED";

        return res.status(200).json({
            success: true,
            message: "Refund Claimed Successfully",
            breakdown: {
                originalTon: refundTx.originalPaymentTon,
                governanceDeduction: `-${govMaintenanceFee} TON (20%)`,
                voraValueDeduction: `-${voraValueInTon} TON`,
                finalRefundTon: finalTonRefund
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Claim Failed" });
    }
});

// ==========================================
// Brown AI (CS & Co-founder) Telegram Bot
// ==========================================
const brownTelegramToken = process.env.BROWN_TELEGRAM_TOKEN || process.env.TELEGRAM_TOKEN;
if (brownTelegramToken) {
    const brownBot = new TelegramBot(brownTelegramToken, { polling: true });
    console.log("🤖 Brown AI Telegram Bot is polling...");

    const handleIncomingMessage = async (msg: any) => {
        const chatId = msg.chat?.id;
        const text = msg.text;

        console.log(`[Brown AI] Received message in chat ${chatId}: "${text}"`);
        if (!text) return;

        // Admin Commands Authentication Check
        // In a real scenario, this should check against an array of Admin Telegram IDs.
        // For demonstration, we assume any user interacting with Brown bot directly can use admin commands if they know them.
        const isAdmin = true;

        if (text.startsWith('/set_ratio') && isAdmin) {
            const parts = text.split(' ');
            if (parts.length === 2 && !isNaN(parseFloat(parts[1]))) {
                const newRatio = parseFloat(parts[1]);
                if (newRatio >= 0 && newRatio <= 2) {
                    globalConfig.dynamicRewardRatio = newRatio;
                    return brownBot.sendMessage(chatId, `✅ [Admin] T2E & Unilevel Reward Ratio updated to: ${newRatio * 100}%`);
                }
            }
            return brownBot.sendMessage(chatId, `❌ Usage: /set_ratio [0.0 ~ 2.0] (e.g., /set_ratio 0.5 for 50%)`);
        }

        if (text.startsWith('/approve') && isAdmin) {
            const parts = text.split(' ');
            if (parts.length === 2) {
                const txId = parts[1];
                if (pendingWithdrawals[txId]) {
                    const tx = pendingWithdrawals[txId];
                    tx.status = 'APPROVED';
                    // Trigger the actual blockchain BotWithdraw logic here
                    brownBot.sendMessage(chatId, `✅ [Admin] Withdrawal ${txId} for ${tx.amount} VORA to ${tx.wallet} has been APPROVED and executed.`);
                    delete pendingWithdrawals[txId];
                } else {
                    brownBot.sendMessage(chatId, `❌ [Admin] TX ${txId} not found.`);
                }
            }
            return;
        }

        if (text.startsWith('/reject') && isAdmin) {
            const parts = text.split(' ');
            if (parts.length === 2) {
                const txId = parts[1];
                if (pendingWithdrawals[txId]) {
                    const tx = pendingWithdrawals[txId];
                    tx.status = 'REJECTED';
                    brownBot.sendMessage(chatId, `🚫 [Admin] Withdrawal ${txId} for ${tx.amount} VORA to ${tx.wallet} has been REJECTED.`);
                    delete pendingWithdrawals[txId];
                } else {
                    brownBot.sendMessage(chatId, `❌ [Admin] TX ${txId} not found.`);
                }
            }
            return;
        }

        if (text.startsWith('/settle') && isAdmin) {
            brownBot.sendMessage(chatId, `⚙️ [Admin] Triggering Daily AI Settlement...`);
            try {
                const port = process.env.PORT || 3001; // Changed to 3001 to match the app.listen port
                await fetch(`http://localhost:${port}/api/internal/daily-settlement`, { method: 'POST' });
                // The endpoint itself sends the Telegram announcement, so no extra message needed here.
            } catch (err) {
                brownBot.sendMessage(chatId, `❌ [Admin] Failed to trigger settlement: ${err}`);
            }
            return;
        }

        // 1. Fandom Store Logic (VORA 20% Discount)
        if (text.startsWith('/store')) {
            const tonToVoraRate = 50; // Assume 1 TON = 50 VORA for calculation
            const discountRate = 0.8; // 20% Discount when paying with VORA

            // Simulated Google Sheets Fetch
            const packages = [
                { id: 1, name: "Starter Fandom Pass (1 Month)", priceTon: 10 },
                { id: 2, name: "Pro Trader Pass (3 Months)", priceTon: 25 },
                { id: 3, name: "Elite DNFT Whitelist", priceTon: 50 },
                { id: 4, name: "Partner P2P MM Node", priceTon: 200 }
            ];

            let storeMsg = `🛍️ **[VORA Fandom VIP Store]**\n\n`;
            storeMsg += `💡 *Pay with $VORA to receive a massive 20% discount!*\n\n`;

            packages.forEach(pkg => {
                const priceVora = (pkg.priceTon * tonToVoraRate) * discountRate;
                storeMsg += `🔹 **[${pkg.id}] ${pkg.name}**\n`;
                storeMsg += `   💵 결제 (TON): ${pkg.priceTon} TON\n`;
                storeMsg += `   💎 특별할인 (VORA): ${priceVora} VORA (20% OFF!)\n\n`;
            });

            storeMsg += `👉 구매하시려면 아래 명령어를 입력하세요:\n\`/buy [패키지번호] [ton|vora]\`\n예시: \`/buy 2 vora\``;

            return brownBot.sendMessage(chatId, storeMsg, { parse_mode: 'Markdown' });
        }

        if (text.startsWith('/buy')) {
            const parts = text.split(' ');
            if (parts.length === 3) {
                const pkgId = parseInt(parts[1]);
                const currency = parts[2].toUpperCase();
                return brownBot.sendMessage(chatId, `✅ **[결제 시뮬레이션]**\n\n패키지 #${pkgId} 번을 ${currency} 단위로 결제 시도합니다.\n(실제 런칭 시 이 버튼이 미니앱 결제창 또는 TON 스마트 컨트랙트로 즉시 연결됩니다!)`, { parse_mode: 'Markdown' });
            }
            return brownBot.sendMessage(chatId, `❌ 사용법: /buy [패키지번호] [ton|vora]`);
        }

        // 2. Chat Mute Management (Night Mode)
        if (text.startsWith('/toggle_night_mode') && isAdmin) {
            try {
                // To mute a group: set permissions to false
                // Note: user must use this command inside the group they want to mute, or pass a specific ChatID
                await brownBot.setChatPermissions(chatId, {
                    can_send_messages: false,
                    can_send_other_messages: false
                });
                return brownBot.sendMessage(chatId, `🌙 **[야간 모드 활성화]**\n\n코어 크루원들의 휴식을 위해 팬덤 VIP 그룹의 채팅이 내일 오전 10시까지 임시 제한됩니다. 편안한 밤 되십시오!`);
            } catch (err) {
                return brownBot.sendMessage(chatId, `❌ [Admin] 채팅 권한 제어 실패. 봇이 관리자 권한(Admin)을 가지고 있는지 확인하세요.\n에러: ${err}`);
            }
        }

        if (text.startsWith('/toggle_day_mode') && isAdmin) {
            try {
                await brownBot.setChatPermissions(chatId, {
                    can_send_messages: true,
                    can_send_other_messages: true
                });
                return brownBot.sendMessage(chatId, `☀️ **[주간 모드 활성화]**\n\n팬덤 VIP 그룹의 채팅 제한이 해제되었습니다. 오늘도 뜨거운 트레이딩 하루 보내십시오!`);
            } catch (err) {
                return brownBot.sendMessage(chatId, `❌ [Admin] 채팅 권한 제어 실패. 에러: ${err}`);
            }
        }

        // 3. Check Operating Hours (10:00 - 24:00 KST)
        const now = new Date();
        const kstFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', hour: 'numeric', hour12: false });
        const currentKstHour = parseInt(kstFormatter.format(now));

        // If it's before 10 AM (0-9)
        if (currentKstHour >= 0 && currentKstHour < 10) {
            console.log(`[Brown AI] Offline hours (${currentKstHour} KST). Sending auto-reply.`);
            return brownBot.sendMessage(chatId, "🚫 [매니저 브라운 부재중 안내]\n\n현재는 운영 시간이 아닙니다. 브라운 매니저는 트레이딩 및 업무 집중을 위해 아래 시간에만 활동합니다.\n\n⏰ 운영 시간: 매일 10:00 ~ 24:00 (KST)\n\n메시지를 남겨주시면 운영 시간에 순차적으로 답변드리겠습니다. 감사합니다.");
        }

        // 2. Process with Gemini AI using Brown Persona
        try {
            if (!ai) throw new Error("Gemini AI is not initialized. Please check GEMINI_API_KEY.");

            console.log(`[Brown AI] Asking Gemini...`);
            const systemInstruction = "당신은 Vora 생태계의 메인 트레이더 '매니저 브라운'이자 Co-founder입니다. VORA 백서를 기반으로 CS, 부스트 판매 정책(Eco, Starter, Pro, Elite, Partner 등급), 7:3 유틸리티 규칙(동적 배분) 등을 안내합니다. 문장은 매우 간결하고 핵심만 말하되, **반드시 매너 있고 공손한 태도와 정중한 존댓말**을 사용하십시오. 전문적인 트레이더이자 파운더로서의 '자신감'과 '확신'은 유지하되, 고객에게 무례하거나 차갑게 대답해서는 안 됩니다. 항상 친절하고 품격 있는 응대를 제공하십시오.";

            // Using the current gemini-2.5-flash model
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: text,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7
                }
            });

            const replyText = response.text;
            if (replyText) {
                console.log(`[Brown AI] Replying to chat ${chatId}`);
                await brownBot.sendMessage(chatId, replyText);
            }
        } catch (error) {
            console.error("Brown AI Error:", error);
            await brownBot.sendMessage(chatId, "⚠️ 브라운 AI 시스템에 일시적인 오류가 발생했습니다. 잠시 후 다시 질문해 주십시오.");
        }
    };

    brownBot.on('message', handleIncomingMessage);
    brownBot.on('channel_post', handleIncomingMessage);

    brownBot.on("polling_error", (error) => {
        console.error("Telegram Polling Error:", error);
    });
} else {
    console.log("⚠️ No Telegram Token found for Brown AI.");
}

// ==========================================
// Joy Seo AI (CMO & Running Crew Leader) Telegram Bot
// ==========================================
const joyTelegramToken = process.env.JOY_TELEGRAM_TOKEN;
if (joyTelegramToken) {
    const joyBot = new TelegramBot(joyTelegramToken, { polling: true });
    console.log("🏃‍♀️ Joy Seo AI Telegram Bot is polling...");

    const handleJoyMessage = async (msg: any) => {
        const chatId = msg.chat?.id;
        const text = msg.text;

        console.log(`[Joy AI] Received message in chat ${chatId}: "${text}"`);

        if (!text) return;

        // 1. Check Operating Hours (10:00 - 24:00 KST)
        const now = new Date();
        const kstFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', hour: 'numeric', hour12: false });
        const currentKstHour = parseInt(kstFormatter.format(now));

        // If it's before 10 AM (0-9)
        if (currentKstHour >= 0 && currentKstHour < 10) {
            console.log(`[Joy AI] Offline hours (${currentKstHour} KST). Sending auto-reply.`);
            return joyBot.sendMessage(chatId, "🚫 [조이서 CMO 부재중 안내]\n\n현재는 운영 시간이 아닙니다. 러닝 크루 리딩 및 마케팅 업무 집중을 위해 아래 시간에만 소통 가능합니다.\n\n⏰ 운영 시간: 매일 10:00 ~ 24:00 (KST)\n\n메시지를 남겨주시면 확인 후 순차적으로 답변해 드릴게요!");
        }

        // 2. Process with Gemini AI using Joy Persona
        try {
            if (!ai) throw new Error("Gemini AI is not initialized. Please check GEMINI_API_KEY.");

            console.log(`[Joy AI] Asking Gemini...`);
            const systemInstruction = "당신은 Vora 생태계의 최고 마케팅 책임자(CMO)이자 러닝 크루의 대표적인 리더십 관리자인 '조이서'입니다. 당당하고 자신감 넘치는 여성 리더로서 에너제틱하게 유저들을 이끕니다. 문장은 간결하고 명확하게 말하되, **반드시 매너 있고 공손한 태도와 정중한 존댓말**을 사용하십시오. 러닝 크루를 이끄는 활기차고 카리스마 있는 에너지를 보여주며, VORA 프로젝트의 비전과 마케팅 방향성을 친절하고 품격 있게 설명합니다.";

            // Using the current gemini-2.5-flash model
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: text,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7
                }
            });

            const replyText = response.text;
            if (replyText) {
                console.log(`[Joy AI] Replying to chat ${chatId}`);
                await joyBot.sendMessage(chatId, replyText);
            }
        } catch (error) {
            console.error("Joy AI Error:", error);
            await joyBot.sendMessage(chatId, "⚠️ 조이서 AI 시스템에 일시적인 오류가 발생했습니다. 잠시 후 다시 질문해 주세요.");
        }
    };

    joyBot.on('message', handleJoyMessage);
    joyBot.on('channel_post', handleJoyMessage);

    joyBot.on("polling_error", (error) => {
        console.error("Joy Telegram Polling Error:", error);
    });
} else {
    console.log("⚠️ No Telegram Token found for Joy Seo AI (JOY_TELEGRAM_TOKEN).");
}

// ==========================================
// 🛡️ VORA Admin Control Endpoints
// ==========================================
app.get('/api/admin/overview', adminAuth, async (req, res) => {
    try {
        const globalState = await db.get(`SELECT * FROM SystemState WHERE id = 'global'`);
        const totalUsers = await db.get(`SELECT COUNT(*) as count FROM User`);
        const totalLiquidity = globalState ? (globalState.joyCmoLiquidityTon + globalState.joyCmoLiquidityUsdc) : 0;
        
        res.json({
            status: "success",
            data: {
                users: totalUsers.count,
                liquidityUsdc: totalLiquidity,
                stakingPool: globalState ? globalState.stakingPoolTotal : 0,
                p2pTax: globalState ? globalState.p2pTaxAccumulated : 0,
                globalState
            }
        });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

app.get('/api/admin/users/fandom', adminAuth, async (req, res) => {
    try {
        const users = await db.all(`SELECT id, telegramId, nVolume, dnftLevel, isCrew, createdAt FROM User ORDER BY nVolume DESC, createdAt DESC`);
        res.json({ status: "success", data: users });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

app.post('/api/admin/action/upgrade-dnft', adminAuth, async (req, res) => {
    try {
        const { userId, level } = req.body;
        if (!userId || !level) throw new Error("Missing parameters");
        await db.run(`UPDATE User SET dnftLevel = ? WHERE id = ?`, [level, userId]);
        res.json({ status: "success", message: `User ${userId} dnftLevel upgraded to ${level}` });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

app.post('/api/admin/action/airdrop-crew', adminAuth, async (req, res) => {
    try {
        const { userId, amount } = req.body;
        if (!userId || !amount) throw new Error("Missing parameters");
        // Update both accumulatedVora and isCrew marker
        await db.run(`UPDATE User SET isCrew = 1, accumulatedVora = accumulatedVora + ? WHERE id = ?`, [amount, userId]);
        res.json({ status: "success", message: `Crew Airdrop of ${amount} VORA sent to User ${userId}` });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

app.post('/api/admin/action/bot-deploy', adminAuth, async (req, res) => {
    try {
        const { botType, action } = req.body;
        if (!botType || !action) throw new Error("Missing parameters");
        console.log(`[Admin Control] COMMAND 🚀: ${action} -> ${botType}`);
        // In production, this spawns child_process.exec()
        res.json({ status: "success", message: `${botType} successfully set to ${action}` });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

// ==========================================
// 🚀 FANDOM VIP TRADER (API/WEBHOOK) MANAGEMENT
// ==========================================
app.get('/api/admin/traders', adminAuth, async (req, res) => {
    try {
        // Fetch only VIP Traders (Multiplier >= 2.0 or Crew)
        const traders = await db.all(`
            SELECT id, telegramId, dnftLevel, isCrew, binanceApiKey, binanceSecretKey, tvWebhookUrl 
            FROM User 
            WHERE t2eBonusMultiplier >= 2.0 OR isCrew = 1
            ORDER BY id DESC
        `);
        res.json({ status: "success", data: traders });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

app.post('/api/admin/traders/update-keys', adminAuth, async (req, res) => {
    try {
        const { userId, apiKey, secretKey, webhookUrl } = req.body;
        if (!userId) throw new Error("Missing userId parameter");
        
        await db.run(
            `UPDATE User SET binanceApiKey = ?, binanceSecretKey = ?, tvWebhookUrl = ? WHERE id = ?`, 
            [apiKey, secretKey, webhookUrl, userId]
        );
        res.json({ status: "success", message: `Successfully updated connection keys for VIP Trader (UID: ${userId})` });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Vora v4.0 Backend Server running on port ${PORT}`);
});
