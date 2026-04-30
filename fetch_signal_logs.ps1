$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "🔍 VORA VIP 시그널 서버(FastAPI) 로그 확인" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

Write-Host "GCP 서버에 접속하여 상태와 로그를 가져오는 중입니다. 잠시만 기다려주세요..." -ForegroundColor Yellow

$remoteCommand = "sudo pm2 status && echo '----------------------------------' && sudo pm2 logs signal-server --lines 50 --nostream"

gcloud compute ssh vora-brain-server --zone=asia-southeast1-a --project=vora-youtube-n8n --command=$remoteCommand

Write-Host "`n✅ 위 출력된 내용(특히 빨간색 에러나 로그)을 복사해서 AI에게 보여주세요." -ForegroundColor Green
