$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "1. Checking active Nginx configurations on GCP..." -ForegroundColor Yellow
$remoteCommand = "sudo nginx -T | grep 'location /api'"
gcloud compute ssh vora-brain-server --zone=asia-southeast1-a --project=vora-youtube-n8n --command=$remoteCommand

Write-Host "Please copy output." -ForegroundColor Green
