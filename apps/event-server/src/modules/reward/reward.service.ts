import { Injectable, NotFoundException } from '@nestjs/common';
import { MongoService, Reward } from '@packages/database';
import { CreateRewardsDto } from './dto/index.js';
import { EVENT_ERRORS, REWARD_ERRORS } from '@constants/index.js';

interface RewardServiceInterface {
  // 리워드 생성
  createMany(createRewardDto: CreateRewardsDto): Promise<void>;
  // 이벤트 별 리워드 조회
  findByEventId(eventId: string): Promise<Reward[]>;
  // 리워드 조회
  findOne(id: string): Promise<Reward>;
}


@Injectable()
export class RewardService implements RewardServiceInterface {
  constructor(private readonly mongoService: MongoService) {}

  async createMany(createRewardsDto: CreateRewardsDto) {
    const { eventId, rewards } = createRewardsDto;
    const event = await this.mongoService.event.findUnique({
      where: { id: createRewardsDto.eventId },
    });

    if (!event) {
      throw new NotFoundException(EVENT_ERRORS.NOT_FOUND);
    }

    await this.mongoService.reward.createMany({
      data: rewards.map((reward) => ({ ...reward, eventId })),
    });
  }

  async findByEventId(eventId: string) {
    return this.mongoService.reward.findMany({
      where: {
        eventId,
      },
    });
  }

  async findOne(id: string) {
    const reward = await this.mongoService.reward.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });

    if (!reward) {
      throw new NotFoundException(REWARD_ERRORS.NOT_FOUND);
    }

    return reward;
  }
}