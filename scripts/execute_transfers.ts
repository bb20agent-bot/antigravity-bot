import { TonClient4, WalletContractV4, internal, Address, beginCell } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";

async function main() {
    const mnemonic = "disease candy give hawk lamp wrist educate quiz negative clinic execute birth author carpet flip daughter effort cherry report boss collect draft consider lazy";
    const key = await mnemonicToPrivateKey(mnemonic.split(" "));
    
    const client = new TonClient4({
        endpoint: "https://mainnet-v4.tonhubapi.com"
    });

    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);

    const JETTON_MASTER = Address.parse("EQALn486GGrxx6AQcDkbmJA5F6aLTEpRCoHyPdUZAgj0aqF4");
    const USER_ADDR = Address.parse("EQCiiQjCDZX12-4935U5gAjdZrD9J4L9FwG3E7wiTFDwvHa4");
    const TEAM_ADDR = Address.parse("UQBQnrwILbIPyzrn0v2AdmRy88xUofLLouoUT3JOSZJr36HN");

    console.log("Using Wallet:", wallet.address.toString());
    
    const sendTokens = async (to: Address, voraAmount: number, memo: string) => {
        console.log(`Sending ${voraAmount} VORA to ${to.toString()} (${memo})...`);
        
        // 1. Get our Jetton Wallet
        const lastBlock = await client.getLastBlock();
        const walletResult = await client.runMethod(lastBlock.last.seqno, JETTON_MASTER, "get_wallet_address", [
            { type: 'slice', cell: beginCell().storeAddress(wallet.address).endCell() }
        ]);
        const ourJettonWallet = walletResult.reader.readAddress();

        // 2. Prepare Transfer Message
        const amount = BigInt(voraAmount) * 1000000000n;
        const body = beginCell()
            .storeUint(0x0f8a7ea5, 32) // opcode for Jetton Transfer
            .storeUint(0, 64) // query_id
            .storeCoins(amount)
            .storeAddress(to)
            .storeAddress(wallet.address) // response_destination
            .storeBit(false) // no custom_payload
            .storeCoins(1000000n) // forward_ton_amount
            .storeBit(false) // forward_payload as slice
            .endCell();

        const seqno = await walletContract.getSeqno();
        await walletContract.sendTransfer({
            seqno: seqno,
            secretKey: key.secretKey,
            messages: [
                internal({
                    to: ourJettonWallet,
                    value: "0.1",
                    bounce: true,
                    body: body
                })
            ]
        });
        console.log("Transfer broadcasted.");
    };

    // Execute Transfers
    await sendTokens(USER_ADDR, 10000000, "User Allocation");
    await new Promise(r => setTimeout(r, 20000)); // Wait for seqno update
    await sendTokens(TEAM_ADDR, 200000000, "Team Volume Allocation");

    console.log("All transfers complete.");
}

main().catch(console.error);
