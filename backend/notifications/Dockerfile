# ---- Base ----
FROM oven/bun:1.1.24-alpine AS base
WORKDIR /app


# ---- Deps ----
FROM base AS deps
COPY bun.lock package.json tsconfig.json ./
# Nếu có prisma, copy luôn để generate ở layer deps
COPY prisma ./prisma
RUN bun install --frozen-lockfile
RUN if [ -d prisma ]; then bun x prisma generate; fi


# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build TS -> dist (tuỳ script build trong package.json)
RUN if [ -f tsconfig.json ]; then bun x tsc -p tsconfig.json; fi


# ---- Run ----
FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package.json .


# Bảo mật user non-root
RUN addgroup -S app && adduser -S app -G app
USER app


# Prisma migrate khi khởi động (tuỳ chọn)
# Có thể gọi trong CMD/Entrypoint nếu muốn tự động deploy migrations


ENV PORT=4000
EXPOSE 4000


# Nếu code compile ra dist/index.js
CMD ["bun", "run", "dist/index.js"]