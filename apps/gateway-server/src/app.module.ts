import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configuration, ConfigModule } from '@packages/env-config';
import { PassportModule, JwtModule } from '@packages/providers';
import { ProxyModule } from './proxy/index.js';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@packages/filters';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ConfigModule,
    PassportModule,
    JwtModule,
    ProxyModule,
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
