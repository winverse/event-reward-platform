import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configuration, ConfigModule } from '@packages/env-config';
import { PassportModule, JwtModule } from '@packages/providers';

@Module({
  imports: [
    NestConfigModule.forRoot({ load: [configuration] }),
    ConfigModule,
    PassportModule,
    JwtModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
