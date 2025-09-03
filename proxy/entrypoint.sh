#!/bin/sh

set -e

echo "🛠️ Substituindo variáveis no nginx.conf..."
envsubst '${FRONTEND_DOMAIN}' \
  < /nginx.template.conf > /etc/nginx/conf.d/default.conf

echo "🚀 Iniciando Nginx..."
nginx -g "daemon off;"