import { TonClient, WalletContractV4, toNano } from "@ton/ton";
import { mnemonicToPrivateKey, mnemonicNew } from "@ton/crypto";
import * as fs from 'fs';
import { Address } from "@ton/core";

import { VoraToken } from "../contracts/build/VoraToken_VoraToken.ts";
import { VoraTreasury } from "../contracts/build/VoraTreasury_VoraTreasury.ts";
import { P2PEscrow } from "../contracts/build/P2PEscrow_P2PEscrow.ts";
import { SubscriptionRouter } from "../contracts/build/SubscriptionRouter_SubscriptionRouter.ts";

async function main() {
    // 1. Initialize TON MAINNET client
    const endpoint = "https://toncenter.com/api/v2/jsonRPC";
    const client = new TonClient({ endpoint });

    // 2. Load deployer wallet
    let mnemonicStrings: string[];
    if (fs.existsSync('.env.deployer.mainnet')) {
        mnemonicStrings = fs.readFileSync('.env.deployer.mainnet', 'utf-8').trim().split(/\s+/);
        console.log("Loaded existing deployer wallet from .env.deployer.mainnet");
    } else {
        mnemonicStrings = await mnemonicNew();
        fs.writeFileSync('.env.deployer.mainnet', mnemonicStrings.join(' '));
        console.log("Created new deployer wallet and saved to .env.deployer.mainnet (KEEP THIS SAFE!)");
    }

    const key = await mnemonicToPrivateKey(mnemonicStrings);
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);

    console.log("=========================================");
    console.log("Deployer Wallet Address:", wallet.address.toString());
    const balance = await client.getBalance(wallet.address);
    console.log("Deployer Wallet Balance:", Number(balance) / 1e9, "TON");
    console.log("=========================================\n");

    if (balance < toNano("1.0")) { // Need ~1.0 TON for total deployment and setup
        console.log("⚠️  Wallet balance is too low! Please send at least 1.0 TON to this address on MAINNET.");
        return;
    }

    console.log("Starting VORA Production Deployment...\n");

    const owner = wallet.address;

    // 3. Deploy VoraTreasury
    const treasury = client.open(await VoraTreasury.fromInit(owner));
    console.log("Treasury Address:", treasury.address.toString());

    if (!(await client.isContractDeployed(treasury.address))) {
        console.log("Deploying VoraTreasury...");
        await treasury.send(walletSender, { value: toNano("0.1") }, { $$type: 'Deploy', queryId: 0n });
        await new Promise(r => setTimeout(r, 20000));
    } else {
        console.log("Treasury already deployed!");
    }

    // 4. Deploy VoraToken (Jetton Master)
    // No initial metadata content for simplicity, can be updated later
    const voraToken = client.open(await VoraToken.fromInit(owner, null));
    console.log("VoraToken (Jetton Master) Address:", voraToken.address.toString());

    if (!(await client.isContractDeployed(voraToken.address))) {
        console.log("Deploying VoraToken...");
        await voraToken.send(walletSender, { value: toNano("0.1") }, { $$type: 'Deploy', queryId: 0n });
        await new Promise(r => setTimeout(r, 20000));
    } else {
        console.log("VoraToken already deployed!");
    }

    // 5. Deploy P2PEscrow
    const p2pEscrow = client.open(await P2PEscrow.fromInit(owner, treasury.address, voraToken.address));
    console.log("P2PEscrow Address:", p2pEscrow.address.toString());

    if (!(await client.isContractDeployed(p2pEscrow.address))) {
        console.log("Deploying P2PEscrow...");
        await p2pEscrow.send(walletSender, { value: toNano("0.1") }, { $$type: 'Deploy', queryId: 0n });
        await new Promise(r => setTimeout(r, 20000));
    }

    // 6. Mint 1,000,000,000 VORA to VoraTreasury
    console.log("Minting 1 Billion VORA to Treasury...");
    const TOTAL_SUPPLY = toNano("1000000000"); // 1B with 9 decimals (standard coins)
    await voraToken.send(walletSender, { value: toNano("0.05") }, {
        $$type: 'Mint',
        amount: TOTAL_SUPPLY,
        receiver: treasury.address
    });
    console.log("Waiting for minting confirmation...");
    await new Promise(r => setTimeout(r, 15000));

    console.log("\n✅ VORA Production Deployment Completed!");
    console.log("-----------------------------------------");
    console.log(`VORA_TOKEN_ADDRESS = "${voraToken.address.toString()}"`);
    console.log(`VORA_TREASURY_ADDRESS = "${treasury.address.toString()}"`);
    console.log(`P2P_ESCROW_ADDRESS = "${p2pEscrow.address.toString()}"`);
    console.log("-----------------------------------------");

    // Update .env with new addresses
    const envUpdate = `
# VORA Final Contract Addresses
VORA_TOKEN_ADDRESS=${voraToken.address.toString()}
VORA_TREASURY_ADDRESS=${treasury.address.toString()}
P2P_ESCROW_ADDRESS=${p2pEscrow.address.toString()}
    `;
    fs.appendFileSync('.env', envUpdate);
    console.log("Updated .env with contract addresses.");
}

main().catch(console.error);
