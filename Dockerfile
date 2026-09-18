FROM node:lts-alpine AS build

RUN npm install -g pnpm@latest

WORKDIR /app

# Copy lockfiles and package definitions
COPY package.json pnpm-lock.yaml ./

# Configure pnpm v10+ build script permissions before installing
RUN echo "onlyBuiltDependencies[]=@esbuild/linux-x64" >> .npmrc && \
    echo "onlyBuiltDependencies[]=esbuild" >> .npmrc && \
    echo "onlyBuiltDependencies[]=@img/sharp-libvips-linuxmusl-x64" >> .npmrc && \
    pnpm config set ignore-scripts false

# Single pnpm install execution
RUN pnpm install --frozen-lockfile --network-concurrency=1

COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]