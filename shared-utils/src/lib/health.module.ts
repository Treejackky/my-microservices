import { Module, DynamicModule } from '@nestjs/common';
import { HealthController } from './health.controller';

export const HEALTH_SERVICE_NAME = 'HEALTH_SERVICE_NAME';

@Module({})
export class HealthModule {
  static register(serviceName: string): DynamicModule {
    return {
      module: HealthModule,
      controllers: [HealthController],
      providers: [
        {
          provide: HEALTH_SERVICE_NAME,
          useValue: serviceName
        }
      ]
    };
  }
}
