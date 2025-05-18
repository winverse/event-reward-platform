import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { RewardRequestService } from './reward-request.service.js';
import { CreateRewardRequestDto, RewardRequestQueryDto } from './dto/index.js';
import { JwtAuthGuard } from '@packages/providers';
import { UserRole } from '@packages/database';
import { Roles, RolesGuard } from '@packages/guards';
import type { FastifyRequest } from 'fastify';
import { format } from 'date-fns';

@UseGuards(JwtAuthGuard)
@Controller({
  path: '/reward-request',
  version: '1',
})
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  // 유저가 보상 요청하는 API
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req: FastifyRequest,
    @Body() createDto: CreateRewardRequestDto,
  ) {
    const today = format(new Date(), 'yyyy-MM-dd');

    if (!req.user) {
      throw new UnauthorizedException('Need to login first.');
    }

    return this.rewardRequestService.createRequest(
      req.user.id,
      createDto,
      today,
    );
  }

  // 유저가 자신의 보상 이력을 보는 API
  @Get('/my-requests')
  @HttpCode(HttpStatus.OK)
  getMyRequests(
    @Req() req: FastifyRequest,
    @Query() query: RewardRequestQueryDto,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('Need to login first.');
    }
    return this.rewardRequestService.getUserRequests(req.user.id, query);
  }

  // 운영자/감사자/관리자가 모든 유저의 요청을 조회하는 API
  @UseGuards(RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.AUDITOR, UserRole.ADMIN)
  @Get('/')
  @HttpCode(HttpStatus.OK)
  getAdminRequests(@Query() query: RewardRequestQueryDto) {
    return this.rewardRequestService.getRequestAll(query);
  }
}
