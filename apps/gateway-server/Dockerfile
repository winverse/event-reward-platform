FROM node:18.20.8-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat

# RUN corepack enable
RUN npm install --global corepack@latest

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm add -g turbo
RUN turbo telemetry disable

ENV APP_NAME="gateway-server"
ENV APP_DIR="apps/${APP_NAME}"
RUN echo "APP_DIR value is: /${APP_DIR}"

WORKDIR /app

FROM base AS pruner
COPY . .
RUN turbo prune ${APP_NAME} --docker

FROM base AS builder
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/full/ ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prefer-frozen-lockfile

RUN pnpm --filter @packages/database generate:prisma
RUN turbo build --filter=${APP_NAME}

FROM base AS runner
ENV NODE_ENV=production

COPY --from=pruner /app/env/.env.production /app/env/.env.production
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/pnpm-*.yaml /app/
COPY --from=builder /app/packages/ /app/packages

WORKDIR /app/${APP_DIR}
COPY --from=builder /app/${APP_DIR}/dist /app/${APP_DIR}/dist
COPY --from=builder /app/${APP_DIR}/*.json .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

EXPOSE 5001

CMD [ "pnpm", "prod" ]