import cron from 'node-cron';
import { runWeeklySettlement } from '../logic/settlement_service';

/**
 * Cron Manager
 * Orchestrates all automated tasks for the VORA Ecosystem.
 */
export const initCronJobs = () => {
    console.log("🚀 Initializing VORA Cron Jobs...");

    // 1. Weekly Settlement (Every Sunday at 00:00)
    cron.schedule('0 0 * * 0', async () => {
        try {
            await runWeeklySettlement();
            console.log("✅ Weekly settlement completed successfully via cron.");
        } catch (error) {
            console.error("❌ Cron Error: Weekly Settlement failed:", error);
        }
    });

    // 2. Daily P2P Liquidity Health Check (Every day at 01:00)
    cron.schedule('0 1 * * *', () => {
        console.log("📊 Running P2P Liquidty Health Check...");
        // Logic for Joy AI to assess market depth
    });

    console.log("📅 Cron Jobs Scheduled: [Settlement: Weekly, Liquidity: Daily]");
};

if (require.main === module) {
    initCronJobs();
}
