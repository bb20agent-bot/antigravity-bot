import "@stdlib/deploy";

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

message SetWallet {
    wallet: Address;
}

message CancelOrder {
    orderId: Int;
}

message FillOrder {
    orderId: Int;
}

struct Order {
    seller: Address;
    amountVora: Int;
    priceTon: Int;
    isActive: Bool;
}

contract P2PEscrow with Deployable {
    owner: Address;
    vora_jetton_wallet: Address?;
    orders: map<Int, Order>;
    orderCounter: Int = 0;

    init(owner: Address) {
        self.owner = owner;
    }

    receive(msg: SetWallet) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        self.vora_jetton_wallet = msg.wallet;
    }

    receive(msg: TokenNotification) {
        let ctx: Context = context();
        require(self.vora_jetton_wallet != null && ctx.sender == self.vora_jetton_wallet!!, "Invalid token sender");
        
        let slice: Slice = msg.forward_payload;
        let op: Int = slice.loadUint(32);
        
        if (op == 1) { // 1 = List Order
            let priceTon: Int = slice.loadCoins();
            self.orderCounter = self.orderCounter + 1;
            
            self.orders.set(self.orderCounter, Order{
                seller: msg.from,
                amountVora: msg.amount,
                priceTon: priceTon,
                isActive: true
            });
        } else {
            // Unknown operation, refund
            self.sendVora(msg.from, msg.amount);
        }
    }

    receive(msg: FillOrder) {
        let ctx: Context = context();
        let order: Order? = self.orders.get(msg.orderId);
        require(order != null, "Order not found");
        let o: Order = order!!;
        require(o.isActive, "Order not active");
        
        // Ensure buyer sent enough TON
        require(ctx.value >= o.priceTon, "Insufficient TON sent");

        // Send TON to Seller
        send(SendParameters{
            to: o.seller,
            value: o.priceTon,
            mode: SendIgnoreErrors,
            bounce: false,
            body: "P2P Payment".asComment()
        });

        // Send VORA to Buyer
        self.sendVora(ctx.sender, o.amountVora);

        // Mark inactive
        self.orders.set(msg.orderId, Order{
            seller: o.seller,
            amountVora: o.amountVora,
            priceTon: o.priceTon,
            isActive: false
        });
    }
    
    receive(msg: CancelOrder) {
        let ctx: Context = context();
        let order: Order? = self.orders.get(msg.orderId);
        require(order != null, "Order not found");
        let o: Order = order!!;
        require(o.isActive, "Order not active");
        require(ctx.sender == o.seller || ctx.sender == self.owner, "Not authorized");

        // Return VORA to Seller
        self.sendVora(o.seller, o.amountVora);

        // Mark inactive
        self.orders.set(msg.orderId, Order{
            seller: o.seller,
            amountVora: o.amountVora,
            priceTon: o.priceTon,
            isActive: false
        });
    }

    fun sendVora(to: Address, amount: Int) {
        send(SendParameters{
            to: self.vora_jetton_wallet!!,
            value: ton("0.05"), // jetton forward fee
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
