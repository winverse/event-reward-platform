import { UtilsService } from './utils.service.js';
import { Module } from '@nestjs/common';

@Module({
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
