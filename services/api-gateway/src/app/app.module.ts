import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '@my-microservices/shared-utils';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [HealthModule.register('api-gateway')],
  controllers: [AppController, ProductsController, UsersController],
  providers: [AppService, ProductsService, UsersService],
})
export class AppModule {}
