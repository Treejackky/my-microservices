import { Injectable } from '@nestjs/common';
import { Product } from '@my-microservices/shared-types';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [
    { id: '1', name: 'Organic Rice', category: 'grain', price: 500, location: 'Bangkok' },
    { id: '2', name: 'Dried Mango', category: 'fruit', price: 120, location: 'Chiang Mai' }
  ];

  findAll(): Product[] {
    return this.products;
  }
}
