
import { Address, Cell, Dictionary, beginCell } from '@ton/core';
import * as fs from 'fs';
import * as path from 'path';

async function generateData() {
    // 1. Get Admin Address from args or default (placeholder)
    const adminAddrStr = process.argv[2];

    if (!adminAddrStr) {
        console.error("Usage: npx ts-node contracts/generate_data.ts <ADMIN_ADDRESS>");
        console.error("Example: npx ts-node contracts/generate_data.ts EQCi...s8n");
        process.exit(1);
    }

    try {
        const adminAddress = Address.parse(adminAddrStr);
        console.log(`Creating data for Admin: ${adminAddress.toString()}`);

        // Key: 256-bit (Address Hash), Value: Cell
        const emptyDict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());

        // 3. Pack into Cell
        // (slice owner_address, cell user_uplines)
        const dataCell = beginCell()
            .storeAddress(adminAddress)
            .storeDict(emptyDict)
            .endCell();

        // 4. Save to File
        const buffer = dataCell.toBoc();
        const outputPath = path.join(__dirname, 'unilevel_data.boc');

        fs.writeFileSync(outputPath, buffer);

        console.log(`✅ Success! Data Cell saved to: ${outputPath}`);
        console.log(`Base64 (for some deployers): ${dataCell.toBoc().toString('base64')}`);

    } catch (e) {
        console.error("Error:", e);
    }
}

generateData();
