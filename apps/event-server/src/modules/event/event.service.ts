import { Injectable, NotFoundException } from '@nestjs/common';
import { MongoService, Prisma, Event } from '@packages/database';
import { CreateEventDto, UpdateEventDto, EventQueryDto } from './dto/index.js';

interface EventServiceInterface {
  // 이벤트 조회
  findAll(query: EventQueryDto): Promise<Event[]>;

  // 이벤트 조회
  findOne(id: string): Promise<Event>;

  // 이벤트 생성
  create(
    createEventDto: CreateEventDto,
  ): Promise<Prisma.EventCreateArgs['data']>;

  // 이벤트 수정
  update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Prisma.EventUpdateArgs['data']>;

  // 이벤트 삭제
  remove(id: string): Promise<void>;
}

@Injectable()
export class EventService implements EventServiceInterface {
  constructor(private readonly mongoService: MongoService) {}

  async findAll(query: EventQueryDto): Promise<Event[]> {
    const filters: Prisma.EventWhereInput = {
      ...(query.name ? { name: query.name } : {}),
      ...(query.eventType ? { eventType: query.eventType } : {}),
      ...(query.status ? { status: query.status } : {}),
    };

    return this.mongoService.event.findMany({
      where: filters,
      include: {
        rewards: true,
      },
    });
  }

  async findOne(id: string) {
    const event = await this.mongoService.event.findUnique({
      where: { id },
      include: {
        rewards: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async create(createEventDto: CreateEventDto) {
    return this.mongoService.event.create({
      data: createEventDto,
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.mongoService.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.mongoService.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  async remove(id: string) {
    const event = await this.mongoService.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.mongoService.event.delete({
      where: { id },
    });
  }
}
