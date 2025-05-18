import { Module } from '@nestjs/common';
import { RewardRequestService } from './reward-request.service.js';
import { RewardRequestController } from './reward-request.controller.js';
import { MongoModule } from '@packages/database';
import { ConfigModule } from '@packages/env-config';
import { UtilsModule } from '@packages/providers';

@Module({
  imports: [MongoModule, ConfigModule, UtilsModule],
  controllers: [RewardRequestController],
  providers: [RewardRequestService],
  exports: [RewardRequestService],
})
export class RewardRequestModule {}
