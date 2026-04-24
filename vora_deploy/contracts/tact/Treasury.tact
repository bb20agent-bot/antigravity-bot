import "@stdlib/deploy";

// Internal messages between Treasury and VoraToken
message TreasuryBalanceRequest {
    queryId: Int;
    mintAmount: Int;
    receiver: Address;
}

message TreasuryBalanceResponse {
    queryId: Int;
    mintAmount: Int;
    receiver: Address;
    treasuryBalance: Int;
}

message SetBotWalletAddress {
    botWalletAddress: Address;
}

message BotWithdraw {
    amount: Int;
    destination: Address;
}

message SetVoraTokenAddress {
    voraTokenAddress: Address;
}

contract Treasury with Deployable {
    owner: Address;
    voraTokenAddress: Address?;
    botWalletAddress: Address?;

    init(owner: Address) {
        self.owner = owner;
        self.voraTokenAddress = null;
        self.botWalletAddress = null;
    }

    receive(msg: SetVoraTokenAddress) {
       require(sender() == self.owner, "Only owner can set");
       require(self.voraTokenAddress == null, "Already set");
       self.voraTokenAddress = msg.voraTokenAddress;
    }

    receive(msg: SetBotWalletAddress) {
       require(sender() == self.owner, "Only owner can set");
       self.botWalletAddress = msg.botWalletAddress;
    }

    receive(msg: BotWithdraw) {
        require(self.botWalletAddress != null, "Bot wallet not set");
        require(sender() == self.botWalletAddress!!, "Only bot can withdraw");
        require(myBalance() >= msg.amount + ton("0.05"), "Insufficient balance");
        send(SendParameters{
            to: msg.destination,
            bounce: true,
            value: msg.amount,
            mode: SendIgnoreErrors
        });
    }

    // Default receive method for accepting TON from Quant, DNFTs, Fees, etc.
    receive() {
        // Automatically adds to the Treasury balance and emits an event (optional)
        dump(context().value);
    }

    receive("withdraw") {
        require(sender() == self.owner, "Only owner can withdraw directly");
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }

    // Responds to 10x Max Supply check from VoraToken during minting
    receive(msg: TreasuryBalanceRequest) {
        require(sender() == self.voraTokenAddress, "Unauthorized request for Treasury Balance");

        send(SendParameters{
            to: self.voraTokenAddress!!,
            value: 0,
            mode: SendRemainingValue,
            body: TreasuryBalanceResponse{
                queryId: msg.queryId,
                mintAmount: msg.mintAmount,
                receiver: msg.receiver,
                treasuryBalance: myBalance()
            }.toCell()
        });
    }

    get fun get_balance(): Int {
        return myBalance();
    }
}
