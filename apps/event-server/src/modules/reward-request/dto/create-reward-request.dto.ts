import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRewardRequestDto {
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @IsNotEmpty()
  @IsString()
  rewardId: string;
}
