import { TonClient, Address } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

async function main() {
    const endpoint = await getHttpEndpoint();
    const client = new TonClient({ endpoint });

    const masterAddress = Address.parse("EQAnhvO5Ibsrt3AY6DXJvdEPEfTogFN4ZGeo0NhSEKTySpyf");
    
    console.log("Checking Jetton Data for Master:", masterAddress.toString());
    
    try {
        const result = await client.runMethod(masterAddress, "get_jetton_data");
        const totalSupply = result.stack.readBigNumber();
        const mintable = result.stack.readBoolean();
        const owner = result.stack.readAddress();
        
        console.log(`Total Supply: ${totalSupply.toString()}`);
        console.log(`Mintable: ${mintable}`);
        console.log(`Owner: ${owner.toString()}`);
    } catch (e: any) {
        console.error(`Error: ${e.message}`);
    }
}

main();
