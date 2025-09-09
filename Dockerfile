# -----------------------------
# 1) Base image
# -----------------------------
ARG NODE_VERSION=20-alpine

# -----------------------------
# 2) deps: install node_modules
# -----------------------------
FROM node:${NODE_VERSION} AS deps
# Helpful for native deps on Alpine (even if you don't use any)
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy only manifests for caching
COPY package.json package-lock.json ./
RUN npm ci

# -----------------------------
# 3) builder: Next (Turbopack) build
# -----------------------------
FROM node:${NODE_VERSION} AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Bring deps and copy source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}

# (optional, for debugging)
RUN echo "Building with NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}"
# Build with Turbopack (per your package.json)
# IMPORTANT: next.config.ts must have `output: "standalone"`
RUN npm run build

# -----------------------------
# 4) runner: minimal image
# -----------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Azure injects PORT; default to 3000 for local
ENV PORT=3000

# Non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy standalone server + assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
USER nextjs

# Standalone build exposes server.js at root
CMD ["node", "server.js"]