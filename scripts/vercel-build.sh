#!/usr/bin/env bash
set -euo pipefail

# Подставляем URL из переменных Vercel / Neon / Postgres Storage
if [ -z "${DATABASE_URL:-}" ]; then
  for candidate in POSTGRES_PRISMA_URL POSTGRES_URL DATABASE_URL_UNPOOLED NEON_DATABASE_URL; do
    if [ -n "${!candidate:-}" ]; then
      export DATABASE_URL="${!candidate}"
      echo "==> DATABASE_URL взят из ${candidate}"
      break
    fi
  done
fi

if [ -z "${DIRECT_URL:-}" ]; then
  for candidate in POSTGRES_URL_NON_POOLING POSTGRES_URL DATABASE_URL_UNPOOLED DATABASE_URL; do
    if [ -n "${!candidate:-}" ]; then
      export DIRECT_URL="${!candidate}"
      echo "==> DIRECT_URL взят из ${candidate}"
      break
    fi
  done
fi

echo "==> prisma generate"
npx prisma generate

if [ -z "${DATABASE_URL:-}" ]; then
  echo ""
  echo "ERROR: DATABASE_URL не задан на этапе сборки."
  echo ""
  echo "Что проверить в Vercel:"
  echo "  1. Storage → ваша БД → Connect Project → выберите этот проект"
  echo "  2. Settings → Environment Variables — должны быть (для Production):"
  echo "       DATABASE_URL = значение POSTGRES_PRISMA_URL"
  echo "       DIRECT_URL   = значение POSTGRES_URL_NON_POOLING"
  echo "  3. Галочки: Production + Preview (и Build, если есть)"
  echo "  4. После добавления — Redeploy (не старый коммит!)"
  echo ""
  echo "Диагностика (задано / нет):"
  for v in DATABASE_URL DIRECT_URL POSTGRES_PRISMA_URL POSTGRES_URL POSTGRES_URL_NON_POOLING DATABASE_URL_UNPOOLED NEON_DATABASE_URL; do
    if [ -n "${!v:-}" ]; then echo "  ${v}=да"; else echo "  ${v}=нет"; fi
  done
  exit 1
fi

echo "==> prisma migrate deploy"
npx prisma migrate deploy

echo "==> next build"
npx next build
