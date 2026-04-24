// 1. GoogleSheetLogger.gs - Google Apps Script 코드를 생성합니다.
// 이 코드를 구글 시트 -> 확장 프로그램 -> Apps Script에 붙여넣고 [배포] 하시면 됩니다.

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    // Webhook으로 전달된 JSON 파싱
    var data = JSON.parse(e.postData.contents);
    
    // 타임스탬프, 종목, 포지션(롱/숏), 진입가, 수량, 기타 메시지 등을 기록합니다.
    var rowData = [
      new Date(),                // 날짜 및 시간
      data.symbol || '-',        // 종목 (예: ETHUSDT)
      data.action || '-',        // 액션 (Buy / Sell)
      data.price || '-',         // 가격
      data.quantity || '-',      // 수량
      data.pnl || '-',           // 손익 (청산 시)
      data.message || 'Success'  // 상태 또는 에러 메시지
    ];
    
    // 시트에 새 행 추가
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // 에러 발생 시 시트에 에러 기록
    sheet.appendRow([new Date(), 'ERROR', '', '', '', '', error.toString()]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
