import { TonClient, Address, beginCell } from "@ton/ton";

async function main() {
    const apiKey = "ee30cb89189b4b087702a5e7896db8dabb20fabef758c6b958240a43e8b0f01c";
    const client = new TonClient({ 
        endpoint: "https://toncenter.com/api/v2/jsonRPC",
        apiKey: apiKey
    });

    // NEW PRODUCTION ADDRESSES
    const masterAddress = Address.parse("EQDCMo8cLF9V5YLxKl5vB4rJK1nm1IZOnxhsAh2tS5hJo1rl");
    const treasuryAddress = Address.parse("EQDci6q1bczf1IIJWX5WvaCryYYJWp6cw1-Qp4A_C9BsGI47");
    
    console.log("Checking Master State...");
    const masterState = await client.getContractState(masterAddress);
    console.log(`Master (${masterAddress.toString()}) State: ${masterState.state}`);
    
    if (masterState.state !== 'active') {
        console.error("Master contract is not active on Mainnet!");
        return;
    }

    const addresses = [
        { name: "Treasury", address: treasuryAddress.toString() },
        { name: "Team", address: "UQBQnrwILbIPyzrn0v2AdmRy88xUofLLouoUT3JOSZJr36HN" },
        { name: "Strategy", address: "UQClOfWpWo5wMDSWJsgaVJmbVQ_NsH-s2tmHlv-qQ4CZU8S4" },
        { name: "Incentive", address: "UQBVqEg6jAOyikibGTMV_nVvSj9oUCBl6uWIxzATeI1P1pdu" }
    ];

    console.log("\nResolving Jetton Wallet Addresses...");
    
    for (const item of addresses) {
        try {
            const ownerAddr = Address.parse(item.address);
            const cell = beginCell().storeAddress(ownerAddr).endCell();
            const walletResult = await client.runMethod(masterAddress, "get_wallet_address", [
                { type: 'slice', cell: cell }
            ]);
            const jettonWalletAddr = walletResult.stack.readAddress();
            console.log(`${item.name} Owner: ${ownerAddr.toString()}`);
            console.log(`${item.name} Jetton Wallet: ${jettonWalletAddr.toString()}`);
            
            const walletState = await client.getContractState(jettonWalletAddr);
            console.log(`${item.name} Wallet State: ${walletState.state}`);
            
            if (walletState.state === 'active') {
                const balResult = await client.runMethod(jettonWalletAddr, "get_wallet_data");
                const balance = balResult.stack.readBigNumber();
                console.log(`${item.name} Balance: ${Number(balance) / 1e9} VORA`);
            }
            console.log("---");
        } catch (e: any) {
            console.error(`Error resolving ${item.name}: ${e.message}`);
        }
    }
}

main().catch(console.error);
