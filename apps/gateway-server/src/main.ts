import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module.js';
import process from 'node:process';
import proxy from '@fastify/http-proxy';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // env-config에서 검증하기 때문에 항상 존재
  const authApiHost = process.env.AUTH_API_HOST!;
  const eventApiHost = process.env.EVENT_API_HOST!;

  await app.register(proxy, {
    upstream: authApiHost,
    prefix: '/api/v1/auth',
    rewritePrefix: '/api/v1',
  });

  await app.register(proxy, {
    upstream: eventApiHost,
    prefix: '/api/v1/event',
    rewritePrefix: '/api/v1',
  });

  const port = process.env.GATEWAY_SERVER_PORT!;
  await app.listen(port);
  return port;
}

bootstrap()
  .then((port) => {
    console.log(`Gateway Server is running on http://localhost:${port}`);
  })
  .catch((err) => {
    console.error(`Gateway Server is failed to start. ${err}`);
  });
