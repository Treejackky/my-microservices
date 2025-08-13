import { Module } from '@nestjs/common';
import { AuthController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '@my-microservices/shared-utils';

@Module({
  imports: [HealthModule.register('auth-service')],
  controllers: [AuthController],
  providers: [AppService],
})
export class AppModule {}
