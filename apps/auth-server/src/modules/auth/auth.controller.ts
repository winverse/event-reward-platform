import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from './dto/index.js';
import { JwtAuthGuard, LocalAuthGuard } from '@packages/providers';
import type { FastifyRequest } from 'fastify';

@Controller({
  path: '/auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 사용자 회원가입
   * @param createUserDto 회원가입 정보 DTO
   * @returns 생성된 사용자 정보 (비밀번호 제외)
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  /**
   * 사용자 로그인
   * @param req JwtAuthGuard 통과하면 req.user에 인증된 사용자 정보가 담김
   * @returns AccessToken & RefreshToken
   */
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: FastifyRequest) {
    if (!req.user) {
      throw new NotFoundException('NOT_FOUND_USER');
    }
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req: FastifyRequest) {
    return req.user;
  }
}