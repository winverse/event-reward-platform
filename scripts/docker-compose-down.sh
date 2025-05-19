#!/bin/bash

echo "🛑 Stopping application containers..."
for dir in ./apps/*/; do
  if [ -f "${dir}docker-compose.yaml" ] || [ -f "${dir}docker-compose.yml" ]; then
    echo "Stopping container in ${dir}..."
    (cd "$dir" && docker compose down)
  fi
done

# MongoDB 중지
echo "🛑 Stopping MongoDB..."
cd dockers && docker compose down
cd ..

# 네트워크 제거
echo "🧹 Removing Docker network..."
docker network rm app-network || true

echo "✅ All containers stopped successfully!"