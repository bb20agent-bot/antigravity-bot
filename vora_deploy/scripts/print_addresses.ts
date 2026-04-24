import { mnemonicToPrivateKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import * as fs from 'fs';

import { VoraToken } from "../contracts/build/VoraToken_VoraToken.ts";
import { Treasury } from "../contracts/build/Treasury_Treasury.ts";
import { Escrow } from "../contracts/build/Escrow_Escrow.ts";
import { VestingVault } from "../contracts/build/VestingVault_VestingVault.ts";

async function main() {
    if (!fs.existsSync('.env.deployer')) {
        console.error("No .env.deployer found!");
        return;
    }
    const mnemonicStrings = fs.readFileSync('.env.deployer', 'utf-8').split(' ');
    const key = await mnemonicToPrivateKey(mnemonicStrings);
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

    console.log("Deployer Wallet Address:", wallet.address.toString());
    const owner = wallet.address;

    const treasury = await Treasury.fromInit(owner);
    console.log(`TREASURY_ADDRESS = "${treasury.address.toString()}"`);

    const voraToken = await VoraToken.fromInit(owner, treasury.address);
    console.log(`VORA_TOKEN_ADDRESS = "${voraToken.address.toString()}"`);

    const escrow = await Escrow.fromInit(owner, treasury.address, voraToken.address);
    console.log(`ESCROW_ADDRESS = "${escrow.address.toString()}"`);

    const vestingVault = await VestingVault.fromInit(owner, voraToken.address);
    console.log(`VESTING_VAULT_ADDRESS = "${vestingVault.address.toString()}"`);
}

main().catch(console.error);
