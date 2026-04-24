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
    
    // THE CORRECT USER ADDRESS FROM BINANCE_BOT/.ENV (Profit Incentive)
    const CORRECT_USER_ADDR = Address.parse("UQBVqEg6jAOyikibGTMV_nVvSj9oUCBl6uWIxzATeI1P1pdu");

    console.log("Using Wallet:", wallet.address.toString());
    console.log(`Sending corrected 10,000,000 VORA to ${CORRECT_USER_ADDR.toString()}...`);
    
    // 1. Get our Jetton Wallet
    const lastBlock = await client.getLastBlock();
    const walletResult = await client.runMethod(lastBlock.last.seqno, JETTON_MASTER, "get_wallet_address", [
        { type: 'slice', cell: beginCell().storeAddress(wallet.address).endCell() }
    ]);
    const ourJettonWallet = walletResult.reader.readAddress();

    // 2. Prepare Transfer Message
    const amount = BigInt(10000000) * 1000000000n;
    const body = beginCell()
        .storeUint(0x0f8a7ea5, 32)
        .storeUint(0, 64)
        .storeCoins(amount)
        .storeAddress(CORRECT_USER_ADDR)
        .storeAddress(wallet.address)
        .storeBit(false)
        .storeCoins(1000000n)
        .storeBit(false)
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
    
    console.log("Corrected transfer broadcasted. 10M VORA sent to Profit Incentive Address.");
}

main().catch(console.error);
