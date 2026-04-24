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

    // DATA URI FROM public/icon.png
    const iconBase64 = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAE9ElEQVR4AbxWSW8cRRT+qrrbM54Z2zOOx8HxFhubWNmcQAgCIRJxAKH4Yn4AEhYCCYRy4RDuSFxAvhokcwKOXHJHXCASBCInbA7xHhKvsT1L9/RavCp7krEZd48Vxa1+1a/qfd+rr6uqq5pj+zL6+kb0o50/6B1H1vQjh8UTsEDvaF/Werqv6gMDF7e7hRKg9/V+LszcGCzrAlynGb6PJ2AMrp1lZnEI+Y3vjGf63pEiuHxzmIUP4QeGbDgQ87yMMIuf0ki8xIVnv3WgnZff0HVbhGN9xOH5p8ttB/503Rc5Aj8d2jHnYLG6UEi1oOIQt1qs3MaCIMupwsiq35Sg7vRxHHr/bdQP9FfHVGmV2EMfjMA4dRygHFUgW01ChEUBlkzCGL6ExPlnceGrUdT3H0XUFes4gpfHR5F4/izq3rwElkqGUuQI7AkQ+Tz8xRV4rgtP09A2PLQnthzIDr8BhzPiePDvL0Pk8uVQ1WeoAMnwp2fh5AookoiWc4OyKdSanxtEwXWIQ+Jn5kKxMhgpIJieg5MvwHQ9pNufAhjDnhfFkoQxPQ82iQ5I/J7Y7UC0gNl5uPkiLLuERDwOdrgFSgQNs1pgchlJnzpnrS0QMQO+48ErFhHMLSDqihQgaOjZ0gpg2vCZQOvQ6wCsBzCiMgYlRvrUln71FTCuQZgWmJx/x0XURVmiIIBzewr5B+soUMLM+TOIZ5oQI4sfykCa8qlunOiH6bkorG0QZzo6MSGiBTCGgKZBzqnp+mjp6UJpMw97fROltXVlyt/IIdHTCccPUJLzTxwQl/oIvaMF0BwHi8uwllfpS7DR2NQATt/67qy8sx2xpiYICpRWHiBYWgbk2qB62B0ugDpX5CBAMDOPUt6CoWuInT0FLZkA03Rl0o8NnkQiVQ+vYBF2FiAOwIByDlS/wgVUcLypWZRyObiBQObcGfhFE0znyqQfP3kMhqbBIozEVlBDXR4aZexhOKBNRa6DIn0V2YFesEQ9AttRJv30sV6QNjibBRqB+Yc8VOR41PjICxegZnQLLGiRlRbuwaJNJpNJg3d3bgWo5Ee7kG3NouT5KN29B7GxSa3lW66Ksv//Z7iAXVz790nkzBJS8pA69jQ4HdPS6PcKKTp0XMeBxOzoZleOHTGqRAjYyfblOqBPUNM46k4MqOGX02AM9CNm6LBpy/anZihtxS125qiIKDdaQEWCYG4e9mZOTUNzbycYbUSspRnSd2nV2zRNwdxdlVgVkitNVaoX4QIkhxJjO4mgRWfNLGCBjmmPPkH6xYY0n/b/fwsFWNPzELYtWVAcyd2q7VlGC5BUmUgaLUrr1wkqQZtOCrynm6wLscaU6tD87RahacglVhrVou7aBMgschRom3Vu3MLGzxNw7y+iobsNDV1tyl//5SbcGzdBf9hKjKTUYhwMQS3AMkbQlrz48SdY+/IbtL52UdnaF19DtslYGVfTk/rm4DqdtTXBd4CsPyeRpRHJ+gLWX7d3xGqucG2DC0O/VjOhAqilm/BCWwdZOzQ6hCpCtbuaPsFZffwzGMZq7awtpEs/HGPvXcbYu5fh0mm51bqPknOHx/Vx7v0x+SNLJq9A19f3QVfQ/E/Xkb92Xfn7KqhzpBpHnb+nv+WS6E7eGUdDelgkUldRF1uCrgXqt4tOt8d9VvAF5V5FfeJ73pga8f65c0X2/R8AAAD//6X/nJcAAAAGSURBVAMA05tFUnuuoZAAAAAASUVORK5CYII=";

    const metadata = {
        name: "VORA Ecosystem",
        symbol: "VORA",
        description: "Official Token of the VORA Multi-AI Ecosystem (IDO Launchpad & Explorer).",
        image_data: iconBase64,
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

    console.log("✅ Final Branding Metadata Broadcasted!");
}

main().catch(console.error);
