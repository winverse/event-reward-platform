import { Global, Module } from '@nestjs/common';
import { PassportModule as NestPassportModule } from '@nestjs/passport';
import { ConfigModule } from '@packages/env-config';
import { MongoModule } from '@packages/database';
import { JwtStrategy, LocalStrategy } from './strategies/index.js';
import { UtilsModule } from '../utils/utils.module.js';


@Global()
@Module({
  imports: [
    ConfigModule,
    NestPassportModule.register({ defaultStrategy: 'local' }),
    MongoModule,
    UtilsModule,
  ],
  providers: [LocalStrategy, JwtStrategy],
  exports: [NestPassportModule],
})
export class PassportModule {}