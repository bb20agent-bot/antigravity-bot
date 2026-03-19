import { TonClient, WalletContractV4 } from "@ton/ton";
import { mnemonicToPrivateKey, mnemonicNew } from "@ton/crypto";
import * as fs from 'fs';

import { VoraToken } from "../contracts/build/VoraToken_VoraToken.ts";
import { Treasury } from "../contracts/build/Treasury_Treasury.ts";
import { Escrow } from "../contracts/build/Escrow_Escrow.ts";
import { VestingVault } from "../contracts/build/VestingVault_VestingVault.ts";

async function main() {
    // 1. Initialize TON MAINNET client
    const endpoint = "https://toncenter.com/api/v2/jsonRPC"; // Ensure you get an API key if rate limited
    const client = new TonClient({ endpoint });

    // 2. Load or create deployer wallet
    let mnemonicStrings: string[];
    if (fs.existsSync('.env.deployer.mainnet')) {
        mnemonicStrings = fs.readFileSync('.env.deployer.mainnet', 'utf-8').split(' ');
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

    if (balance < 500000000n) { // Need at least ~0.5 TON to deploy all 4 contracts safely
        console.log("⚠️  Wallet balance is too low! Please send at least 0.5 TON to this address on MAINNET before deploying.");
        return;
    }

    console.log("Starting MAINNET Deployment...\n");

    const owner = wallet.address;

    // 3. Deploy Treasury
    const treasury = client.open(await Treasury.fromInit(owner));
    console.log("Treasury Address:", treasury.address.toString());

    if (!(await client.isContractDeployed(treasury.address))) {
        console.log("Deploying Treasury...");
        await treasury.send(walletSender, { value: 60000000n }, { $$type: 'Deploy', queryId: 0n });
        await new Promise(r => setTimeout(r, 15000));
    } else {
        console.log("Treasury already deployed!");
    }

    // 4. Deploy VoraToken (Jetton Master)
    // Pass null for metadata content for now, can be updated later via TokenUpdateContent msg
    const voraToken = client.open(await VoraToken.fromInit(owner, null));
    console.log("VoraToken (Jetton Master) Address:", voraToken.address.toString());

    if (!(await client.isContractDeployed(voraToken.address))) {
        console.log("Deploying VoraToken...");
        await voraToken.send(walletSender, { value: 60000000n }, { $$type: 'Deploy', queryId: 0n });
        await new Promise(r => setTimeout(r, 15000));
    } else {
        console.log("VoraToken already deployed!");
    }

    // 5. Link VoraToken to Treasury
    console.log("Linking VoraToken inside Treasury...");
    await treasury.send(walletSender, { value: 30000000n }, {
        $$type: 'SetVoraTokenAddress',
        voraTokenAddress: voraToken.address
    });
    await new Promise(r => setTimeout(r, 10000));

    // 6. Deploy Escrow
    const escrow = client.open(await Escrow.fromInit(owner, treasury.address, voraToken.address));
    console.log("Escrow Address:", escrow.address.toString());

    if (!(await client.isContractDeployed(escrow.address))) {
        console.log("Deploying Escrow...");
        await escrow.send(walletSender, { value: 60000000n }, { $$type: 'Deploy', queryId: 0n });
        await new Promise(r => setTimeout(r, 15000));
    } else {
        console.log("Escrow already deployed!");
    }

    // 7. Deploy VestingVault
    const vestingVault = client.open(await VestingVault.fromInit(owner, voraToken.address));
    console.log("VestingVault Address:", vestingVault.address.toString());

    if (!(await client.isContractDeployed(vestingVault.address))) {
        console.log("Deploying VestingVault...");
        await vestingVault.send(walletSender, { value: 60000000n }, { $$type: 'Deploy', queryId: 0n });
        await new Promise(r => setTimeout(r, 15000));
    } else {
        console.log("VestingVault already deployed!");
    }

    console.log("\n✅ MAINNET Deployment Process Completed!");
    console.log("Please save these contract addresses for frontend integration:");
    console.log(`VORA_TOKEN_ADDRESS = "${voraToken.address.toString()}"`);
    console.log(`TREASURY_ADDRESS = "${treasury.address.toString()}"`);
    console.log(`ESCROW_ADDRESS = "${escrow.address.toString()}"`);
    console.log(`VESTING_VAULT_ADDRESS = "${vestingVault.address.toString()}"`);
}

main().catch(console.error);
