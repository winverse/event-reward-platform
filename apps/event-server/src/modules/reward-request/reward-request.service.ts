import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { UtilsService } from '@packages/providers';
import {
  MongoService,
  Prisma,
  RequestStatus,
  UserRewardRequest,
} from '@packages/database';
import { CreateRewardRequestDto, RewardRequestQueryDto } from './dto/index.js';
import {
  ExchangeLimitConditions,
  MapEntryTask,
  MonsterHuntTask,
  ItemCollectionTask,
  EventConditions,
  TaskType,
} from '@packages/interface';

interface RewardRequestServiceInterface {
  // 보상 요청
  createRequest(
    userId: string,
    createDto: CreateRewardRequestDto,
    today: string,
  ): Promise<UserRewardRequest>;

  // 보상 요청 리스트 조회
  getUserRequests(
    userId: string,
    query: RewardRequestQueryDto,
  ): Promise<UserRewardRequest[]>;

  // 모든 보상 요청 리스트 조회
  getRequestAll(query: RewardRequestQueryDto): Promise<UserRewardRequest[]>;
}

@Injectable()
export class RewardRequestService implements RewardRequestServiceInterface {
  constructor(
    private readonly mongoService: MongoService,
    private readonly utilsService: UtilsService,
  ) {}

  async createRequest(
    userId: string,
    createDto: CreateRewardRequestDto,
    today: string,
  ) {
    const event = await this.mongoService.event.findUnique({
      where: { id: createDto.eventId },
      include: { rewards: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const now = new Date();
    if (now < event.startDate || now > event.endDate) {
      throw new BadRequestException('Event is not active at this time');
    }

    const reward = await this.mongoService.reward.findFirst({
      where: {
        id: createDto.rewardId,
        eventId: createDto.eventId,
      },
    });

    if (!reward) {
      throw new NotFoundException('Reward not found for this event');
    }

    // 보상 요청 제한 확인
    const conditions = event.conditions as unknown as EventConditions;
    await this.checkRequestLimit(
      userId,
      createDto.eventId,
      createDto.rewardId,
      conditions,
      today,
    );

    // 각 조건에 맞게 되었는지 인게임 서버와 통신을 통해서 검증
    const { status } = await this.verifyTaskConditions(conditions);

    return this.mongoService.userRewardRequest.create({
      data: {
        userId,
        eventId: createDto.eventId,
        rewardId: createDto.rewardId,
        status,
        claimedDate: today,
      },
    });
  }

  private async checkRequestLimit(
    userId: string,
    eventId: string,
    rewardId: string,
    conditions: EventConditions,
    today: string,
  ): Promise<void> {
    const baseWhere: Prisma.UserRewardRequestWhereInput = {
      userId,
      eventId,
      rewardId,
      status: RequestStatus.APPROVED,
    };

    const isExchangeLimit = this.hasExchangeLimit(conditions);
    const limitCount = isExchangeLimit ? conditions.exchangeLimitPerAccount : 1; // 기본값: 하루 한 번 요청 가능
    const where = isExchangeLimit
      ? baseWhere
      : { ...baseWhere, claimedDate: today };
    const errorMessage = isExchangeLimit
      ? '이 보상에 대한 최대 요청 횟수에 도달했습니다'
      : '이미 오늘 보상을 요청했습니다';

    const approvedCount = await this.mongoService.userRewardRequest.count({
      where,
    });

    if (approvedCount >= limitCount) {
      throw new ConflictException(errorMessage);
    }
  }

  private async verifyTaskConditions(
    conditions: EventConditions,
  ): Promise<{ status: RequestStatus }> {
    // 조건이 없는 이벤트인 경우
    if (!conditions || !conditions.tasks || conditions.tasks.length === 0) {
      return { status: RequestStatus.APPROVED };
    }

    // 태스크 유형에 따른 검증
    const promises = conditions.tasks.map(({ type, ...rest }) =>
      this.callExternalAPI(type, rest),
    );

    // 병렬 처리
    const result = await Promise.allSettled(promises);
    const isEligible = result.every(
      (res) => res.status === 'fulfilled' && res.value,
    );

    return {
      status: isEligible ? RequestStatus.PENDING : RequestStatus.FAILED,
    };
  }

  async getUserRequests(userId: string, query: RewardRequestQueryDto) {
    const { limit = 10, page = 1 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserRewardRequestWhereInput = {
      userId,
      ...(query.eventId ? { eventId: query.eventId } : {}),
      ...(query.status ? { status: query.status } : {}),
    };

    return this.mongoService.userRewardRequest.findMany({
      where: where,
      include: {
        event: true,
        reward: true,
      },
      orderBy: {
        requestedAt: 'desc',
      },
      skip,
      take: limit,
    });
  }

  async getRequestAll(
    query: RewardRequestQueryDto,
  ): Promise<UserRewardRequest[]> {
    const { limit = 10, page = 1 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserRewardRequestWhereInput = {
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.eventId ? { eventId: query.eventId } : {}),
      ...(query.status ? { status: query.status } : {}),
    };

    return this.mongoService.userRewardRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        requestedAt: 'desc',
      },
      skip,
      take: limit,
    });
  }

  private hasExchangeLimit(
    conditions: any,
  ): conditions is ExchangeLimitConditions {
    return (
      conditions &&
      typeof conditions === 'object' &&
      conditions.conditionKind === 'exchangeLimit'
    );
  }

  private async callExternalAPI(
    taskType: TaskType,
    ...body: any[]
  ): Promise<boolean> {
    try {
      const isMapEntryTask = this.isMapEntryTask({ taskType });
      const isMonsterHuntTask = this.isMonsterHuntTask({ taskType });
      const isItemCollectionTask = this.isItemCollectionTask({ taskType });
      const baseURI = 'https://nexon.com/api/v13/maple';

      // 조건마다 인게임 서버 API 경로를 다르게 호출
      if (isMapEntryTask) {
        await this.utilsService.fakeAxios(`${baseURI}/mapEntry`, {
          method: 'GET',
          data: body,
        });
        return true;
      }

      if (isMonsterHuntTask) {
        await this.utilsService.fakeAxios(`${baseURI}/monster-hunt`, {
          method: 'GET',
          data: body,
        });
        return true;
      }

      if (isItemCollectionTask) {
        await this.utilsService.fakeAxios(`${baseURI}/item-collection`, {
          method: 'GET',
          data: body,
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  private isMapEntryTask(task: any): task is MapEntryTask {
    return task && typeof task === 'object' && task?.type === 'mapEntry';
  }

  private isMonsterHuntTask(task: any): task is MonsterHuntTask {
    return (
      task &&
      typeof task === 'object' &&
      ['monsterHunt', 'eliteHunt', 'bossHunt'].includes(task?.type ?? '')
    );
  }

  private isItemCollectionTask(task: any): task is ItemCollectionTask {
    return task && typeof task === 'object' && task?.type === 'itemCollection';
  }
}
