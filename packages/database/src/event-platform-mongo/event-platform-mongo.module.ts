import { Module } from '@nestjs/common';
import { ConfigModule } from '@packages/env-config';
import { EventPlatformMongoService } from './event-platform-mongo.service.js';

@Module({
  imports: [ConfigModule],
  providers: [EventPlatformMongoService],
  exports: [EventPlatformMongoService],
})
export class EventPlatformMongoModule {}
