import { Global, Module } from '@nestjs/common';
import { PassportModule as NestPassportModule } from '@nestjs/passport';
import { ConfigModule } from '@packages/env-config';
import { MongoModule } from '@packages/database';
import { JwtStrategy } from './strategies/index.js';

@Global()
@Module({
  imports: [
    ConfigModule,
    NestPassportModule.register({ defaultStrategy: 'jwt' }),
    MongoModule,
  ],
  providers: [JwtStrategy],
  exports: [NestPassportModule],
})
export class PassportModule {}