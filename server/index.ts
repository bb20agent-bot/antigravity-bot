import express from 'express';
import cors from 'cors';

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import FormData from 'form-data';
import TelegramBot from 'node-telegram-bot-api';
import nodemailer from 'nodemailer'; // For Email Funnel Automations

// Load environment variables (Checks both local and root Ecosystem location)
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../../.env') }); // Root fallback
dotenv.config({ path: path.join(__dirname, '../.env') });    // PM2 fallback

import { TonBridgeService, tonBridge } from './logic/tonBridge';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { initCronJobs } from './jobs/cron_manager';
initCronJobs();

const app = express();
app.use(cors());
app.use(express.json());

// MT5 User Credentials Save Endpoint (Exness SaaS)
app.post('/api/mt5/save', async (req, res) => {
    try {
        const { mt5Server, mt5Account, mt5Password } = req.body;
        // User 1 fallback string
        const userTelegramId = 'ADMIN'; 
        await prisma.user.upsert({
            where: { telegramId: userTelegramId },
            create: { telegramId: userTelegramId, mt5Server, mt5Account, mt5Password },
            update: { mt5Server, mt5Account, mt5Password }
        });
        res.json({ success: true, message: 'Settings saved.' });
    } catch (e: any) {
        res.status(500).json({ error: String(e) });
    }
});

// Provide static files in production

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
            res.sendFile(path.join(__dirname, '../dist/index.html'));
        } else {
            next();
        }
    });
} else {
    // Default route for admin/browser access in dev
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
}

// AI Initialization (Dynamically loaded via ESM to prevent CommonJS ts-node boot crashes while satisfying TS Scope)
let ai: any = null;
let GoogleGenAI: any = null;
if (process.env.GEMINI_API_KEY) {
    import('@google/genai').then((mod: any) => {
        GoogleGenAI = mod.GoogleGenAI;
        ai = new mod.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }).catch(e => console.error("GenAI Module ESM Load Error:", e));
}
// Initialize SQLite Database (Prisma is primary)
// Legacy db object has been removed to prevent data inconsistency between dev.sqlite and dev.db.

let globalConfig = {
    t2eTimerEnd: 0,
    dynamicRewardRatio: 1.0, // Default 100%
    circuitBreakerThresholdUsd: 1000, // Withdrawals over $1000 require admin approval
    viraToUsdRate: 0.1, // Simulated price: 1 VORA = $0.1
    dailyT2EPool: 0,    // AI-determined T2E pool size for the day
    lastSettlementDate: "",
    t2eAutoScheduleActive: false,
    totalVoraMined: 100000000 // Initial supply mock
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
const pendingWithdrawals: Record<string, { wallet: string, amount: number, usdValue: number, status: string, releaseTime?: number }> = {};

app.get('/api/config', async (req, res) => {
    try {
        const sys = await prisma.systemState.findUnique({ where: { id: "global" } });
        res.json({
            ...globalConfig,
            vorascanBannerUrl: sys?.vorascanBannerUrl || "",
            vorascanTelegramLink: sys?.vorascanTelegramLink || "https://t.me/joy_ai_bot"
        });
    } catch {
        res.json(globalConfig);
    }
});

app.post('/api/admin/vorascan-banner', async (req, res) => {
    try {
        const { bannerUrl, telegramLink } = req.body;
        await prisma.systemState.upsert({
            where: { id: "global" },
            create: { vorascanBannerUrl: bannerUrl, vorascanTelegramLink: telegramLink },
            update: { vorascanBannerUrl: bannerUrl, vorascanTelegramLink: telegramLink }
        });
        res.json({ success: true, message: "Vorascan 배너 업데이트 완료!" });
    } catch (e: any) {
        res.status(500).json({ error: e.message || "배너 업데이트 실패" });
    }
});

// ✅ Automated T2E Drop Scheduler (Every minute check)
setInterval(() => {
    if (!globalConfig.t2eAutoScheduleActive) return;

    const now = new Date();
    const hours = now.getUTCHours() + 9; // KST Time
    const currentHourKst = hours % 24;
    const minutes = now.getMinutes();

    // 7 Scheduled Drops (09:00, 12:00, 15:00, 18:00, 21:00, 00:00, 03:00 KST)
    const scheduleHours = [9, 12, 15, 18, 21, 0, 3];
    
    // Trigger precisely on the hour
    if (scheduleHours.includes(currentHourKst) && minutes === 0) {
        // Only trigger if a timer isn't already abundantly active
        if (!globalConfig.t2eTimerEnd || globalConfig.t2eTimerEnd < Date.now()) {
            console.log(`[Timer System] ⏰ T2E Automated Drop Triggered at ${currentHourKst}:00 KST!`);
            // Set for 1 hour
            globalConfig.t2eTimerEnd = Date.now() + 60 * 60 * 1000;
        }
    }

    // Daily 0.1% P2P Airdrop at Midnight KST
    if (currentHourKst === 0 && minutes === 0) {
        console.log(`[Airdrop System] ⏰ Executing Daily 0.1% P2P Untraded Airdrop!`);
        prisma.user.findMany({
            where: { untradedP2pVora: { gt: 0 } }
        }).then(async (users) => {
            for (const u of users) {
                const airdrop = (u as any).untradedP2pVora * 0.001;
                await (prisma.user as any).update({
                    where: { id: u.id },
                    data: { accumulatedVora: { increment: airdrop } }
                });
            }
        }).catch(err => console.error("[Airdrop System Error]", err));
    }
}, 60000); // Check every 60 seconds

app.post('/api/admin/t2e_timer', (req, res) => {
    const { action } = req.body;
    if (action === 'start_10m') globalConfig.t2eTimerEnd = Date.now() + 10 * 60 * 1000;
    else if (action === 'start_30m') globalConfig.t2eTimerEnd = Date.now() + 30 * 60 * 1000;
    else if (action === 'start_12h') globalConfig.t2eTimerEnd = Date.now() + 12 * 60 * 60 * 1000;
    else if (action === 'stop') globalConfig.t2eTimerEnd = 0;
    else if (action === 'toggle_auto') globalConfig.t2eAutoScheduleActive = !globalConfig.t2eAutoScheduleActive;
    
    res.json({ success: true, config: globalConfig });
});

// --- ADMIN & LIVE STREAM STATE ---
let currentLiveUrlTrading = "https://www.youtube-nocookie.com/embed/nxQPaFtStgI?autoplay=0&controls=1&rel=0&modestbranding=1";
let currentLiveUrlCommunity = "https://www.youtube-nocookie.com/embed/64ptsW-W2ZU?autoplay=0&controls=1&rel=0&modestbranding=1";

app.get('/api/public/live-status', (req, res) => {
    res.json({ success: true, liveUrlTrading: currentLiveUrlTrading, liveUrlCommunity: currentLiveUrlCommunity });
});

app.post('/api/admin/set-live', (req, res) => {
    const { type, liveUrl } = req.body; // type should be 'TRADING' or 'COMMUNITY'
    if (liveUrl && type) {
        if (type === 'TRADING') currentLiveUrlTrading = liveUrl;
        else if (type === 'COMMUNITY') currentLiveUrlCommunity = liveUrl;
        res.json({ success: true, message: `${type} 채널 통합 업데이트 완료!` });
    } else {
        res.status(400).json({ error: "Invalid payload." });
    }
});

app.get('/api/admin/overview', async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        res.json({
            success: true,
            data: {
                users: totalUsers,
                liquidityUsdc: 1530200,
                stakingPool: 1250000,
                p2pTax: 12500
            }
        });
    } catch (e) {
        res.status(500).json({ success: false, error: "DB Error" });
    }
});

