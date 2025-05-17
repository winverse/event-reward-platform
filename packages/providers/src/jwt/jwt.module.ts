import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@packages/env-config';
import { MongoModule } from '@packages/database';
import { JwtService } from './jwt.service.js';

@Global()
@Module({
  imports: [
    ConfigModule,
    MongoModule,
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get('jwt.jwtSecretKey');
        return {
          secret: secret,
          signOptions: { expiresIn: '1h' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
