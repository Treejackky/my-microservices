import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '@my-microservices/shared-utils';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [HealthModule.register('api-gateway')],
  controllers: [AppController, ProductsController],
  providers: [AppService, ProductsService],
})
export class AppModule {}
