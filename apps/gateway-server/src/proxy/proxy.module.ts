import { Module } from '@nestjs/common';
import { ConfigModule } from '@packages/env-config';
import { ProxyService } from './proxy.service.js';

@Module({
  imports: [ConfigModule],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
