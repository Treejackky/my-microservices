import { Injectable } from '@nestjs/common';
import { eventBus, EventTopics } from '@my-microservices/shared-utils';
import { CreateChargerDto } from './dto/create-charger.dto';
import { UpdateChargerDto } from './dto/update-charger.dto';

interface Charger {
  id: string;
  status: 'available' | 'in_use' | 'offline';
}

@Injectable()
export class AppService {
  private chargers: Charger[] = [
    { id: '1', status: 'available' },
    { id: '2', status: 'offline' },
  ];

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getChargers(): Charger[] {
    return this.chargers;
  }

  getCharger(id: string): Charger | undefined {
    return this.chargers.find((c) => c.id === id);
  }

  createCharger(dto: CreateChargerDto): Charger {
    const charger: Charger = { id: dto.id, status: dto.status };
    this.chargers.push(charger);
    return charger;
  }

  updateCharger(id: string, dto: UpdateChargerDto): Charger | undefined {
    const charger = this.getCharger(id);
    if (charger) {
      Object.assign(charger, dto);
      eventBus.emit(EventTopics.ChargerUpdated, charger);
    }
    return charger;
  }

  deleteCharger(id: string): Charger | undefined {
    const index = this.chargers.findIndex((c) => c.id === id);
    if (index >= 0) {
      const [removed] = this.chargers.splice(index, 1);
      return removed;
    }
    return undefined;
  }
}
