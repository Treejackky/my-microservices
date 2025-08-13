import { Module } from '@nestjs/common';
import { TransactionController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '@my-microservices/shared-utils';

@Module({
  imports: [HealthModule.register('transaction-service')],
  controllers: [TransactionController],
  providers: [AppService],
})
export class AppModule {}
