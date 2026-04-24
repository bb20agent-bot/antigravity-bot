#!/bin/bash
# VORA Ecosystem - GCP Compute Engine (Ubuntu) Setup Script
# Run this script on your fresh GCP VM instance to deploy the VORA Mini App Server.

echo "======================================================"
echo "🚀 VORA Ecosystem GCP Deployment Setup"
echo "======================================================"

# 1. Update OS and install dependencies
echo "[1/6] Updating system packages..."
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y curl git build-essential nginx python3 python3-pip python3-venv

# 2. Install Node.js (v18 LTS)
echo "[2/6] Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 (Process Manager)
echo "[3/6] Installing PM2 globally..."
sudo npm install -g pm2
pm2 startup

# 4. Setup VORA Application Directory
echo "[4/6] Setting up application directory..."
APP_DIR="/opt/vora-ecosystem"

sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# IMPORTANT FOR DEPLOYMENT:
# Since you are developing locally on Windows, you should upload your 'c:\antigravity-bot' folder 
# contents to this GCP VM. You can do this using gcloud CLI from your Windows machine:
#
#   gcloud compute scp --recurse C:\antigravity-bot\* your-vm-name:/opt/vora-ecosystem --zone=your-zone
#
# For now, we assume you have uploaded the files to $APP_DIR.

cd $APP_DIR

# Install frontend/repo dependencies
echo "Installing root dependencies..."
npm install
npm run build

# Install backend dependencies
echo "Installing server dependencies..."
cd server
npm install --production
cd ..

# 5. Setup Python Virtual Environment for Python Bots
echo "[5/6] Setting up Python dependencies..."
python3 -m venv .venv
source .venv/bin/activate
if [ -f "requirements.txt" ]; then
  pip install -r requirements.txt
else
  # Fallback for known requirements in the existing setup
  pip install requests telebot ccxt beautifulsoup4 python-dotenv
fi
deactivate

# 6. Start the Ecosystem using PM2
echo "[6/6] Starting background processes with PM2..."
# Assuming ecosystem.config.cjs is in the root directory
export NODE_ENV=production
pm2 start ecosystem.config.cjs
pm2 save

echo "======================================================"
echo "✅ Deployment setup complete!"
echo "Next Steps:"
echo "1. Configure your .env file in $APP_DIR"
echo "2. Setup NGINX reverse proxy to map port 80/443 to localhost:3001"
echo "3. Run 'pm2 logs' to monitor your application"
echo "======================================================"
