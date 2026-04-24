#!/bin/bash
sudo cp /home/PC2503/vora_nginx.conf /etc/nginx/sites-available/vora
sudo ln -sf /etc/nginx/sites-available/vora /etc/nginx/sites-enabled/vora
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
