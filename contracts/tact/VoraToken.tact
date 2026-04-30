import "@stdlib/deploy";

// Jetton Master and Wallet standard implementation (TEP-74)

message(0xf8a7ea5) TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address?;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x178d4519) TokenTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    response_destination: Address?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x7362d09c) TokenNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining;
}

message(0x595f07bc) TokenBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    response_destination: Address?;
    custom_payload: Cell?;
}

message(0x7bdd97de) TokenBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    response_destination: Address?;
}

message(0xd53276db) TokenExcesses {
    queryId: Int as uint64;
}

message TokenUpdateContent {
    content: Cell;
}

message MasterSetWalletStatus {
    queryId: Int as uint64;
    target_owner: Address;
    is_frozen: Bool;
}

message(0x8b7e28b2) WalletSetStatus {
    queryId: Int as uint64;
    is_frozen: Bool;
}

message SetPublicKey {
    public_key: Int;
}

message RelayedTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address?;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    relayer_fee: Int as coins;
    valid_until: Int as uint32;
    signature: Slice;
    forward_payload: Slice as remaining;
}

message Mint {
    amount: Int;
    receiver: Address;
}

struct JettonData {
    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell?;
    walletCode: Cell;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

@interface("org.ton.jetton.master")
contract VoraToken with Deployable {
    totalSupply: Int as coins;
    owner: Address;
    content: Cell?;
    mintable: Bool;
    
    init(owner: Address, content: Cell?) {
        self.totalSupply = 0;
        self.owner = owner;
        self.mintable = true;
        self.content = content;
    }

    receive(msg: Mint) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        require(self.mintable, "Not mintable");
        
        // Minting increments total supply
        self.totalSupply = self.totalSupply + msg.amount;
        let winit: StateInit = initOf VoraJettonWallet(msg.receiver, myAddress());
        
        send(SendParameters{
            to: contractAddress(winit), 
            value: 0, 
            bounce: true,
            mode: SendRemainingValue,
            body: TokenTransferInternal{ 
                queryId: 0,
                amount: msg.amount,
                from: self.owner,
                response_destination: self.owner,
                forward_ton_amount: 0,
                forward_payload: emptySlice()
            }.toCell(),
            code: winit.code,
            data: winit.data
        });
    }

    receive(msg: TokenUpdateContent) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        self.content = msg.content;
    }

    receive("Stop Mint") {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        self.mintable = false;
    }

    receive(msg: MasterSetWalletStatus) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        
        let winit: StateInit = initOf VoraJettonWallet(msg.target_owner, myAddress());
        
        send(SendParameters{
            to: contractAddress(winit),
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: WalletSetStatus{
                queryId: msg.queryId,
                is_frozen: msg.is_frozen
            }.toCell()
        });
    }

    receive(msg: TokenBurnNotification) {
        let winit: StateInit = initOf VoraJettonWallet(msg.sender, myAddress());
        require(contractAddress(winit) == sender(), "Invalid sender");
        self.totalSupply = self.totalSupply - msg.amount;

        if (msg.response_destination != null) {
            send(SendParameters{
                to: msg.response_destination!!,
                value: 0,
                bounce: false,
                mode: SendRemainingValue | SendIgnoreErrors,
                body: TokenExcesses{ queryId: msg.queryId }.toCell()
            });
        }
    }

    get fun get_jetton_data(): JettonData {
        return JettonData{
            totalSupply: self.totalSupply,
            mintable: self.mintable,
            owner: self.owner,
            content: self.content,
            walletCode: initOf VoraJettonWallet(self.owner, myAddress()).code
        };
    }

    get fun get_wallet_address(owner: Address): Address {
        return contractAddress(initOf VoraJettonWallet(owner, myAddress()));
    }
}

