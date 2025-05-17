import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { MongoService } from '@packages/database';
import { JwtService, UtilsService } from '@packages/providers';
import { ConfigService } from '@packages/env-config';
import { LoggedUser, SafeUser } from '@packages/interface';
import { CreateUserDto, UpdateRoleDto } from './dto/index.js';

interface AuthServiceInterface {
  createUser(createUserDto: CreateUserDto): Promise<SafeUser>;

  login(
    user: LoggedUser,
  ): Promise<{ accessToken: string; refreshToken: string }>;

  updateUserRole(updateRoleDto: UpdateRoleDto): Promise<SafeUser>;
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
      refreshToken: this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '7d' },
      ),
    };
  }

  public async updateUserRole(updateRoleDto: UpdateRoleDto): Promise<SafeUser> {
    const user = await this.mongoService.user.findUnique({
      where: { id: updateRoleDto.userId },
    });

    if (!user) {
      throw new NotFoundException('NOT_FOUND_USER');
    }

    const updatedUser = await this.mongoService.user.update({
      where: { id: updateRoleDto.userId },
      data: { role: updateRoleDto.role },
    });

    const { password, ...result } = updatedUser;
    return result;
  }
}