import { Module } from '@nestjs/common';
import { EventService } from './event.service.js';
import { EventController } from './event.controller.js';
import { MongoModule } from '@packages/database';
import { ConfigModule } from '@packages/env-config';

@Module({
  imports: [MongoModule, ConfigModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
