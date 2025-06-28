#!/bin/sh

# Wait for DB to be up
echo "⏳ Waiting for Postgres..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "✅ Postgres is ready!"

# Run Prisma migrations
npx prisma migrate deploy

# Start NestJS app
npm run start
