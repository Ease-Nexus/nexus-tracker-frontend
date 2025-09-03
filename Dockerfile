FROM node:22-alpine AS builder

WORKDIR /app
COPY . .

RUN yarn && yarn build

# Etapa 2: imagem final com Nginx
FROM nginx:alpine

RUN apk add --no-cache bash curl gettext

# Copia nginx/template e script de substituição
COPY proxy/nginx.template.conf /nginx.template.conf
COPY proxy/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copia os arquivos estáticos da UI
COPY --from=builder /app/dist /usr/share/nginx/html

ENTRYPOINT ["/entrypoint.sh"]