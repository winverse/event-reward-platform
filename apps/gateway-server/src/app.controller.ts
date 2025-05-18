import { Controller, Get } from '@nestjs/common';

@Controller({
  version: '1',
})
export class AppController {
  @Get('/health')
  health() {
    return {
      status: 'OK',
      service: 'gateway-server',
      timestamp: new Date().toISOString(),
    };
  }
}
