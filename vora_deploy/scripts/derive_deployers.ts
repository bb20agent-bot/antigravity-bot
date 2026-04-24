import { mnemonicToPrivateKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import * as fs from 'fs';

async function derive(filename: string) {
    if (!fs.existsSync(filename)) return;
    const seed = fs.readFileSync(filename, 'utf8').trim();
    const mnemonic = seed.split(' ');
    const key = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    console.log(`${filename}: ${wallet.address.toString()}`);
}

async function main() {
    await derive('.env.deployer');
    await derive('.env.deployer.mainnet');
}

main().catch(console.error);
