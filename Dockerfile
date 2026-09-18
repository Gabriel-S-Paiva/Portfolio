FROM node:lts-alpine AS build

RUN npm install -g pnpm@latest

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Disable build script enforcement and limit concurrency
RUN pnpm install --frozen-lockfile --network-concurrency=1 --config.ignore-scripts=false

COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]