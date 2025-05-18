import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { MongoService } from '@packages/database';
import { JwtService, UtilsService } from '@packages/providers';
import { ConfigService } from '@packages/env-config';
import { LoggedUser, SafeUser } from '@packages/interface';
import { CreateUserDto } from './dto/index.js';
import {
  ALREADY_EXISTING_EMAIL_ERROR,
  ALREADY_EXISTING_NAME_ERROR,
} from '@constants/error.constants.js';

interface AuthServiceInterface {
  // 유저 생성
  createUser(createUserDto: CreateUserDto): Promise<SafeUser>;

  // 로그인
  login(user: LoggedUser): Promise<{ accessToken: string }>;
}

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    private readonly mongoService: MongoService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly utilsService: UtilsService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<SafeUser> {
    const { email, username, password } = createUserDto;
    const existingUserByEmail = await this.mongoService.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new ConflictException(ALREADY_EXISTING_EMAIL_ERROR);
    }

    const existingUserByUsername = await this.mongoService.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      throw new ConflictException(ALREADY_EXISTING_NAME_ERROR);
    }

    const hashedPassword = await this.utilsService.hashPassword(password);
    const user = await this.mongoService.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    const { password: _, ...rest } = user;
    return rest;
  }

  public async login(user: LoggedUser) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const expiresIn = this.configService.get('jwt.jwtExpiresIn');
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn }),
    };
  }
}