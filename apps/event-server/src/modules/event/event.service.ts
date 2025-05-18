import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  type Event,
  MongoService,
  Prisma,
  EventStatus,
  EventType,
} from '@packages/database';
import { CreateEventDto, EventQueryDto } from './dto/index.js';

interface EventServiceInterface {
  // 이벤트 조회
  findAll(query: EventQueryDto): Promise<Event[]>;

  // 이벤트 조회
  findOne(id: string): Promise<Event>;

  // 이벤트 생성
  create(createEventDto: CreateEventDto): Promise<Event>;
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
      throw new NotFoundException('찾을 수 없는 이벤트 입니다.');
    }
    return event;
  }

  async create(createEventDto: CreateEventDto) {
    if (createEventDto.startDate >= createEventDto.endDate) {
      throw new BadRequestException('시작일은 종료일보다 이전이어야 합니다');
    }

    const now = new Date();
    if (now > createEventDto.endDate) {
      if (createEventDto.status !== EventStatus.ENDED) {
        createEventDto.status = EventStatus.ENDED;
      }
    }

    const existingEvent = await this.mongoService.event.findFirst({
      where: { name: createEventDto.name },
    });

    if (existingEvent) {
      throw new ConflictException('같은 이름의 이벤트가 이미 존재합니다');
    }

    this.validateEventTypeAndCondition(createEventDto);

    const { conditions, ...eventData } = createEventDto;
    const eventCreateData = {
      ...eventData,
      ...(conditions ? { conditions: conditions as any } : {}),
    };

    return this.mongoService.event.create({
      data: eventCreateData,
    });
  }

  private validateEventTypeAndCondition(event: CreateEventDto): void {
    // 이벤트 타입이 GENERIC이 아닌데 조건이 없는 경우
    if (!event.conditions && event.eventType !== EventType.GENERIC) {
      throw new BadRequestException(
        `${event.eventType} 이벤트 타입에는 조건이 필요합니다`,
      );
    }

    if (!event.conditions) {
      return;
    }

    // 이벤트 타입별 조건 검증
    switch (event.eventType) {
      case EventType.DAILY_LOGIN:
        if (event.conditions.conditionKind !== 'dailyReset') {
          throw new BadRequestException(
            '일일 로그인 이벤트에는 dailyReset 조건이 필요합니다',
          );
        }
        break;

      case EventType.DAILY_TASK:
        if (event.conditions.conditionKind !== 'dailyReset') {
          throw new BadRequestException(
            '일일 태스크 이벤트에는 dailyReset 조건이 필요합니다',
          );
        }
        break;

      case EventType.ITEM_COLLECTION:
        const hasItemCollectionTask = event.conditions.tasks.some(
          (task) => task.type === 'itemCollection',
        );

        if (!hasItemCollectionTask) {
          throw new BadRequestException(
            '아이템 수집 이벤트에는 최소 하나 이상의 itemCollection 태스크가 필요합니다',
          );
        }
        break;

      case EventType.GENERIC:
        break;

      default:
        throw new BadRequestException('지원되지 않는 이벤트 타입입니다');
    }
  }
}
