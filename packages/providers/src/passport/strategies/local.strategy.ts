import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { MongoService } from '@packages/database';
import { LoggedUser } from '@packages/interface/dist/index.js';
import { UtilsService } from '../../utils/index.js';
import { ConfigService } from '@packages/env-config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly configService: ConfigService,
    private readonly mongoService: MongoService,
    private readonly utilsService: UtilsService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<LoggedUser> {
    const user = await this.mongoService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('NOT_FOUND_USER');
    }

    const isPasswordValid = await this.utilsService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('WRONG_PASSWORD');
    }
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}
