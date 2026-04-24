import "@stdlib/deploy";

// Allocation Buckets
struct Allocation {
    dex: Int as coins;      // 40% (400M)
    tap: Int as coins;      // 30% (300M)
    team: Int as coins;     // 20% (200M)
    ido: Int as coins;      // 10% (100M)
}

message Withdraw {
    amount: Int as coins;
    category: Int as uint8; // 0: DEX, 1: TAP, 2: TEAM, 3: IDO
    destination: Address;
}

contract VoraTreasury with Deployable {
    owner: Address;
    allocations: Allocation;
    jettonWallet: Address?; // Treasury's own VoraJettonWallet address

    init(owner: Address) {
        self.owner = owner;
        // Initialize with 1B total supply divided by buckets
        self.allocations = Allocation{
            dex: ton("400000000"), 
            tap: ton("300000000"),
            team: ton("200000000"),
            ido: ton("100000000")
        };
    }

    receive(msg: Withdraw) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can withdraw from Treasury");

        if (msg.category == 0) {
            require(self.allocations.dex >= msg.amount, "Insufficient DEX allocation");
            self.allocations.dex = self.allocations.dex - msg.amount;
        } else if (msg.category == 1) {
            require(self.allocations.tap >= msg.amount, "Insufficient TAP allocation");
            self.allocations.tap = self.allocations.tap - msg.amount;
        } else if (msg.category == 2) {
            require(self.allocations.team >= msg.amount, "Insufficient TEAM allocation");
            self.allocations.team = self.allocations.team - msg.amount;
        } else if (msg.category == 3) {
            require(self.allocations.ido >= msg.amount, "Insufficient IDO allocation");
            self.allocations.ido = self.allocations.ido - msg.amount;
        } else {
            nativeThrow(1001); // Invalid category
        }

        // Logic to send JettonTransfer to self.jettonWallet (to be configured after deployment)
        // For now, it tracks the internal allocation balance.
    }

    receive("Update Wallet") {
        // After deployment, set the jetton wallet address if needed
    }

    get fun get_allocations(): Allocation {
        return self.allocations;
    }

    get fun total_remaining(): Int {
        return self.allocations.dex + self.allocations.tap + self.allocations.team + self.allocations.ido;
    }
}
