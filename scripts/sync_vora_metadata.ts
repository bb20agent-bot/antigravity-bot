import { TonClient4, WalletContractV4, beginCell, Cell, Dictionary, Address, Builder, internal } from "@ton/ton";
import { mnemonicToPrivateKey, sha256_sync } from "@ton/crypto";

function storeSnakeTail(src: Buffer, builder: Builder) {
    if (src.length > 0) {
        const space = Math.floor((1023 - builder.bits) / 8);
        if (src.length <= space) {
            builder.storeBuffer(src);
        } else {
            const chunk = src.subarray(0, space);
            const tail = src.subarray(space);
            builder.storeBuffer(chunk);
            const nextCell = beginCell();
            storeSnakeTail(tail, nextCell);
            builder.storeRef(nextCell.endCell());
        }
    }
}

function buildSnakeCell(data: Buffer): Cell {
    const builder = beginCell();
    builder.storeUint(0x00, 8);
    storeSnakeTail(data, builder);
    return builder.endCell();
}

function buildJettonMetadata(data: { [key: string]: string | number }): Cell {
    const ONCHAIN_CONTENT_PREFIX = 0x00;
    const dict = Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell());
    for (const [key, value] of Object.entries(data)) {
        dict.set(sha256_sync(key), buildSnakeCell(Buffer.from(value.toString(), 'utf8')));
    }
    return beginCell().storeUint(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict).endCell();
}

async function main() {
    const mnemonic = "disease candy give hawk lamp wrist educate quiz negative clinic execute birth author carpet flip daughter effort cherry report boss collect draft consider lazy";
    const key = await mnemonicToPrivateKey(mnemonic.split(" "));
    
    const client = new TonClient4({ endpoint: "https://mainnet-v4.tonhubapi.com" });
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    const contract = client.open(wallet);

    const voraMasterAddress = Address.parse("EQALn486GGrxx6AQcDkbmJA5F6aLTEpRCoHyPdUZAgj0aqF4");

    const metadata = {
        name: "VORA",
        symbol: "VORA",
        description: "VORA Official Token for the Multi-AI Trading Ecosystem.",
        image: "https://voramini.com/assets/icon.png",
        decimals: "9"
    };

    console.log(`Updating metadata for Master: ${voraMasterAddress.toString()}...`);
    const content = buildJettonMetadata(metadata);
    const body = beginCell().storeUint(2937889386, 32).storeUint(0, 64).storeRef(content).endCell();

    const seqno = await contract.getSeqno();
    
    await contract.sendTransfer({
        seqno: seqno,
        secretKey: key.secretKey,
        messages: [
            internal({
                to: voraMasterAddress,
                value: "0.1",
                bounce: true,
                body: body
            })
        ]
    });

    console.log("✅ Metadata Update Broadcasted via Tonhub V4!");
}

main().catch(console.error);
