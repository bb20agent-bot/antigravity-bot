import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { Address, Cell, toNano } from "@ton/core";
import { mnemonicToPrivateKey } from "@ton/crypto";

/**
 * Gasless Relayer Backend Service (VORA Ecosystem)
 * 
 * 텔레그램 미니 앱 유저가 오프체인에서 서명한 'RelayedTransfer' 메시지를 받아,
 * 백엔드의 릴레이어 지갑(Treasury)이 TON 가스비를 대신 지불하고 블록체인에 브로드캐스팅합니다.
 * 컨트랙트 단에서 서명이 검증되면, 릴레이어는 수수료 명목으로 VORA 토큰을 받게 됩니다.
 */
export class RelayerService {
    private client: TonClient | null = null;
    private relayerKeyPair: any = null;
    private relayerWallet: any = null;
    
    constructor() {
        this.init();
    }

    async init() {
        try {
            // TON 테스트넷 클라이언트 초기화
            this.client = new TonClient({
                endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
                apiKey: process.env.TONCENTER_API_KEY || ""
            });

            // 환경변수에서 릴레이어용 지갑 니모닉 로드
            const mnemonic = process.env.RELAYER_MNEMONIC;
            if (!mnemonic) {
                console.warn("[RelayerService] RELAYER_MNEMONIC이 설정되지 않았습니다. 가스비 대납 기능이 비활성화됩니다.");
                return;
            }
            
            this.relayerKeyPair = await mnemonicToPrivateKey(mnemonic.split(" "));
            this.relayerWallet = WalletContractV4.create({
                workchain: 0,
                publicKey: this.relayerKeyPair.publicKey
            });
            
            console.log(`[RelayerService] 활성화 완료. 릴레이어 지갑 주소: ${this.relayerWallet.address.toString()}`);
        } catch (error) {
            console.error("[RelayerService] 초기화 중 에러 발생:", error);
        }
    }

    /**
     * 유저 대신 블록체인에 트랜잭션을 전송하는 핵심 함수
     * @param userJettonWallet 유저의 VORA Jetton Wallet 주소
     * @param payloadBase64 유저가 서명한 RelayedTransfer 메시지 (Base64 인코딩)
     */
    async submitRelayedTransfer(userJettonWallet: string, payloadBase64: string) {
        if (!this.client || !this.relayerWallet) {
            throw new Error("Relayer가 준비되지 않았습니다. (서버 설정 확인 필요)");
        }

        try {
            const userWalletAddr = Address.parse(userJettonWallet);
            const payloadCell = Cell.fromBase64(payloadBase64);

            const walletContract = this.client.open(this.relayerWallet);
            const seqno = await walletContract.getSeqno();

            console.log(`[Relayer] ${userJettonWallet} 지갑의 가스리스 트랜잭션 처리 중...`);
            console.log(`[Relayer] 가스비(0.1 TON)를 대납하여 블록체인에 전송합니다.`);

            // 릴레이어 지갑이 가스비를 내면서, 유저의 Jetton Wallet으로 메시지를 쏩니다.
            await walletContract.sendTransfer({
                secretKey: this.relayerKeyPair.secretKey,
                seqno: seqno,
                messages: [
                    internal({
                        to: userWalletAddr,
                        value: toNano('0.1'), // 충분한 가스비 대납
                        body: payloadCell,    // 서명이 포함된 RelayedTransfer Payload
                        bounce: true
                    })
                ]
            });

            console.log(`[Relayer] 트랜잭션 브로드캐스트 성공!`);
            return { success: true, message: "가스리스 트랜잭션이 성공적으로 TON 네트워크에 제출되었습니다." };
        } catch (error: any) {
            console.error(`[Relayer] 트랜잭션 제출 실패:`, error);
            throw new Error(`대납 전송 실패: ${error.message}`);
        }
    }
}

// 싱글톤 인스턴스 추출
export const relayerService = new RelayerService();
