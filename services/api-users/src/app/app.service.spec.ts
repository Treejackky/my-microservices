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

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });

  describe('users CRUD', () => {
    it('should create, retrieve, update and delete a user', () => {
      expect(service.getUsers()).toHaveLength(2);
      const created = service.createUser('Charlie');
      expect(created).toEqual({ id: 3, name: 'Charlie' });
      expect(service.getUser(3)).toEqual({ id: 3, name: 'Charlie' });
      const updated = service.updateUser(3, 'Charles');
      expect(updated).toEqual({ id: 3, name: 'Charles' });
      const removed = service.deleteUser(3);
      expect(removed).toEqual({ id: 3, name: 'Charles' });
      expect(service.getUser(3)).toBeUndefined();
    });
  });
});
