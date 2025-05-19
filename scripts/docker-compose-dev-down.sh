#!/bin/bash

# 현재 실행 중인 애플리케이션 서버 중지
echo "🛑 Stopping application processes..."
pkill -f "pnpm.*dev" || true

# MongoDB 중지 및 제거
echo "🛑 Stopping and removing MongoDB container..."
docker stop mongo_db_single_rs_dev 2>/dev/null || true
docker rm mongo_db_single_rs_dev 2>/dev/null || true

# dockers 폴더에서 compose down 실행
echo "🧹 Cleaning up Docker resources..."
cd dockers && docker compose -f ../dockers/docker-compose.dev.yaml down
cd ..

echo "✅ Development environment cleanup completed!"