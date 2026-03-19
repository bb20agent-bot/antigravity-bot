# VORA Unified Telegram & Brown AI Automation Guide

이 가이드는 보라 플랫폼의 핵심 커뮤니티인 **공식 채널/그룹, 팬덤 그룹, 크루 그룹**을 하나의 봇(Vora_Bot)과 메인 인공지능인 **브라운 파운더 AI(Brown Founder AI)** 로 통합하여 관리하는 통합 웹훅(Webhook) 운영 가이드입니다.

이전에는 각 그룹마다 개별적인 워크플로우(`webhook_vora_meetup.json`, `webhook_fandom_meetup.json`, `webhook_crew_meetup.json` 등)가 존재했으나, 이를 하나의 파이프라인으로 통합하여 유지 보수를 극대화하고 AI의 컨텍스트를 일치시킬 수 있습니다.

---

## 🏗 통합 아키텍처 (Unified Architecture)

하나의 **Telegram Trigger** 노드에서 모든 메시지를 수신한 후, 텔레그램 방 제목(`chat.title`) 또는 ID(`chat.id`)를 기준으로 **Switch 노드**를 통해 3개의 각기 다른 페르소나를 가진 브라운 AI에게 분배(Routing)하는 구조입니다.

### 1단계: 조건 필터링 (Operating Hours)
봇이 무분별하게 24시간 응답하는 것을 방지하기 위해 심야 시간(예: 한국시간 00:00 ~ 09:00)에는 휴식 메시지("현재는 휴식 시간입니다")를 내보내고 AI API 호출을 방지합니다.

### 2단계: 그룹 라우팅 (Group Routing)
`Switch` 노드를 통해 그룹별로 워크플로우를 분기합니다.
*   **루트 0 (Official):** 공식 채널 및 그룹 (VORA Official)
*   **루트 1 (Fandom):** 코어 팬덤 엘리트 그룹 (VORA Fandom)
*   **루트 2 (Crew):** 일반 다단계 레퍼럴 및 팀빌딩 그룹 (VORA Crew)

### 3단계: 브라운 파운더 AI 페르소나 부여 (AI Persona Assignment)
각 라우팅된 경로마다 동일한 LLM(Gemini Pro 등)을 사용하지만, **시스템 프롬프트(System Prompt)** 를 그룹의 목적에 맞게 완전히 다르게 부여합니다.

1.  **[공식 채널/그룹] AI 모드**
    *   **역할:** 공식적인 뉴스 공지, 압도적인 수익률 브리핑, 유튜브/쇼츠 시청 독려.
    *   **톤:** 플랫폼 대표(Founder)의 전문적이고 격식 있는 톤. 구체적인 CS 처리는 팬덤 채널로 유도.
2.  **[팬덤(Fandom) 그룹] AI 모드 & 샵 시스템(Shop/Airdrop)**
    *   **역할:** 공식 채널 내용 포워딩 + 집중적인 고객 지원(CS), 팬덤 특별 혜택 안내.
    *   **커머스 & 에어드랍 로직 내장:** 
        *   유저가 `/shop_list` 명령어 입력 시 Google Sheets와 연동해 상점 목록을 불러옵니다.
        *   유저가 사진(Photo)을 업로드하여 인증 시 자동으로 Google Sheets에 50 VORA 토큰 에어드랍이 추가됩니다.
        *   이외의 모든 대화는 친절하고 능동적인 브라운 AI가 전담하여 100% 문제를 해결해 줍니다.
3.  **[크루(Crew) 그룹] AI 모드**
    *   **역할:** 공식 내용 포워딩 + CS 방어 + **다단계(Uni-level) 팀빌딩 리드 및 레퍼럴 독려.**
    *   **톤:** 리더십 넘치고 동기부여를 강하게 심어주는 멘토(Mentor) 톤. "당신도 별(Star) 등급이 될 수 있다", "팀원을 모아라"를 지속적으로 코칭.

---

## 🚀 적용 방법

1.  **웹훅 시스템 접속:** 본인의 독립 웹훅 서버 환경을 엽니다.
2.  **Import:** 구성을 위해 제공된 `webhook_unified_telegram_brown_ai.json` 등 설정 파일을 웹훅 환경에 반영합니다.
3.  **텔레그램 자격 증명 연동:**
    *   `Telegram Trigger` 노드와 3개의 `Telegram Reply` 노드에 기존 Vora_Bot의 Credential(API Key)을 연결합니다.
4.  **라우팅(Routing) 세팅:**
    *   라우팅 조건문 안에 들어가서 실제 텔레그램 방 제목 문자열("VORA Official", "VORA Fandom" 등)을 본인이 생성한 실제 방 이름으로 맞추거나, 방 ID(Chat ID 숫자) 로 규칙(Rules)을 변경합니다.
5.  **AI 모델 및 Memory 연결 (옵션):**
    *   각 AI 시스템에 본인의 LLM 자격 증명(Gemini API 등)을 설정하고, 과거 맥락 유지를 위한 메모리 캐싱을 연결해 주면 자연스러운 대화가 가능해집니다.

---

*"We do not build bots. We build an AI ecosystem." - Brown, Founder of VORA*
