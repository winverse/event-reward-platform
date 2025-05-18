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
import { CreateRewardDto, UpdateRewardDto } from './dto/index.js';
import { JwtAuthGuard } from '@packages/providers';
import { AdminOnly, OperatorAccess, RolesGuard } from '@packages/guards';

@Controller({
  path: '/rewards',
  version: '1',
})
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/event/:eventId')
  @HttpCode(HttpStatus.OK)
  findByEventId(@Param('eventId') eventId: string) {
    return this.rewardService.findByEventId(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.rewardService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @OperatorAccess()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardService.create(createRewardDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @OperatorAccess()
  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateRewardDto: UpdateRewardDto) {
    return this.rewardService.update(id, updateRewardDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @AdminOnly()
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.rewardService.remove(id);
  }
}
