import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module.js';
import * as process from 'node:process';
import { EventConditions } from '@packages/interface';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const port = process.env.GATEWAY_SERVER_PORT ?? String(5000);
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
