import { Test } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
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

  describe('getUsers', () => {
    it('should return an array of users', () => {
      expect(service.getUsers()).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]);
    });
  });
});
