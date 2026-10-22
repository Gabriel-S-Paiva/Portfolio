FROM node:22-alpine AS build
RUN npm install -g pnpm@11.17.0
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
# dev fixtures only; production reads the bind-mounted status/ written by ops/status/status.py
RUN rm -rf dist/status

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80