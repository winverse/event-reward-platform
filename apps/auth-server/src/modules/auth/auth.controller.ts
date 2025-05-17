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
  Patch,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto, UpdateRoleDto } from './dto/index.js';
import { JwtAuthGuard, LocalAuthGuard } from '@packages/providers';
import type { FastifyRequest } from 'fastify';
import { AdminOnly, RolesGuard } from '@packages/guards';

@Controller({
  path: '/',
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @AdminOnly()
  @Patch('/users/:userId/role')
  @HttpCode(HttpStatus.OK)
  async updateUserRole(@Body() updateRoleDto: UpdateRoleDto) {
    return this.authService.updateUserRole(updateRoleDto);
  }
}