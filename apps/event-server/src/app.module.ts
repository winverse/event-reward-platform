import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { configuration, ConfigModule } from '@packages/env-config';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { EventModule } from '@modules/event/index.js';
import { RewardModule } from '@modules/reward/index.js';
import { JwtModule, PassportModule } from '@packages/providers';
import { MongoModule } from '@packages/database';

@Module({
  imports: [
    NestConfigModule.forRoot({ load: [configuration] }),
    ConfigModule,
    MongoModule,
    PassportModule,
    JwtModule,
    EventModule,
    RewardModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
