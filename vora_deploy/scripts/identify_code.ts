import { TonClient, Address } from "@ton/ton";
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

async function main() {
    const apiKey = "ee30cb89189b4b087702a5e7896db8dabb20fabef758c6b958240a43e8b0f01c";
    const client = new TonClient({ 
        endpoint: "https://toncenter.com/api/v2/jsonRPC",
        apiKey: apiKey
    });

    const targetAddr = Address.parse("EQCjW67Edr0mctOUm1mN7CINi7eUVVSa2_XTBj6p9X87Akz1");
    const state = await client.getContractState(targetAddr);
    
    if (!state.code) {
        console.log("No code found at address.");
        return;
    }
    
    const deployedHash = crypto.createHash('sha256').update(state.code).digest('hex');
    console.log(`Deployed Code Hash: ${deployedHash}`);

    const searchPaths = ['contracts/build', 'vora_deploy/contracts/build'];
    
    for (const dir of searchPaths) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.pkg'));
        console.log(`\nScanning packages in ${dir}...`);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const codeB64 = pkg.code;
            const codeBuffer = Buffer.from(codeB64, 'base64');
            const hash = crypto.createHash('sha256').update(codeBuffer).digest('hex');
            if (hash === deployedHash) {
                console.log(`MATCH FOUND: ${file} !!!`);
            }
        }
    }
}

main().catch(console.error);
