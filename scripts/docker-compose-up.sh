#!/bin/bash

BUILD_OPTION=""

for arg in "$@"; do
  if [ "$arg" == "--build" ]; then
    BUILD_OPTION="--build"
    echo "🏗️ Build option enabled!"
  fi
done

# 네트워크 생성 (존재하지 않는 경우에만 생성)
docker network inspect app-network >/dev/null 2>&1 || docker network create app-network

# MongoDB 실행
echo "🚀 Starting MongoDB..."
cd dockers && docker compose up -d
cd ..

# 5초 대기 후 레플리카 셋 초기화
echo "⏳ Waiting 5 seconds for MongoDB to initialize..."
sleep 5
echo "🔄 Initializing MongoDB Replica Set..."
docker exec -it mongo_db_single_rs mongosh --eval "printjson(rs.initiate({ _id: 'rs0', members: [ { _id: 0, host: 'mongodb:27017' } ] }))"

# 앱 디렉토리에서 docker-compose up 실행
echo "🚀 Starting application containers..."
for dir in ./apps/*/; do
  if [ -f "${dir}docker-compose.yaml" ] || [ -f "${dir}docker-compose.yml" ]; then
    echo "Starting container in ${dir}..."
    (cd "$dir" && docker compose up -d $BUILD_OPTION)
  fi
done

echo "✅ All containers are running!"
echo "📝 To check status run: docker ps"