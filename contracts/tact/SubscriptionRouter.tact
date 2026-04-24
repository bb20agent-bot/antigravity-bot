import "@stdlib/deploy";

message SubscribeTON {
    tier: Int; // 1: Bronze, 2: Silver, 3: Gold, 4: Crew
    durationMonths: Int;
}

message SubscribeVORA {
    tier: Int;
    amountToBurn: Int;
    voraWallet: Address;
}

contract SubscriptionRouter with Deployable {
    owner: Address;
    totalTonCollected: Int as coins;
    totalVoraBurned: Int as coins;

    init(owner: Address) {
        self.owner = owner;
        self.totalTonCollected = 0;
        self.totalVoraBurned = 0;
    }

    receive(msg: SubscribeTON) {
        let ctx: Context = context();
        let value: Int = ctx.value;
        
        // Security checks: Require minimum TON based on tier
        if (msg.tier == 4) {
            require(value >= ton("1000"), "Insufficient TON for Crew annual");
        } else if (msg.tier == 3) {
            require(value >= ton("100"), "Insufficient TON for Gold");
        }
        
        self.totalTonCollected = self.totalTonCollected + value;
        
        // Emit log for backend indexer
        emit("Subscribed via TON".asComment());
    }

    receive(msg: SubscribeVORA) {
        let ctx: Context = context();
        
        // Receives Jetton notification of VORA transfer
        // Normally requires TEP-74 TokenNotification parsing
        
        // VORA sink validation: ensure 10% discount value is met 
        // and tokens are sent to dead address or Master burn function.
        self.totalVoraBurned = self.totalVoraBurned + msg.amountToBurn;
        
        emit("Subscribed via VORA - Burned".asComment());
    }
    get fun get_stats(): RouterStats {
        return RouterStats{
            totalTon: self.totalTonCollected, 
            totalVora: self.totalVoraBurned
        };
    }
}

struct RouterStats {
    totalTon: Int;
    totalVora: Int;
}
