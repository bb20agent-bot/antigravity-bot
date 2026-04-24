import { TonClient, WalletContractV4, toNano, Address } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import * as fs from 'fs';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { VoraToken } from "../contracts/build/VoraToken_VoraToken";

async function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function main() {
    const endpoint = await getHttpEndpoint({ network: "mainnet" });
    const client = new TonClient({ endpoint });

    // 1. Setup Deployer
    const mnemonic = fs.readFileSync('.env.deployer.mainnet', 'utf-8').trim().split(/\s+/);
    const key = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);

    const MASTER_ADDR = Address.parse("EQAnhvO5Ibsrt3AY6DXJvdEPEfTogFN4ZGeo0NhSEKTySpyf");
    const voraMaster = client.open(VoraToken.fromAddress(MASTER_ADDR));

    // 2. Stop Minting (Final Lock)
    console.log("🔒 Locking VORA Supply Permanent...");
    try {
        let seqno = await walletContract.getSeqno();
        await voraMaster.send(walletSender, { value: toNano("0.1") }, "Stop Mint");
        
        console.log("Waiting for lock confirmation...");
        while (await walletContract.getSeqno() == seqno) {
            await sleep(2000);
        }
        console.log("✅ VORA Supply is now PERMANENTLY LOCKED.");
    } catch (e) {
        console.error("Locking error (might be already locked):", e);
    }

    // 3. Final Verification
    const result = await client.runMethod(MASTER_ADDR, "get_jetton_data");
    console.log("Final Total Supply:", result.stack.readBigNumber().toString());
    console.log("Final Mintable Status:", result.stack.readBoolean());
}

main().catch(console.error);
