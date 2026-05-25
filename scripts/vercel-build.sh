#!/usr/bin/env bash
set -euo pipefail

# Vercel Postgres автоматически добавляет POSTGRES_* — подставляем для Prisma
if [ -z "${DATABASE_URL:-}" ] && [ -n "${POSTGRES_PRISMA_URL:-}" ]; then
  export DATABASE_URL="$POSTGRES_PRISMA_URL"
fi
if [ -z "${DATABASE_URL:-}" ] && [ -n "${POSTGRES_URL:-}" ]; then
  export DATABASE_URL="$POSTGRES_URL"
fi

# Миграции требуют прямое подключение (не pooler)
if [ -z "${DIRECT_URL:-}" ] && [ -n "${POSTGRES_URL_NON_POOLING:-}" ]; then
  export DIRECT_URL="$POSTGRES_URL_NON_POOLING"
fi
if [ -z "${DIRECT_URL:-}" ] && [ -n "${POSTGRES_URL:-}" ]; then
  export DIRECT_URL="$POSTGRES_URL"
fi
if [ -z "${DIRECT_URL:-}" ] && [ -n "${DATABASE_URL:-}" ]; then
  export DIRECT_URL="$DATABASE_URL"
fi

echo "==> prisma generate"
npx prisma generate

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL не задан. Подключите Postgres в Vercel → Storage → Connect Project."
  exit 1
fi

echo "==> prisma migrate deploy"
npx prisma migrate deploy

echo "==> next build"
npx next build
