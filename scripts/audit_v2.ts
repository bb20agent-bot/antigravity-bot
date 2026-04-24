import { TonClient, Address } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

async function main() {
    const endpoint = await getHttpEndpoint({ network: "mainnet" });
    const client = new TonClient({ endpoint });
    
    const MASTER_ADDR = Address.parse("EQAnhvO5Ibsrt3AY6DXJvdEPEfTogFN4ZGeo0NhSEKTySpyf");
    const TREASURY_ADDR = Address.parse("EQDYEa2ze4tQnEZg6-xo5XS3DdJtb61kToIkIi14LMKyLfcv");
    
    console.log("--- Ecosystem Audit ---");
    
    // 1. Master Data
    const result = await client.runMethod(MASTER_ADDR, "get_jetton_data");
    console.log("Total Supply:", result.stack.readBigNumber().toString());
    console.log("Mintable:", result.stack.readBoolean());

    // 2. Treasury Wallet Address
    const walletResult = await client.runMethod(MASTER_ADDR, "get_wallet_address", [{ type: 'slice', cell: Address.parse(TREASURY_ADDR.toString()).toRaw() }]);
    // Wait! Address.parse is enough
    const treasuryWallet = await client.runMethod(MASTER_ADDR, "get_wallet_address", [{ type: 'slice', cell: Address.parse(TREASURY_ADDR.toString()).toRaw().toCell() }]);
    // Use a simpler way to call runMethod with Address
}
// Actually, I'll just check if the sequence of Mint calls happened.
