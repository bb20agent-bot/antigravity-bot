import { TonClient, WalletContractV4, toNano, Address } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import * as fs from 'fs';
import { VoraToken } from "../contracts/build/VoraToken_VoraToken";
import { VoraTreasury_v4 } from "../contracts/build/VoraTreasury_VoraTreasury_v4";

import { getHttpEndpoint } from "@orbs-network/ton-access";

async function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function main() {
    // 1. Setup Client with Ton Access
    const endpoint = await getHttpEndpoint({ network: "mainnet" });
    const client = new TonClient({ endpoint });

    // 1. Setup Deployer
    const mnemonic = fs.readFileSync('.env.deployer.mainnet', 'utf-8').trim().split(/\s+/);
    const key = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);

    console.log("🚀 Deployer Address:", wallet.address.toString());

    // 2. Define Target Addresses
    const TARGET_TEAM = Address.parse("UQBQnrwILbIPyzrn0v2AdmRy88xUofLLouoUT3JOSZJr36HN");
    const TARGET_IDO_STRATEGY = Address.parse("UQClOfWpWo5wMDSWJsgaVJmbVQ_NsH-s2tmHlv-qQ4CZU8S4");
    const TARGET_INCENTIVE = Address.parse("UQBVqEg6jAOyikibGTMV_nVvSj9oUCBl6uWIxzATeI1P1pdu");
    
    // Addresses for Treasury v4 Constructor
    const ADDR_STRATEGY = TARGET_IDO_STRATEGY;
    const ADDR_DEV = TARGET_TEAM;
    const ADDR_DEX = Address.parse("UQBQnrwILbIPyzrn0v2AdmRy88xUofLLouoUT3JOSZJr36HN");
    const ADDR_TECH = Address.parse("UQBVqEg6jAOyikibGTMV_nVvSj9oUCBl6uWIxzATeI1P1pdu");
    const ADDR_P2P = TARGET_TEAM;

    // 3. Deploy Master V2
    const voraMaster = client.open(await VoraToken.fromInit(wallet.address, null));
    console.log("💎 VORA Master V2 Address:", voraMaster.address.toString());
    
    // 4. Deploy Treasury V4
    const voraTreasury = client.open(await VoraTreasury_v4.fromInit(wallet.address, ADDR_STRATEGY, ADDR_DEV, ADDR_DEX, ADDR_TECH, ADDR_P2P));
    console.log("🏛️ VORA Treasury V4 Address:", voraTreasury.address.toString());

    async function sendTx(contract: any, body: any) {
        let seqno = await walletContract.getSeqno();
        await contract.send(walletSender, { value: toNano("0.2") }, body);
        console.log("Waiting for seqno to increment from", seqno, "...");
        while (await walletContract.getSeqno() == seqno) {
            await sleep(1500);
        }
    }

    console.log("🚀 Deploying Master and Treasury...");
    await sendTx(voraMaster, { $$type: 'Deploy', queryId: 0n });
    await sendTx(voraTreasury, { $$type: 'Deploy', queryId: 0n });

    // 5. Genesis Distribution (1,000,000,000 VORA)
    console.log("💰 Starting Genesis Distribution...");
    
    const MINT_TEAM = toNano("200000000");      // 200M (Team/Price Defense)
    const MINT_IDO = toNano("100000000");       // 100M (IDO Strategy)
    const MINT_INCENTIVE = toNano("10000000");  // 10M (Airdrop/Incentive)
    const MINT_TREASURY = toNano("690000000");   // 690M (Ecosystem Pool)

    await sendTx(voraMaster, { $$type: 'Mint', amount: MINT_TEAM, receiver: TARGET_TEAM });
    console.log("✅ Minted 200M to Team (Price Defense)");
    
    await sendTx(voraMaster, { $$type: 'Mint', amount: MINT_IDO, receiver: TARGET_IDO_STRATEGY });
    console.log("✅ Minted 100M to IDO Strategy");
    
    await sendTx(voraMaster, { $$type: 'Mint', amount: MINT_INCENTIVE, receiver: TARGET_INCENTIVE });
    console.log("✅ Minted 10M to Incentive Address");
    
    await sendTx(voraMaster, { $$type: 'Mint', amount: MINT_TREASURY, receiver: voraTreasury.address });
    console.log("✅ Minted 690M to Treasury V4 Locker");

    // 6. Lock Supply Permanent
    console.log("🔒 Locking Supply Permanent...");
    await sendTx(voraMaster, "StopMint");
    
    console.log("🌟 VORA Ecosystem Genesis Complete. Total Supply: 1,000,000,000 (FIXED)");
}

main().catch(console.error);
