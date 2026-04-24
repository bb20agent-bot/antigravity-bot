$ErrorActionPreference = "Stop"
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "🕵️ VORA SERVER DIAGNOSTIC TOOL" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan

$remoteCommand = @"
echo '--- PM2 STATUS ---'
sudo pm2 status

echo '--- NETSTAT 3001 ---'
sudo netstat -tulpn | grep 3001 || echo 'PORT 3001 IS NOT LISTENING!'

echo '--- NGINX STATUS ---'
sudo systemctl status nginx --no-pager | head -n 10

echo '--- PM2 ERROR LOGS (LAST 50 LINES) ---'
sudo tail -n 50 /root/.pm2/logs/vora-backend-error.log

echo '--- PM2 OUT LOGS (LAST 50 LINES) ---'
sudo tail -n 50 /root/.pm2/logs/vora-backend-out.log
"@

Write-Host "Connecting to GCP Server..." -ForegroundColor Yellow
gcloud compute ssh vora-brain-server --zone=asia-southeast1-a --project=vora-youtube-n8n --command=$remoteCommand
Write-Host "======================================================" -ForegroundColor Green
Write-Host "Done. Please COPY ALL THE TEXT ABOVE and paste it to the AI." -ForegroundColor Green
