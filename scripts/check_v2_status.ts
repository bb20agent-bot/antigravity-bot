import { TonClient, Address } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

async function main() {
    const endpoint = await getHttpEndpoint({ network: "mainnet" });
    const client = new TonClient({ endpoint });
    
    const MASTER_ADDR = Address.parse("EQAnhvO5Ibsrt3AY6DXJvdEPEfTogFN4ZGeo0NhSEKTySpyf");
    
    try {
        const result = await client.runMethod(MASTER_ADDR, "get_jetton_data");
        const totalSupply = result.stack.readBigNumber();
        const mintable = result.stack.readBoolean();
        const adminAddress = result.stack.readAddress();
        
        console.log("--- VORA V2 STATUS ---");
        console.log("Total Supply:", totalSupply.toString());
        console.log("Mintable:", mintable);
        console.log("Admin Address:", adminAddress.toString());
    } catch (e) {
        console.error("Contract not active or error:", e);
    }
}

main().catch(console.error);
