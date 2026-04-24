import { TonClient4, Address } from "@ton/ton";

async function main() {
    const client = new TonClient4({ endpoint: "https://mainnet-v4.tonhubapi.com" });
    const MASTER_ADDR = Address.parse("EQALn486GGrxx6AQcDkbmJA5F6aLTEpRCoHyPdUZAgj0aqF4");
    const TREASURY_V4 = Address.parse("EQDYEa2ze4tQnEZg6-xo5XS3DdJtb61kToIkIi14LMKyLfcv");
    
    console.log("--- FINAL VORA V2 AUDIT ---");
    
    // 1. Master Data
    const lastBlock = await client.getLastBlock();
    const result = await client.runMethod(lastBlock.last.seqno, MASTER_ADDR, "get_jetton_data");
    const totalSupply = result.reader.readBigNumber();
    const mintable = result.reader.readBoolean();
    
    console.log("Total Supply:", (totalSupply / 1000000000n).toString(), "VORA");
    console.log("Locked (Mintable: false):", !mintable);

    // 2. Holders Check (Sample check)
    const incentiveAddr = Address.parse("UQBVqEg6jAOyikibGTMV_nVvSj9oUCBl6uWIxzATeI1P1pdu");
    const walletRes = await client.runMethod(lastBlock.last.seqno, MASTER_ADDR, "get_wallet_address", [{ type: 'slice', cell: incentiveAddr.toRaw().toCell() }]);
    const incentiveWallet = walletRes.reader.readAddress();
    
    const walletData = await client.runMethod(lastBlock.last.seqno, incentiveWallet, "get_wallet_data");
    const balance = walletData.reader.readBigNumber();
    console.log("Incentive Balance:", (balance / 1000000000n).toString(), "VORA");
    
    console.log("--- AUDIT COMPLETE ---");
}

main().catch(console.error);
