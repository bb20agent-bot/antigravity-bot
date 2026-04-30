$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "🚀 VORA Ecosystem - ROOT-FIX Cloud Deployment" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Package source code directly (NO LOCAL BUILD)
$zipPath = "deploy_latest.tar.gz"
Write-Host "[1/3] Packaging source files for remote build..." -ForegroundColor Yellow

$tempDir = "deploy_temp"
If (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
New-Item -ItemType Directory -Path $tempDir | Out-Null

foreach ($dir in @("src", "public", "pages", "user", "true_legacy_vora", "services", "components", "assets", "server", "signal_server")) {
    if (Test-Path $dir) {
        robocopy $dir "$tempDir\$dir" /E /XD node_modules /NJH /NJS /NDL /NC /NS
    }
}

foreach ($file in @("package.json", "package-lock.json", "vite.config.ts", "tsconfig.json", "tailwind.config.cjs", "postcss.config.cjs", "index.html", "ecosystem.config.prod.cjs", ".env", "vora_mt5_engine.py", "vora_webhook_handler.py", "vora_main_trading_bot.py", "webhook_receiver.py", "vora_nginx.conf")) {
    if (Test-Path $file) { Copy-Item $file -Destination "$tempDir\" }
}

Write-Host "Zipping the files..."
Push-Location $tempDir
tar.exe -czf "..\$zipPath" *
Pop-Location

Write-Host "[2/3] Uploading to GCP Server (vora-brain-server)..." -ForegroundColor Yellow
gcloud compute scp $zipPath vora-brain-server:/tmp/$zipPath --zone=asia-southeast1-a --project=vora-youtube-n8n
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "[3/3] Preparing Remote Execution Script..." -ForegroundColor Yellow

$scriptContent = @'
#!/bin/bash
set -e

echo "➡️ [1/6] Moving and extracting files..."
sudo mv /tmp/deploy_latest.tar.gz /opt/vora-ecosystem/
cd /opt/vora-ecosystem
sudo tar -xzf deploy_latest.tar.gz

echo "➡️ [2/6] Wiping old build to prevent caching issues..."
sudo rm -rf dist

echo "➡️ [3/6] Installing Frontend dependencies & Building..."
sudo npm install -g yarn 2>/dev/null
sudo yarn install --ignore-engines --cache-folder /tmp/yarn-cache
sudo yarn add react-is@18.3.1 --ignore-engines --cache-folder /tmp/yarn-cache
echo "Running Vite Build..."
sudo yarn build

echo "➡️ [4/6] Backend setup & Database Migration..."
cd server
sudo yarn install --production --ignore-engines --cache-folder /tmp/yarn-cache
echo "Applying Database Schema updates..."
sudo npx prisma generate --schema=./prisma/schema.prisma
sudo npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss
cd ..

echo "➡️ [5/6] ROOT FIX: Destroying PM2 Daemon to kill all Zombie 7-day processes..."
echo "Installing Python dependencies for Brown AI via venv..."
sudo apt-get update || true
sudo apt-get install -y python3-venv python3-pip || true
python3 -m venv /opt/vora-ecosystem/bot_env || true
/opt/vora-ecosystem/bot_env/bin/pip install flask python-telegram-bot flask-cors requests python-dotenv fastapi uvicorn pydantic || true

# This is the ultimate fix. We don't restart, we kill the entire PM2 background engine.
sudo pm2 kill || true
sudo rm -rf /root/.pm2/dump.pm2

echo "➡️ [6/6] Resurrecting Ecosystem natively..."
sudo chown -R $(whoami):$(whoami) /opt/vora-ecosystem
# Convert the .cjs to pure PM2 JSON to completely bypass JS/ESM conflicts
node -e "const cfg = require('./ecosystem.config.prod.cjs'); require('fs').writeFileSync('ecosystem.json', JSON.stringify(cfg));"
sudo pm2 start ecosystem.json --update-env
sudo pm2 save

# NGINX Configuration Auto-sync
if [ -f "/opt/vora-ecosystem/vora_nginx.conf" ]; then
    echo "Updating NGINX Proxy Pass routes to 127.0.0.1:3001..."
    sudo cp /opt/vora-ecosystem/vora_nginx.conf /etc/nginx/sites-available/default
    sudo systemctl restart nginx
fi

echo "✅ SERVER DIAGNOSTICS:"
sudo pm2 status
sudo netstat -tulpn | grep 3001 || echo "❌ CRITICAL: PORT 3001 IS STILL NOT LISTENING!"

echo "🎉 ROOT-FIX Deployment Completed Successfully!"
'@

Set-Content -Path "deploy.sh" -Value $scriptContent -Encoding Ascii
gcloud compute scp deploy.sh vora-brain-server:/tmp/deploy.sh --zone=asia-southeast1-a --project=vora-youtube-n8n

Write-Host "Executing Remote Build & Server Hard-Reset (Live Stream)..." -ForegroundColor Yellow
$remoteCommand = "sed -i 's/\r$//' /tmp/deploy.sh && bash /tmp/deploy.sh"
# Execute directly through SSH so the log output is heavily streamed to the terminal!
gcloud compute ssh vora-brain-server --zone=asia-southeast1-a --project=vora-youtube-n8n --command=$remoteCommand
$exitCode = $LASTEXITCODE

Remove-Item -Force deploy.sh
Remove-Item -Force $zipPath
Remove-Item -Recurse -Force $tempDir

if ($exitCode -eq 0) {
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host "✅ Ultimate Root-Fix Deployment is 100% DONE." -ForegroundColor Green
    Write-Host "======================================================" -ForegroundColor Green
} else {
    Write-Host "======================================================" -ForegroundColor Red
    Write-Host "❌ Deployment Script failed on GCP with Exit Code $exitCode." -ForegroundColor Red
    Write-Host "======================================================" -ForegroundColor Red
}
