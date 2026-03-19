import "@stdlib/deploy";

// =====================================================================
// 1. 메시지(Message) 정의
// =====================================================================
message MintVoraNFT {
    to: Address;          // NFT를 받을 팬덤 유저 지갑
    referrer: Address?;   // 초대한 사람의 지갑 주소 (옵션)
}

message UpdateLPStatus {
    item_index: Int;
    is_active: Bool;      // 유동성 공급 / 구독 유지 여부 업데이트 (dNFT 특성)
}

// =====================================================================
// 2. VORA 'V' NFT 개별 아이템 컨트랙트 (The dNFT)
// =====================================================================
contract VoraNFTItem {
    collection_address: Address;
    item_index: Int;
    owner: Address;
    
    // --- VORA dNFT 특화 변수 ---
    is_lp_provider: Bool; // 유동성 공급/구독 전환 유지 상태
    referrer: Address?;   // 추천인 온체인 기록 (에어드랍용)

    init(collection: Address, index: Int, owner: Address, referrer: Address?) {
        self.collection_address = collection;
        self.item_index = index;
        self.owner = owner;
        self.is_lp_provider = true; // 최초 민팅 시 유동성/구독 증명 완료로 간주
        self.referrer = referrer;
    }

    // 컬렉션(Admin)에서만 LP/구독 상태를 업데이트할 수 있는 동적(Dynamic) 기능
    receive(msg: UpdateLPStatus) {
        require(sender() == self.collection_address, "VORA: Only Collection can update");
        self.is_lp_provider = msg.is_active;
    }

    // 외부(백엔드 에어드랍 봇)에서 추천인 및 상태를 읽어갈 수 있는 Getter 함수
    get fun get_vora_item_data(): VoraItemData {
        return VoraItemData{
            index: self.item_index,
            owner: self.owner,
            is_lp_provider: self.is_lp_provider,
            referrer: self.referrer
        };
    }
}

struct VoraItemData {
    index: Int;
    owner: Address;
    is_lp_provider: Bool;
    referrer: Address?;
}

// =====================================================================
// 3. VORA 'V' NFT 컬렉션 컨트랙트 (The Master Collection)
// =====================================================================
contract VoraNFTCollection with Deployable {
    owner_address: Address;
    next_item_index: Int as uint32 = 0;
    
    // 핵심 비즈니스 로직: 딱 200개 한정 발행 (초기 코어 팬덤)
    const MAX_SUPPLY: Int = 200; 

    init(owner: Address) {
        self.owner_address = owner;
    }

    // 팬덤 구독 전환 시 Admin(백엔드 봇)이 NFT를 발행(Mint)하는 함수
    receive(msg: MintVoraNFT) {
        require(sender() == self.owner_address, "VORA: Only Admin can mint");
        require(self.next_item_index < self.MAX_SUPPLY, "VORA: Maximum supply of 200 reached");

        // 다음 NFT 아이템 주소 계산 및 배포
        let initCode = initOf VoraNFTItem(myAddress(), self.next_item_index, msg.to, msg.referrer);
        let nftAddress = contractAddress(initCode);

        // NFT Item 컨트랙트 배포
        send(SendParameters{
            to: nftAddress,
            value: ton("0.05"), // NFT 스토리지 렌트비 및 초기 가스비
            mode: SendIgnoreErrors,
            bounce: false,
            body: "VORA Fandom Minted".asComment(),
            code: initCode.code,
            data: initCode.data
        });

        self.next_item_index = self.next_item_index + 1;
    }

    // 컬렉션 정보 조회 Getter
    get fun get_collection_data(): CollectionData {
        return CollectionData{
            next_item_index: self.next_item_index,
            max_supply: self.MAX_SUPPLY,
            owner_address: self.owner_address
        };
    }
}

struct CollectionData {
    next_item_index: Int;
    max_supply: Int;
    owner_address: Address;
}