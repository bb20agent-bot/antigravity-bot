import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function seed() {
    const db = await open({
        filename: './dev.sqlite',
        driver: sqlite3.Database
    });

    console.log("Clearing old data...");
    await db.exec(`DELETE FROM User`);

    // Create Root User (dev_user_123 corresponds to the UI's mock test user)
    const result = await db.run(
        `INSERT INTO User (telegramId, tonWalletAddress, isFandomUser) VALUES (?, ?, ?)`,
        ['dev_user_123', 'root_wallet_test_123', 1]
    );
    const rootId = result.lastID;
    console.log("Root user created with ID:", rootId);

    // Create 20 Level 1 Users
    console.log("Creating 20 L1 users...");
    const l1Ids = [];
    for (let i = 1; i <= 20; i++) {
        const res = await db.run(
            `INSERT INTO User (telegramId, referrerId, isFandomUser) VALUES (?, ?, ?)`,
            [`l1_user_${i}`, rootId, 1]
        );
        l1Ids.push(res.lastID);
    }

    // Create 80 Level 2 Users distributed among L1 users (4 per L1)
    console.log("Creating 80 L2 users...");
    let userCount = 1;
    for (const l1Id of l1Ids) {
        for (let j = 1; j <= 4; j++) {
            await db.run(
                `INSERT INTO User (telegramId, referrerId, isFandomUser) VALUES (?, ?, ?)`,
                [`l2_user_${userCount++}`, l1Id, 0] // some fandom, some not
            );
        }
    }

    console.log("Seeding complete! 100 users added to the unilevel structure.");
}

seed().catch(console.error);
