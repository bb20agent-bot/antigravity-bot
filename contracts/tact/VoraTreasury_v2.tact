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

// Governance Withdrawal Categories
message WithdrawIDO {
    strategy_amount: Int as coins;
    dev_amount: Int as coins;
    dex_amount: Int as coins;
}

message WithdrawSubscription {
    strategy_amount: Int as coins;
    tech_amount: Int as coins;
    dex_lp_amount: Int as coins;
    p2p_brokerage_amount: Int as coins;
}

contract VoraTreasury with Deployable, Ownable {
    owner: Address;
    vora_jetton_wallet: Address?;
    
    // Revenue tracking (Internal state for transparency)
    total_ido_revenue: Int as coins = 0;
    total_subscription_revenue: Int as coins = 0;

    // Target Addresses (Configured by Governance)
    strategy_address: Address;
    dev_address: Address;
    dex_address: Address;
    tech_incentive_address: Address;
    p2p_brokerage_address: Address;

    init(owner: Address, strategy: Address, dev: Address, dex: Address, tech: Address, p2p: Address) {
        self.owner = owner;
        self.strategy_address = strategy;
        self.dev_address = dev;
        self.dex_address = dex;
        self.tech_incentive_address = tech;
        self.p2p_brokerage_address = p2p;
    }

    receive("Set Jetton Wallet") {
        let ctx: Context = context();
        // This is usually called after the Master resolves the wallet address
        self.vora_jetton_wallet = sender(); 
    }

    // =====================================================================
    // 1. IDO Asset Allocation (50% Strategy, 20% Dev, 30% DEX)
    // =====================================================================
    receive(msg: WithdrawIDO) {
        self.requireOwner();
        let total: Int = msg.strategy_amount + msg.dev_amount + msg.dex_amount;
        
        // Ensure accurate percentage split enforcement logic could be added here
        // For now, we direct the funds to the specific pre-configured addresses
        
        if (msg.strategy_amount > 0) {
            self.send_jettons(self.strategy_address, msg.strategy_amount, "VORA IDO: Strategy (50%)");
        }
        if (msg.dev_amount > 0) {
            self.send_jettons(self.dev_address, msg.dev_amount, "VORA IDO: Dev (20%)");
        }
        if (msg.dex_amount > 0) {
            self.send_jettons(self.dex_address, msg.dex_amount, "VORA IDO: DEX (30%)");
        }
    }

    // =====================================================================
    // 2. Subscription Asset Allocation (50% Strat, 5% Tech, 20% DEX, 25% P2P)
    // =====================================================================
    receive(msg: WithdrawSubscription) {
        self.requireOwner();
        
        if (msg.strategy_amount > 0) {
            self.send_jettons(self.strategy_address, msg.strategy_amount, "VORA Sub: Strategy (50%)");
        }
        if (msg.tech_amount > 0) {
            self.send_jettons(self.tech_incentive_address, msg.tech_amount, "VORA Sub: Tech (5%)");
        }
        if (msg.dex_lp_amount > 0) {
            self.send_jettons(self.dex_address, msg.dex_lp_amount, "VORA Sub: DEX LP (20%)");
        }
        if (msg.p2p_brokerage_amount > 0) {
            self.send_jettons(self.p2p_brokerage_address, msg.p2p_brokerage_amount, "VORA Sub: P2P Brokerage (25%)");
        }
    }

    // =====================================================================
    // Internal Helper: Actual Jetton Transfer Execution
    // =====================================================================
    fun send_jettons(to: Address, amount: Int, memo: String) {
        require(self.vora_jetton_wallet != null, "Jetton Wallet not configured");
        
        send(SendParameters{
            to: self.vora_jetton_wallet!!,
            value: ton("0.05"), // Gas for Jetton transfer
            mode: SendPayGasSeparately,
            body: TokenTransfer{
                query_id: 0,
                amount: amount,
                destination: to,
                response_destination: self.owner,
                custom_payload: null,
                forward_ton_amount: ton("0.01"),
                forward_payload: memo.asSlice()
            }.toCell()
        });
    }

    // Allow the owner to withdraw excess TON
    receive("withdraw_ton") {
        self.requireOwner();
        send(SendParameters{
            to: self.owner,
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }
}
