import { TonClient, Address } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

async function main() {
    const voraTokenAddress = Address.parse("EQDCMo8cLF9V5YLxKl5vB4rJK1nm1IZOnxhsAh2tS5hJo1rl");
    
    console.log("Checking VORA Token Address on MAINNET...");
    const mainnetEndpoint = await getHttpEndpoint({ network: 'mainnet' });
    const mainnetClient = new TonClient({ endpoint: mainnetEndpoint });
    const mainnetState = await mainnetClient.getContractState(voraTokenAddress);
    console.log("Mainnet State:", mainnetState.state);

    console.log("\nChecking VORA Token Address on TESTNET...");
    const testnetEndpoint = await getHttpEndpoint({ network: 'testnet' });
    const testnetClient = new TonClient({ endpoint: testnetEndpoint });
    const testnetState = await testnetClient.getContractState(voraTokenAddress);
    console.log("Testnet State:", testnetState.state);
}

main().catch(console.error);
