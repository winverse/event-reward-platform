import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { Config, Environment } from './config.interface.js';
import { validateConfig } from './config.validator.js';

export const configuration = (): Config => {
  const environment = process.env.NODE_ENV || 'production';
  const filename = `.env.${environment}`;

  const envFilePath = path.resolve(process.cwd(), '..', '..', 'env', filename);

  const existFile = fs.existsSync(envFilePath);

  if (!existFile) {
    throw new Error(`Missing or not built config file: ${envFilePath}`);
  }

  const rawConfig = dotenv.config({ path: envFilePath }).parsed;

  if (!rawConfig) {
    throw new Error('Failed to load config');
  }

  try {
    const config: Config = {
      env: environment as Environment,
      app: {
        gateway_server_port: Number(rawConfig['GATEWAY_SERVER_PORT']),
        auth_server_port: Number(rawConfig['AUTH_SERVER_PORT']),
        event_server_port: Number(rawConfig['EVENT_SERVER_PORT']),
      },
      db: {
        database_provider: rawConfig['DATABASE_PROVIDER'] as 'mongodb',
        database_url: rawConfig['DATABASE_URL'],
      },
      api: {
        gateway_api_host: rawConfig['GATEWAY_API_HOST'],
        auth_api_host: rawConfig['AUTH_API_HOST'],
        event_api_host: rawConfig['EVENT_API_HOST'],
      },
      jwt: {
        jwtSecretKey: rawConfig['JWT_SECRET_KEY'],
        jwtExpiresIn: rawConfig['JWT_EXPIRES_IN'],
      },
    };
    return validateConfig(config);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to import configuration file', { cause: error });
  }
};
