# -----------------------------------------------------------------------------
# Stage 0: base (shared)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat

# Copy package files first (for better caching)
COPY package*.json ./
# copy lock file if exists
COPY pnpm-lock.yaml* yarn.lock* package-lock.json* bun.lock* ./

# -----------------------------------------------------------------------------
# Stage 1: deps - install dependencies and generate Prisma client
# -----------------------------------------------------------------------------
FROM base AS deps

# install deps
RUN npm install

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# If you use prisma client generation
RUN npx prisma generate

# -----------------------------------------------------------------------------
# Stage 2: builder - build 
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source code
COPY . .

# Build TypeScript (if needed)
RUN npm run build || echo "No build script found"

# -----------------------------------------------------------------------------
# Stage 3: runner - minimal runtime image
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Install OpenSSL for Prisma AND postgresql-client for psql command
RUN apk update && apk add --no-cache \
    openssl \
    libc6-compat \
    postgresql16-client

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy necessary files from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/src/database ./database

# Copy entrypoint script and make it executable
COPY --chown=nodejs:nodejs ./entrypoint.sh ./
RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8099

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8099/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use relative path since WORKDIR is /app
ENTRYPOINT ["sh","./entrypoint.sh"]

# Start application with Prisma migrations
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]