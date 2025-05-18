export type TaskType =
  | 'mapEntry'
  | 'monsterHunt'
  | 'eliteHunt'
  | 'bossHunt'
  | 'itemCollection';

interface BaseTask {
  type: TaskType;
  description?: string;
}

export interface MapEntryTask extends BaseTask {
  type: 'mapEntry';
  mapName: string;
}

export interface MonsterHuntTask extends BaseTask {
  type: 'monsterHunt' | 'eliteHunt' | 'bossHunt';
  targetCount: number;
}

export interface ItemCollectionTask extends BaseTask {
  type: 'itemCollection';
  itemName: string;
  itemQuantity: number;
}

export type EventTask = MapEntryTask | MonsterHuntTask | ItemCollectionTask;

export type DailyResetConditions = {
  tasks: EventTask[];
  dailyReset: boolean;
};

export type ExchangeLimitConditions = {
  tasks: EventTask[];
  exchangeLimitPerAccount: number;
};

export type EventConditions = DailyResetConditions | ExchangeLimitConditions;
