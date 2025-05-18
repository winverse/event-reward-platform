import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventService } from './event.service.js';
import { CreateEventDto, UpdateEventDto, EventQueryDto } from './dto/index.js';
import { JwtAuthGuard } from '@packages/providers';
import { AdminOnly, RolesGuard, OperatorAccess } from '@packages/guards';

@Controller({
  path: '/events',
  version: '1',
})
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // event list
  @UseGuards(JwtAuthGuard)
  @Get('/')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: EventQueryDto) {
    return this.eventService.findAll(query);
  }

  // event 조회
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  // event 생성
  @UseGuards(JwtAuthGuard, RolesGuard)
  @OperatorAccess()
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  // event 업데이트
  @UseGuards(JwtAuthGuard, RolesGuard)
  @OperatorAccess()
  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  // event 삭제
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AdminOnly()
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
