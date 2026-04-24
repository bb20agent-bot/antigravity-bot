import "@stdlib/deploy";
import "@stdlib/ownable";

message(0x0f8a7ea5) TokenTransfer {
    query_id: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address?;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

struct ReferrerInfo { l1: Address?; l2: Address?; }

message SetReferrer { user: Address; referrer: Address; }
message RecordT2EVolume { user: Address; amount: Int as coins; }
message WithdrawIDO { strategy: Int as coins; dev: Int as coins; dex: Int as coins; }
message WithdrawSubscription { strategy: Int as coins; tech: Int as coins; lp: Int as coins; p2p: Int as coins; }

// Noblesse Oblige Governance
message VoteBurn { amount: Int as coins; }
message PayoutAdvisor { amount: Int as coins; recipient: Address; }

contract VoraTreasury_v4 with Deployable, Ownable {
    owner: Address;
    vora_jetton_wallet: Address?;
    
    // Referral & Volume
    referrers: map<Address, ReferrerInfo>;
    n_volume: map<Address, Int>;
    
    // Noblesse Oblige (Advisor Pool)
    advisor_pool: Int as coins = ton("50000000"); // 50M VORA (5%)
    tier5_users: map<Address, Bool>;
    tier5_count: Int = 0;
    
    // Addresses
    strategy_addr: Address; dev_addr: Address; dex_addr: Address; tech_addr: Address; p2p_addr: Address;

    init(owner: Address, strategy: Address, dev: Address, dex: Address, tech: Address, p2p: Address) {
        self.owner = owner;
        self.strategy_addr = strategy; self.dev_addr = dev; self.dex_addr = dex;
        self.tech_addr = tech; self.p2p_addr = p2p;
    }

    receive("Set Jetton Wallet") { self.vora_jetton_wallet = sender(); }

    // 1. T2E & Tier Tracking
    receive(msg: RecordT2EVolume) {
        self.requireOwner();
        let vol: Int = 0;
        if (self.n_volume.get(msg.user) != null) { vol = self.n_volume.get(msg.user)!!; }
        let new_vol: Int = vol + msg.amount;
        self.n_volume.set(msg.user, new_vol);
        
        // Check for Tier 5 Upgrade (10M N-Volume threshold)
        if (new_vol >= ton("10000000") && self.tier5_users.get(msg.user) == null) {
            self.tier5_users.set(msg.user, true);
            self.tier5_count = self.tier5_count + 1;
        }

        // Referral Payouts
        let info: ReferrerInfo? = self.referrers.get(msg.user);
        if (info != null) {
            if (info!!.l1 != null) { self.send_jettons(info!!.l1!!, (msg.amount * 15) / 100, "T2E L1 Reward"); }
            if (info!!.l2 != null) { self.send_jettons(info!!.l2!!, (msg.amount * 5) / 100, "T2E L2 Reward"); }
        }
    }

    // 2. Noblesse Oblige Payout (Requires 10 Tier-5 Users)
    receive(msg: PayoutAdvisor) {
        self.requireOwner();
        require(self.tier5_count >= 10, "Noblesse Oblige: Minimum 10 Tier-5 Crew needed to unlock");
        require(self.advisor_pool >= msg.amount, "Insufficient advisor pool");
        
        self.advisor_pool = self.advisor_pool - msg.amount;
        self.send_jettons(msg.recipient, msg.amount, "Noblesse Oblige: Advisor Payout");
    }

    // 3. Governance Voting (Placeholder for complex multisig-style voting)
    receive(msg: VoteBurn) {
        require(self.tier5_users.get(sender()) != null, "Only Tier-5 Crew can vote");
        // Logic to track votes and execute burn from Treasury if threshold reached
        self.send_jettons(address("EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c"), msg.amount, "Governance: Strategic Burn");
    }

    // Governance Splits
    receive(msg: WithdrawIDO) {
        self.requireOwner();
        if (msg.strategy > 0) { self.send_jettons(self.strategy_addr, msg.strategy, "IDO Strat (50%)"); }
        if (msg.dev > 0) { self.send_jettons(self.dev_addr, msg.dev, "IDO Dev (20%)"); }
        if (msg.dex > 0) { self.send_jettons(self.dex_addr, msg.dex, "IDO DEX (30%)"); }
    }

    receive(msg: WithdrawSubscription) {
        self.requireOwner();
        if (msg.strategy > 0) { self.send_jettons(self.strategy_addr, msg.strategy, "SUB Strat (50%)"); }
        if (msg.tech > 0) { self.send_jettons(self.tech_addr, msg.tech, "SUB Tech (5%)"); }
        if (msg.lp > 0) { self.send_jettons(self.dex_addr, msg.lp, "SUB DEX LP (20%)"); }
        if (msg.p2p > 0) { self.send_jettons(self.p2p_addr, msg.p2p, "SUB P2P Brokers (25%)"); }
    }

    receive(msg: SetReferrer) {
        let current: ReferrerInfo? = self.referrers.get(msg.user);
        require(current == null, "Referrer locked");
        let l1_info: ReferrerInfo? = self.referrers.get(msg.referrer);
        let l2: Address? = null;
        if (l1_info != null) { l2 = l1_info!!.l1; }
        self.referrers.set(msg.user, ReferrerInfo{l1: msg.referrer, l2: l2});
    }

    get fun get_dnft_tier(user: Address): Int {
        let vol: Int = 0;
        if (self.n_volume.get(user) != null) { vol = self.n_volume.get(user)!!; }
        if (vol >= ton("10000000")) { return 5; } // 10M
        if (vol >= ton("1000000")) { return 4; }  // 1M
        if (vol >= ton("100000")) { return 3; }   // 100k
        if (vol >= ton("10000")) { return 2; }    // 10k
        return 1;
    }

    get fun get_stats(): Int { return self.tier5_count; }

    fun send_jettons(to: Address, amount: Int, memo: String) {
        require(self.vora_jetton_wallet != null, "Budget error");
        send(SendParameters{
            to: self.vora_jetton_wallet!!, value: ton("0.05"), mode: SendPayGasSeparately,
            body: TokenTransfer{
                query_id: 0, amount: amount, destination: to, response_destination: self.owner,
                custom_payload: null, forward_ton_amount: ton("0.01"), forward_payload: memo.asSlice()
            }.toCell()
        });
    }
}