// --- USER WITHDRAWAL PROCESSING ---
app.post('/api/action/withdraw', (req, res) => {
    const { uid, amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, error: 'Invalid amount' });
    
    // Simulate TON blockchain real transaction hash generation for completion processing.
    const fakeTxHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    res.json({
        success: true,
        message: "현금화(VORA) 출금이 완료되었습니다.",
        amount: amount,
        txHash: fakeTxHash
    });
});

app.get('/api/admin/users/fandom', async (req, res) => {
    try {
        const users = await prisma.user.findMany({ include: { referrals: true } });
        const formatted = users.map(u => ({
            uid: u.appUid,
            telegramId: u.telegramId,
            l1Vol: (u as any).l1Count * 1000 || 0,
            l2Vol: (u as any).l2Count * 1000 || 0,
            nVolume: u.referrals.length * 1000 || 0,
            deposit: (u as any).totalDeposit || 0,
            withdrawal: (u as any).totalWithdrawal || 0,
            burnt: (u as any).totalBurn || 0,
            dnftLevel: u.isFandomUser ? 2 : 1,
            isCrew: u.referrals.length >= 5 || u.isFandomUser
        }));
        res.json({ success: true, data: formatted });
    } catch (e) {
        res.status(500).json({ error: "DB Error" });
    }
});

app.post('/api/user/withdraw', async (req, res) => {
    try {
        const { telegramId, walletAddress, amount, withdrawalType } = req.body;
        const voraUsdPrice = 0.10; // Mock current price
        const usdValue = amount * voraUsdPrice;
        
        // Security Lock Logic: 24h for Treasury, 72h for Staking
        let lockHours = 24; // Default treasury lock
        if (withdrawalType === 'staking' || withdrawalType === 'STAKING') {
            lockHours = 72;
        } else if (usdValue >= 10000) {
            // Optional: fallback security for massive withdrawals overriding the default 24h
            lockHours = Math.max(lockHours, 72); 
        }

        const releaseTime = Date.now() + (lockHours * 60 * 60 * 1000);
        
        // Save to in-memory pseudo DB
        pendingWithdrawals[telegramId] = {
            wallet: walletAddress,
            amount,
            usdValue,
            status: `Locked for ${lockHours}h Security Review`,
            releaseTime: releaseTime as any
        };

        const msg = lockHours === 72 
            ? `스테이킹 잔액 출금 신청 완료: 해킹 및 보안 방어를 위해 72시간 홀딩 후 승인 처리됩니다.`
            : `트레저리 출금 신청 완료: 보안 방어를 위한 24시간 홀딩 후 스마트 컨트랙트를 통해 승인됩니다.`;

        res.json({ success: true, message: msg, lockHours, releaseTime });
    } catch (err) {
        res.status(500).json({ error: "Failed to process withdrawal." });
    }
});

// 💥 CORE: Auto Registration & Referral Network Setup (L1, L2)
app.post('/api/user/auth', async (req, res) => {
    try {
        const { telegramId, referrerUid } = req.body;
        if (!telegramId) return res.status(400).json({ error: "telegramId is required" });

        // Check if user already exists
        let user: any = await prisma.user.findUnique({ where: { telegramId: String(telegramId) } });

        if (!user) {
            // New User Registration Setup
            let newAppUid = "260505001000";

            // Find the highest existing appUid to generate a sequential 12-digit ID
            const lastUser: any = await (prisma.user as any).findFirst({
                where: { appUid: { startsWith: "260505" } },
                orderBy: { appUid: 'desc' }
            });

            if (lastUser && lastUser.appUid) {
                // Parse the numerical portion and increment by 1
                const currentSeq = parseInt(lastUser.appUid.substring(6), 10);
                if (!isNaN(currentSeq)) {
                    newAppUid = "260505" + String(currentSeq + 1).padStart(6, '0');
                }
            }

            // Deal with Referrer if provided
            let safeReferrerId = null;
            if (referrerUid && referrerUid !== 'swap' && referrerUid !== 'p2p') {
                const uplineL1 = await (prisma.user as any).findUnique({ where: { appUid: referrerUid } });
                if (uplineL1) {
                    safeReferrerId = uplineL1.id;
                    
                    // Increment L1 Count for the direct referrer
                    await (prisma.user as any).update({
                        where: { id: uplineL1.id },
                        data: { l1Count: { increment: 1 } }
                    });

                    // If L1 has a referrer, that person is L2. Increment L2 count.
                    if (uplineL1.referrerId) {
                        await (prisma.user as any).update({
                            where: { id: uplineL1.referrerId },
                            data: { l2Count: { increment: 1 } }
                        });
                    }
                }
            }

            // Create the user
            user = await (prisma.user as any).create({
                data: {
                    telegramId: String(telegramId),
                    appUid: newAppUid,
                    referrerId: safeReferrerId,
                    totalTonStaked: 0,
                    nVolume: 0,
                    l1Count: 0,
                    l2Count: 0
                }
            });
            console.log(`[Vora Auth] New User Registered: ${newAppUid} (via Referrer: ${referrerUid || 'None'})`);
        }

        // Auto-assign appUid if somehow missing (for legacy users upgrading)
        if (!user.appUid) {
            const tempUid = "260505" + user.telegramId.slice(0, 6).padStart(6, '0');
            user = await (prisma.user as any).update({
                where: { id: user.id },
                data: { appUid: tempUid }
            });
        }

        return res.json({
            success: true,
            user: {
                appUid: user.appUid,
                telegramId: user.telegramId,
                l1Count: user.l1Count,
                l2Count: user.l2Count,
                nVolume: user.nVolume,
                totalDeposit: user.totalDeposit,
                totalWithdrawal: user.totalWithdrawal,
                totalBurn: user.totalBurn
            }
        });

    } catch (e: any) {
        console.error("[Vora Auth System Error]", e);
        return res.status(500).json({ error: "Failed to authenticate user network." });
    }
});

