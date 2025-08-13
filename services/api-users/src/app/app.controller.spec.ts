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

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(controller.getData()).toEqual({ message: 'Hello API' });
    });
  });

  describe('users CRUD', () => {
    it('should create, retrieve, update and delete a user', () => {
      expect(controller.getUsers()).toHaveLength(2);
      const created = controller.createUser({ name: 'Charlie' });
      expect(created).toEqual({ id: 3, name: 'Charlie' });
      expect(controller.getUser('3')).toEqual({ id: 3, name: 'Charlie' });
      const updated = controller.updateUser('3', { name: 'Charles' });
      expect(updated).toEqual({ id: 3, name: 'Charles' });
      const removed = controller.deleteUser('3');
      expect(removed).toEqual({ id: 3, name: 'Charles' });
      expect(controller.getUser('3')).toBeUndefined();
    });
  });
});
