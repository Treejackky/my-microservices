import { Injectable, Logger } from '@nestjs/common';
import { eventBus, EventTopics } from '@my-microservices/shared-utils';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor() {
    eventBus.on(EventTopics.ChargerUpdated, (charger) => {
      this.logger.log(`Charger ${charger.id} changed to ${charger.status}`);
      // Here we could stop transactions based on charger status
    });
  }

  getData(): { message: string } {
    return { message: 'Transactions up' };
  }
}
