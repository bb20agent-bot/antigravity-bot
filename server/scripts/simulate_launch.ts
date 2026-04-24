import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function simulate() {
    const db = await open({
        filename: './dev.sqlite',
        driver: sqlite3.Database
    });

    console.log("🚀 [Phase 1] 1,000명의 예비 차량 구매자(드라이버) DB 생성 중...");
    
    // Clear old sim users
    await db.exec(`DELETE FROM User WHERE telegramId LIKE 'sim_user_%'`);
    
    // Insert 1000 users
    let values = [];
    for (let i = 1; i <= 1000; i++) {
        values.push(`('sim_user_${i}', 'SUV', 1000, 0, 0, 0)`);
        
        if (i % 100 === 0) {
            await db.run(`INSERT INTO User (telegramId, vehicleType, untradedP2pVora, accumulatedVora, totalTonStaked, totalWithdrawal) VALUES ${values.join(',')}`);
            values = [];
        }
    }
    console.log("✅ 1,000명의 운전자 세팅 완료 (각 1,000 VORA P2P 대기 상태)");

    // Simulate 10 P2P Trades
    console.log("🔄 [Phase 2] 10회의 P2P 거래 시뮬레이션 중 (40% 수익 시뮬레이션)");
    // Fetch 10 arbitrary sim users to execute P2P 
    const p2pUsers = await db.all(`SELECT id FROM User WHERE telegramId LIKE 'sim_user_%' LIMIT 10`);
    for (const u of p2pUsers) {
        // Decrease untraded VORA by 500 as it gets traded, give logical withdrawal/profit.
        await db.run(`UPDATE User SET untradedP2pVora = untradedP2pVora - 500, totalWithdrawal = totalWithdrawal + 200 WHERE id = ?`, [u.id]);
    }
    console.log("✅ 10명의 유저가 P2P 유동성 매도 완료 (수익금 40% 확정)");

    // Simulate 10 Staking Pool Joins
    console.log("🏦 [Phase 3] 10회의 보라 스테이킹 풀 가입 시뮬레이션 중");
    const stakingUsers = await db.all(`SELECT id FROM User WHERE telegramId LIKE 'sim_user_%' LIMIT 10 OFFSET 10`);
    for (const u of stakingUsers) {
        await db.run(`UPDATE User SET totalTonStaked = totalTonStaked + 100 WHERE id = ?`, [u.id]);
    }
    console.log("✅ 10명의 유저 통산 1,000 TON 스테이킹 풀 진입 완료");

    console.log("⏳ [Phase 4] 7일간의 시간이 경과합니다... (매일 0.1% 유휴 에어드랍 작동)");
    let totalAirdropDistributed = 0;

    for (let day = 1; day <= 7; day++) {
        const users = await db.all(`SELECT id, untradedP2pVora FROM User WHERE telegramId LIKE 'sim_user_%' AND untradedP2pVora > 0`);
        let dailyAirdropTotal = 0;
        for (const u of users) {
            const airdrop = u.untradedP2pVora * 0.001; // 0.1% airdrop
            dailyAirdropTotal += airdrop;
            await db.run(`UPDATE User SET accumulatedVora = accumulatedVora + ? WHERE id = ?`, [airdrop, u.id]);
        }
        totalAirdropDistributed += dailyAirdropTotal;
        console.log(` - Day ${day}: ${dailyAirdropTotal.toFixed(2)} VORA 에어드랍이 P2P 대기 유저들에게 지급됨.`);
    }

    console.log("📊 [최종 생태계 모의 결과 리포트]");
    console.log(` - 총 지급된 7일간의 에어드랍 총량: ${totalAirdropDistributed.toFixed(2)} VORA`);
    
    const p2pUser = await db.get(`SELECT * FROM User WHERE id = ?`, [p2pUsers[0].id]);
    console.log(` - [샘플] P2P 거래를 수행한 유저 상태: 대기자금 ${p2pUser.untradedP2pVora} VORA, 누적 에어드랍: ${p2pUser.accumulatedVora.toFixed(2)} VORA (차감된 자산에 비례하여 적게 배분됨)`);
    
    const normalUser = await db.get(`SELECT * FROM User WHERE telegramId = 'sim_user_50'`);
    console.log(` - [샘플] P2P 대기 상태만 유지한 유저 상태: 대기자금 ${normalUser.untradedP2pVora} VORA, 누적 에어드랍: ${normalUser.accumulatedVora.toFixed(1)} VORA (원금 그대로 7일간 최대치 수령)`);

    console.log("🎉 시뮬레이션 완벽 종료.");
}

simulate().catch(console.error);
