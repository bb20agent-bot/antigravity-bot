$ErrorActionPreference = "Stop"
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "📡 Fetching Vora Backend & Brown AI Crash Logs..." -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan

$remoteCommand = "sudo pm2 logs vora-backend --lines 50 --nostream; echo '--------------------------------'; sudo pm2 logs joy-funnel-bot --lines 50 --nostream"

Write-Host "Executing remote log fetch on GCP..." -ForegroundColor Yellow
gcloud compute ssh vora-brain-server --zone=asia-southeast1-a --project=vora-youtube-n8n --command=$remoteCommand

Write-Host "======================================================" -ForegroundColor Green
Write-Host "✅ Done. Please COPY the output and paste it to the AI." -ForegroundColor Green
