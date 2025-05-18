import { EventStatus, EventType } from '@packages/database';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class EventQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
