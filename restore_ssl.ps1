$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "1. Restoring HTTPS (SSL) Configuration for voraswap.com..." -ForegroundColor Yellow
$remoteCommand = "sudo certbot install --nginx --cert-name voraswap.com -d voraswap.com -d www.voraswap.com --redirect ; sudo systemctl restart nginx"
gcloud compute ssh vora-brain-server --zone=asia-southeast1-a --project=vora-youtube-n8n --command=$remoteCommand

Write-Host "`n2. Final Webhook Test..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "https://voraswap.com/api/webhook/tradingview" -Method Post -Body '{"symbol":"TEST", "timeframe":"1", "price":"1000", "signal":"BUY"}' -ContentType "application/json" -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 200) {
    Write-Host "SUCCESS! HTTPS restored and webhook delivered!" -ForegroundColor Green
} else {
    Write-Host "FAILED. Status: $($response.StatusCode)" -ForegroundColor Red
}

Write-Host "Please copy output to AI." -ForegroundColor Green
