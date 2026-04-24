import { TonClient4, WalletContractV4, toNano, Address, beginCell } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import * as fs from 'fs';
import { VoraToken } from "../contracts/build/VoraToken_VoraToken";
import { VoraTreasury_v4 } from "../contracts/build/VoraTreasury_VoraTreasury_v4";

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

    // 2. Define Unique Content for V2 (to avoid address collision)
    // We add a versioning cell to the content init parameter
    const v2Content = beginCell().storeStringTail("VORA Ecosystem V2 - Governance Locked").endCell();
    
    // 3. Define Target Addresses
    const TARGET_TEAM = Address.parse("UQBQnrwILbIPyzrn0v2AdmRy88xUofLLouoUT3JOSZJr36HN");
    const TARGET_IDO_STRATEGY = Address.parse("UQClOfWpWo5wMDSWJsgaVJmbVQ_NsH-s2tmHlv-qQ4CZU8S4");
    const TARGET_INCENTIVE = Address.parse("UQBVqEg6jAOyikibGTMV_nVvSj9oUCBl6uWIxzATeI1P1pdu");
    
    const ADDR_STRATEGY = TARGET_IDO_STRATEGY;
    const ADDR_DEV = TARGET_TEAM;
    const ADDR_DEX = Address.parse("UQBQnrwILbIPyzrn0v2AdmRy88xUofLLouoUT3JOSZJr36HN");
    const ADDR_TECH = Address.parse("UQBVqEg6jAOyikibGTMV_nVvSj9oUCBl6uWIxzATeI1P1pdu");
    const ADDR_P2P = TARGET_TEAM;

    // 4. Resolve New Addresses
    const voraMaster = client.open(await VoraToken.fromInit(wallet.address, v2Content));
    const voraTreasury = client.open(await VoraTreasury_v4.fromInit(wallet.address, ADDR_STRATEGY, ADDR_DEV, ADDR_DEX, ADDR_TECH, ADDR_P2P));
    
    console.log("💎 NEW VORA Master V2:", voraMaster.address.toString());
    console.log("🏛️ NEW VORA Treasury V4:", voraTreasury.address.toString());

    async function sendTx(contract: any, body: any, label: string) {
        let seqno = await walletContract.getSeqno();
        console.log(`Sending: ${label} (Wallet Seqno: ${seqno})...`);
        await contract.send(walletSender, { value: toNano("0.3") }, body);
        
        while (await walletContract.getSeqno() == seqno) {
            await sleep(2500);
        }
        console.log(`✅ ${label} Confirmed.`);
    }

    // 5. Execution
    console.log("🚀 Starting Clean Start V2 Deployment...");
    await sendTx(voraMaster, { $$type: 'Deploy', queryId: 0n }, "Deploy Master V2");
    await sendTx(voraTreasury, { $$type: 'Deploy', queryId: 0n }, "Deploy Treasury V4");

    const MINT_TEAM = toNano("200000000");      
    const MINT_IDO = toNano("100000000");       
    const MINT_INCENTIVE = toNano("10000000");  
    const MINT_TREASURY = toNano("690000000");   

    await sendTx(voraMaster, { $$type: 'Mint', amount: MINT_TEAM, receiver: TARGET_TEAM }, "Mint Team (200M)");
    await sendTx(voraMaster, { $$type: 'Mint', amount: MINT_IDO, receiver: TARGET_IDO_STRATEGY }, "Mint IDO (100M)");
    await sendTx(voraMaster, { $$type: 'Mint', amount: MINT_INCENTIVE, receiver: TARGET_INCENTIVE }, "Mint Incentive (10M)");
    await sendTx(voraMaster, { $$type: 'Mint', amount: MINT_TREASURY, receiver: voraTreasury.address }, "Mint Treasury (690M)");

    console.log("🔒 Final Step: Killing Minting Privileges...");
    await sendTx(voraMaster, "Stop Mint", "Lock Supply");
    
    console.log("🌟 VORA V2 Launch Successful! Supply is 1B fixed.");
}

main().catch(console.error);
