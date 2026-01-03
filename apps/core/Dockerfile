# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY turbo.json ./

# Copy package configs
COPY packages/typescript-config ./packages/typescript-config
COPY packages/eslint-config ./packages/eslint-config
COPY packages/ui ./packages/ui
COPY packages/types ./packages/types
COPY packages/auth-lib ./packages/auth-lib

# Copy core app
COPY apps/core ./apps/core

# Install dependencies
RUN npm ci

# Set service URLs for K8s deployment
ENV AUTH_SERVICE_URL=http://auth:3001
ENV SOCIAL_SERVICE_URL=http://social:3002

# Build the core app
RUN npm run build --filter=core

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built files
COPY --from=builder /app/apps/core/.next/standalone ./
COPY --from=builder /app/apps/core/.next/static ./apps/core/.next/static
COPY --from=builder /app/apps/core/public ./apps/core/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/core/server.js"]
