import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ConfigService } from '@packages/env-config';
import { MongoService } from '@packages/database';
import { LoggedUser } from '@packages/interface/dist/index.js';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    configService: ConfigService,
    private readonly mongoService: MongoService,
  ) {
    super();
  }

  async validate(payload: any): Promise<LoggedUser> {
    console.log('validate PassportStrategy payload', payload);
    const user = await this.mongoService.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    
    if (!payload || !payload.userId) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}
