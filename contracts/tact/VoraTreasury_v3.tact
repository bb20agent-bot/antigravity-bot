import "@stdlib/deploy";
import "@stdlib/ownable";

// Jetton Transfer Message
message(0x0f8a7ea5) TokenTransfer {
    query_id: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address?;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

struct ReferrerInfo {
    l1: Address?;
    l2: Address?;
}

// Governance Messages
message SetReferrer { user: Address; referrer: Address; }
message RecordT2EVolume { user: Address; amount: Int as coins; }
message WithdrawIDO { strategy: Int as coins; dev: Int as coins; dex: Int as coins; }
message WithdrawSubscription { strategy: Int as coins; tech: Int as coins; lp: Int as coins; p2p: Int as coins; }

contract VoraTreasury_v3 with Deployable, Ownable {
    owner: Address;
    vora_jetton_wallet: Address?;
    
    // Referral and Volume State
    referrers: map<Address, ReferrerInfo>;
    n_volume: map<Address, Int>;
    
    // Config
    strategy_addr: Address;
    dev_addr: Address;
    dex_addr: Address;
    tech_addr: Address;
    p2p_addr: Address;

    init(owner: Address, strategy: Address, dev: Address, dex: Address, tech: Address, p2p: Address) {
        self.owner = owner;
        self.strategy_addr = strategy;
        self.dev_addr = dev;
        self.dex_addr = dex;
        self.tech_addr = tech;
        self.p2p_addr = p2p;
    }

    receive("Set Jetton Wallet") { self.vora_jetton_wallet = sender(); }

    // 1. Governance IDO Withdraw (50/20/30)
    receive(msg: WithdrawIDO) {
        self.requireOwner();
        if (msg.strategy > 0) { self.send_jettons(self.strategy_addr, msg.strategy, "IDO Strategy (50%)"); }
        if (msg.dev > 0) { self.send_jettons(self.dev_addr, msg.dev, "IDO Dev (20%)"); }
        if (msg.dex > 0) { self.send_jettons(self.dex_addr, msg.dex, "IDO DEX (30%)"); }
    }

    // 2. Governance Subscription Withdraw (50/5/20/25)
    receive(msg: WithdrawSubscription) {
        self.requireOwner();
        if (msg.strategy > 0) { self.send_jettons(self.strategy_addr, msg.strategy, "SUB Strategy (50%)"); }
        if (msg.tech > 0) { self.send_jettons(self.tech_addr, msg.tech, "SUB Tech (5%)"); }
        if (msg.lp > 0) { self.send_jettons(self.dex_addr, msg.lp, "SUB DEX LP (20%)"); }
        if (msg.p2p > 0) { self.send_jettons(self.p2p_addr, msg.p2p, "SUB P2P Brokers (25%)"); }
    }

    // 3. T2E Referral recording & Payouts (L1: 15~30%, L2: 5~15%)
    receive(msg: RecordT2EVolume) {
        self.requireOwner();
        let vol: Int = 0;
        if (self.n_volume.get(msg.user) != null) { vol = self.n_volume.get(msg.user)!!; }
        self.n_volume.set(msg.user, vol + msg.amount);
        
        let info: ReferrerInfo? = self.referrers.get(msg.user);
        if (info != null) {
            if (info!!.l1 != null) { self.send_jettons(info!!.l1!!, (msg.amount * 15) / 100, "T2E L1 Reward"); }
            if (info!!.l2 != null) { self.send_jettons(info!!.l2!!, (msg.amount * 5) / 100, "T2E L2 Reward"); }
        }
    }

    receive(msg: SetReferrer) {
        let current: ReferrerInfo? = self.referrers.get(msg.user);
        require(current == null, "Referrer locked");
        let l1: Address = msg.referrer;
        let l2: Address? = null;
        let l1_info: ReferrerInfo? = self.referrers.get(l1);
        if (l1_info != null) { l2 = l1_info!!.l1; }
        self.referrers.set(msg.user, ReferrerInfo{l1: l1, l2: l2});
    }

    get fun get_dnft_tier(user: Address): Int {
        let vol: Int = 0;
        if (self.n_volume.get(user) != null) { vol = self.n_volume.get(user)!!; }
        if (vol >= ton("100000")) { return 5; }
        if (vol >= ton("10000")) { return 4; }
        if (vol >= ton("1000")) { return 3; }
        if (vol >= ton("100")) { return 2; }
        return 1;
    }

    fun send_jettons(to: Address, amount: Int, memo: String) {
        require(self.vora_jetton_wallet != null, "No Jetton Wallet");
        send(SendParameters{
            to: self.vora_jetton_wallet!!, value: ton("0.05"), mode: SendPayGasSeparately,
            body: TokenTransfer{
                query_id: 0, amount: amount, destination: to, response_destination: self.owner,
                custom_payload: null, forward_ton_amount: ton("0.01"), forward_payload: memo.asSlice()
            }.toCell()
        });
    }
}
