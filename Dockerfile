FROM node:lts-alpine AS build

RUN npm install -g pnpm@latest

WORKDIR /app

# Copy configuration files first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Run install with frozen lockfile
RUN pnpm install --frozen-lockfile --network-concurrency=1

COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]