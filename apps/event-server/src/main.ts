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

  const port = process.env.EVENT_SERVER_PORT!;
  await app.listen(port);
  return port;
}

bootstrap()
  .then((port) => {
    console.log(`Event Server is running on http://localhost:${port}`);
  })
  .catch((err) => {
    console.error(`Event Server is failed to start. ${err}`);
  });
