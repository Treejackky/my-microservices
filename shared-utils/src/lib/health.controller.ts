import { Controller, Get, Inject } from '@nestjs/common';
import { HEALTH_SERVICE_NAME } from './health.module';

@Controller()
export class HealthController {
  constructor(@Inject(HEALTH_SERVICE_NAME) private readonly serviceName: string) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: this.serviceName,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  @Get('ready')
  ready() {
    return {
      status: 'ready',
      service: this.serviceName,
      timestamp: new Date().toISOString()
    };
  }
}
