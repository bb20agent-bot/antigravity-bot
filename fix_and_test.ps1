$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "1. Forcing Nginx Restart on GCP Server..." -ForegroundColor Yellow
$remoteCommand = "sudo cp /opt/vora-ecosystem/vora_nginx.conf /etc/nginx/sites-available/default ; sudo systemctl restart nginx"
gcloud compute ssh vora-brain-server --zone=asia-southeast1-a --project=vora-youtube-n8n --command=$remoteCommand

Write-Host "2. Testing HTTPS Webhook Payload..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "https://voraswap.com/api/webhook/tradingview" -Method Post -Body '{"symbol":"TEST", "timeframe":"1", "price":"1000", "signal":"BUY"}' -ContentType "application/json" -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 200) {
    Write-Host "SUCCESS! Status 200" -ForegroundColor Green
} else {
    Write-Host "FAILED! Status: $($response.StatusCode)" -ForegroundColor Red
}

Write-Host "Please copy this output to AI." -ForegroundColor Green
