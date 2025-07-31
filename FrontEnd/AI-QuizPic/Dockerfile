# 빌드 환경
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 배포 환경
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80