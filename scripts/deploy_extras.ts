import { TonClient4, WalletContractV4, toNano, Address } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import * as fs from 'fs';
import { Escrow_v2 } from "../contracts/build/Escrow_v2_Escrow_v2";
import { SubscriptionRouter } from "../contracts/build/SubscriptionRouter_v2_SubscriptionRouter";

async function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function main() {
    const client = new TonClient4({ endpoint: "https://mainnet-v4.tonhubapi.com" });

    // 1. Setup Deployer
    const mnemonic = fs.readFileSync('.env.deployer.mainnet', 'utf-8').trim().split(/\s+/);
    const key = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);

    console.log("🚀 Deployer Address:", wallet.address.toString());

    // 2. Deploy Subscription Router V2
    const voraRouter = client.open(await SubscriptionRouter.fromInit(wallet.address));
    console.log("📡 Subscription Router V2 Address:", voraRouter.address.toString());
    
    // 3. Deploy Escrow V2
    const voraEscrow = client.open(await Escrow_v2.fromInit(wallet.address, voraRouter.address));
    console.log("🛡️ Escrow V2 Address:", voraEscrow.address.toString());

    async function sendTx(contract: any, body: any, label: string) {
        let seqno = await walletContract.getSeqno();
        console.log(`Sending: ${label} (Wallet Seqno: ${seqno})...`);
        await contract.send(walletSender, { value: toNano("0.25") }, body);
        while (await walletContract.getSeqno() == seqno) {
            await sleep(2500);
        }
        console.log(`✅ ${label} Confirmed.`);
    }

    console.log("🚀 Launching Final Components...");
    await sendTx(voraRouter, { $$type: 'Deploy', queryId: 0n }, "Deploy Router V2");
    await sendTx(voraEscrow, { $$type: 'Deploy', queryId: 0n }, "Deploy Escrow V2");

    console.log("🌟 Master Block Components Deployed Successfully.");
}

main().catch(console.error);
