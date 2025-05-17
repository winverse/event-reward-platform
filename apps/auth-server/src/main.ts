import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const port = process.env.AUTH_SERVER_PORT ?? String(5001);
  await app.listen(port);
  return port;
}

bootstrap()
  .then((port) => {
    console.log(`Auth Server is running on http://localhost:${port}`);
  })
  .catch((err) => {
    console.error(`Auth Server is failed to start. ${err}`);
  });
