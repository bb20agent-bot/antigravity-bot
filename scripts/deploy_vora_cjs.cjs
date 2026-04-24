const { TonClient, WalletContractV4, toNano, Address, beginCell } = require("@ton/ton");
const { mnemonicToPrivateKey, mnemonicNew } = require("@ton/crypto");
const fs = require("fs");
const path = require("path");

async function main() {
    const endpoint = "https://toncenter.com/api/v2/jsonRPC";
    const client = new TonClient({ endpoint });

    // Load mnemonic
    let mnemonic;
    if (fs.existsSync(".env.deployer.mainnet")) {
        mnemonic = fs.readFileSync(".env.deployer.mainnet", "utf-8").trim().split(/\s+/);
    } else {
        console.error("Deployer mnemonic not found in .env.deployer.mainnet");
        return;
    }

    const key = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);

    console.log("Deployer Wallet:", wallet.address.toString());
    const balance = await client.getBalance(wallet.address);
    console.log("Balance:", Number(balance) / 1e9, "TON");

    if (balance < toNano("1.0")) {
        console.log("Insufficient balance for deployment (~1.0 TON needed).");
        return;
    }

    // Load PKG files (Directly from build artifacts)
    const treasuryPkg = JSON.parse(fs.readFileSync("./contracts/build/VoraTreasury_VoraTreasury.pkg", "utf-8"));
    const voraTokenPkg = JSON.parse(fs.readFileSync("./contracts/build/VoraToken_VoraToken.pkg", "utf-8"));

    console.log("Ready to deploy VoraTreasury and VoraToken...");
    
    // In CJS/Pure JS without wrappers, we can use the `Contract` class from @ton/ton or @ton/core
    // But it's easier to just use the wrappers if we can fix them.
    // Since I can't easily fix the wrappers, I'll use a simplified deployment logic.
    
    // Deployment of Tact contracts usually involves:
    // 1. Sending BOC of StateInit
    // 2. Sending optional body
    
    // I'll stop here and try to run a simple TON balance check first to confirm the wallet is funded.
}

main().catch(console.error);
