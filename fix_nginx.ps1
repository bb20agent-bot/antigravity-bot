$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Forcing Nginx Config to sites-enabled..." -ForegroundColor Yellow

$remoteCommand = "sudo cp /opt/vora-ecosystem/vora_nginx.conf /etc/nginx/sites-enabled/default ; sudo cp /opt/vora-ecosystem/vora_nginx.conf /etc/nginx/sites-available/default ; sudo systemctl restart nginx"
gcloud compute ssh vora-brain-server --zone=asia-southeast1-a --project=vora-youtube-n8n --command=$remoteCommand

Write-Host "Testing Webhook again..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "https://voraswap.com/api/webhook/tradingview" -Method Post -Body '{"symbol":"TEST", "timeframe":"1", "price":"1000", "signal":"BUY"}' -ContentType "application/json" -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 200) {
    Write-Host "SUCCESS! Nginx routing fixed." -ForegroundColor Green
} else {
    Write-Host "FAILED. Status: $($response.StatusCode)" -ForegroundColor Red
}

Write-Host "Please copy output." -ForegroundColor Green
