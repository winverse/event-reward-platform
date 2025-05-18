import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventService } from './event.service.js';
import { CreateEventDto, EventQueryDto } from './dto/index.js';
import { JwtAuthGuard } from '@packages/providers';
import { RolesGuard, OperatorAccess } from '@packages/guards';

@Controller({
  path: '/events',
  version: '1',
})
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // 1. 운영자 또는 관리자, 이벤트 목록 조회
  @UseGuards(JwtAuthGuard, RolesGuard)
  @OperatorAccess()
  @Get('/')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: EventQueryDto) {
    return this.eventService.findAll(query);
  }

  // 2. 이벤트 상세 조회
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  // 3. 이벤트 등록
  @UseGuards(JwtAuthGuard, RolesGuard)
  @OperatorAccess()
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }
}
