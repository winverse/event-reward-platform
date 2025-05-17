import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@packages/env-config';
import { LoggedUser } from '@packages/interface/dist/index.js';
import { MongoService } from '@packages/database/mongo';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly mongoService: MongoService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.jwtSecretKey'),
      issuer: configService.get('api.api_host'),
    });
  }

  async validate(payload: any): Promise<LoggedUser> {
    const user = await this.mongoService.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    if (!payload || !payload.userId) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}
