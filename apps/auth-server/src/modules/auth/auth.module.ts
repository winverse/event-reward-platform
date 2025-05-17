import { Module } from '@nestjs/common';
import { AuthController } from '@modules/auth/auth.controller.js';
import { AuthService } from '@modules/auth/auth.service.js';
import { JwtModule } from '@packages/providers';
import { MongoModule } from '@packages/database';
import { ConfigModule } from '@packages/env-config';
import { UtilsModule } from '@packages/providers/dist/utils/utils.module.js';

@Module({
  imports: [MongoModule, JwtModule, ConfigModule, UtilsModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
