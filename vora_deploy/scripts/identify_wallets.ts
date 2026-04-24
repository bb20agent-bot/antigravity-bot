import { TonClient, Address, beginCell } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

async function main() {
    const endpoint = await getHttpEndpoint();
    const client = new TonClient({ endpoint });

    const masterAddress = Address.parse("EQAnhvO5Ibsrt3AY6DXJvdEPEfTogFN4ZGeo0NhSEKTySpyf");
    
    // Addresses from browser search and scripts
    const candidates = [
        { name: "Deployer", address: "EQA1U7mObfd8oZ_I8BP34F02PtE874R381-EXI_fs09NvvVI" },
        { name: "Potential 1", address: "EQCjW67Edr0mctOUm1mN7CINi7eUVVSa2_XTBj6p9X87Akz1" },
        { name: "Potential 2", address: "EQBkVCXyS38KzqmvAn18coD0diVJowi8bTmftbVzhNnHqf5O" },
        { name: "Potential 3", address: "EQCBmwa099VV_SiE9K6uWa28LpFZYyuFpRpez6Mtte3RRREc" }
    ];

    console.log("Checking Jetton Wallets for Master:", masterAddress.toString());
    
    for (const c of candidates) {
        try {
            const addr = Address.parse(c.address);
            // Jetton Master get_wallet_address takes a slice containing the address
            const cell = beginCell().storeAddress(addr).endCell();
            const result = await client.runMethod(masterAddress, "get_wallet_address", [
                { type: 'slice', cell: cell }
            ]);
            const jettonWallet = result.stack.readAddress();
            console.log(`${c.name} (${c.address}) -> Jetton Wallet: ${jettonWallet.toString()}`);
        } catch (e: any) {
            console.error(`Error checking ${c.name}: ${e.message}`);
        }
    }
}

main().catch(console.error);
