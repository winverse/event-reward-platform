// event-server/src/modules/reward/reward.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RewardService } from './reward.service.js';
import { CreateRewardsDto } from './dto/index.js';
import { JwtAuthGuard } from '@packages/providers';
import { OperatorAccess, RolesGuard } from '@packages/guards';

@Controller({
  path: '/rewards',
  version: '1',
})
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  // 이벤트에 연결된 보상 정보 추가
  @UseGuards(JwtAuthGuard, RolesGuard)
  @OperatorAccess()
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRewardsDto: CreateRewardsDto) {
    return this.rewardService.createMany(createRewardsDto);
  }

  // 이벤트 별 보상 조회
  @UseGuards(JwtAuthGuard, RolesGuard)
  @OperatorAccess()
  @Get('/event/:eventId')
  @HttpCode(HttpStatus.OK)
  findByEventId(@Param('eventId') eventId: string) {
    return this.rewardService.findByEventId(eventId);
  }
}
