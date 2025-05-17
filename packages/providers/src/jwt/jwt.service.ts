import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@packages/env-config';

@Injectable()
export class JwtService {
  private readonly secretKey: string;

  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {
    this.secretKey = this.configService.get('jwt.jwtSecretKey');
  }

  sign(payload: any, options?: JwtSignOptions): string {
    return this.nestJwtService.sign(payload, {
      ...options,
      secret: this.secretKey,
    });
  }

  verify(token: string, options?: any): any {
    return this.nestJwtService.verify(token, {
      ...options,
      secret: this.secretKey,
    });
  }
}
