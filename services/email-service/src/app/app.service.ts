import { Injectable, Logger } from '@nestjs/common';
import { eventBus, EventTopics } from '@my-microservices/shared-utils';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor() {
    eventBus.on(EventTopics.UserCreated, (user) => {
      this.logger.log(`Sending welcome email to ${user.name}`);
    });
  }

  getData(): { message: string } {
    return { message: 'Email service ready' };
  }
}
