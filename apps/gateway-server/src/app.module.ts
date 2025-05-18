import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configuration, ConfigModule } from '@packages/env-config';
import { PassportModule, JwtModule } from '@packages/providers';
import { ProxyModule } from './proxy/index.js';

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
})
export class AppModule {}
