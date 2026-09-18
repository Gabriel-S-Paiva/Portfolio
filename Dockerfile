FROM node:lts-alpine AS build

RUN npm install -g pnpm@latest

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc* ./
RUN pnpm install --frozen-lockfile --network-concurrency=1

# Configure onlyBuiltDependencies via .npmrc for pnpm v10+
RUN echo "onlyBuiltDependencies=esbuild" > .npmrc && \
    pnpm install --frozen-lockfile --network-concurrency=1

COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]