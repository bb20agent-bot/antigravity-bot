import { TonClient4, Address, beginCell } from "@ton/ton";

async function main() {
    const client = new TonClient4({ endpoint: "https://mainnet-v4.tonhubapi.com" });
    const MASTER = Address.parse("EQALn486GGrxx6AQcDkbmJA5F6aLTEpRCoHyPdUZAgj0aqF4");
    
    // Addresses from user's .env
    const addresses = [
        { name: "Profit Incentive (User)", addr: "UQBVqEg6jAOyikibGTMV_nVvSj9oUCBl6uWIxzATeI1P1pdu" },
        { name: "Team Shared Volume", addr: "UQBQnrwILbIPyzrn0v2AdmRy88xUofLLouoUT3JOSZJr36HN" }
    ];

    console.log("--- BOCKCHAIN VORA AUDIT ---");
    const last = await client.getLastBlock();

    for (const item of addresses) {
        const userAddr = Address.parse(item.addr);
        const walletResult = await client.runMethod(last.last.seqno, MASTER, "get_wallet_address", [
            { type: 'slice', cell: beginCell().storeAddress(userAddr).endCell() }
        ]);
        const jettonWallet = walletResult.reader.readAddress();
        
        try {
            const data = await client.runMethod(last.last.seqno, jettonWallet, "get_wallet_data");
            const balance = data.reader.readBigNumber();
            console.log(`${item.name} (${userAddr.toString()}): ${Number(balance / 1000000000n)} VORA`);
        } catch (e) {
            console.log(`${item.name} (${userAddr.toString()}): 0 VORA (No tokens received yet)`);
        }
    }
}

main().catch(console.error);
