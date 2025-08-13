import { Module } from '@nestjs/common';
import { ChargerController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '@my-microservices/shared-utils';

@Module({
  imports: [HealthModule.register('charger-service')],
  controllers: [ChargerController],
  providers: [AppService],
})
export class AppModule {}
