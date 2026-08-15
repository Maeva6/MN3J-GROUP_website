#!/bin/sh
set -e

echo "→ Application des migrations Prisma…"
npx prisma migrate deploy

if [ "$SEED_ON_START" = "true" ]; then
  echo "→ Seed de la base (SEED_ON_START=true)…"
  node prisma/seed.js
fi

exec "$@"
