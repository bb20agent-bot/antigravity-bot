import { TonClient4, Address } from "@ton/ton";

async function main() {
    const client = new TonClient4({ endpoint: "https://mainnet-v4.tonhubapi.com" });
    const MASTER = Address.parse("EQALn486GGrxx6AQcDkbmJA5F6aLTEpRCoHyPdUZAgj0aqF4");
    
    console.log("--- VORA MASTER METADATA CHECK ---");
    const last = await client.getLastBlock();
    const res = await client.runMethod(last.last.seqno, MASTER, "get_jetton_data");
    
    console.log("Total Supply:", (res.reader.readBigNumber() / 1000000000n).toString(), "VORA");
    console.log("Admin:", res.reader.readAddress().toString());
    
    // The content is usually a Cell (TEP-64)
    const content = res.reader.readCell();
    console.log("Metadata Hash:", content.hash().toString('hex'));
    
    console.log("\nIf the name/symbol doesn't show in MyTonWallet, follow the manual Add process.");
}

main().catch(console.error);
