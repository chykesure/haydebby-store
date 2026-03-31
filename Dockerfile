# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install bun
RUN npm install -g bun

# Copy dependency manifests
COPY package.json bun.lock* ./

# Install dependencies (including devDependencies for build)
RUN bun install --frozen-lockfile || bun install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN bunx prisma generate

# Copy source code
COPY . .

# Build Next.js standalone output
RUN bun run build

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

# Install bun for runtime
RUN npm install -g bun

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema and client for runtime DB operations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Create upload directory for product images
RUN mkdir -p /app/public/images/products && \
    mkdir -p /app/public/images/uploads && \
    mkdir -p /app/db && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment defaults
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "server.js"]
