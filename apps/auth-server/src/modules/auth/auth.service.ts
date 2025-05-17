import { Injectable, ConflictException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { MongoService, User } from '@packages/database';
import { JwtService, UtilsService } from '@packages/providers';
import { ConfigService } from '@packages/env-config';
import { LoggedUser } from '@packages/interface/dist/index.js';
import { CreateUserDto } from './dto/index.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly mongoService: MongoService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly utilsService: UtilsService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const { email, username, password } = createUserDto;
    const existingUserByEmail = await this.mongoService.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUserByUsername = await this.mongoService.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
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

  async login(user: LoggedUser) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const expiresIn = this.configService.get('jwt.jwtExpiresIn');
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn }),
      refreshToken: this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '7d' },
      ),
    };
  }
}