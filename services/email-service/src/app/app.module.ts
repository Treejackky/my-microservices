import { Module } from '@nestjs/common';
import { EmailController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '@my-microservices/shared-utils';

@Module({
  imports: [HealthModule.register('email-service')],
  controllers: [EmailController],
  providers: [AppService],
})
export class AppModule {}
