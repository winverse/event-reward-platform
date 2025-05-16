# Event-reward-platform

# Setup database

```bash
  cd dockers

```

```bash
  docker-compose up -d
```

```bash
  # 10초 뒤에 실행, replica set
  docker exec -it mongo_db_single_rs mongosh --eval "printjson(rs.initiate({ _id: 'rs0', members: [ { _id: 0, host: 'localhost:27017' } ] }))"
```

# Create Schema

```bash
   cd packages/database
```

```bash
   pnpm db:push
```

# Generate Seed

```bash
    # 경로: /pacakages/database
    pnpm generate:seed
```