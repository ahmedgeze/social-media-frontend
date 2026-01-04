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
COPY packages/api-client ./packages/api-client
COPY packages/auth-lib ./packages/auth-lib

# Copy social app
COPY apps/social ./apps/social

# Create public folder if it doesn't exist
RUN mkdir -p ./apps/social/public

# Install dependencies
RUN npm ci

# Build with API URL pointing to localhost (accessed via port-forward)
ENV NEXT_PUBLIC_API_URL=http://localhost:8080
RUN npm run build --filter=social

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built files
COPY --from=builder /app/apps/social/.next/standalone ./
COPY --from=builder /app/apps/social/.next/static ./apps/social/.next/static
COPY --from=builder /app/apps/social/public ./apps/social/public

USER nextjs

EXPOSE 3002

ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/social/server.js"]
