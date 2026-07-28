#!/bin/sh
set -e

if [ "${RUN_MIGRATIONS:-1}" = "1" ] && [ -n "${DATABASE_URL:-}" ]; then
  echo "[entrypoint] Running prisma migrate deploy..."
  npx prisma migrate deploy
fi

exec "$@"
