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
        const expiresIn = configService.get('jwt.jwtExpiresIn');
        const issuer = configService.get('api.gateway_api_host');
        return {
          secret: secret,
          signOptions: { expiresIn, issuer },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
