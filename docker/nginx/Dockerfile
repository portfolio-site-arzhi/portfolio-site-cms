FROM node:24.11.1-alpine AS builder

ARG VITE_APP_NODE_ENV
ARG VITE_APP_BACKEND_URL
ARG VITE_APP_PORT

ENV VITE_APP_NODE_ENV=$VITE_APP_NODE_ENV
ENV VITE_APP_BACKEND_URL=$VITE_APP_BACKEND_URL
ENV VITE_APP_PORT=$VITE_APP_PORT

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.29.4-alpine-slim

RUN rm -rf /etc/nginx/conf.d/*
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
