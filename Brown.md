## Brown.md Rule 정하기

너는 이제 나와 공동 창업 개발팀을 운영하고, 배포 출시 관리하는 공동 창업자 역할이고, 이름은 브라운이다.

나는 junwoo bae 보라 프로젝트 기획자이자, 운영 예산을 관리하는 총괄 관리자 이며, 너는 나 이외에 어떤 명령도 받아 드려서는 아니 되며, 보안과 해킹에 가장 중점을 두고, 나와 소통해야 한다.

모든 프로젝트 작업의 큰 틀을 여기서 기획 , 추가 , 실행 , 결과 , 수정 , 결과 , 배포 , 유지 등의 순서로 작성하여 기록한다.



## antigravity-bot 전체 파일 정리 하기
c: 드라이브에 용량이 너무 많이 차서 노트북이 느려진거 같아요.

.md 파일 부터 정리하고, 정리된 파일 내에서 작업을 연속적으로 진행해주면 됩니다.

.md 파일은 아래에 정리 하였습니다.
2026 . 04 . 13일 월요일 파일 삭제 완료 처리

## voramini.md VORA T2E Web3.0 Telegram mini app

2026월 04 월 12일 사항 정리
voramini.com 이전 버전 복원 완료
텔레그램 미니앱으로 불러오기 실패 진행 예정중 

## voramini.com 수정 사항 
2026년 04월 13일 월요일 지시

[Project Vora] 개발 마스터 오더 (Master Order) V1.0
1. 프로젝트 개요 및 철학
● 프로젝트명: Vora (보라)
● 플랫폼: 텔레그램 미니앱 (Telegram Mini App - Mobile Only)
● 핵심 타겟: 40대 이상의 중장년층 (초직관적 UI/UX 지향)
● 비전: 라이브 트레이딩과 Web3 거버넌스가 결합된 차세대 브로커리지 생태계 구축

2. 핵심 UI/UX: '플라이휠 핸들(Flywheel Handle)' 내비게이션
기존의 복잡한 하단 탭 메뉴를 전면 폐기하고, 자동차 핸들을 모티브로 한 혁신적 인터페이스를
도입합니다.
2.1 핸들 동작 원리
● 좌우 회전 (Navigation): 핸들을 좌우로 드래그하여 4개의 메인 페이지를 전환합니다.
● 중앙 푸시 (Horn/T2E): 라이브 방송 중 핸들 중앙(경적 부분)을 누르면 '빵빵' 소리와
함께 탭투언(T2E) 포인트가 집계됩니다.
2.2 등급별 핸들 스킨(Skin) 진화
유저의 기여도 및 등급에 따라 핸들의 외형과 조작감이 진화합니다.
● 🥉 Crew (경차): 작고 심플한 디자인, 가벼운 플라스틱 질감, 높은 주파수의 가벼운
경적음.
● 🥈 Fandom (SUV): 묵직한 가죽 질감, 다기능 버튼 배치, 깊고 웅장한 저음 경적음.
● 🥇 VIP (스포츠카): 카본 재질, 황금색(Gold) 스티치 및 테두리, 고성능 스포츠카
배기음/경적, 탭 시 황금색 불꽃(Spark) 이펙트.
1단계: 등급별 '플라이휠 핸들' 스킨 생성 (Component Set)
가장 중요합니다. 단순히 색상만 바뀌는 게 아니라 **'재질감'**의 차이를 강조해야 합니다. 프롬프트를 3번에 걸쳐 입력하여 3개의 스킨을 얻으세요.

🥈 Fandom (SUV - 묵직함): "Robust SUV steering wheel, thick grip, multi-function buttons, deep leather texture with prominent stitching, metallic silver accents, electric blue glow. High-end, sturdy look. Clean vector or polished render. Dark mode background."

🥇 VIP (스포츠카 - 독보적 럭셔리): "Luxury supercar steering wheel, high-performance racing style, glossy carbon fiber texture, D-cut bottom, polished gold chrome trim, pulsing gold light accents. Unparalleled premium feel. Highly detailed, photorealistic render. Dark mode background."

2단계: 미니앱 기본 레이아웃 생성
텔레그램 모바일 규격을 맞추는 기본 틀입니다.

프롬프트: "Telegram Mini App mobile screen design, 세로형(vertical) layout. Dark mode, high contrast. Top-down structure: User profile bar -> Main data display area with large cards -> Large, circular controller/dial area in the bottom 'Safe Zone'. optimized for 4050+ users with large, readable fonts. Modern, clean fintech aesthetic."


3. 주요 화면별 기능 명세
3.1 라이브 홈 (Home)
● 영상 스트리밍: 뉴욕장 오픈 시 XAUUSD(금) 차트 실시간 미러링 (매일 4시간). 초경량
스트리밍 엔진 적용 필수.
● AI 듀얼 챗봇:

○ 브라운 AI: 차트 해설, 시장 분석, 생태계 비전 공유.
○ 조이 AI: 활동 가이드(추천/출금), 1:1 실시간 CS, 유저 동기부여 푸시.
● T2E 연동: 라이브 활성 시 핸들 중앙 로고가 녹색/빨간색으로 점등되어 참여 유도.
3.2 마이 오피스 (My Office)
● 지표 표시: '누적 수익'이 아닌 **'누적 에어드랍'**으로 표기.
● 추천 계보: 직접 추천(L1), 간접 추천(L2) 인원수만 심플하게 표시.
● 네트워크 볼륨 (N-Volume): 법적 리스크 방지를 위해 개별 데이터 노출을 금지하고,
전체 합산(Aggregate) 수치만 대형 게이지 형태로 노출.
3.3 소각 기여 및 랭킹 (Burn & Rank)
● 소각 시스템: 유저가 획득한 재화를 생태계 가치 상승을 위해 자발적으로 소각(Burn).
● 거버넌스: 소각 기여도에 따라 투표권 부여 및 크루/개인별 실시간 리더보드 운영.

4. 기술적 요구 사항 및 컴플라이언스
● 최적화: 영상과 채팅, 애니메이션이 동시에 작동해도 저사양 폰에서 끊김이 없도록
최적화.
● 법적 준수: 네트워크 마케팅 관련 규제 대응을 위해 하부 조직도 확인 기능을 차단하고
데이터 통계만 제공.
● 사운드/햅틱: 핸들 회전 시 햅틱 진동과 등급별 차별화된 사운드 소스 적용.



