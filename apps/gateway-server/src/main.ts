import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module.js';
import process from 'node:process';
import { ProxyService } from './proxy/index.js';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // proxy 설정
  const proxyService = app.get(ProxyService);
  await proxyService.registerProxies(app);

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
