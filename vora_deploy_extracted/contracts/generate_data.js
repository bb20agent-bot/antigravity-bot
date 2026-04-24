
import { Address, Cell, Dictionary, beginCell } from '@ton/core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateData() {
    console.log("Starting script...");
    const adminAddrStr = process.argv[2];
    console.log("Admin Address Input:", adminAddrStr);

    if (!adminAddrStr) {
        console.error("Usage: node contracts/generate_data.js <ADMIN_ADDRESS>");
        process.exit(1);
    }

    try {
        console.log("Parsing Address...");
        const adminAddress = Address.parse(adminAddrStr);
        console.log(`Parsed: ${adminAddress.toString()}`);

        console.log("Creating Dictionary...");
        // Use proper types for Dictionary
        const emptyDict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Slice());
        console.log("Dictionary created.");

        console.log("Building Cell...");
        const dataCell = beginCell()
            .storeAddress(adminAddress)
            .storeDict(emptyDict)
            .endCell();
        console.log("Cell built.");

        console.log("Converting to BOC...");
        const buffer = dataCell.toBoc();
        console.log("BOC created, length:", buffer.length);

        const outputPath = path.join(__dirname, 'unilevel_data.boc');
        console.log("Writing to:", outputPath);

        fs.writeFileSync(outputPath, buffer);
        console.log("File written.");

        console.log(`✅ Success! Data Cell saved to: ${outputPath}`);
        console.log(`Base64: ${dataCell.toBoc().toString('base64')}`);

    } catch (e) {
        console.error("CAUGHT ERROR:", e);
    }
}

generateData();
