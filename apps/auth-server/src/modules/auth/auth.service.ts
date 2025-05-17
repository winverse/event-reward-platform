import { Injectable, ConflictException } from '@nestjs/common';
import { MongoService, User } from '@packages/database';
import { JwtService } from '@packages/providers';
import { ConfigService } from '@packages/env-config';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/index.js';
import { LoggedUser } from '@packages/interface/dist/index.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly mongoService: MongoService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.mongoService.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoggedUser) {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const expiresIn = this.configService.get('jwt.jwtExpiresIn');
    return {
      accessToken: await this.jwtService.signAsync(payload, { expiresIn }),
      refreshToken: await this.jwtService.signAsync(
        { userId: user.id },
        { expiresIn: '7d' },
      ),
    };
  }
}