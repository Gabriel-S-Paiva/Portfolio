FROM node:lts-alpine AS build

RUN npm install -g pnpm@latest

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Limit network concurrency to 1 to prevent Wi-Fi packet drops
RUN pnpm config set max-sockets 1 && \
    pnpm config set network-concurrency 1 && \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]