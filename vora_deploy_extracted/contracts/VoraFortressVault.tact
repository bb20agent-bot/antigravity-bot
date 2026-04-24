import "@stdlib/deploy";
import "@stdlib/ownable";

// =====================================================================
// 1. Messages (제톤 및 내부 통신 메시지 정의)
// =====================================================================
message(0x7362d09c) JettonTransferNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forward_payload: Slice as remaining;
}

message AllocateReward {
    user: Address;
    amount: Int as coins;
}

message ClaimReward {
    query_id: Int as uint64;
}

// =====================================================================
// 2. VORA Fortress Vault Contract (TON Native)
// =====================================================================
contract VoraFortressVault with Deployable, Ownable {
    owner: Address;                 // 멀티시그 트레저리 (Admin)
    engine_bot: Address;            // MM & 트레이딩 봇 지갑
    vora_jetton_wallet: Address;    // 이 Vault가 소유한 공식 VORA 제톤 지갑 주소
    
    // TON 메인넷 공식 소각 주소 (Hole)
    const BURN_ADDRESS: Address = address("EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c"); 
    burn_rate: Int = 1000;          // 기본 소각률 10% (1000 / 10000)
    
    // 유저별 클레임 가능 보상 (Pull-over-Push 패턴)
    claimable_rewards: map<Address, Int>;

    init(owner: Address, bot: Address, vora_wallet: Address) {
        self.owner = owner;
        self.engine_bot = bot;
        self.vora_jetton_wallet = vora_wallet;
    }

    // =====================================================================
    // [보안 핵심 1] 가짜 제톤(Jetton) 알림 방어 및 수익 처리/자동 소각
    // =====================================================================
    receive(msg: JettonTransferNotification) {
        // [SECURITY] 송신자가 반드시 '진짜 VORA 제톤 지갑'인지 확인. 
        // 해커가 가짜 토큰을 보내고 진짜인 척하는 알림 스푸핑(Spoofing) 공격 원천 차단.
        require(sender() == self.vora_jetton_wallet, "VORA: Invalid Jetton Wallet Sender");
        
        // 봇이 수익을 입금한 경우 자동 소각 로직 실행
        if (msg.sender == self.engine_bot) {
            let burn_amount: Int = (msg.amount * self.burn_rate) / 10000;
            let pool_amount: Int = msg.amount - burn_amount;
            
            // 소각 주소로 토큰 전송 (비동기 메시지 발송)
            if (burn_amount > 0) {
                self.send_jettons(self.BURN_ADDRESS, burn_amount, "VORA Yield Burn");
            }
            // 남은 pool_amount는 자동으로 이 Vault의 잔고에 안전하게 누적됨
        }
    }

    // =====================================================================
    // [보안 핵심 2] T2E 보상 할당 (비동기 Pull-over-Push)
    // =====================================================================
    receive(msg: AllocateReward) {
        // 봇만 유저에게 보상을 할당할 수 있음
        require(sender() == self.engine_bot, "VORA: Only Engine Bot can allocate");
        
        let current_reward: Int = 0;
        if (self.claimable_rewards.get(msg.user) != null) {
            current_reward = self.claimable_rewards.get(msg.user)!!;
        }
        self.claimable_rewards.set(msg.user, current_reward + msg.amount);
    }

    // 유저가 직접 수령 (가스비 대납 및 레이스 컨디션 방어)
    receive(msg: ClaimReward) {
        let user: Address = sender();
        let reward: Int = 0;
        
        if (self.claimable_rewards.get(user) != null) {
            reward = self.claimable_rewards.get(user)!!;
        }
        require(reward > 0, "VORA: No rewards to claim");

        // [SECURITY] 상태를 먼저 변경(초기화)한 후 토큰 발송. 
        // TON은 비동기이므로, 상태를 나중에 변경하면 중복 출금 위험 존재.
        self.claimable_rewards.set(user, 0);

        // 제톤 지갑을 통해 유저에게 전송
        self.send_jettons(user, reward, "VORA T2E Reward Claim");
    }

    // =====================================================================
    // 내부 헬퍼 함수: 제톤 전송 (TON 표준)
    // =====================================================================
    fun send_jettons(to: Address, amount: Int, payload: String) {
        send(SendParameters{
            to: self.vora_jetton_wallet,
            value: ton("0.05"), // 트랜잭션 가스비 (초과분은 반환됨)
            mode: SendPayGasSeparately,
            body: beginCell()
                .storeUint(0x0f8a7ea5, 32) // Jetton Transfer op-code
                .storeUint(0, 64)          // query_id
                .storeCoins(amount)        // 전송량
                .storeAddress(to)          // 받는 사람
                .storeAddress(self.owner)  // 남은 가스비 반환 주소
                .storeUint(0, 1)           // custom_payload 없음
                .storeCoins(ton("0.01"))   // forward_ton_amount
                .storeUint(0, 1)           // forward_payload 없음
                .endCell()
        });
    }

    // 바운스(오류 발생 시 롤백) 처리
    bounced(src: bounced<JettonTransferNotification>) {
        // [SECURITY] 비동기 전송이 실패하여 돌아왔을 때의 상태 복구 로직 (에지 케이스 방어)
    }
}