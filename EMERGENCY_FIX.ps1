$ErrorActionPreference = "Stop"
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "🔥 EMERGENCY SERVER RESET & REBUILD" -ForegroundColor Red
Write-Host "======================================================" -ForegroundColor Cyan

$remoteCommand = @"
set -e

echo "➡️ [1/4] Destroying Zombie PM2 Daemon & Processes..."
sudo pm2 kill || true
sudo rm -rf /root/.pm2/dump.pm2

echo "➡️ [2/4] Wiping old Frontend Build to force a fresh compilation..."
cd /opt/vora-ecosystem
sudo rm -rf dist

echo "➡️ [3/4] Re-building Frontend (This will error if TS fails)..."
sudo yarn build

echo "➡️ [4/4] Resurrecting Backend PM2 via Production Config..."
sudo pm2 start ecosystem.config.prod.cjs --update-env
sudo pm2 save

echo "--- VERIFICATION ---"
sudo pm2 status
sudo netstat -tulpn | grep 3001 || echo "⚠️ PORT 3001 IS STILL NOT LISTENING"
"@

Write-Host "Executing brutal SSH force-reset..." -ForegroundColor Yellow
gcloud compute ssh vora-brain-server --zone=asia-southeast1-a --project=vora-youtube-n8n --command=$remoteCommand

Write-Host "======================================================" -ForegroundColor Green
Write-Host "Done. Please COPY the output and paste it to me." -ForegroundColor Green
