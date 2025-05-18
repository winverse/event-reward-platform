import { Module } from '@nestjs/common';
import { ConfigModule } from '@packages/env-config';
import { UserService } from '@modules/user/user.service.js';
import { MongoModule } from '@packages/database';
import { UserController } from '@modules/user/user.controller.js';

@Module({
  imports: [MongoModule, ConfigModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
