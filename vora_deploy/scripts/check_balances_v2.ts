import { TonClient, Address, beginCell } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

async function main() {
    const endpoint = await getHttpEndpoint();
    const client = new TonClient({ endpoint });

    const masterAddress = Address.parse("EQAnhvO5Ibsrt3AY6DXJvdEPEfTogFN4ZGeo0NhSEKTySpyf");
    
    const addresses = [
        { name: "Deployer", address: "EQA1U7mObfd8oZ_I8BP34F02PtE874R381-EXI_fs09NvvVI" },
        { name: "Treasury", address: "EQCjW67Edr0mctOUm1mN7CINi7eUVVSa2_XTBj6p9X87Akz1" },
        { name: "Team (Team Volume)", address: "UQBQnrwILbIPyzrn0v2AdmRy88xUofLLouoUT3JOSZJr36HN" },
        { name: "Strategy (IDO)", address: "UQClOfWpWo5wMDSWJsgaVJmbVQ_NsH-s2tmHlv-qQ4CZU8S4" },
        { name: "Incentive (Hot Wallet)", address: "UQBVqEg6jAOyikibGTMV_nVvSj9oUCBl6uWIxzATeI1P1pdu" }
    ];

    console.log("Checking VORA Balances...");
    
    for (const item of addresses) {
        try {
            const ownerAddr = Address.parse(item.address);
            const cell = beginCell().storeAddress(ownerAddr).endCell();
            const walletResult = await client.runMethod(masterAddress, "get_wallet_address", [
                { type: 'slice', cell: cell }
            ]);
            const jettonWalletAddr = walletResult.stack.readAddress();
            
            try {
                const balanceResult = await client.runMethod(jettonWalletAddr, "get_wallet_data");
                const balance = balanceResult.stack.readBigNumber();
                console.log(`${item.name} (${ownerAddr.toString()}): ${Number(balance) / 1e9} VORA`);
            } catch (e) {
                console.log(`${item.name} (${ownerAddr.toString()}): 0 VORA (Wallet not deployed)`);
            }
        } catch (e: any) {
            console.error(`Error checking ${item.name}: ${e.message}`);
        }
    }
}

main().catch(console.error);
