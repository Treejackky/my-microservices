import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });

  describe('ready', () => {
    it('should include uptime', () => {
      const appController = app.get<AppController>(AppController);
      const result = appController.ready();
      expect(result.status).toBe('ready');
      expect(result.service).toBe('api-gateway');
      expect(typeof result.uptime).toBe('number');
    });
  });
});
