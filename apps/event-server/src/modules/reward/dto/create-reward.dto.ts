import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRewardDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsOptional()
  @IsString()
  externalItemId?: string;

  @IsOptional()
  @IsInt()
  rewardOrder?: number;

  @IsNotEmpty()
  @IsString()
  eventId: string;
}
