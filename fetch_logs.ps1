Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "🔍 VORA Backend Server Remote Log Fetcher" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

Write-Host "Connecting to GCP vora-brain-server to fetch PM2 Crash Logs... Pleas wait." -ForegroundColor Yellow
$remoteCommand = "sudo tail -n 100 /root/.pm2/logs/vora-backend-error.log"

gcloud compute ssh vora-brain-server --zone=asia-southeast1-a --project=vora-youtube-n8n --command=$remoteCommand

Write-Host "`n✅ Log fetch complete. Please copy the RED ERRORS above and paste them to the AI." -ForegroundColor Green
