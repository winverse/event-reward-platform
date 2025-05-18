import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '@packages/providers';
import type { FastifyRequest } from 'fastify';
import { AdminOnly, RolesGuard } from '@packages/guards';
import { UpdateRoleDto } from '@modules/user/dto/index.js';
import { UserService } from '@modules/user/user.service.js';

@Controller({
  path: '/users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req: FastifyRequest) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @AdminOnly()
  @Patch('/:userId/role')
  @HttpCode(HttpStatus.OK)
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.userService.updateUserRole(userId, updateRoleDto);
  }
}
