#!/bin/bash
ssh -i ~/.ssh/Smith-Server_key.pem ubuntu@smittysplanningcite.click << 'ENDSSH'
sudo cp -r ~/services/simon/public /usr/share/caddy/simon
sudo cp -r ~/services/startup/public /usr/share/caddy/startup  
sudo chown -R caddy:caddy /usr/share/caddy/simon
sudo chown -R caddy:caddy /usr/share/caddy/startup
sudo systemctl restart caddy
ENDSSH

