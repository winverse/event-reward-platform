# Event-reward-platform

# 1. Setup database

```bash
  cd dockers

```

```bash
  docker compose up -d
```

```bash
  # 5초 뒤에, replica set
  docker exec -it mongo_db_single_rs mongosh --eval "printjson(rs.initiate({ _id: 'rs0', members: [ { _id: 0, host: 'mongodb:27017' } ] }))"

  # 5초 뒤에 
  docker exec -it mongo_db_single_rs mongosh --eval "rs.status()"

  # name: 'mongodb:27017', << name 설정 확인

```

# 2. Create Schema
```
   # 최상단에서 경로에서
   pnpm prisma:init
```

# 3. Generate Seed (필요한 경우)

```bash
    cd /packages/database
    pnpm generate:seed
```


# 실행

## 1. Dev 환경 실행

```bash
    pnpm dev
```


## 2. Prod 환경 실행

```bash
    
    # 1. 실행 권한 부여
    chmod +x scripts/compose-up.sh
    chmod +x scripts/compose-down.sh
    

```
