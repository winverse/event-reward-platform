#!/bin/bash

echo "🚀 Setting up development environment..."

# 필요한 경우 기존 MongoDB 컨테이너 중지
echo "🛑 Stopping existing MongoDB container..."
docker stop mongo_db_single_rs_dev 2>/dev/null || true
docker rm mongo_db_single_rs_dev 2>/dev/null || true

# MongoDB 시작
echo "🚀 Starting MongoDB for development..."
cd dockers && docker compose -f ../dockers/docker-compose.dev.yaml up -d
cd ..

# 10초 대기
echo "⏳ Waiting for MongoDB to start..."
sleep 10

# 레플리카 셋 초기화 전 상태 확인 (이미 초기화되어 있는지 확인)
REPLSET_STATUS=$(docker exec -it mongo_db_single_rs_dev mongosh --quiet --eval "try { rs.status().ok } catch(e) { 0 }")

if [ "$REPLSET_STATUS" = "1" ]; then
  echo "🔄 Replica Set already initialized."
else
  echo "🔄 Initializing MongoDB Replica Set..."
  docker exec -it mongo_db_single_rs_dev mongosh --eval "printjson(rs.initiate({ _id: 'rs0', members: [ { _id: 0, host: 'localhost:27017' } ] }))" || true
fi

# 상태 확인
echo "ℹ️ Checking Replica Set status..."
docker exec -it mongo_db_single_rs_dev mongosh --eval "rs.status()" || true

echo "✅ Development environment setup complete!"
sleep 10