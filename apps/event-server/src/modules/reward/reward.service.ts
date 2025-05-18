import { Injectable, NotFoundException } from '@nestjs/common';
import { MongoService, Reward } from '@packages/database';
import { CreateRewardDto, UpdateRewardDto } from './dto/index.js';

interface RewardServiceInterface {
  // 이벤트 별 리워드 조회
  findByEventId(eventId: string): Promise<Reward[]>;

  // 리워드 조회
  findOne(id: string): Promise<Reward>;

  // 리워드 생성
  create(createRewardDto: CreateRewardDto): Promise<Reward>;

  // 리워드 수정
  update(id: string, updateRewardDto: UpdateRewardDto): Promise<Reward>;

  // 리워드 삭제
  remove(id: string): Promise<void>;
}

@Injectable()
export class RewardService implements RewardServiceInterface {
  constructor(private readonly mongoService: MongoService) {}

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
      throw new NotFoundException('Reward not found');
    }

    return reward;
  }

  async create(createRewardDto: CreateRewardDto) {
    const event = await this.mongoService.event.findUnique({
      where: { id: createRewardDto.eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.mongoService.reward.create({
      data: createRewardDto,
    });
  }

  async update(id: string, updateRewardDto: UpdateRewardDto) {
    const reward = await this.mongoService.reward.findUnique({
      where: { id },
    });

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    return this.mongoService.reward.update({
      where: { id },
      data: updateRewardDto,
    });
  }

  async remove(id: string) {
    const reward = await this.mongoService.reward.findUnique({
      where: { id },
    });

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    await this.mongoService.reward.delete({
      where: { id },
    });
  }
}
