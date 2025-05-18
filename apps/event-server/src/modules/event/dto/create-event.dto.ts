import { EventStatus, EventType } from '@packages/database';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EventType)
  eventType: EventType;

  @IsOptional()
  @IsObject()
  conditions?: Record<string, any>;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsEnum(EventStatus)
  status: EventStatus;

  @IsOptional()
  @IsString()
  npcName?: string;
}