@interface("org.ton.jetton.wallet")
contract VoraJettonWallet {
    balance: Int as coins = 0;
    owner: Address;
    master: Address;
    is_frozen: Bool = false;
    public_key: Int? = null;

    init(owner: Address, master: Address) {
        self.owner = owner;
        self.master = master;
    }

    receive(msg: TokenTransfer) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender");
        require(!self.is_frozen, "Account is frozen");
        require(self.balance >= msg.amount, "Insufficient balance");
        
        // Decrement balance
        self.balance = self.balance - msg.amount;

        let winit: StateInit = initOf VoraJettonWallet(msg.destination, self.master);
        let walletAddress: Address = contractAddress(winit);

        send(SendParameters{
            to: walletAddress, 
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: TokenTransferInternal{
                queryId: msg.queryId,
                amount: msg.amount,
                from: self.owner,
                response_destination: msg.response_destination,
                forward_ton_amount: msg.forward_ton_amount,
                forward_payload: msg.forward_payload
            }.toCell(),
            code: winit.code,
            data: winit.data
        });
    }

    receive(msg: TokenTransferInternal) {
        let ctx: Context = context();
        
        if (ctx.sender != self.master) {
            let sinit: StateInit = initOf VoraJettonWallet(msg.from, self.master);
            require(contractAddress(sinit) == ctx.sender, "Invalid sender");
        }

        self.balance = self.balance + msg.amount;

        let msgValue: Int = ctx.value;
        let fwdFee: Int = ctx.readForwardFee();
        
        // Notify recipient if needed
        if (msg.forward_ton_amount > 0) {
            msgValue = msgValue - msg.forward_ton_amount - fwdFee;
            send(SendParameters{
                to: self.owner,
                value: msg.forward_ton_amount,
                mode: SendIgnoreErrors, 
                bounce: false,
                body: TokenNotification{
                    queryId: msg.queryId,
                    amount: msg.amount,
                    from: msg.from,
                    forward_payload: msg.forward_payload
                }.toCell()
            });
        }

        // Return excesses
        if (msg.response_destination != null && msgValue > 0) {
            send(SendParameters{
                to: msg.response_destination!!, 
                value: 0, // Should be msgValue
                mode: SendIgnoreErrors | SendRemainingValue, 
                bounce: false,
                body: TokenExcesses{ queryId: msg.queryId }.toCell()
            });
        }
    }

    receive(msg: TokenBurn) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender");
        require(!self.is_frozen, "Account is frozen");
        require(self.balance >= msg.amount, "Insufficient balance");

        self.balance = self.balance - msg.amount;

        send(SendParameters{
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: TokenBurnNotification{
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                response_destination: msg.response_destination
            }.toCell()
        });
    }

    receive(msg: WalletSetStatus) {
        let ctx: Context = context();
        require(ctx.sender == self.master, "Invalid sender");
        self.is_frozen = msg.is_frozen;
    }

    receive(msg: SetPublicKey) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender");
        self.public_key = msg.public_key;
    }

    receive(msg: RelayedTransfer) {
        let ctx: Context = context();
        require(!self.is_frozen, "Account is frozen");
        require(self.public_key != null, "Public key not set");
        require(now() <= msg.valid_until, "Signature expired");
        
        let total_amount: Int = msg.amount + msg.relayer_fee;
        require(self.balance >= total_amount, "Insufficient balance");

        // Verify signature
        let hash: Int = beginCell()
            .storeUint(msg.queryId, 64)
            .storeCoins(msg.amount)
            .storeAddress(msg.destination)
            .storeCoins(msg.relayer_fee)
            .storeUint(msg.valid_until, 32)
            .endCell().hash();
            
        require(checkSignature(hash, msg.signature, self.public_key!!), "Invalid signature");

        // Deduct total balance
        self.balance = self.balance - total_amount;

        // Pay relayer fee to sender (Relayer)
        if (msg.relayer_fee > 0) {
            let relayerWinit: StateInit = initOf VoraJettonWallet(ctx.sender, self.master);
            send(SendParameters{
                to: contractAddress(relayerWinit),
                value: ton("0.015"), // minimal forward ton for fee transfer
                bounce: false, // Don't bounce relayer fees to simplify
                mode: SendIgnoreErrors,
                body: TokenTransferInternal{
                    queryId: msg.queryId,
                    amount: msg.relayer_fee,
                    from: self.owner,
                    response_destination: null,
                    forward_ton_amount: 0,
                    forward_payload: emptySlice()
                }.toCell(),
                code: relayerWinit.code,
                data: relayerWinit.data
            });
        }

        // Perform actual transfer
        let destWinit: StateInit = initOf VoraJettonWallet(msg.destination, self.master);
        send(SendParameters{
            to: contractAddress(destWinit), 
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: TokenTransferInternal{
                queryId: msg.queryId,
                amount: msg.amount,
                from: self.owner,
                response_destination: msg.response_destination,
                forward_ton_amount: msg.forward_ton_amount,
                forward_payload: msg.forward_payload
            }.toCell(),
            code: destWinit.code,
            data: destWinit.data
        });
    }

    // Bounced transfers MUST be handled
    bounced(src: bounced<TokenTransferInternal>) {
        self.balance = self.balance + src.amount;
    }

    bounced(src: bounced<TokenBurnNotification>) {
        self.balance = self.balance + src.amount;
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            walletCode: initOf VoraJettonWallet(self.owner, self.master).code
        };
    }
}
