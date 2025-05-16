import {
  HttpException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { PrismaClient } from '@prisma/generated/event-platform-mongo';
import { ConfigService } from '@packages/env-config';

@Injectable()
export class EventPlatformMongoService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly dbUrl: string;

  constructor(private readonly config: ConfigService) {
    const dbUrl = config.get('db.database_url');
    super({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
    this.dbUrl = dbUrl;
  }

  async onModuleInit() {
    try {
      await this.$connect();
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
