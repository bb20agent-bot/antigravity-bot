import { TonClient, WalletContractV4, internal, toNano, beginCell } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import * as fs from "fs";
import * as path from "path";

// 컴파일된 Tact Wrapper 로드
import { VoraToken } from "../contracts/build/VoraToken_VoraToken.ts";
import { UnilevelDistributor } from "../contracts/build/UnilevelDistributor_UnilevelDistributor.ts";
import { P2PEscrow } from "../contracts/build/P2PEscrow_P2PEscrow.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log("🚀 VORA 스마트 컨트랙트 통합 테스트넷 배포 스크립트 🚀\n");

    let apiKey = "";
    try {
        const envContent = fs.readFileSync(path.resolve(process.cwd(), ".env"), "utf8");
        const match = envContent.match(/TESTNET_API_KEY=(.*)/);
        if (match) apiKey = match[1].trim();
    } catch (e) {}

    if (!apiKey) {
        console.error("❌ 에러: .env 파일에 TESTNET_API_KEY가 없습니다!");
        console.error("현재 모든 무료 테스트넷 서버가 포화 상태입니다. 정상 배포를 위해 전용 키가 필수입니다.");
        console.error("👉 텔레그램에서 @tonapibot 에 접속 후 /api_key 를 입력하여 Testnet 키를 무료 발급받아 주세요.");
        console.error("👉 .env 파일에 TESTNET_API_KEY=발급받은키 를 추가하고 다시 실행해주세요.");
        process.exit(1);
    }

    // 1. TON Client 및 배포자 지갑 초기화 (공식 toncenter 사용, 전용 API 키 사용)
    const client = new TonClient({
        endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
        apiKey: apiKey
    });

    const envPath = path.resolve(process.cwd(), ".env.deployer");
    const mnemonic = fs.readFileSync(envPath, "utf8").trim().split(" ");
    const key = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });
    const walletContract = client.open(wallet);

    console.log(`🔑 Deployer 지갑 주소: ${wallet.address.toString()}`);
    
    // 잔고 확인
    const balance = await walletContract.getBalance();
    console.log(`💰 현재 잔고: ${Number(balance) / 1e9} TON`);
    if (balance < toNano("0.5")) {
        console.warn("⚠️ 경고: 컨트랙트 3개를 연속 배포하기에 가스비가 부족할 수 있습니다.");
    }

    await sleep(1500); // Rate Limit 방어

    // 2. VoraToken (Core) 배포
    console.log("\n[1] VoraToken 코어 배포 중...");
    const voraContract = client.open(await VoraToken.fromInit(wallet.address, beginCell().endCell()));
    
    await voraContract.send(walletContract.sender(key.secretKey), { value: toNano("0.1") }, {
        $$type: "Deploy",
        queryId: 0n
    });
    console.log(`✅ VoraToken 주소: ${voraContract.address.toString()}`);

    await sleep(2000); // 2초 대기 (Rate Limit 방어)

    // 3. UnilevelDistributor (Multi-tier Referral) 배포
    console.log("\n[2] UnilevelDistributor 배포 중...");
    const distContract = client.open(await UnilevelDistributor.fromInit(wallet.address));
    
    await distContract.send(walletContract.sender(key.secretKey), { value: toNano("0.05") }, {
        $$type: "Deploy",
        queryId: 0n
    });
    console.log(`✅ UnilevelDistributor 주소: ${distContract.address.toString()}`);

    await sleep(2000); // 2초 대기 (Rate Limit 방어)

    // 4. P2PEscrow (OTC Swap) 배포
    console.log("\n[3] P2PEscrow 배포 중...");
    const escrowContract = client.open(await P2PEscrow.fromInit(wallet.address));
    
    await escrowContract.send(walletContract.sender(key.secretKey), { value: toNano("0.05") }, {
        $$type: "Deploy",
        queryId: 0n
    });
    console.log(`✅ P2PEscrow 주소: ${escrowContract.address.toString()}`);

    console.log("\n🎉 모든 트랜잭션이 네트워크에 전송되었습니다! (완료까지 15~30초 소요)");
    console.log("\n[다음 단계]");
    console.log(`환경 변수(.env) 파일을 열고 아래 주소를 업데이트 하세요:`);

    console.log(`VITE_VORA_TOKEN_ADDRESS=${voraContract.address.toString()}`);
    console.log(`VITE_P2P_ESCROW=${escrowContract.address.toString()}`);
}

main().catch(console.error);
