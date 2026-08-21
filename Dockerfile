# Multi-stage build producing a plain Node server.
#
# The image contains no platform-specific code: it is the same `node-server` Nitro output that
# `npm start` runs locally, so a VPS, Railway, Render, Fly, ECS or a bare Docker host all run the
# identical artifact.
#
#   docker build -t lux-game-studio .
#   docker run --rm -p 3000:3000 --env-file .env lux-game-studio

# --- build ------------------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first so this layer is cached until the lockfile changes.
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# node-server is the default in vite.config.ts; stated explicitly so an inherited
# NITRO_PRESET from the build environment cannot change what lands in the image.
ENV NITRO_PRESET=node-server
RUN npm run build

# --- runtime ----------------------------------------------------------------
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
# Nitro's node-server listens on this host; 0.0.0.0 is required to accept traffic
# from outside the container.
ENV HOST=0.0.0.0

# Nitro traces every runtime dependency into .output, so no npm install is needed here.
COPY --from=build /app/.output ./.output

# Run unprivileged. The node images ship a `node` user for exactly this.
USER node

EXPOSE 3000

# No shell wrapper, so SIGTERM reaches Node directly and shutdown is graceful.
CMD ["node", ".output/server/index.mjs"]
