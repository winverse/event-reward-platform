import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from './dto/index.js';
import { LocalAuthGuard } from '@packages/providers';
import type { FastifyRequest } from 'fastify';
import { NOT_FOUND_USER_ERROR } from '@constants/index.js';

@Controller({
  path: '/auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: FastifyRequest) {
    if (!req.user) {
      throw new NotFoundException(NOT_FOUND_USER_ERROR);
    }
    return this.authService.login(req.user);
  }
}