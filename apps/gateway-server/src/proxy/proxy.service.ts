import { Injectable } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import proxy from '@fastify/http-proxy';
import { authRoutes, eventRoutes, type ProxyRoute } from './proxy.config.js';
import { ConfigService } from '@packages/env-config';

@Injectable()
export class ProxyService {
  constructor(private readonly configService: ConfigService) {}

  async registerProxies(app: NestFastifyApplication): Promise<void> {
    const authApiHost = this.configService.get('api.auth_api_host');
    const eventApiHost = this.configService.get('api.event_api_host');

    const routes: ProxyRoute[] = [
      ...authRoutes(authApiHost),
      ...eventRoutes(eventApiHost),
    ];

    for (const route of routes) {
      await app.register(proxy, route);
    }
  }
}
