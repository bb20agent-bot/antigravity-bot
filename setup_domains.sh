#!/bin/bash
# VORA Ecosystem - Domain & SSL Setup Script
# External IP: 34.142.162.20

echo "======================================================"
echo "🌐 VORA Domain & SSL Configuration"
echo "======================================================"

# 1. Install NGINX and Certbot if not already installed
echo "Checking dependencies..."
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx

# 2. Create NGINX Configuration
echo "Creating NGINX configuration for domains..."
NGINX_CONF="/etc/nginx/sites-available/vora"
DIST_DIR="/opt/vora-ecosystem/dist"

sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name voraswap.com vorascan.com voramini.com vorainvest.com www.voraswap.com www.vorascan.com www.voramini.com www.vorainvest.com;
    
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name voraswap.com vorascan.com voramini.com vorainvest.com www.voraswap.com www.vorascan.com www.voramini.com www.vorainvest.com;

    root $DIST_DIR;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Logging
    access_log /var/log/nginx/vora_access.log;
    error_log /var/log/nginx/vora_error.log;
}
EOF

# Enable the configuration
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test NGINX
sudo nginx -t
if [ $? -eq 0 ]; then
    echo "NGINX configuration is valid. Reloading..."
    sudo systemctl reload nginx
else
    echo "❌ NGINX configuration is invalid! Please check manually."
    exit 1
fi

# 3. SSL with Certbot
echo "======================================================"
echo "🔒 Requesting SSL Certificates (Let's Encrypt)"
echo "Make sure your DNS A Records are already pointing to 34.142.162.20"
echo "======================================================"

sudo certbot --nginx -d voraswap.com -d www.voraswap.com -d vorascan.com -d www.vorascan.com -d voramini.com -d www.voramini.com -d vorainvest.com -d www.vorainvest.com

echo "======================================================"
echo "✅ Domain setup complete!"
echo "You can now visit:"
echo " - https://voraswap.com (IDO)"
echo " - https://vorascan.com (Scan)"
echo " - https://voramini.com (Mini App)"
echo "======================================================"
