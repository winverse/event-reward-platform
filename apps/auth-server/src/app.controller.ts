import { Controller, Get } from '@nestjs/common';

@Controller({
  version: '1',
})
export class AppController {
  constructor() {}

  @Get('/health')
  health(): string {
    return 'auth server is ok';
  }
}
