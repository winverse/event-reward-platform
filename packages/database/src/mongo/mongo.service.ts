import {
  HttpException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@packages/env-config';
import { PrismaClient } from '../generated/mongo/client.js';

@Injectable()
export class MongoService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly dbUrl: string;

  constructor(config: ConfigService) {
    const dbUrl = config.get('db.database_url');
    console.log('MONGO SERVICE CONSTRUCTOR - DATABASE_URL:', dbUrl);
    super({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
      log: ['query', 'info', 'warn', 'error'],
    });
    this.dbUrl = dbUrl;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('MongoDB에 연결 시도 중...');
      await this.$runCommandRaw({
        connectionStatus: true,
        showPrivileges: true,
      });
      console.log(`Database connected successfully. URL: ${this.dbUrl}`);
    } catch (error) {
      console.error(error);
      throw new HttpException('SERVER_ERROR', 503);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
