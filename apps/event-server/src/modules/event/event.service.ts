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
import { EVENT_ERRORS } from '@constants/index.js';

interface EventServiceInterface {
  findAll(query: EventQueryDto): Promise<Event[]>;
  findOne(id: string): Promise<Event>;
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
      throw new NotFoundException(EVENT_ERRORS.NOT_FOUND);
    }
    return event;
  }

  async create(createEventDto: CreateEventDto) {
    if (createEventDto.startDate >= createEventDto.endDate) {
      throw new BadRequestException(EVENT_ERRORS.START_DATE_AFTER_END_DATE);
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
      throw new ConflictException(EVENT_ERRORS.DUPLICATE_NAME);
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
    if (!event.conditions && event.eventType !== EventType.GENERIC) {
      throw new BadRequestException(
        `${event.eventType} ${EVENT_ERRORS.MISSING_CONDITIONS}`,
      );
    }

    if (!event.conditions) {
      return;
    }

    switch (event.eventType) {
      case EventType.DAILY_LOGIN:
        if (event.conditions.conditionKind !== 'dailyReset') {
          throw new BadRequestException(
            EVENT_ERRORS.DAILY_LOGIN.INVALID_CONDITION,
          );
        }
        break;

      case EventType.DAILY_TASK:
        if (event.conditions.conditionKind !== 'dailyReset') {
          throw new BadRequestException(
            EVENT_ERRORS.DAILY_TASK.INVALID_CONDITION,
          );
        }
        break;

      case EventType.ITEM_COLLECTION:
        const hasItemCollectionTask = event.conditions.tasks.some(
          (task) => task.type === 'itemCollection',
        );

        if (!hasItemCollectionTask) {
          throw new BadRequestException(
            EVENT_ERRORS.ITEM_COLLECTION.MISSING_TASK,
          );
        }
        break;

      case EventType.GENERIC:
        break;

      default:
        throw new BadRequestException(EVENT_ERRORS.UNSUPPORTED_EVENT_TYPE);
    }
  }
}