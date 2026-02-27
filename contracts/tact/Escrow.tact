import "@stdlib/deploy";
import "./Treasury"; // For sending Treasury tax

message(0x0f8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address;
    customPayload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message CreateTrade {
    buyer: Address;
    seller: Address;
    tonAmount: Int;
    voraAmount: Int;
    feePercentage: Int; // e.g., 55 for 5.5%
    reBatePercentage: Int; // e.g., 20 for 2%
    timeoutLength: Int;
}

message ReleaseTrade {
    tradeId: Int;
}

message CancelTrade {
    tradeId: Int;
}

contract Escrow with Deployable {
    owner: Address;
    treasuryAddress: Address;
    voraTokenAddress: Address;
    
    // Simple state storage for trades (Needs Map for production)
    trades: map<Int, TradeDetails>;
    tradeCounter: Int as uint64 = 0;

    init(owner: Address, treasuryAddress: Address, voraTokenAddress: Address) {
        self.owner = owner;
        self.treasuryAddress = treasuryAddress;
        self.voraTokenAddress = voraTokenAddress;
    }

    receive(msg: CreateTrade) {
        // Assume Seller deposited VORA and Buyer deposited TON in separate ops
        let tradeId: Int = self.tradeCounter;
        self.trades.set(tradeId, TradeDetails{
            buyer: msg.buyer,
            seller: msg.seller,
            tonAmount: msg.tonAmount,
            voraAmount: msg.voraAmount,
            feePercentage: msg.feePercentage,
            reBatePercentage: msg.reBatePercentage,
            status: "LOCKED",
            createdAt: now(),
            timeoutLength: msg.timeoutLength
        });
        self.tradeCounter = self.tradeCounter + 1;
    }

    receive(msg: ReleaseTrade) {
        let trade: TradeDetails = self.trades.get(msg.tradeId)!!;
        require(trade.status == "LOCKED", "Trade is not locked");

        // Calculate fees
        let totalFee: Int = (trade.tonAmount * trade.feePercentage) / 1000;
        let treasuryFee: Int = (totalFee * 30) / 100; // 30% of fee to Treasury
        let sellerFee: Int = (totalFee * 40) / 100;
        let rebate: Int = (totalFee * trade.reBatePercentage) / 100; // Buyer rebate
        let devFund: Int = totalFee - treasuryFee - sellerFee - rebate;

        // Send TON to Seller (minus their fee)
        let sellerEarnings: Int = trade.tonAmount - totalFee + sellerFee;
        send(SendParameters{
            to: trade.seller,
            value: sellerEarnings,
            mode: SendIgnoreErrors
        });

        // Send VORA to Buyer
        send(SendParameters{
            to: self.voraTokenAddress,
            value: ton("0.05"),
            mode: SendIgnoreErrors,
            body: JettonTransfer{
                queryId: 0,
                amount: trade.voraAmount,
                destination: trade.buyer,
                responseDestination: trade.buyer,
                customPayload: null,
                forwardTonAmount: 0,
                forwardPayload: emptySlice()
            }.toCell()
        });

        // Send TON Rebate to Buyer
        send(SendParameters{
            to: trade.buyer,
            value: rebate,
            mode: SendIgnoreErrors
        });

        // Send Fees to Treasury
        send(SendParameters{
            to: self.treasuryAddress,
            value: treasuryFee,
            mode: SendIgnoreErrors
        });

        trade.status = "COMPLETED";
        self.trades.set(msg.tradeId, trade);
    }

    receive(msg: CancelTrade) {
        let trade: TradeDetails = self.trades.get(msg.tradeId)!!;
        require(trade.status == "LOCKED", "Trade is not locked");
        require(now() > trade.createdAt + trade.timeoutLength, "Timeout not reached");

        // Refund Buyer TON
        send(SendParameters{
            to: trade.buyer,
            value: trade.tonAmount,
            mode: SendIgnoreErrors
        });

        // Refund Seller VORA
        send(SendParameters{
            to: self.voraTokenAddress,
            value: ton("0.05"),
            mode: SendIgnoreErrors,
            body: JettonTransfer{
                queryId: 0,
                amount: trade.voraAmount,
                destination: trade.seller,
                responseDestination: trade.seller,
                customPayload: null,
                forwardTonAmount: 0,
                forwardPayload: emptySlice()
            }.toCell()
        });
        
        trade.status = "CANCELLED";
        self.trades.set(msg.tradeId, trade);
    }
}

struct TradeDetails {
    buyer: Address;
    seller: Address;
    tonAmount: Int;
    voraAmount: Int;
    feePercentage: Int;
    reBatePercentage: Int;
    status: String; // LOCKED, COMPLETED, CANCELLED
    createdAt: Int;
    timeoutLength: Int;
}
