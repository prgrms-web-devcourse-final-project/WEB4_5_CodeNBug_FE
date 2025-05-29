# 1단계: build
FROM node:22-alpine AS builder

WORKDIR /app

COPY . .
RUN corepack enable && corepack prepare pnpm@10.6.5 --activate
RUN pnpm install
RUN pnpm build

# 2단계: nginx로 정적 서빙
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
