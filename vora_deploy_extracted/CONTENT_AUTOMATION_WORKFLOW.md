# OPEN CLAW (오픈클로) - 콘텐츠 자동화 파이프라인 로드맵

**To: 브라운(Brown) 총괄 책임 이사 (CTO)**
**From: 안티그래비티 (Anti-Gravity) AI 팀**

본 문서는 트레이딩뷰 웹훅 및 바이낸스 실매매 자동화 데이터를 기반으로, 블로그 및 비디오 숏폼(YouTube) 콘텐츠를 자동 생성하고 배포하기 위한 **데이터 파이프라인 및 워크플로우 명세**입니다.

브라운 CTO님께서는 아래 아키텍처를 참고하시어, 실제 서비스를 운영하며 쌓이는 매매 이력이 어떻게 마케팅 및 커뮤니티 콘텐츠로 변환되는지 점검해 주시기 바랍니다.

---

## 1. 데이터 소스 및 접근 경로 (Data Sources & Access)

현재 시스템에서 트레이딩 시그널과 매매 체결 기록은 다음 3가지 핵심 채널을 통해 수집 및 저장되고 있습니다.

1. **Google Sheets Webhook (클라우드 로깅)**
   - **위치:** `binance_trading_bot.py` 에서 체결 즉시 `.env`의 `GOOGLE_SHEET_WEBHOOK` 엔드포인트로 전송
   - **목적:** 팀 전원이 실시간으로 매매 내역을 확인할 수 있는 마스터 데이터베이스 (CSV/XLSX 형태로 Export 가능)
2. **로컬 상태 보관소 (`RECOVERY_STATE.json`)**
   - **위치:** `c:\antigravity-bot\RECOVERY_STATE.json`
   - **목적:** 잦은 API 호출로 인한 할당량(Quota) 초과를 방지하기 위해 `v4_1_optimization.py`의 `QuotaManager`가 최근 거래 내역을 일괄(Batch) 처리용으로 임시 저장
3. **Vora 미디어 렌더링 API (실시간 트리거)**
   - **위치:** `https://api.vora-ai.com/api/internal/record-trade-video` (프로덕션 공용 URL) 및 `trade-log`
   - **목적:** 거래 체결 즉시 서버 내 Video Generator 파이프라인을 호출하여 애니메이션 및 숏폼 영상을 렌더링

---

## 2. 데이터 형식 및 페이로드 구조 (Data Schema / JSON)

AI 콘텐츠 생성 모델(Gemini 등)에 주입되는 데이터의 기본 스키마입니다.

### A. AI 미디어 생성용 Batch Payload (RECOVERY_STATE.json)
```json
"trade_batch": [
  {
    "symbol": "BTCUSDT",
    "signal": "BUY",
    "entry_price": 95000.0,
    "stop_loss": 90000.0,
    "take_profit": 105000.0,
    "size": 0.5,
    "balance": 10000.0,
    "order_id": "12345",
    "leverage": 5
  }
]
```

### B. Google Sheets 전송용 Webhook Payload
```json
{
  "symbol": "BTC/USDT",
  "action": "LONG_AUTO_HEDGED",
  "price": 95000.0,
  "quantity": 0.5,
  "message": "Auto SL: 90000 / TP: 105000"
}
```

---

## 3. 콘텐츠 자동화 워크플로우 (Automation Pipeline)

다니엘 CEO님의 가이드라인(콘텐츠 목적 및 톤앤매너)이 확정되는 대로, 아래 파이프라인에 AI 프롬프트가 이식되어 완전 자동화될 예정입니다.

1. **거래 데이터 수집 단계 (Data Ingestion)**
   - 실시간 매매 로그가 `trade_batch` 큐에 3개 이상 쌓이거나(Batch Size 도달), 특정 스케줄(일일 마감)이 되면 파이프라인이 즉각 가동됩니다.
2. **콘텐츠 생성 단계 (AI Generation)**
   - **텍스트:** 거래 데이터(진입가, 레버리지, 목표수익 등)를 Context로 삼아, 투자자 유치 및 커뮤니티 정보 공유 목적에 맞는 매매 복기 리포트를 작성합니다. 
   - **영상/이미지:** Vora 내부 API를 통해 해당 거래 차트와 PnL 결과를 시각화한 숏폼 모션 그래픽이 자동 렌더링됩니다.
3. **자동 퍼블리싱 단계 (Auto-Publishing)**
   - 작성된 텍스트는 `blogger_auto_post.py` 스크립트를 통해 `joyseorecipes.blogspot.com`에 자동 포스팅됩니다.
   - 포스팅 URL과 함께 영상 결과물은 텔레그램 커뮤니티(또는 자동 유튜브 업로드 API)로 디스패치됩니다.

---

## 4. 리뷰 및 후속 진행 항목 (To-Do for CTO)

브라운 CTO님께서는 성공적인 시스템 런칭을 위해 다음 사항들을 우선 결재 및 검토 부탁드립니다.

- [ ] **Google Sheets 접근 권한 부여:** 마스터 구글 시트의 읽기/쓰기 권한(또는 서비스 계정 JSON)이 `client_secret.json` 등과 올바로 연동되어 있는지 확인.
- [ ] **콘텐츠 톤앤매너(Prompt) 확정:** 블로그 게시글의 작성 어조(예: 전문적 분석 vs 직관적이고 쉬운 설명) 가이드라인 제공.
- [ ] **API Quota Management 점검:** 텍스트 및 영상 자동화 시 LLM API 할당량 초과(429 에러)를 방어하는 로직(`v4_1_optimization.py`)의 정상 동작 확인.

본 문서를 바탕으로 피드백을 주시면 즉각 반영하여 시스템에 배포하겠습니다. 
감사합니다.
