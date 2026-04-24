# OPEN CLAW (오픈클로) - CTO 브라운(Brown) 인수인계 및 업무 가이드

안녕하세요, 이번에 오픈클로 총괄 책임 이사(CTO)로 합류하신 **브라운(Brown)** 님을 환영합니다. 
본 문서는 지금까지 진행된 **VORA (Anti-Gravity Bot Platform) 프로젝트의 개발 현황**을 브리핑하고, 앞으로 CTO로서 리드해 주셔야 할 **잔여 핵심 과제**들을 정리한 핸드오버 문서입니다.

---

## 1. 프로젝트 개요 (Project Overview)
**VORA AI (Anti-Gravity Bot Platform)**는 AI 기반의 고효율 트레이딩 전략(레버리지, 그리드, 모멘텀 등)을 텔레그램 미니앱(TMA) 환경에서 자동화하고, 사용자가 앱 내 상호작용(Tap-to-Earn)을 통해 생태계에 기여 및 보상(VORA 토큰)을 얻어가는 혁신적인 TradeFi 플랫폼입니다. 
시각적으로는 미래지향적인 짙은 우주 테마(Dark Void/Glassmorphism)를 기조로 하며, 핵심 키 컬러는 VORA Blue(#0088cc) 및 Force Purple(#a855f7)입니다.

---

## 2. 지금까지의 개발 진행 상황 (Completed Features)
지금까지 프론트엔드 UI 구축, 스마트 컨트랙트 기초, 파이프라인 연동 분야에서 상당한 진척이 있었습니다. 주요 완료 내역은 다음과 같습니다.

### A. 프론트엔드 및 플랫폼 UI (React + Vite)
* **모바일 최적화 미니앱 UI 구축:** 하단 네비게이션 탭(Home, My Office, Marketplace, Info), 대시보드 구조 등 `App.tsx` 기반 핵심 프레임워크 완성.
* **Tap-to-Earn (T2E) 시스템 완성:** My Office 탭 내에서 에너지를 소모하여 터치(탭) 시 VORA 포인트를 실시간으로 획득하는 모듈 및 플로팅 애니메이션 통합 적용.
* **동적 분배 엔진 (Dynamic Pool) 시스템:** 구독료 원금 회수 전 단계(Phase 1)와 원금 도달 이후(Phase 2)의 7:3 생태계 분배 로직, 72시간 내 재활성화(Active Safegaurd 1배수/0.3배수) 시각화 타이머 구축 완료.
* **버그 및 컴파일 에러 해결:** 최근 `import` 경로 문제(types.ts, components/, pages/, services/)로 인한 빈 화면 렌더링 에러를 완벽히 픽스하고 핫 리로드(Hot Reload) 안정화 달성.

### B. 시그널 파이프라인 및 워크플로우 (Trading Automations)
* 3대 핵심 모델 전략(ETH V11.1, SOL V15.1, Forex V13)의 파인스크립트 포팅 준비.
* **독립 Webhook 기반 파이프라인:** 트레이딩뷰 웹훅 신호를 Python 핸들러(`vora_webhook_handler.py`)를 거쳐 텔레그램 등으로 파싱 및 자체 매매 트리거로 전송하는 독립 API 웹훅 서버 아키텍처 준비 완료.

### C. TON 스마트 컨트랙트 기반 (Tact)
* VoraToken, Treasury, Escrow, VestingVault 등 주요 컨트랙트들을 Tact 언어로 작성 후 테스트넷(Testnet) 컴파일 및 배포 기초 완료 (Address 추출 완료).

---

## 3. 앞으로의 핵심 해결 과제 (Immediate Next Steps for CTO)

브라운 CTO님께서 본격적인 서비스 오픈(내일 트레이딩 세션 시작)을 대비하여 우선적으로 점검하고 진두지휘해주셔야 하는 과제 리스트입니다.

### 🎯 Task 1: 안정적인 앱 호스팅 및 연결성 확보 (User App Host Stabilization)
* **클라이언트/서버 통신 이슈:** 현재 텔레그램 봇이나 뷰어에서 실행되는 미니앱(User App)이 Host 환경에 접근할 때 가끔 끊기거나 연결 응답 지연(Timeout)이 되는 문제 해결 모색. 
* **배포 환경 검증:** 로컬 개발 서버가 아닌 실 서비스 배포(Vercel, AWS, Cloudflare 등) 환경에서 CORS 및 WebSocket 연결 무결성을 철저히 보완해야 함.

### 🎯 Task 2: TradingView ↔ Webhook ↔ Python Bot 파이프라인 E2E 튜닝
* 트레이딩뷰(TradingView) 얼럿(Alert) 신호 발생부터 서버를 관통해 파이썬 기반 거래 로직으로 들어가 최종 텔레그램 푸시 및 실제 API(Binance/Bybit 퓨처스) 주문(Order)까지 걸리는 레이턴시(속도) 단축 최적화.
* 비정상 시그널 필터링, 네트워크 오류 시 재시도 로직 등 엣지 케이스 점검 필수.

### 🎯 Task 3: 스마트 컨트랙트(TON) ↔ 프론트엔드 연동 완성
* 웹 애플리케이션 프론트엔드의 데이터(유저가 T2E로 벌어들인 VORA 잔고 변경분, 결제 구독 정보)를 TON 블록체인 상의 지갑 연결 기능(TonConnectUIProvider)과 완전히 락킹(Locking)시키는 로직.
* 유저가 지갑 서명(Sign)을 통해 컨트랙트 스코어로 데이터를 On-chain에 기록할 수 있는 브릿지 개발 마무리.

### 🎯 Task 4: 브랜드 아이덴티티 완전 적용 (로고 / UI 피팅)
* `Vora_Logo.html` 로고 이미지를 각 페이지 헤더와 대시보드 컴포넌트들에 매끄럽게 SVG화하여 모바일 비율에서도 깨짐 현상이 나지 않도록 파이널 폴리싱 (일부 진행됨, 검수 필요).

---

**CTO 브라운님,**
이 문서를 토대로 잔여 개발 프로세스를 정렬해주시고, 기술 스택 전반에 걸친 아키텍처 점검을 진두지휘해주시면 완벽한 트레이딩 서비스 오픈이 가능할 것입니다. 앞으로 잘 부탁드립니다!
