import { TonClient, WalletContractV4, toNano } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import * as fs from 'fs';
import { VoraToken } from "../contracts/build/VoraToken_VoraToken.ts";

async function main() {
    console.log("Starting simple deployment with 10s delay...");
    await new Promise(r => setTimeout(r, 10000));
    
    const client = new TonClient({ endpoint: "https://toncenter.com/api/v2/jsonRPC" });
    const mnemonic = fs.readFileSync('.env.deployer.mainnet', 'utf-8').trim().split(/\s+/);
    const key = await mnemonicToPrivateKey(mnemonic);
    const wallet = client.open(WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 }));
    const sender = wallet.sender(key.secretKey);

    console.log("Wallet address:", wallet.address.toString());
    
    // Minimal interaction to avoid 429
    const voraToken = client.open(await VoraToken.fromInit(wallet.address, null));
    console.log("Token address (predicted):", voraToken.address.toString());
    
    await voraToken.send(sender, { value: toNano("0.2") }, { $$type: 'Deploy', queryId: 0n });
    console.log("Deployment message sent. Check Tonscan.");
}
main().catch(console.error);
