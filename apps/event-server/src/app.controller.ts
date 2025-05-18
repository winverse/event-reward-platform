import { Controller, Get } from '@nestjs/common';

@Controller({
  version: '1',
})
export class AppController {
  // alternative @nestjs/terminus
  @Get('/health')
  health() {
    return {
      status: 'OK',
      service: 'event-server',
      timestamp: new Date().toISOString(),
    };
  }
}
