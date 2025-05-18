import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateRewardDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsString()
  externalItemId?: string;

  @IsOptional()
  @IsInt()
  rewardOrder?: number;
}
