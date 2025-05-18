import { Module } from '@nestjs/common';
import { configuration, ConfigModule } from '@packages/env-config';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { MongoModule } from '@packages/database';
import { AppController } from './app.controller.js';
import { PassportModule, JwtModule } from '@packages/providers';
import { AuthModule } from '@modules/auth/index.js';
import { UserModule } from '@modules/user/index.js';

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
})
export class AppModule {}
