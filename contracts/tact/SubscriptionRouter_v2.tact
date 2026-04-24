import "@stdlib/deploy";
import "@stdlib/ownable";

message SubscribeTON {
    tier: Int; // 4: Crew ($5000/yr)
    durationMonths: Int;
}

message(0x7362d09c) JettonTransferNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forward_payload: Slice as remaining;
}

contract SubscriptionRouter with Deployable, Ownable {
    owner: Address;
    
    // expiry timestamp per user
    expiries: map<Address, Int>;
    tiers: map<Address, Int>;

    init(owner: Address) {
        self.owner = owner;
    }

    receive(msg: SubscribeTON) {
        let ctx: Context = context();
        let value: Int = ctx.value;
        
        // $5,000 threshold (approx 1,000 TON)
        if (msg.tier == 4) {
            require(value >= ton("1000"), "Insufficient TON for $5,000 P2P Right");
        }
        
        // Update expiry
        let current_expiry: Int = 0;
        if (self.expiries.get(sender()) != null) {
            current_expiry = self.expiries.get(sender())!!;
        }
        
        let startTime: Int = now();
        if (current_expiry > now()) {
            startTime = current_expiry;
        }
        
        self.expiries.set(sender(), startTime + (msg.durationMonths * 30 * 24 * 60 * 60));
        self.tiers.set(sender(), msg.tier);
    }

    get fun is_p2p_authorized(user: Address): Bool {
        let expiry: Int? = self.expiries.get(user);
        let tier: Int? = self.tiers.get(user);
        if (expiry != null && tier != null) {
            return (expiry!! > now()) && (tier!! >= 4);
        }
        return false;
    }
}
