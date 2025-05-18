import { Module } from '@nestjs/common';
import { configuration, ConfigModule } from '@packages/env-config';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { MongoModule } from '@packages/database';
import { AppController } from './app.controller.js';
import { PassportModule, JwtModule } from '@packages/providers';
import { AuthModule } from '@modules/auth/index.js';
import { UserModule } from '@modules/user/index.js';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@packages/filters';

@Module({
  imports: [
    NestConfigModule.forRoot({ load: [configuration] }),
    ConfigModule,
    MongoModule,
    PassportModule,
    JwtModule,
    AuthModule,
    UserModule,
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
