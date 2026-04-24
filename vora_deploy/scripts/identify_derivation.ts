import { mnemonicToPrivateKey } from "@ton/crypto";
import { 
    WalletContractV3R2,
    WalletContractV4,
    Address
} from "@ton/ton";
import * as fs from 'fs';

// Try to import from various possible build locations
import { Treasury as Treasury1 } from "../../contracts/build/Treasury_Treasury";
import { VoraTreasury as VoraTreasury1 } from "../../contracts/build/VoraTreasury_VoraTreasury";
import { Treasury as Treasury2 } from "../contracts/build/VoraToken_Treasury";
import { Treasury as Treasury3 } from "../contracts/build/Escrow_Treasury";

async function main() {
    const filename = '.env.deployer.mainnet';
    if (!fs.existsSync(filename)) return;
    const seed = fs.readFileSync(filename, 'utf8').trim();
    const mnemonic = seed.split(/\s+/);
    const key = await mnemonicToPrivateKey(mnemonic);

    const target = "EQCjW67Edr0mctOUm1mN7CINi7eUVVSa2_XTBj6p9X87Akz1";
    console.log("Target Treasury Address:", target);

    const owners = [
        { name: "V3R2", addr: WalletContractV3R2.create({ publicKey: key.publicKey, workchain: 0 }).address },
        { name: "V4R2", addr: WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 }).address }
    ];

    const types = [
        { name: "Treasury (root)", contract: Treasury1 },
        { name: "VoraTreasury (root)", contract: VoraTreasury1 },
        { name: "Treasury (VoraToken build)", contract: Treasury2 },
        { name: "Treasury (Escrow build)", contract: Treasury3 }
    ];

    for (const o of owners) {
        for (const t of types) {
            try {
                if (!t.contract) continue;
                const instance = await t.contract.fromInit(o.addr);
                const addr = instance.address.toString();
                console.log(`${t.name} from ${o.name}: ${addr}`);
                if (addr === target) console.log("!!! MATCH FOUND !!!");
            } catch (e: any) {
                // console.log(`Error for ${t.name}: ${e.message}`);
            }
        }
    }
}

main().catch(console.error);
