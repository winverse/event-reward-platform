import { Controller, Get } from '@nestjs/common';

@Controller({
  version: '1',
})
export class AppController {
  @Get('/health')
  health(): string {
    return 'gateway server is ok';
  }
}
