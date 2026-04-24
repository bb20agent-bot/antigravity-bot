import { mnemonicToPrivateKey } from "@ton/crypto";
import { 
    WalletContractV1R1, WalletContractV1R2, WalletContractV1R3,
    WalletContractV2R1, WalletContractV2R2,
    WalletContractV3R1, WalletContractV3R2,
    WalletContractV4,
    Address
} from "@ton/ton";
import * as fs from 'fs';

async function main() {
    const filename = '.env.deployer'; // Checking the other one
    if (!fs.existsSync(filename)) return;
    const seed = fs.readFileSync(filename, 'utf8').trim();
    const mnemonic = seed.split(/\s+/);
    const key = await mnemonicToPrivateKey(mnemonic);

    const target = "EQCjW67Edr0mctOUm1mN7CINi7eUVVSa2_XTBj6p9X87Akz1";
    console.log("Target Address:", target);

    const wallets = [
        { name: "V1R1", contract: WalletContractV1R1 },
        { name: "V1R2", contract: WalletContractV1R2 },
        { name: "V1R3", contract: WalletContractV1R3 },
        { name: "V2R1", contract: WalletContractV2R1 },
        { name: "V2R2", contract: WalletContractV2R2 },
        { name: "V3R1", contract: WalletContractV3R1 },
        { name: "V3R2", contract: WalletContractV3R2 },
        { name: "V4R2", contract: WalletContractV4 }
    ];

    for (const w of wallets) {
        const wallet = w.contract.create({ publicKey: key.publicKey, workchain: 0 });
        const addr = wallet.address.toString();
        console.log(`${w.name}: ${addr}`);
        if (addr === target) console.log("!!! MATCH FOUND !!!");
    }
}

main().catch(console.error);
