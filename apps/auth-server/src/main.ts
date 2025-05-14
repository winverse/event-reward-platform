import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';

const PORT = 5001;

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
    console.log(`Auth Server is running on http://localhost:${PORT}`);
  })
  .catch((err) => {
    console.error(`Auth Server is failed to start. ${err}`);
  });
