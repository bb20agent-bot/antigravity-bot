import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { mnemonicToPrivateKey, mnemonicNew } from "@ton/crypto";
import { Address } from "@ton/core";
import * as fs from 'fs';

import { VoraToken } from "../contracts/build/VoraToken_VoraToken.ts";
import { Treasury } from "../contracts/build/Treasury_Treasury.ts";
import { Escrow } from "../contracts/build/Escrow_Escrow.ts";
import { VestingVault } from "../contracts/build/VestingVault_VestingVault.ts";

async function main() {
    // 1. Initialize TON testnet client
    const endpoint = "https://testnet.toncenter.com/api/v2/jsonRPC";
    const client = new TonClient({ endpoint });

    // 2. Load or create deployer wallet
    let mnemonicStrings: string[];
    if (fs.existsSync('.env.deployer')) {
        mnemonicStrings = fs.readFileSync('.env.deployer', 'utf-8').split(' ');
        console.log("Loaded existing deployer wallet from .env.deployer");
    } else {
        mnemonicStrings = await mnemonicNew();
        fs.writeFileSync('.env.deployer', mnemonicStrings.join(' '));
        console.log("Created new deployer wallet and saved to .env.deployer");
    }

    const key = await mnemonicToPrivateKey(mnemonicStrings);
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);

    console.log("Deployer Wallet Address:", wallet.address.toString());
    const balance = await client.getBalance(wallet.address);
    console.log("Deployer Wallet Balance:", balance.toString());

    if (balance === 0n) {
        console.log("⚠️  Wallet is empty! Please send some Testnet TON to this address before deploying.");
        console.log("Get testnet TON from https://t.me/testgiver_ton_bot");
        return;
    }

    console.log("\nStarting Deployment...\n");

    const owner = wallet.address;

    // 3. Deploy Treasury
    const treasury = client.open(await Treasury.fromInit(owner));
    console.log("Treasury Address:", treasury.address.toString());

    // Check if Treasury is already deployed
    if (!(await client.isContractDeployed(treasury.address))) {
        console.log("Deploying Treasury...");
        await treasury.send(
            walletSender,
            { value: 50000000n }, // 0.05 TON
            null // Standard deploy message format can just be empty for Deployable trait if handled, or call the explicit deploy receiver
        );
        // Tact Deployable trait reacts to "Deploy" (opcode 0x946a98b6) via standard text or struct...
        // Sending standard message
        await treasury.send(walletSender, { value: 50000000n }, { $$type: 'Deploy', queryId: 0n });
        console.log("Waiting for Treasury to deploy...");
        await new Promise(r => setTimeout(r, 10000));
    } else {
        console.log("Treasury already deployed!");
    }

    // 4. Deploy VoraToken
    const voraToken = client.open(await VoraToken.fromInit(owner, treasury.address));
    console.log("VoraToken Address:", voraToken.address.toString());

    if (!(await client.isContractDeployed(voraToken.address))) {
        console.log("Deploying VoraToken...");
        await voraToken.send(walletSender, { value: 50000000n }, { $$type: 'Deploy', queryId: 0n });
        console.log("Waiting for VoraToken to deploy...");
        await new Promise(r => setTimeout(r, 10000));
    } else {
        console.log("VoraToken already deployed!");
    }

    // 5. Link VoraToken to Treasury
    console.log("Sending SetVoraTokenAddress to Treasury...");
    await treasury.send(walletSender, { value: 50000000n }, {
        $$type: 'SetVoraTokenAddress',
        voraTokenAddress: voraToken.address
    });
    console.log("Waiting for transaction...");
    await new Promise(r => setTimeout(r, 5000));

    // 6. Deploy Escrow
    const escrow = client.open(await Escrow.fromInit(owner, treasury.address, voraToken.address));
    console.log("Escrow Address:", escrow.address.toString());

    if (!(await client.isContractDeployed(escrow.address))) {
        console.log("Deploying Escrow...");
        await escrow.send(walletSender, { value: 50000000n }, { $$type: 'Deploy', queryId: 0n });
        console.log("Waiting for Escrow to deploy...");
        await new Promise(r => setTimeout(r, 10000));
    } else {
        console.log("Escrow already deployed!");
    }

    // 7. Deploy VestingVault
    const vestingVault = client.open(await VestingVault.fromInit(owner, voraToken.address));
    console.log("VestingVault Address:", vestingVault.address.toString());

    if (!(await client.isContractDeployed(vestingVault.address))) {
        console.log("Deploying VestingVault...");
        await vestingVault.send(walletSender, { value: 50000000n }, { $$type: 'Deploy', queryId: 0n });
        console.log("Waiting for VestingVault to deploy...");
        await new Promise(r => setTimeout(r, 10000));
    } else {
        console.log("VestingVault already deployed!");
    }

    console.log("\nDeployment Process Completed!");
    console.log("Save these addresses into the backend bot settings:");
    console.log(`VORA_TOKEN_ADDRESS = "${voraToken.address.toString()}"`);
    console.log(`TREASURY_ADDRESS = "${treasury.address.toString()}"`);
    console.log(`ESCROW_ADDRESS = "${escrow.address.toString()}"`);
    console.log(`VESTING_VAULT_ADDRESS = "${vestingVault.address.toString()}"`);
}

main().catch(console.error);
