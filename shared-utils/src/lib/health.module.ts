import { Module, DynamicModule } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HEALTH_SERVICE_NAME } from './health.constants';

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
