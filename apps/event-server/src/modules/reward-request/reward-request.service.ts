import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
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
  DailyResetConditions,
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

    const conditions = event.conditions as unknown as EventConditions;

    // 제한이 있는 보상 요청에 대해서 요청 횟수를 체크
    if (this.hasExchangeLimit(conditions)) {
      const limitRequestCount = conditions.exchangeLimitPerAccount;
      const approvedRequestCount =
        await this.mongoService.userRewardRequest.count({
          where: {
            userId,
            eventId: createDto.eventId,
            rewardId: createDto.rewardId,
            status: RequestStatus.APPROVED,
          },
        });

      if (limitRequestCount <= approvedRequestCount) {
        throw new ConflictException('Reward already requested today');
      }
    }

    let isEligible = true;
    let status: RequestStatus = RequestStatus.PENDING;

    // 각 조건에 맞게 되었는지 인게임 서버와 통신을 통해서 검증
    for (const task of conditions.tasks) {
      if (this.isDailyResetReward(event.conditions)) {
        if (this.isMapEntryTask(task)) {
          isEligible = await this.callExternalAPI(task.type);
        } else if (this.isMonsterHuntTask(task)) {
          isEligible = await this.callExternalAPI(task.type, task.targetCount);
        }
      }

      if (this.isItemCollectionTask(task)) {
        isEligible = await this.callExternalAPI(
          task.type,
          task.itemName,
          task.itemQuantity,
        );
      }
    }

    if (!isEligible) {
      status = RequestStatus.FAILED;
    }

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
      'exchangeLimitPerAccount' in conditions
    );
  }

  private isDailyResetReward(
    conditions: any,
  ): conditions is DailyResetConditions {
    return (
      conditions && typeof conditions === 'object' && 'dailyReset' in conditions
    );
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

  private async callExternalAPI(
    taskType: TaskType,
    ...body: any[]
  ): Promise<boolean> {
    try {
      await this.utilsService.sleep(150);
      this.randomlyThrowError(
        0.1,
        `${taskType} API call failed, Body: ${body}`,
      );
      console.log(`${taskType} API call succeeded`);
      return true;
    } catch (error) {
      return false;
    }
  }

  private randomlyThrowError(ratio: number, message: string) {
    if (Math.random() < ratio) {
      throw new Error(message);
    }
  }
}
