import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '@my-microservices/shared-utils';

@Module({
  imports: [HealthModule.register('api-gateway')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
