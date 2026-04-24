import { mnemonicToPrivateKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import * as dotenv from 'dotenv';
import * as fs from 'fs';

async function main() {
    const envPath = 'binance_bot/.env';
    if (!fs.existsSync(envPath)) {
        console.error("No .env found in binance_bot/");
        return;
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/BOT_HOT_WALLET_SEED=(.*)/);
    if (!match) {
        console.error("BOT_HOT_WALLET_SEED not found in .env");
        return;
    }
    
    const seed = match[1].trim();
    const mnemonic = seed.split(' ');
    
    try {
        const key = await mnemonicToPrivateKey(mnemonic);
        const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
        console.log("Derived Address (V4):", wallet.address.toString());
    } catch (e) {
        console.error("Error deriving address from seed:", e.message);
    }
}

main().catch(console.error);
