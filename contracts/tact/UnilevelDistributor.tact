import "@stdlib/deploy";

message SetUpline {
    user: Address;
    upline: Address;
}

message SetWallet {
    wallet: Address;
}

message(0x7362d09c) TokenNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining;
}

message(0xf8a7ea5) TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address?;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

contract UnilevelDistributor with Deployable {
    owner: Address;
    vora_jetton_wallet: Address?;
    
    // user -> upline (parent)
    uplines: map<Address, Address>;

    init(owner: Address) {
        self.owner = owner;
    }

    receive(msg: SetUpline) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        self.uplines.set(msg.user, msg.upline);
    }

    receive(msg: SetWallet) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        self.vora_jetton_wallet = msg.wallet;
    }

    receive(msg: TokenNotification) {
        let ctx: Context = context();
        require(self.vora_jetton_wallet != null && ctx.sender == self.vora_jetton_wallet!!, "Invalid token sender");

        let user: Address = msg.from;
        let total_amount: Int = msg.amount;

        let u1: Address? = self.uplines.get(user);
        if (u1 != null) {
            let a1: Int = total_amount * 50 / 100; // 1st tier 50%
            self.sendVora(u1!!, a1);
            
            let u2: Address? = self.uplines.get(u1!!);
            if (u2 != null) {
                let a2: Int = total_amount * 30 / 100; // 2nd tier 30%
                self.sendVora(u2!!, a2);
                
                let u3: Address? = self.uplines.get(u2!!);
                if (u3 != null) {
                    let a3: Int = total_amount * 20 / 100; // 3rd tier 20%
                    self.sendVora(u3!!, a3);
                }
            }
        }
    }

    fun sendVora(to: Address, amount: Int) {
        send(SendParameters{
            to: self.vora_jetton_wallet!!,
            value: ton("0.05"), // Provide sufficient gas for internal routing
            mode: SendIgnoreErrors,
            body: TokenTransfer{
                queryId: 0,
                amount: amount,
                destination: to,
                response_destination: null,
                custom_payload: null,
                forward_ton_amount: 0,
                forward_payload: emptySlice()
            }.toCell()
        });
    }
}
