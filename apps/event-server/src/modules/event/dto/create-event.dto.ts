import { EventStatus, EventType } from '@packages/database';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import type {
  DailyResetConditions,
  ExchangeLimitConditions,
} from '@packages/interface';

// 태스크 타입별 DTO 정의
class MapEntryTaskDto {
  @IsEnum(['mapEntry'])
  type: 'mapEntry';

  @IsString()
  @IsNotEmpty({ message: '맵 이름은 비워둘 수 없습니다.' })
  mapName: string;

  @IsOptional()
  @IsString()
  description?: string;
}

class MonsterHuntTaskDto {
  @IsEnum(['monsterHunt', 'eliteHunt', 'bossHunt'])
  type: 'monsterHunt' | 'eliteHunt' | 'bossHunt';

  @IsNumber()
  @Min(1, { message: '목표 카운트는 1 이상이어야 합니다.' })
  targetCount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

class ItemCollectionTaskDto {
  @IsEnum(['itemCollection'])
  type: 'itemCollection';

  @IsString()
  @IsNotEmpty({ message: '아이템 이름은 비워둘 수 없습니다.' })
  itemName: string;

  @IsNumber()
  @Min(1, { message: '아이템 수량은 1 이상이어야 합니다.' })
  itemQuantity: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class DailyResetConditionsDto implements DailyResetConditions {
  @IsEnum(['dailyReset'])
  @IsNotEmpty()
  conditionKind: 'dailyReset';

  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: MapEntryTaskDto, name: 'mapEntry' },
        { value: MonsterHuntTaskDto, name: 'monsterHunt' },
        { value: MonsterHuntTaskDto, name: 'eliteHunt' },
        { value: MonsterHuntTaskDto, name: 'bossHunt' },
        { value: ItemCollectionTaskDto, name: 'itemCollection' },
      ],
    },
  })
  tasks: Array<MapEntryTaskDto | MonsterHuntTaskDto | ItemCollectionTaskDto>;

  @IsBoolean()
  dailyReset: boolean;
}

export class ExchangeLimitConditionsDto implements ExchangeLimitConditions {
  @IsEnum(['exchangeLimit'])
  @IsNotEmpty()
  conditionKind: 'exchangeLimit'; // 판별자 필드

  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: MapEntryTaskDto, name: 'mapEntry' },
        { value: MonsterHuntTaskDto, name: 'monsterHunt' },
        { value: MonsterHuntTaskDto, name: 'eliteHunt' },
        { value: MonsterHuntTaskDto, name: 'bossHunt' },
        { value: ItemCollectionTaskDto, name: 'itemCollection' },
      ],
    },
  })
  tasks: Array<MapEntryTaskDto | MonsterHuntTaskDto | ItemCollectionTaskDto>;

  @IsNumber()
  @Min(1, { message: '계정당 교환 제한은 0 이상이어야 합니다.' })
  exchangeLimitPerAccount: number;
}

export class CreateEventDto {
  @IsNotEmpty({ message: '이벤트 이름은 비워둘 수 없습니다.' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EventType, { message: '유효한 이벤트 타입을 선택해야 합니다.' })
  eventType: EventType;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object, {
    discriminator: {
      property: 'conditionKind',
      subTypes: [
        { value: DailyResetConditionsDto, name: 'dailyReset' },
        { value: ExchangeLimitConditionsDto, name: 'exchangeLimit' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  conditions?: DailyResetConditionsDto | ExchangeLimitConditionsDto;

  @IsNotEmpty({ message: '시작 날짜는 비워둘 수 없습니다.' })
  @Type(() => Date)
  @IsDate({ message: '유효한 날짜 형식이여야 합니다.' })
  startDate: Date;

  @IsNotEmpty({ message: '종료 날짜는 비워둘 수 없습니다.' })
  @Type(() => Date)
  @IsDate({ message: '유효한 날짜 형식이여야 합니다.' })
  endDate: Date;

  @IsEnum(EventStatus, { message: '유효한 이벤트 상태를 선택해야 합니다.' })
  status: EventStatus;

  @IsOptional()
  @IsString()
  npcName?: string;
}
