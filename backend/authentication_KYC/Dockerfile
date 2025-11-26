# -----------------------------------------------------------------------------
# OLD Dockerfile (FROM VYJ - No seed data)
# -----------------------------------------------------------------------------
# FROM node:18

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3001
# CMD ["node", "src/index.js"]



# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# NEW Dockerfile (Have seed data)
# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# Stage 0: base (shared)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

# -----------------------------------------------------------------------------
# Stage 1: deps - install dependencies and generate Prisma client
# -----------------------------------------------------------------------------
FROM base AS deps

RUN npm install

# Copy package files
COPY package*.json ./


# -----------------------------------------------------------------------------
# Stage 2: builder - build 
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

COPY . .

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
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY ./database ./database

# make entrypoint executable
COPY ./entrypoint.sh ./entrypoint.sh
RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh

# --- THÊM ĐOẠN NÀY ---
# Tạo thư mục uploads và cấp quyền cho user nodejs
RUN mkdir -p /app/uploads/kyc && \
    chown -R nodejs:nodejs /app/uploads
# ---------------------

# Switch to non-root user
USER nodejs

EXPOSE 6000

ENTRYPOINT ["sh","./entrypoint.sh"]
# Start application
CMD ["node", "src/index.js"]