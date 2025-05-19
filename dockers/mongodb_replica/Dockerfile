ARG MONGO_VERSION
FROM mongo:${MONGO_VERSION}

# 레플리카 셋 중복 초기화 문제를 방지하기 위한 수정된 entrypoint
ENTRYPOINT exec mongod --port $MONGO_REPLICA_PORT --replSet rs0 --bind_ip 0.0.0.0 & MONGOD_PID=$!; \
# rs.status()를 통해 레플리카 셋이 이미 초기화되었는지 확인 후 필요한 경우만 초기화
INIT_CHECK_CMD="rs.status().ok || rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '$MONGO_REPLICA_HOST:$MONGO_REPLICA_PORT' }] })"; \
until ($MONGO_COMMAND admin --port $MONGO_REPLICA_PORT --eval "$INIT_CHECK_CMD"); do sleep 1; done; \
echo "REPLICA SET ONLINE"; wait $MONGOD_PID;