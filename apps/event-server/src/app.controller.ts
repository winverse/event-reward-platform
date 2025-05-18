import { Controller, Get } from '@nestjs/common';

@Controller({
  version: '1',
})
export class AppController {
  @Get('/health')
  health() {
    return {
      status: 'OK',
      service: 'event-server',
      timestamp: new Date().toISOString(),
    };
  }
}
