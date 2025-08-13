import { Test } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  it('should return "Hello API"', () => {
    expect(service.getData()).toEqual({ message: 'Hello API' });
  });

  it('should create, retrieve, update and delete a product', () => {
    expect(service.getProducts()).toHaveLength(2);
    const created = service.createProduct({
      name: 'Coffee Beans',
      category: 'beverage',
      price: 250,
      location: 'Chiang Rai',
    });
    expect(created).toEqual({
      id: '3',
      name: 'Coffee Beans',
      category: 'beverage',
      price: 250,
      location: 'Chiang Rai',
    });
    expect(service.getProduct('3')).toEqual(created);
    const updated = service.updateProduct('3', { price: 260 });
    expect(updated).toEqual({
      id: '3',
      name: 'Coffee Beans',
      category: 'beverage',
      price: 260,
      location: 'Chiang Rai',
    });
    const removed = service.deleteProduct('3');
    expect(removed).toEqual(updated);
    expect(service.getProduct('3')).toBeUndefined();
  });
});
