#!/bin/bash

BUILD_OPTION=""

for arg in "$@"; do
  if [ "$arg" == "--build" ]; then
    BUILD_OPTION="--build"
    echo "🏗️ Build option enabled!"
  fi
done

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