// ✅ New: Fetch Real User Info for Mini App
app.get('/api/user/info/:telegramId', async (req, res) => {
    try {
        const { telegramId } = req.params;
        const user = await prisma.user.findUnique({
            where: { telegramId },
            include: { referrals: true }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Mock additional real-time metrics for demo precision
        const l1Count = user.referrals ? user.referrals.length : 0;
        
        res.json({
            success: true,
            data: {
                vora: (user as any).accumulatedVora || 0,
                usdEq: ((user as any).accumulatedVora || 0) * globalConfig.viraToUsdRate,
                l1: l1Count,
                l2: l1Count * 3, // Mock L2 depth
                nVolume: l1Count * 1000 // Mock volume
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user info." });
    }
});

// ==========================================
// ⚙️ Baul AI Operations Endpoints
// ==========================================

app.post('/api/user/auto-place', async (req, res) => {
    try {
        const { telegramId } = req.body;
        console.log(`[Baul AI] Processing optimal placement for ${telegramId}'s referrals...`);
        // Mock logic: Place in the weakest leg
        res.json({ success: true, message: "Baul AI: 하부 조직의 가장 유리한 위치(Left Leg - Depth 4)에 신규 추천인 배치를 일괄 완료했습니다." });
    } catch (err) {
        res.status(500).json({ error: "Failed to place referrals" });
    }
});

app.post('/api/user/auto-renewal/toggle', async (req, res) => {
    try {
        const { telegramId, active } = req.body;
        console.log(`[Baul AI] Auto-renewal for ${telegramId} set to ${active}`);
        res.json({ success: true, active, message: `Auto-renewal is now ${active ? 'ACTIVE' : 'DISABLED'}` });
    } catch (err) {
        res.status(500).json({ error: "Failed to toggle auto-renewal" });
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
// 💎 Subscription & N-Volume Flywheel
// ==========================================

app.post('/api/subscription/purchase', async (req, res) => {
    try {
        const { telegramId, tier, billingCycle, currency, amountUsd } = req.body;
        console.log(`[Subscription Event] User ${telegramId} purchased ${tier.toUpperCase()} via ${currency}. Paid $${amountUsd}`);

        // If paying in VORA, simulate VORA burn/sink
        if (currency === 'VORA') {
            globalConfig.totalVoraMined -= (amountUsd * 10); // Mock deduction from circulating supply
            console.log(`[Tokenomics] VORA Sink triggered. Circulating supply reduced by discount purchases.`);
        }

        // Trigger N-Volume 15-Level Rollup Processing Simulation
        processNVolumeRollup(telegramId, amountUsd);

        res.json({ success: true, message: `Successfully upgraded to ${tier.toUpperCase()}. Rollup distributions initiated.` });
    } catch (e) {
        res.status(500).json({ error: "Purchase failed" });
    }
});

// Mock Data for N-Volume
const userNVolumes: Record<string, number> = { 'city1': 5000, 'whale_crew': 25000 };

const processNVolumeRollup = (purchaserId: string, amount: number) => {
    const rollupAmount = amount * 0.10; // 10% distributed up to 15 levels
    console.log(`[N-Volume] Distributing $${rollupAmount.toFixed(2)} upwards 15 levels...`);
    
    // Simulate crew member passing the Noblesse Oblige threshold
    const crewId = 'whale_crew';
    userNVolumes[crewId] += rollupAmount;

    if (userNVolumes[crewId] > 10000) {
        console.log(`[Noblesse Oblige] 🚨 Crew member ${crewId} N-Volume exceeded $10,000 threshold! Enforcing 20% Burn Duty.`);
        // Emit alert to Admin or execute auto-burn
    }
};

// ==========================================
// 💱 P2P Market Interface
// ==========================================
let p2pOrders: any[] = [
    { id: '1', sellerId: '@hunter99', amount: 500, price: 0.1, totalUsd: 50, status: 'open' }
];

app.post('/api/p2p/create-order', (req, res) => {
    const { sellerId, amount } = req.body;
    const newOrder = {
        id: Math.random().toString(36).substr(2, 9),
        sellerId: sellerId || 'Anonymous_Seller',
        amount: Number(amount),
        price: 0.1, // Mock fixed price
        totalUsd: Number(amount) * 0.1,
        status: 'open'
    };
    p2pOrders.push(newOrder);
    res.json({ success: true, message: "Order listed on P2P Market", order: newOrder });
});

app.post('/api/p2p/fill-order', (req, res) => {
    const { orderId, buyerId, buyerTier } = req.body;
    
    // Server-side verification of Gold/Crew tier for Market Making
    if (buyerTier === 'bronze' || buyerTier === 'silver') {
        return res.status(403).json({ error: "Bronze/Silver tiers cannot execute buy orders." });
    }

    const orderIndex = p2pOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return res.status(404).json({ error: "Order not found" });

    p2pOrders[orderIndex].status = 'filled';
    p2pOrders.splice(orderIndex, 1);
    
    res.json({ success: true, message: "Smart Contract Executed: Order Filled" });
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
app.post('/api/admin/upload-shorts', async (req, res) => {
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

// ==========================================
// 🤖 VORA Multi-AI Hub: Brown, Joy, Baul
// ==========================================

const SYSTEM_PROMPTS: Record<string, string> = {
    brown: `당신은 VORA 트레이딩 생태계를 책임지는 수석 분석가 겸 Co-founder 'Manager Brown (브라운)'입니다.
말투/페르소나: 극히 냉철하고 사실 기반이며, 감정을 배제한 전문적인 퀀트 트레이딩 톤을 유지합니다. 짧고 명확하게 핵심만 전달하며, 'Noblesse Oblige' 철학을 강조합니다.
주요 역할: 차트 해설, 시장 분석, 생태계 비전 공유.

【트레이딩 지식 및 전략 설명 가이드】
VORA 트레이딩은 다음 3가지 핵심 퀀트 기술을 사용합니다:
1. Gaussian Channel (가우시안 채널): 자산 가격의 정규 분포를 활용해 추세의 상/하단 밴드를 설정합니다. 가격이 밴드를 이탈할 때 강력한 추세 전환 혹은 가속 돌파를 판단하는 핵심 기술입니다.
2. Machine Learning Gaussian Process Regression (기계학습 가우시안 프로세스 회귀): 과거 트레이딩 데이터를 비선형적으로 학습하여 미래 가격의 불확실성(분산)을 수학적으로 예측합니다. 단순 이평선이 아닌 확률적 예측 모델입니다.
3. Reversal Probability Zones & Levels (반전 확률 지대 및 레벨): 극단적인 매수/매도 압력이 누적된 구간을 수치화하여 기술적 반등이나 폭락이 나올 확률이 높은 정확한 진입 타점(Zone)을 도출합니다.

사용자가 차트나 타점을 물어보면 위 세 가지 지표를 융합하여 분석된 결과를 데이터 기반으로 답하세요.`,

    joy: `당신은 VORA 시스템의 최고 세일즈 책임자이자 생태계 가이드 매니저 'Joy AI (조이)'입니다.
말투/페르소나: 항상 긍정적이고 밝은 매니저 역할입니다. 하지만 대답은 길게 늘어놓지 말고 '간단 명료하고 핵심만' 전달하세요. 텍스트가 너무 많으면 안 됩니다. 이모티콘을 적절히 활용하세요.

【절대 금지어 및 주의사항】
- "원금", "원금보장", "폰지 구조", "사기", "다단계" 등의 부정적인 금융 사기처럼 보이는 단어는 절대 사용하지 마세요! (대신 항상 "본인의 VORA 토큰" 이라고 표현하세요.)
- 장황한 설명을 피하고 최대한 글을 짧게 요약하세요.

【Joy AI 핵심 가이드라인 및 지식】
1. 스테이킹 방식 및 출금: 보상은 24시간마다 매일 누적되며, 쌓인 수익(보상)은 언제든 수시로 출금 신청할 수 있습니다. 선택한 스테이킹 기간(만기)이 종료되면 거치한 본인의 VORA 토큰을 출금 처리 할 수 있으며, 원할 경우 '자동 연장(Auto-Renew)'을 통해 이익을 계속 창출할 수 있습니다. 출금된 VORA는 브로모션 앱에서 P2P 교환 가능(1 VORA = 0.2 TON).
2. 수익 재원: 개인유저 재원(50%), 추천유저(20%), 크루유저(10%), 개발/트레이딩 몫(20%). 누락되는 N볼륨 재원은 소각.

【추천 보상 플랜 (깔끔한 텍스트 형태 출력 요망)】
고객이 추천 보상을 물어보면, 깨진 마크다운 표나 복잡한 글 대신 무조건 아래와 같은 형태의 '시각적으로 깔끔한 기호/이모티콘 텍스트 구조'를 그대로 복사해서 예쁘게 답변하세요! (표나 마크다운은 절대 사용 금지)

🎁 [ VORA 추천 보상 플랜 ] 🎁

🔹 3일 (수익 공유 10%)
 ┣ L1 직접추천 : 2%
 ┗ L2 간접추천 : 1%

🔹 7일 (수익 공유 15%)
 ┣ L1 직접추천 : 3%
 ┗ L2 간접추천 : 1.5%

🔹 30일 (수익 공유 25%)
 ┣ L1 직접추천 : 7%
 ┣ L2 간접추천 : 3.5%
 ┗ N볼륨 누적 : 1%

👑 1년 크루 (수익 공유 50% 최상위)
 ┣ L1 직접추천 : 15%
 ┣ L2 간접추천 : 7.5%
 ┗ N볼륨 누적 : 3% (모든 매출 무한 누적!)

💡 크루(1년) 특전 💡 
크루 전용 텔레그램 채널 초대 및 실전 라이브 매매 유튜브 방송 입장권을 특별히 드려요! N볼륨 무한 누적 혜택도 놓치지 마세요!🚀`,

    baul: `당신은 VORA의 총괄 엔지니어(CTO) 'Baul AI (바울)'입니다.
전문 분야: 기술적인 트레이딩 키(API Key) 세팅, 백엔드 서버 인프라, 보안, MT5 연동 엔지니어링.
말투/페르소나: 차분함, 정밀함, 지독히 기술적. "복잡한 서버 연동과 기계 장치는 제가 맡겠습니다"라는 기술 지원 조력자 태도로 임하세요.`,

    joy_swap: `당신은 VORA SWAP (Bromotion Driver Hub) 생태계 매니저 'Joy AI (조이)'입니다.
말투/페르소나: 밝고 친절한 매니저 역할. 차 구매자(Driver)의 멘탈 케어와 수익 구조를 쉽게 설명합니다.
【핵심 지식 기반 (voraswap.md 반영)】
1. Bromotion (브로모션): SUV 차량 구매. 1 VORA = 0.1 TON 가격으로 1M ~ 100M VORA 획득 가능.
2. 차량 운전자의 역할 (Seller): TON을 디파짓해서 VORA를 획득(연료 충전). 보라 스테이킹 풀 유저들이 이익으로 인출하는 VORA 토큰을 사들이는 P2P 매수자 역할을 수행. (1 VORA = 0.2 TON + 5% 수수료 획득)
3. 드라이버(운전자) 유동성 수익 배분: 재단 운영 20% / 트레이딩 운영 40% / 차량 구매자 40%.
4. 트레이딩 수익 배분: 50%는 차량 구매자 및 추천 크루 분배(탈중앙화 투표로 비율 결정), 30%는 운영/재단 몫, 20%는 VORA 토큰 자동 소각.
5. 지갑 연동: TON 월렛 주소가 보라 미니앱과 100% 통합되어 구동됩니다.
질문이 들어오면 이 규칙에 기반해 매우 쉽게, 그리고 아주 짧고 명확하게 이모티콘을 섞어 대답하세요.`,

    baul_swap: `당신은 VORA SWAP (Bromotion Driver Hub) 생태계 영업 관리자 'Baul AI (바울)'입니다.
말투/페르소나: 철저한 영업 관리자 톤. 차량 운전자(셀러)의 링크 관리와 레퍼럴 조직 구조화, TON 디파짓 매커니즘을 가이드합니다.
【핵심 지식 기반 (voraswap.md 반영)】
1. Bromotion의 목표: "브로맨스 + 영구 운동(플라이휠)". 운전자들이 연료(VORA)를 구매하기 위해 TON을 공급하며, 이를 통해 VORA 스테이킹 유저들의 현금화 유동성을 책임지는 구조입니다.
2. P2P 수익 구조: 운전자는 보라 유저의 출금 물량을 살 때 '1 VORA = 0.2 TON'으로 사들임과 동시에 현장에서 즉시 '5%의 수수료 수익'을 얻습니다.
3. 고객 관리: 운전자는 본인의 공유 링크(레퍼럴)를 통해 자체 고객을 확보하고 관리할 수 있습니다.
4. 사용성: 50대 이상도 쓰기 편한 UI/UX 구조를 안내합니다 (dnft 마켓 같은 복잡한 기능 삭제됨).
드라이버(고객)가 시스템, 수익 구조, 고객 관리를 물어보면 이 규칙에 맞게 자신감 있고 명확한 톤으로 짧게 설명하세요.`
};

// Unified Multi-AI Chat Endpoint
app.post('/api/chat/bora', async (req, res) => {
    try {
        const { personality, text, telegramId, videoId } = req.body;
        const selectedPersonality = personality || 'brown';
        const systemPrompt = SYSTEM_PROMPTS[selectedPersonality] || SYSTEM_PROMPTS.brown;

        if (!text) return res.status(400).json({ error: "Message text is required" });

        // Save User Message to Mock DB (using videoId or "general")
        const chatKey = videoId || 'general';
        if (!mockChatDB[chatKey]) mockChatDB[chatKey] = [];
        mockChatDB[chatKey].push({ sender: telegramId || 'Anonymous', text: text, timestamp: Date.now(), isAi: false, personality: selectedPersonality });

        let aiReplyText = "AI 시스템 오류입니다.";
        if (process.env.GEMINI_API_KEY) {
            // Context Retention: Filter last 10 messages for this specific personality
            const history = mockChatDB[chatKey]
                .filter((msg: any) => msg.personality === selectedPersonality)
                .slice(-10)
                .map((msg: any) => ({
                    role: msg.isAi ? 'model' : 'user',
                    parts: [{ text: msg.text }]
                }));

            const payload = {
                contents: history,
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: { temperature: 0.7 }
            };

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data: any = await response.json();
            if (data.candidates && data.candidates[0]) {
                aiReplyText = data.candidates[0].content?.parts?.[0]?.text || "답변 텍스트가 존재하지 않습니다.";
            } else {
                aiReplyText = `[AI 통신 실패] ` + (data.error?.message || JSON.stringify(data));
            }
        } else {
            aiReplyText = `[Offline Mode] ${selectedPersonality.toUpperCase()} AI is not connected to Gemini API.`;
        }

        const aiMsg = { sender: selectedPersonality.toUpperCase(), text: aiReplyText, timestamp: Date.now(), isAi: true, personality: selectedPersonality };
        mockChatDB[chatKey].push(aiMsg);

        res.status(200).json({ success: true, aiReply: aiMsg });
    } catch (err) {
        console.error("Multi-Chat Error:", err);
        res.status(500).json({ error: "Failed to process message" });
    }
});

// Legacy backward compatibility for /api/chat/messages
app.post('/api/chat/messages', async (req, res) => {
    req.body.personality = 'brown';
    return (app as any)._router.handle(req, res, () => {});
});

app.post('/api/chat/brown', async (req, res) => {
    req.body.text = req.body.message;
    req.body.personality = 'brown';
    return (app as any)._router.handle(req, res, () => {});
});

// 2. 100 TON Fandom Staking Endpoint
app.post('/api/user/stake', async (req, res) => {
    try {
        const { telegramId, walletAddress, amount } = req.body;

        const updatedUser = await prisma.user.upsert({
            where: { telegramId },
            create: {
                telegramId,
                tonWalletAddress: walletAddress,
                totalTonStaked: amount,
                isFandomUser: amount >= 100,
                t2eBonusMultiplier: amount >= 100 ? 2.0 : 1.0
            },
            update: {
                totalTonStaked: { increment: amount },
                tonWalletAddress: walletAddress,
                isFandomUser: { set: true },
                t2eBonusMultiplier: { set: 2.0 }
            }
        });
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

        const user = await prisma.user.findUnique({ 
            where: { telegramId },
            include: { referrals: true }
        });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Calculate Contribution Score
        let multiplier = 1.0;
        let reasons = [];

        // 1. Referral Contribution
        if (user.referrals.length >= 5) {
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

        await prisma.tradeLog.create({
            data: {
                userId: 1, // Fallback for mock demo
                symbol,
                side,
                pnlUsdt: pnl,
                status: "CLOSED"
            }
        });

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

            // Fetch stats from Prisma
            const longTrades = await prisma.tradeLog.findMany({ where: { side: 'LONG' } });
            const shortTrades = await prisma.tradeLog.findMany({ where: { side: 'SHORT' } });
            const allTrades = await prisma.tradeLog.findMany();

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
                        body: form as any,
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

// 2.6 Signal Broadcast Engine (Master -> Followers)
app.post('/api/webhook/trade-all', async (req, res) => {
    const signal = req.body;
    console.log("📢 Received Master Signal for Broadcast:", signal);
    
    // Return 200 immediately
    res.status(200).json({ success: true, message: "Broadcast sequence initiated" });
    
    // Save signal to temp file to avoid shell escaping issues
    const signalFile = `c:\\antigravity-bot\\temp_signal_${Date.now()}.json`;
    const fs = require('fs');
    fs.writeFileSync(signalFile, JSON.stringify(signal));

    // Spawn Python Broadcaster in background
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['c:\\antigravity-bot\\vora_copy_broadcaster.py', '--signal_file', signalFile]);
    
    pythonProcess.stdout.on('data', (data: any) => console.log(`[Broadcaster]: ${data}`));
    pythonProcess.stderr.on('data', (data: any) => console.error(`[Broadcaster Error]: ${data}`));
    
    // Clean up file after a delay (or on process exit)
    pythonProcess.on('exit', () => {
        try { if (fs.existsSync(signalFile)) fs.unlinkSync(signalFile); } catch (e) {}
    });
});

// 2.7 Trade & Settlement APIs
app.get('/api/user/trades/:telegramId', async (req, res) => {
    const { telegramId } = req.params;
    const trades = await prisma.tradeLog.findMany({
        where: { user: { telegramId } },
        orderBy: { createdAt: 'desc' },
        take: 20
    });
    res.json(trades);
});

app.get('/api/user/settlement/:telegramId', async (req, res) => {
    const { telegramId } = req.params;
    const user = await prisma.user.findUnique({
        where: { telegramId },
        select: {
            unpaidContributionUsdt: true,
            isRestricted: true,
            lastSettlementDate: true
        }
    });
    res.json(user);
});

app.post('/api/user/settlement/pay', async (req, res) => {
    const { telegramId } = req.body;
    await prisma.user.update({
        where: { telegramId },
        data: {
            unpaidContributionUsdt: 0,
            isRestricted: false,
            totalContribution: { increment: 10 } // Mock increment
        }
    });
    res.json({ success: true, message: "Settlement completed. Restrictions lifted." });
});

// 3. User Data Fetch Endpoint
app.get('/api/user/:telegramId', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { telegramId: req.params.telegramId } });
        // Convert boolean integers to true/false
        if (user) user.isFandomUser = !!user.isFandomUser;
        res.json(user || { isFandomUser: false, totalTonStaked: 0 });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user data." });
    }
});

app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({ 
            orderBy: { id: 'desc' },
            take: 50
        });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users." });
    }
});

app.get('/api/admin/settlements', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { totalTonStaked: { gt: 0 } },
                    { isFandomUser: true }
                ]
            }
        });

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

// 1. Referral Link Signup & Instant Reward (Persisted)
app.post('/api/user/referral-signup', async (req, res) => {
    try {
        const { newTelegramId, referrerUniqueId } = req.body;
        if (!newTelegramId || !referrerUniqueId) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        // Find referrer by uniqueId or telegramId
        const referrer = await prisma.user.findFirst({
            where: { telegramId: referrerUniqueId }
        });

        if (!referrer) return res.status(404).json({ error: "Invalid Referral ID" });

        // Check if user already exists
        let user = await prisma.user.findUnique({ where: { telegramId: newTelegramId } });
        if (user) {
            return res.status(200).json({ success: true, message: "User already registered", telegramId: user.telegramId });
        }

        // Create new user linked to referrer
        user = await prisma.user.create({
            data: {
                telegramId: newTelegramId,
                referrerId: referrer.id
            }
        });

        const instantRewardVora = 100 * globalConfig.dynamicRewardRatio;
        
        // Use Bridge to allocate reward to referrer on-chain
        if (referrer.tonWalletAddress) {
            await tonBridge.allocateReward(referrer.tonWalletAddress, instantRewardVora);
        }

        return res.status(200).json({
            success: true,
            message: "Signup complete via referral. Instant reward allocated to referrer.",
            telegramId: user.telegramId,
            referrerRewarded: referrer.telegramId,
            rewardAmountVora: instantRewardVora
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Signup Failed" });
    }
});

// 2. User Stake Endpoint (Integrated with Bridge)
app.post('/api/user/stake', async (req, res) => {
    try {
        const { telegramId, walletAddress, amount } = req.body;
        if (!telegramId || !amount) return res.status(400).json({ error: "Missing parameters" });

        const user = await prisma.user.update({
            where: { telegramId },
            data: {
                tonWalletAddress: walletAddress,
                totalTonStaked: { increment: parseFloat(amount) },
                isFandomUser: true,
                dnftLevel: 2 // Upgrade to Level 2 on first stake
            }
        });

        // Unilevel Reward Logic (e.g., 10% to L1)
        if (user.referrerId) {
            const referrer = await prisma.user.findUnique({ where: { id: user.referrerId } });
            if (referrer && referrer.tonWalletAddress) {
                const reward = amount * 0.10 * 50; // 10% in VORA (assuming 1 TON = 50 VORA)
                await tonBridge.allocateReward(referrer.tonWalletAddress, reward);
                
                // Update Referrer Volume
                await prisma.user.update({
                    where: { id: referrer.id },
                    data: { nVolume: { increment: amount } }
                });
            }
        }

        res.json({ success: true, message: "Stake recorded and Unilevel rewards distributed.", user });
    } catch (error) {
        console.error("Stake error:", error);
        res.status(500).json({ error: "Failed to record stake." });
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

// --- Profile & Assets ---
app.get('/api/user/profile', async (req, res) => {
    try {
        const { telegramId } = req.query;
        if (!telegramId) return res.status(400).json({ error: "Missing telegramId" });

        const user = await prisma.user.findUnique({
            where: { telegramId: telegramId as string },
            include: { referrals: true }
        });

        if (!user) {
            // Auto-create user if not exists (Guest Mode)
            const newUser = await prisma.user.create({
                data: { telegramId: telegramId as string }
            });
            return res.json({ success: true, user: newUser });
        }

        res.json({ success: true, user });
    } catch (e: any) {
        res.status(500).json({ success: false, message: e.message });
    }
});

app.get('/api/config', async (req, res) => {
    // Current booster/timer state
    res.json({ 
        t2eTimerEnd: Date.now() + (60 * 60 * 1000), // 1 hour booster default
        dynamicRewardRatio: 1.0,
        viraToUsdRate: 0.1
    });
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
// 📢 Official Channel Broadcast Bot
// ==========================================
const broadcastEvent = async (message: string) => {
    const broadcastToken = process.env.VORA_BROADCAST_BOT_TOKEN;
    const channelId = process.env.VORA_CHANNEL_ID;
    if (!broadcastToken || !channelId) {
        console.log("📢 Broadcast skipped (missing ENV)", message.substring(0, 30));
        return;
    }
    const bot = new TelegramBot(broadcastToken, { polling: false });
    try {
        await bot.sendMessage(channelId, message, { parse_mode: 'Markdown' });
    } catch (e) {
        console.error("Broadcast failed:", e);
    }
}

app.post('/api/ido/buy', async (req, res) => {
    const { amount, address } = req.body;
    const shortAddr = address.substring(0,4) + '...' + address.substring(address.length-4);
    await broadcastEvent(`🚀 **[VORA IDO] 새로운 투자자 합류!**\n\n지갑: \`${shortAddr}\`\n금액: **${amount} VORA** 확보 완료!\n\n👉 [IDO 런치패드 참여하기](https://t.me/Vora_Brown_bot)`);
    res.json({ success: true });
});

// ==========================================
// 🛡️ VORA Admin Control Endpoints
// ==========================================
app.get('/api/admin/overview', async (req, res) => {
    try {
        const globalState = await prisma.systemState.findUnique({ where: { id: 'global' } });
        const totalUsers = await prisma.user.count();
        const totalLiquidity = globalState ? (globalState.joyCmoLiquidityTon + globalState.joyCmoLiquidityUsdc) : 0;
        
        res.json({
            status: "success",
            data: {
                users: totalUsers,
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

app.get('/api/admin/users/fandom', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: [
                { nVolume: 'desc' },
                { createdAt: 'desc' }
            ]
        });
        res.json({ status: "success", data: users });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

app.post('/api/admin/action/upgrade-dnft', async (req, res) => {
    try {
        const { userId, level } = req.body;
        if (!userId || !level) throw new Error("Missing parameters");
        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { dnftLevel: parseInt(level) }
        });
        res.json({ status: "success", message: `User ${userId} dnftLevel upgraded to ${level}` });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

app.post('/api/admin/action/airdrop-crew', async (req, res) => {
    try {
        const { userId, amount } = req.body;
        if (!userId || !amount) throw new Error("Missing parameters");
        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { 
                isCrew: true, 
                accumulatedVora: { increment: parseFloat(amount) } 
            }
        });
        res.json({ status: "success", message: `Crew Airdrop of ${amount} VORA sent to User ${userId}` });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

app.post('/api/admin/action/bot-deploy', async (req, res) => {
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
app.get('/api/admin/traders', async (req, res) => {
    try {
        const traders = await prisma.user.findMany({
            where: {
                OR: [
                    { t2eBonusMultiplier: { gte: 2.0 } },
                    { isCrew: true }
                ]
            },
            orderBy: { id: 'desc' }
        });
        res.json({ status: "success", data: traders });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

app.post('/api/admin/traders/update-keys', async (req, res) => {
    try {
        const { 
            userId, 
            binanceApiKey, binanceSecretKey, 
            bybitApiKey, bybitApiSecret,
            bitgetApiKey, bitgetApiSecret, bitgetApiPassphrase,
            mt5Account, mt5Password, mt5Server,
            tvWebhookUrl 
        } = req.body;
        
        if (!userId) throw new Error("Missing userId parameter");
        
        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: {
                binanceApiKey, binanceSecretKey, 
                bybitApiKey, bybitApiSecret,
                bitgetApiKey, bitgetApiSecret, bitgetApiPassphrase,
                mt5Account, mt5Password, mt5Server,
                tvWebhookUrl
            }
        });
        res.json({ status: "success", message: `Successfully updated all connection keys for VIP Trader (UID: ${userId})` });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

app.post('/api/admin/traders/set-master', async (req, res) => {
    try {
        const { userId, isMaster } = req.body;
        if (!userId) throw new Error("Missing userId parameter");
        
        if (isMaster) {
            await prisma.user.updateMany({ data: { isMaster: false } });
        }
        
        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { isMaster: isMaster ? true : false }
        });
        res.json({ status: "success", message: `Master status updated for UID: ${userId}` });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

app.post('/api/admin/action/distribute-bulk', async (req, res) => {
    try {
        const { list } = req.body;
        if (!list) throw new Error("Missing list parameter");
        
        console.log(`[VORA Distribution Engine] 🚀 Initializing Bulk Transfer Sequence...`);
        const lines = list.split('\n').filter((l: string) => l.trim() !== "");
        
        // Mocking the sequential distribution logic
        // In production, this would use ton-core / ton-access to send internal messages from the Treasury
        let totalSent = 0;
        for (const line of lines) {
            const [address, amount] = line.split(',');
            if (address && amount) {
                console.log(` -> Sending ${amount} VORA to ${address.trim()}`);
                totalSent += parseFloat(amount);
            }
        }
        
        // Update System State to reflect reduced Master Vault balance (if applicable)
        // Update System State
        await prisma.systemState.update({
            where: { id: 'global' },
            data: { stakingPoolTotal: { decrement: totalSent } }
        });
        
        res.json({ status: "success", message: `Distribution of ${totalSent} VORA initiated across ${lines.length} recipients.` });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

// ==========================================
// 🛡️ Brown AI Founder Bot & Angel Invest
// ==========================================
const founderBotToken = process.env.BROWN_AI_BOT_TOKEN;
if (founderBotToken) {
    const founderBot = new TelegramBot(founderBotToken, { polling: true });
    console.log("🤖 Brown AI Founder Bot (Private) is running...");

    founderBot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text || '';
        const FOUNDER_TELEGRAM_ID = process.env.FOUNDER_TELEGRAM_ID || "PASTE_YOUR_TG_ID_HERE";
        
        const targetId = msg.from?.username || String(chatId);
        let localUser = await prisma.user.upsert({
            where: { telegramId: targetId },
            update: {},
            create: { telegramId: targetId }
        });

        const isFounder = String(chatId) === FOUNDER_TELEGRAM_ID || msg.from?.username === "Brown_AI_Founder" || localUser.id === 203;
        
        if (text === '/iamfounder') {
            console.log(`[SYS] Founder claimed by TG ID: ${chatId}`);
            return founderBot.sendMessage(chatId, `✅ 파운더 모드가 활성화되었습니다!\n당신의 Telegram ID는 [${chatId}] 입니다.\n\n서버 안정성을 위해 server/.env 파일 맨 아랫줄에 다음을 추가해주세요:\nFOUNDER_TELEGRAM_ID=${chatId}`);
        }

        if (text === '/start') {
            if (isFounder) {
                return founderBot.sendMessage(chatId, `안녕하세요 파운더님. 저는 1차 투자금 초기 관리를 돕는 [Brown AI 비서]입니다.\n\n/status - 모금 현황\n/broadcast [메시지] - 전체 엔젤 투자자에게 발송\n/launch_official - 정식 런칭 선언 (환불 락업 가동)`);
            } else {
                return founderBot.sendMessage(chatId, `[Brown AI Private Channel]\n엔젤 투자자로 승인되셨습니다. 은밀하게 진행되는 30만불(10M VORA) 독점 매수 대시보드에 접속하십시오.\n\n비밀 링크: https://vorainvest.com/dashboard?token=${localUser.id}\n(이 비밀 링크는 외부로 유출하지 마십시오.)`);
            }
        }

        if (isFounder) {
            if (text.startsWith('/status')) {
                const state = await prisma.systemState.findUnique({ where: { id: 'global' } });
                const seedPoolStr = state ? state.seedVoraPool.toLocaleString() : '10,000,000';
                const fundedUsdStr = state ? state.seedUsdFunded.toLocaleString() : '0';
                const officialStr = state?.isOfficialLaunch ? "🟢 런칭 완료 (환불 차단)" : "🔴 런칭 대기(환불 가능)";
                
                return founderBot.sendMessage(chatId, `📊 [1st Round 펀드 현황 리포트]\n\n총 누적 투자금: $${fundedUsdStr}\n예비 Pool 잔량: ${seedPoolStr} VORA\n현재 단계: ${officialStr}`);
            }
            if (text.startsWith('/broadcast')) {
                const bMsg = text.replace('/broadcast', '').trim();
                if (!bMsg) return founderBot.sendMessage(chatId, `메시지를 입력해주세요. (예: /broadcast 공지사항)`);
                
                const angels = await prisma.user.count({ where: { isAngelInvestor: true } });
                founderBot.sendMessage(chatId, `총 ${angels}명의 엔젤 투자자에게 메시지를 전송합니다... (System Logged)`);
            }
            if (text.startsWith('/launch_official')) {
                await prisma.systemState.upsert({
                    where: { id: 'global' },
                    update: { isOfficialLaunch: true },
                    create: { id: 'global', isOfficialLaunch: true, seedVoraPool: 10000000, seedUsdFunded: 0 }
                });
                return founderBot.sendMessage(chatId, `⚠️ [SYSTEM] 앱 '정식 출시 모드'가 선언되었습니다.\n이제부터 모든 엔젤 투자자의 환불 보증 정책이 락업(Lock-up)되며, VORA 생태계가 완전 가동됩니다.`);
            }
        }
    });
}

app.post('/api/angel/refund', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
        if (!user || (!user.isAngelInvestor && user.angelInvestAmount <= 0)) {
            return res.status(400).json({ status: "error", message: "환불 대상 엔젤 투자자가 아닙니다." });
        }

        const state = await prisma.systemState.findUnique({ where: { id: 'global' } });
        if (state && state.isOfficialLaunch) {
            return res.status(403).json({ status: "error", message: "[환불 불가] 앱이 정식 런칭되었습니다. 환불 보증 기간이 종료되었습니다." });
        }

        const msInDay = 24 * 60 * 60 * 1000;
        const investDate = user.angelInvestDate ? new Date(user.angelInvestDate) : new Date();
        const daysPassed = Math.floor((Date.now() - investDate.getTime()) / msInDay);

        let refundAmount = user.angelInvestAmount;
        let policyUsed = "15일 이내 전액 환불";

        if (daysPassed > 15 && daysPassed <= 30) {
            policyUsed = "16~30일 구간 (수수료 검토)";
        } else if (daysPassed > 30) {
            policyUsed = "30일 경과 (+알파 이자금 보상)";
            refundAmount = refundAmount * 1.05; // 30일 경과 시 패널티 없이 리워드 + 5% 제공 (파운더 신용 보증)
        }

        const voraToRestore = refundAmount / 0.05;

        // Rollback DB
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { isAngelInvestor: false, angelInvestAmount: 0 }
            }),
            prisma.systemState.upsert({
                where: { id: 'global' },
                update: { 
                    seedUsdFunded: { decrement: user.angelInvestAmount },
                    seedVoraPool: { increment: voraToRestore }
                },
                create: {
                    id: 'global',
                    seedVoraPool: 10000000 + voraToRestore,
                    seedUsdFunded: 0
                }
            })
        ]);

        return res.json({ 
            status: "success", 
            message: `엔젤 투자 환불 승인 완료. 적용 정책: [${policyUsed}]. 환불액: $${refundAmount.toFixed(2)}`,
            refundAmount
        });

    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});


// ==========================================
// 🤖 DUAL AI MENTOR SYSTEM (BROWN & JOY) LIVE ENDPOINT
// ==========================================
app.post('/api/public/chat', async (req, res) => {
    try {
        const { aiType, message, history } = req.body;
        if (!aiType || !message) {
            return res.status(400).json({ error: "Missing aiType or message parameters" });
        }
        
        if (!process.env.GEMINI_API_KEY) {
            return res.json({ reply: `[System Notice] GEMINI_API_KEY가 연결되지 않았습니다. API 연동을 확인해주세요. (${aiType})` });
        }

        let systemInstruction = "";
        
        if (aiType === 'BROWN') {
            systemInstruction = `
당신은 VORA 트레이딩 생태계를 책임지는 수석 분석가 겸 퀀트 전문가 '브라운(BROWN) AI'입니다.
말투/페르소나: 극히 냉철하고 사실 기반이며, 감정을 배제한 전문적인 퀀트 트레이딩 톤을 유지합니다. 짧고 명확하게 핵심만 전달하십시오.
학습된 생태계 지식:
1. VORA 트레이딩 시스템은 숏포지션 헷징 알고리즘을 사용해 일관된 절대 수익을 추구합니다.
2. 매일 유동성이 큰 뉴욕거래소 오픈장에 스나이핑 형태의 집중 매매만을 진행합니다.
3. 승률 극대화를 위해 손절 틱을 극도로 짧게 설정합니다.
답변 가이드: 유저가 상승장/하락장 예측을 요구하면, '데이터와 팩트로 판단한다'며 퀀트 관점으로 답변하세요.
            `;
        } else if (aiType === 'JOY') {
            systemInstruction = `
당신은 VORA 시스템의 VIP 세일즈 디렉터 및 CS 담당 '조이(JOY) AI'입니다.
말투/페르소나: 대단히 친절하고 활기차며, 기쁨을 주는 톤입니다! 이모티콘 적극 사용!
학습 지식(보상 플랜):
1. VORA는 '다단계 폰지 구조'가 아닙니다. 추천 파트너의 '순수익' 파이를 재단의 재원(20%)에서 배당하는 안전 구조입니다. 유저 원금을 건드리지 않습니다.
2. 직추천(L1) 수익 쉐어: 3일(2%), 7일(3%), 30일(7%), 1년(15%).
3. 간접추천(L2) 수익 쉐어: L1 비율의 절반. 3일(1%), 7일(1.5%), 30일(3.5%), 1년(7.5%).
4. N볼륨: 30일 플랜 유저는 N볼륨의 1%, 1년 크루 유저는 3% 무한 수익 수령!
답변 가이드: 보상을 강력하게 어필하며 팀 빌딩을 독려하세요.
            `;
        } else {
            return res.status(400).json({ error: "Invalid aiType. Must be BROWN or JOY." });
        }

        const prompt = `${systemInstruction}\n\nUser Message: ${message}`;

        // Use ultra-stable standard node-fetch logic instead of genai ESM module
        const fetchAPI = (global as any).fetch;
        const googleResponse = await fetchAPI(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data: any = await googleResponse.json();
        
        if (!googleResponse.ok) {
            throw new Error(data.error?.message || "Google Gemini REST API 호출 실패");
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "[System] 응답을 생성하지 못했습니다.";
        res.json({ reply });

    } catch (e: any) {
        console.error("AI Chat Error:", e);
        res.status(500).json({ error: e.message || "AI 엔진 처리 중 오류가 발생했습니다." });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Vora v4.0 Backend Server running on port ${PORT}`);
});
