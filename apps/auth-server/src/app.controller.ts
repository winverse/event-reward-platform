import { Controller, Get } from '@nestjs/common';

@Controller({
  path: '/',
  version: '1',
})
export class AppController {
  constructor() {}

  // alternative @nestjs/terminus
  @Get('/health')
  health() {
    return {
      status: 'OK',
      service: 'auth-server',
      timestamp: new Date().toISOString(),
    };
  }
}
