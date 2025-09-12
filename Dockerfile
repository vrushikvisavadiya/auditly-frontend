# -----------------------------
# 1) Base image
# -----------------------------
ARG NODE_VERSION=20-alpine

# -----------------------------
# 2) deps: install node_modules
# -----------------------------
FROM node:${NODE_VERSION} AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# -----------------------------
# 3) builder: Next (Turbopack) build
# -----------------------------
FROM node:${NODE_VERSION} AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

ARG NEXT_PUBLIC_API_BASE=""
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
RUN npm run build

# -----------------------------
# 4) runner: minimal image
# -----------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
USER nextjs
CMD ["node", "server.js"]