import { WalletContractV4 } from "@ton/ton";
import { mnemonicToPrivateKey, mnemonicNew } from "@ton/crypto";
import * as fs from 'fs';

import { VoraToken } from "../contracts/build/VoraToken_VoraToken.ts";
import { Treasury } from "../contracts/build/Treasury_Treasury.ts";
import { Escrow } from "../contracts/build/Escrow_Escrow.ts";
import { VestingVault } from "../contracts/build/VestingVault_VestingVault.ts";

async function main() {
    let mnemonicStrings: string[];
    if (fs.existsSync('.env.deployer')) {
        mnemonicStrings = fs.readFileSync('.env.deployer', 'utf-8').split(' ');
    } else {
        mnemonicStrings = await mnemonicNew();
        fs.writeFileSync('.env.deployer', mnemonicStrings.join(' '));
    }

    const key = await mnemonicToPrivateKey(mnemonicStrings);
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    const owner = wallet.address;

    console.log("Locally computing contract addresses...");

    const treasuryInit = await Treasury.fromInit(owner);
    const treasuryAddress = treasuryInit.address;
    console.log("Treasury Address:", treasuryAddress.toString());

    const voraTokenInit = await VoraToken.fromInit(owner, treasuryAddress);
    const voraTokenAddress = voraTokenInit.address;
    console.log("VoraToken Address:", voraTokenAddress.toString());

    const escrowInit = await Escrow.fromInit(owner, treasuryAddress, voraTokenAddress);
    const escrowAddress = escrowInit.address;
    console.log("Escrow Address:", escrowAddress.toString());

    const vestingVaultInit = await VestingVault.fromInit(owner, voraTokenAddress);
    const vestingVaultAddress = vestingVaultInit.address;
    console.log("VestingVault Address:", vestingVaultAddress.toString());

    const envContent = `
VITE_VORA_TOKEN_ADDRESS=${voraTokenAddress.toString()}
VITE_TREASURY_ADDRESS=${treasuryAddress.toString()}
    `.trim();

    fs.writeFileSync('.env', envContent);
    console.log("Addresses saved to .env");
}

main().catch(console.error);
