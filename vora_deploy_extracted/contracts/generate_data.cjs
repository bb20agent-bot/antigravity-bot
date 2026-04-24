
const { Address, Cell, Dictionary, beginCell } = require('@ton/core');
const fs = require('fs');
const path = require('path');

async function generateData() {
    console.log("Starting script...");
    const adminAddrStr = process.argv[2];
    console.log("Admin Address Input:", adminAddrStr);

    if (!adminAddrStr) {
        console.error("Usage: node contracts/generate_data.cjs <ADMIN_ADDRESS>");
        console.error("Example: node contracts/generate_data.cjs EQCi...s8n");
        process.exit(1);
    }

    try {
        const adminAddress = Address.parse(adminAddrStr);
        console.log(`Creating data for Admin: ${adminAddress.toString()}`);

        // 2. Create Empty Dictionary for User Uplines
        const emptyDict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Slice());

        // 3. Pack into Cell
        const dataCell = beginCell()
            .storeAddress(adminAddress)
            .storeDict(emptyDict)
            .endCell();

        // 4. Save to File
        const buffer = dataCell.toBoc();
        const outputPath = path.join(__dirname, 'unilevel_data.boc');

        fs.writeFileSync(outputPath, buffer);

        console.log(`✅ Success! Data Cell saved to: ${outputPath}`);
        console.log(`Base64: ${dataCell.toBoc().toString('base64')}`);

    } catch (e) {
        console.error("Error:", e);
    }
}

generateData();
