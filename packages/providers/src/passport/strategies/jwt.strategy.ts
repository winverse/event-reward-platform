import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@packages/env-config';
import { LoggedUser } from '@packages/interface';
import { MongoService } from '@packages/database';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly mongoService: MongoService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.jwtSecretKey'),
      issuer: configService.get('api.gateway_api_host'),
    });
  }

  async validate(payload: any): Promise<LoggedUser> {
    if (!payload) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.mongoService.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}
