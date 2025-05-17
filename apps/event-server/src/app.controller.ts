import { Controller, Get } from '@nestjs/common';

@Controller({
  version: '1',
})
export class AppController {
  @Get('/health')
  health(): string {
    return 'event server is ok';
  }
}
