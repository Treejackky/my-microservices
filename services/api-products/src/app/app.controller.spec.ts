import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;
  let controller: AppController;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    controller = app.get<AppController>(AppController);
  });

  it('should return "Hello API"', () => {
    expect(controller.getData()).toEqual({ message: 'Hello API' });
  });

  it('should create, retrieve, update and delete a product', () => {
    expect(controller.getProducts()).toHaveLength(2);
    const created = controller.createProduct({
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
    expect(controller.getProduct('3')).toEqual(created);
    const updated = controller.updateProduct('3', { price: 260 });
    expect(updated).toEqual({
      id: '3',
      name: 'Coffee Beans',
      category: 'beverage',
      price: 260,
      location: 'Chiang Rai',
    });
    const removed = controller.deleteProduct('3');
    expect(removed).toEqual(updated);
    expect(controller.getProduct('3')).toBeUndefined();
  });
});
