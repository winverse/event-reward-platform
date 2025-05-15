import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { configuration, ConfigModule } from '@packages/env-config';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [NestConfigModule.forRoot({ load: [configuration] }), ConfigModule],
  controllers: [AppController],
})
export class AppModule {}
