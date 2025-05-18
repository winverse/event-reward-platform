import { Module } from '@nestjs/common';
import { RewardService } from './reward.service.js';
import { RewardController } from './reward.controller.js';
import { MongoModule } from '@packages/database';
import { ConfigModule } from '@packages/env-config';

@Module({
  imports: [MongoModule, ConfigModule],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {}
