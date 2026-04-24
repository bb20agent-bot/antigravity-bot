import { TonClient, WalletContractV4, WalletContractV3R2, beginCell, Cell, Dictionary, Address } from "@ton/ton";
import { mnemonicToPrivateKey, sha256_sync } from "@ton/crypto";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import * as fs from 'fs';

async function checkMnemonic(envFile: string) {
    if (!fs.existsSync(envFile)) return;
    const mnemonic = fs.readFileSync(envFile, 'utf-8').trim().split(/\s+/);
    const key = await mnemonicToPrivateKey(mnemonic);
    
    const v3 = WalletContractV3R2.create({ publicKey: key.publicKey, workchain: 0 });
    const v4 = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    
    console.log(`\nFile: ${envFile}`);
    console.log(`V3R2 Address: ${v3.address.toString()}`);
    console.log(`V4 Address:   ${v4.address.toString()}`);
}

async function main() {
    console.log("Checking mnemonics against expected address: EQCiiQjCDZX12-4935U5gAjdZrD9J4L9FwG3E7wiTFDwvHa4");
    await checkMnemonic('.env.deployer.mainnet');
    await checkMnemonic('.env.deployer');
    await checkMnemonic('.env');
}

main().catch(console.error);
