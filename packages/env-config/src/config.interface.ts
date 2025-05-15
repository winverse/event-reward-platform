export type Environment = 'development' | 'production' | 'test';

export type AppConfig = {
  readonly gateway_server_port: number;
  readonly auth_server_port: number;
  readonly event_server_port: number;
};

export type DBConfig = {
  readonly database_provider: 'mongodb';
  readonly database_url: string;
};

export type Config = {
  readonly env: 'development' | 'production' | 'test';
  readonly app: AppConfig;
  readonly db: DBConfig;
};
