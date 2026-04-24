import * as dotenv from 'dotenv';
dotenv.config();
import { TonClient, WalletContractV4, toNano, Address } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import * as fs from 'fs';
import { VoraToken } from "../contracts/build/VoraToken_VoraToken.ts";
import { VoraTreasury } from "../contracts/build/VoraTreasury_VoraTreasury.ts";
import { P2PEscrow } from "../contracts/build/P2PEscrow_P2PEscrow.ts";
import { SubscriptionRouter } from "../contracts/build/SubscriptionRouter_SubscriptionRouter.ts";

async function main() {
    const apiKey = "ee30cb89189b4b087702a5e7896db8dabb20fabef758c6b958240a43e8b0f01c";
    const client = new TonClient({ 
        endpoint: "https://toncenter.com/api/v2/jsonRPC",
        apiKey: apiKey
    });

    async function wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function callWithRetry<T>(fn: () => Promise<T>): Promise<T> {
        for (let i = 0; i < 5; i++) {
            try {
                // With API key, we should have 10 RPS, so 1s wait is plenty.
                await wait(1000); 
                return await fn();
            } catch (e: any) {
                if (e?.response?.status === 429) {
                    console.log("Rate limited, waiting 5s...");
                    await wait(5000);
                    continue;
                }
                throw e;
            }
        }
        throw new Error("Max retries");
    }

    if (!fs.existsSync('.env.deployer.mainnet')) {
        console.error("Deployer mnemonic not found");
        return;
    }
    const mnemonic = fs.readFileSync('.env.deployer.mainnet', 'utf-8').trim().split(/\s+/);
    const key = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);

    console.log("Deployer:", wallet.address.toString());
    const balance = await callWithRetry(() => client.getBalance(wallet.address));
    console.log("Balance:", Number(balance) / 1e9, "TON");

    if (balance < toNano("0.5")) {
        console.log("Insufficient balance. Need ~0.5 TON.");
        return;
    }

    const owner = wallet.address;

    console.log("Deploying Treasury...");
    const treasury = client.open(await VoraTreasury.fromInit(owner));
    if (!(await callWithRetry(() => client.isContractDeployed(treasury.address)))) {
        await treasury.send(walletSender, { value: toNano("0.1") }, { $$type: 'Deploy', queryId: 0n });
        console.log("Treasury msg sent:", treasury.address.toString());
        await wait(20000);
    } else {
        console.log("Treasury exists:", treasury.address.toString());
    }

    console.log("Deploying Token...");
    const token = client.open(await VoraToken.fromInit(owner, null));
    if (!(await callWithRetry(() => client.isContractDeployed(token.address)))) {
        await token.send(walletSender, { value: toNano("0.15") }, { $$type: 'Deploy', queryId: 0n });
        console.log("Token msg sent:", token.address.toString());
        await wait(20000);
    } else {
        console.log("Token exists:", token.address.toString());
    }

    console.log("Minting to Treasury...");
    const supply1B = 1000000000000000000n;
    await token.send(walletSender, { value: toNano("0.1") }, { 
        $$type: 'Mint', 
        amount: supply1B, 
        receiver: treasury.address 
    });
    console.log("Mint msg sent.");
    await wait(15000);

    console.log("Deploying Router...");
    const router = client.open(await SubscriptionRouter.fromInit(owner));
    if (!(await callWithRetry(() => client.isContractDeployed(router.address)))) {
        await router.send(walletSender, { value: toNano("0.1") }, { $$type: 'Deploy', queryId: 0n });
        console.log("Router msg sent:", router.address.toString());
        await wait(15000);
    } else {
        console.log("Router exists:", router.address.toString());
    }

    console.log("Deploying Escrow...");
    const escrow = client.open(await P2PEscrow.fromInit(owner));
    if (!(await callWithRetry(() => client.isContractDeployed(escrow.address)))) {
        await escrow.send(walletSender, { value: toNano("0.1") }, { $$type: 'Deploy', queryId: 0n });
        console.log("Escrow msg sent:", escrow.address.toString());
        await wait(15000);
    } else {
        console.log("Escrow exists:", escrow.address.toString());
    }

    console.log("\nDEPLOYED SUCCESSFULLY");
    console.log("TOKEN:", token.address.toString());
    console.log("TREASURY:", treasury.address.toString());
    console.log("ROUTER:", router.address.toString());
    console.log("ESCROW:", escrow.address.toString());
}

main().catch(console.error);
