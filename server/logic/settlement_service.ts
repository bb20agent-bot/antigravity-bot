import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Settlement Service
 * Responsible for weekly profit calculation and governance contribution enforcement.
 */
export const runWeeklySettlement = async () => {
    console.log("📅 Running Weekly Settlement...");
    
    // 1. Fetch all users with trade logs
    const users = await prisma.user.findMany({
        where: {
            t2eBonusMultiplier: { gte: 2.0 }, // VIP/Traders
        },
        include: {
            trades: {
                where: {
                    status: 'CLOSED',
                    // ideally filter by last settlement date
                }
            }
        }
    });

    for (const user of users) {
        // Calculate weekly profit from CLOSED trades
        let weeklyProfit = 0;
        for (const trade of user.trades) {
            weeklyProfit += trade.pnlUsdt || 0;
        }

        if (weeklyProfit > 0) {
            const contribution = weeklyProfit * 0.20; // 20%
            
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    unpaidContributionUsdt: { increment: contribution },
                    lastSettlementDate: new Date(),
                }
            });
            
            console.log(`✅ User ${user.telegramId}: Profit ${weeklyProfit}, Contribution ${contribution}`);
        }
    }

    // 2. Enforcement: Restrict users with high unpaid contributions
    // Example: Restrict if unpaid > 10 USDT and older than 3 days
    const usersToRestrict = await prisma.user.findMany({
        where: {
            unpaidContributionUsdt: { gt: 10 },
            isRestricted: false,
        }
    });

    for (const user of usersToRestrict) {
        await prisma.user.update({
            where: { id: user.id },
            data: { isRestricted: true }
        });
        console.warn(`🛑 User ${user.telegramId} restricted due to unpaid fees.`);
    }
};

// Simple Cron-like trigger for manual test or actual integration
// In production, this would be called by a cron job or scheduled task.
if (require.main === module) {
    runWeeklySettlement().then(() => console.log("Settlement Done."));
}
