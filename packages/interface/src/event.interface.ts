import { Event, Reward } from '@packages/database';

export type TaskType =
  | 'mapEntry'
  | 'monsterHunt'
  | 'eliteHunt'
  | 'bossHunt'
  | 'itemCollection';

export interface BaseTaskCondition {
  type: TaskType;
  description?: string;
}

export interface MapEntryTaskCondition extends BaseTaskCondition {
  type: 'mapEntry';
  mapName: string;
}

export interface MonsterHuntTaskCondition extends BaseTaskCondition {
  type: 'monsterHunt' | 'eliteHunt' | 'bossHunt';
  targetCount: number;
}

export interface ItemCollectionTaskCondition extends BaseTaskCondition {
  type: 'itemCollection';
  itemName: string;
  itemQuantity: number;
}

export type EventTaskCondition =
  | MapEntryTaskCondition
  | MonsterHuntTaskCondition
  | ItemCollectionTaskCondition;

export type DailyResetConditions = {
  tasks: EventTaskCondition[];
  dailyReset: boolean;
};

export type ExchangeLimitConditions = {
  tasks: EventTaskCondition[];
  exchangeLimitPerAccount: number;
};

export type EventConditions = DailyResetConditions | ExchangeLimitConditions;

export type EventWithRewards = Event & {
  rewards: Reward[];
};