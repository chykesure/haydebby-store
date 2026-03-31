#!/bin/bash
set -e

echo "🔄 Initializing database..."

# Ensure db directory exists
mkdir -p db

# Push schema to database (creates tables if needed)
npx prisma db push --skip-generate

echo "📦 Seeding database..."
npx tsx prisma/seed.ts

echo "🚀 Starting server..."
exec npx next start