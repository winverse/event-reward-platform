import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { configuration, ConfigModule } from '@packages/env-config';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { JwtModule, PassportModule } from '@packages/providers';
import { MongoModule } from '@packages/database';
import { APP_FILTER } from '@nestjs/core';
import { EventModule } from '@modules/event/index.js';
import { HttpExceptionFilter } from '@packages/filters';
import { RewardRequestModule } from '@modules/reward-request/index.js';
import { RewardModule } from '@modules/reward/index.js';

@Module({
  imports: [
    NestConfigModule.forRoot({ load: [configuration] }),
    ConfigModule,
    MongoModule,
    PassportModule,
    JwtModule,
    EventModule,
    RewardModule,
    RewardRequestModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
