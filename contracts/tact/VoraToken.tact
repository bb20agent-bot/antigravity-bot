import "@stdlib/deploy";
import "./Treasury";

message Mint {
    amount: Int;
    receiver: Address;
}

message TokenNotification {
    queryId: Int;
    amount: Int;
    from: Address;
    forwardPayload: Slice as remaining;
}

contract VoraToken with Deployable {
    owner: Address;
    treasuryAddress: Address;
    totalSupply: Int as coins;
    maxSupply: Int as coins;
    
    init(owner: Address, treasuryAddress: Address) {
        self.owner = owner;
        self.treasuryAddress = treasuryAddress;
        self.totalSupply = 0;
        self.maxSupply = 1000000000000000000; // 1 Billion tokens with 9 decimals
    }

    receive(msg: Mint) {
        require(sender() == self.owner, "Only owner can mint");
        require(self.totalSupply + msg.amount <= self.maxSupply, "Exceeds max supply");

        // Request Treasury balance directly
        send(SendParameters{
            to: self.treasuryAddress,
            value: ton("0.05"), // Attach gas for the request
            mode: SendIgnoreErrors,
            body: TreasuryBalanceRequest{
                queryId: 0,
                mintAmount: msg.amount,
                receiver: msg.receiver
            }.toCell()
        });
    }

    // Callback from Treasury after checking balance
    receive(msg: TreasuryBalanceResponse) {
        require(sender() == self.treasuryAddress, "Only Treasury can respond");
        
        let allowedMint: Int = msg.treasuryBalance * 10;
        let hypotheticalSupply: Int = self.totalSupply + msg.mintAmount;

        require(hypotheticalSupply <= allowedMint, "Mint amount exceeds 10x Treasury TON balance limit");

        self.totalSupply = self.totalSupply + msg.mintAmount;

        // Implement Jetton minting logic here
        // E.g., sending JettonTransfer to receiver
    }

    receive(msg: TokenNotification) {
        // Handle incoming notifications (e.g., from Treasury profit)
    }

    get fun get_total_supply(): Int {
        return self.totalSupply;
    }

    get fun get_max_supply(): Int {
        return self.maxSupply;
    }
}
