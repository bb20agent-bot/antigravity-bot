
// test_logic.js - Simulation of TON Contract Logic

const USERS = {
    'Admin': { address: 'Admin', upline: null, balance: 1000 },
    'User_A': { address: 'User_A', upline: 'Admin', balance: 100 },
    'User_B': { address: 'User_B', upline: 'User_A', balance: 100 },
    'User_C': { address: 'User_C', upline: 'User_B', balance: 100 },
    'User_D': { address: 'User_D', upline: 'User_C', balance: 100 },
    'User_E': { address: 'User_E', upline: 'User_D', balance: 100 },
    'Buyer': { address: 'Buyer', upline: 'User_E', balance: 500 },
};

function distributeRewards(buyerAddr, amount) {
    console.log(`\n[TX] Buyer ${buyerAddr} spends ${amount}`);

    let current = USERS[buyerAddr];
    let remaining = amount;

    const rates = [0.10, 0.05, 0.03, 0.02, 0.01]; // 10%, 5%, 3%, 2%, 1%

    for (let i = 0; i < 5; i++) {
        if (!current.upline) break;

        const uplineAddr = current.upline;
        const reward = amount * rates[i];

        if (remaining >= reward) {
            USERS[uplineAddr].balance += reward;
            remaining -= reward;
            console.log(`  Level ${i + 1}: ${uplineAddr} gets ${reward.toFixed(2)} (Rate ${rates[i] * 100}%)`);
        }

        current = USERS[uplineAddr];
    }

    // Treasury
    USERS['Admin'].balance += remaining;
    console.log(`  Treasury (Admin) gets remaining: ${remaining.toFixed(2)}`);
}

// Run Simulation
console.log("--- Initial State ---");
console.log(USERS);

distributeRewards('Buyer', 100);

console.log("\n--- Final State ---");
Object.values(USERS).forEach(u => {
    console.log(`${u.address}: ${u.balance.toFixed(2)}`);
});
