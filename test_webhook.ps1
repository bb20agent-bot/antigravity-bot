$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "1. Testing Webhook Locally..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "http://voraswap.com/api/webhook/tradingview" -Method Post -Body '{"symbol":"TEST", "timeframe":"1", "price":"1000", "signal":"BUY"}' -ContentType "application/json" -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 200) {
    Write-Host "SUCCESS! Status 200" -ForegroundColor Green
} else {
    Write-Host "FAILED! Status: $($response.StatusCode)" -ForegroundColor Red
}

Write-Host "`n2. Checking Nginx on GCP Server..." -ForegroundColor Yellow
$remoteCommand = "sudo systemctl status nginx --no-pager ; echo '------------------' ; sudo tail -n 20 /var/log/nginx/error.log"
gcloud compute ssh vora-brain-server --zone=asia-southeast1-a --project=vora-youtube-n8n --command=$remoteCommand

Write-Host "`nDONE! Please copy the output." -ForegroundColor Green
