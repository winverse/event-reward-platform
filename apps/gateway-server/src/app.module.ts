import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configuration, ConfigModule } from '@packages/providers';

@Module({
  imports: [NestConfigModule.forRoot({ load: [configuration] }), ConfigModule],
  controllers: [AppController],
})
export class AppModule {}
