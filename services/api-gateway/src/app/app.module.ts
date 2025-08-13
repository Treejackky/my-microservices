import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '@my-microservices/shared-utils';
import { ChargersController } from './chargers.controller';
import { ChargersService } from './chargers.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [HealthModule.register('api-gateway')],
  controllers: [AppController, ChargersController, AuthController],
  providers: [AppService, ChargersService, AuthService],
})
export class AppModule {}
