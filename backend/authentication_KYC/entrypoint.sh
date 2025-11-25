#!/bin/sh
set -e

echo "[entrypoint] Starting entrypoint script..."

# Validate DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "[entrypoint] ERROR: DATABASE_URL environment variable is not set"
  exit 1
fi

# Mask password for logging
MASKED_URL=$(echo "$DATABASE_URL" | sed -E 's/(:[^:@]+)@/:*****@/')
echo "[entrypoint] DATABASE_URL: $MASKED_URL"

# Strip Prisma-specific query parameters for psql (psql doesn't understand ?schema=)
PSQL_URL=$(echo "$DATABASE_URL" | sed 's/?.*$//')
echo "[entrypoint] Sanitized URL for psql (removed query params)"

# Check if psql is available
if ! command -v psql >/dev/null 2>&1; then
  echo "[entrypoint] ERROR: psql command not found. postgresql-client is not installed."
  exit 1
fi

# Timeout settings
MAX_RETRIES=${DB_WAIT_MAX_RETRIES:-30}
SLEEP_SECONDS=${DB_WAIT_SLEEP_SECONDS:-2}
RETRY=0

echo "[entrypoint] Waiting for database to be available..."

# Wait for database with error output (use PSQL_URL without query params)
until psql "$PSQL_URL" -c '\q' 2>&1; do
  EXIT_CODE=$?
  RETRY=$((RETRY+1))
  
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "[entrypoint] ERROR: Timeout after $RETRY attempts (exit code: $EXIT_CODE)"
    echo "[entrypoint] Check: docker logs database"
    exit 1
  fi
  
  echo "[entrypoint] Postgres not ready - attempt $RETRY/$MAX_RETRIES (waiting ${SLEEP_SECONDS}s)"
  sleep "$SLEEP_SECONDS"
done

echo "[entrypoint] Database is available"


# Run SQL seed file (use PSQL_URL without query params)
SEED_FILE="./database/seed.sql"
if [ -f "$SEED_FILE" ]; then
  echo "[entrypoint] Running seed seed.sql: $SEED_FILE"
  if psql "$PSQL_URL" -f "$SEED_FILE"; then
    echo "[entrypoint] Seed data for User and UserProfile completed successfully"
  else
    EXIT_CODE=$?
    echo "[entrypoint] ERROR: Failed to run seed seed.sql (exit code: $EXIT_CODE)"
    exit 1
  fi
else
  echo "[entrypoint] INFO: No seed file found at $SEED_FILE, skipping"
fi

echo "[entrypoint] All initialization complete"
echo "[entrypoint] Starting application: $*"

# Replace shell with the application process
exec "$@"