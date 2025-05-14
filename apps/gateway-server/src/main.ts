import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module.js';

const PORT = 5004;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(PORT);
}

bootstrap()
  .then(() => {
    console.log(`Gateway Server is running on http://localhost:${PORT}`);
  })
  .catch((err) => {
    console.error(`Gateway Server is failed to start. ${err}`);
  });
