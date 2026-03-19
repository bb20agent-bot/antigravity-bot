# Vora Fandom Shop & Airdrop DB Schema

n8n 워크플로우 연동을 위해 **새로운 Google Sheets(스프레드시트)를 생성**하시고, 하단에 2개의 탭(시트)을 만들어 주세요.

## 1번 시트: `Users` (유저 잔액 관리)
유저의 텔레그램 ID와 현재 보유 중인 보라 토큰(Vora Token)을 기록합니다.
* **A열**: `Telegram_ID`
* **B열**: `Username`
* **C열**: `Vora_Token_Balance` (숫자)

## 2번 시트: `Shop` (상점 판매 목록)
관리자가 추가한 상점 아이템과 가격을 기록합니다.
* **A열**: `Item_ID` (1, 2, 3...)
* **B열**: `Item_Name` (예: 기프티콘_커피)
* **C열**: `Price` (예: 500)
* **D열**: `Stock` (예: 100)

---
### ⚙️ 시스템 작동 기본 원리
* **사진 업로드 (출석/인증)**: 텔레그램에 유저가 사진을 올리면, n8n이 트리거되어 `Users` 시트의 해당 `Telegram_ID` 행을 찾아 `Vora_Token_Balance` 값에 +50(예시)을 더해 업데이트합니다.
* **`/shop_list`**: n8n이 `Shop` 시트의 데이터를 읽어와서 상점 목록을 표출해 줍니다.
* **`/buy [아이템명]`**: n8n이 `Shop` 시트에서 가격을 확인하고, `Users` 시트에서 유저 잔액을 차감한 뒤, 성공/실패 메시지를 보냅니다.
