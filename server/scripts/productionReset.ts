import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('🚮 Starting Production Zero-State Reset...');

  try {
    // 1. Clear User data (Cascade should handle TradeLogs if defined, but we'll do both)
    const deletedTrades = await prisma.tradeLog.deleteMany({});
    console.log(`✅ Deleted ${deletedTrades.count} TradeLogs`);

    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`✅ Deleted ${deletedUsers.count} Users`);

    // 2. Reset SystemState to defaults
    await prisma.systemState.upsert({
      where: { id: 'global' },
      update: {
        stakingPoolTotal: 0,
        joyCmoLiquidityTon: 0,
        joyCmoLiquidityUsdc: 0,
        p2pTaxAccumulated: 0,
        p2pBurnAccumulated: 0,
        governancePoolUsdt: 0,
      },
      create: {
        id: 'global',
        stakingPoolTotal: 0,
        joyCmoLiquidityTon: 0,
        joyCmoLiquidityUsdc: 0,
        p2pTaxAccumulated: 0,
        p2pBurnAccumulated: 0,
        governancePoolUsdt: 0,
      },
    });
    console.log('✅ SystemState reset to defaults.');

    console.log('🚀 Final Step: Creating Admin user...');
    await prisma.user.create({
      data: {
        telegramId: 'ADMIN',
        isMaster: true,
        dnftLevel: 5, // Master Level
        isCrew: true,
      }
    });
    console.log('✅ Admin user created.');

    console.log('✨ Production Reset Complete!');
  } catch (error) {
    console.error('❌ Reset failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
