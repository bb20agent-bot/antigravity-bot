import { TonClient, WalletContractV4, beginCell, Cell, Dictionary, Address, Builder } from "@ton/ton";
import { mnemonicToPrivateKey, sha256_sync } from "@ton/crypto";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import * as fs from 'fs';

// Helper for TEP-64 Snake encoding (splits long data across multiple cells)
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
    builder.storeUint(0x00, 8); // Snake prefix
    storeSnakeTail(data, builder);
    return builder.endCell();
}

function buildJettonMetadata(data: { [key: string]: string | number }): Cell {
    const ONCHAIN_CONTENT_PREFIX = 0x00;
    const dict = Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell());

    for (const [key, value] of Object.entries(data)) {
        const valStr = value.toString();
        dict.set(sha256_sync(key), buildSnakeCell(Buffer.from(valStr, 'utf8')));
    }

    return beginCell()
        .storeUint(ONCHAIN_CONTENT_PREFIX, 8)
        .storeDict(dict)
        .endCell();
}

async function main() {
    const envFile = '.env.deployer.mainnet';
    if (!fs.existsSync(envFile)) return;
    const mnemonic = fs.readFileSync(envFile, 'utf-8').trim().split(/\s+/);
    const key = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

    const voraTokenAddress = Address.parse("EQAnhvO5Ibsrt3AY6DXJvdEPEfTogFN4ZGeo0NhSEKTySpyf");

    // Load icon and convert to base64 for image_data field
    const iconPath = "c:\\antigravity-bot\\public\\icon.png";
    let imageData = "";
    if (fs.existsSync(iconPath)) {
        const iconBuffer = fs.readFileSync(iconPath);
        imageData = iconBuffer.toString('base64');
        console.log(`Embedding icon as base64 image_data (${imageData.length} chars)...`);
    }

    const metadata = {
        name: "VORA",
        symbol: "VORA",
        description: "VORA Official Token for the Multi-AI Trading Ecosystem.",
        image: "https://vora.tradefi.app/icon.png",
        image_data: imageData,
        decimals: "9"
    };

    const content = buildJettonMetadata(metadata);
    const body = beginCell().storeUint(2937889386, 32).storeRef(content).endCell();

    const rpcs = [
        async () => await getHttpEndpoint(),
        async () => "https://toncenter.com/api/v2/jsonRPC",
        async () => "https://mainnet-v2.ton.social/jsonRPC"
    ];

    for (const getRpc of rpcs) {
        try {
            const endpoint = await getRpc();
            console.log("Trying " + endpoint);
            const client = new TonClient({ endpoint });
            const contract = client.open(wallet);
            await contract.sender(key.secretKey).send({ to: voraTokenAddress, value: 100000000n, body }); // 0.1 TON
            console.log("✅ SUCCESS!");
            return;
        } catch (e) {
            console.error("Failed: " + e);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}
main();
