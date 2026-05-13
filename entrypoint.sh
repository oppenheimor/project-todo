#!/bin/sh
set -e
echo "Running database migration..."
npx prisma db push --skip-generate
echo "Starting server..."
exec node server.js
