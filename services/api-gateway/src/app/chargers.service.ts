import { Injectable } from '@nestjs/common';

interface CreateChargerDto {
  id: string;
  status: string;
}

@Injectable()
export class ChargersService {
  private readonly chargerServiceUrl =
    process.env.CHARGER_SERVICE_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'http://charger-service:3002'
      : 'http://localhost:3002');

  async createCharger(dto: CreateChargerDto) {
    const response = await fetch(`${this.chargerServiceUrl}/api/chargers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error(`Failed to create charger: ${response.statusText}`);
    }

    return response.json();
  }

  async getChargers() {
    const response = await fetch(`${this.chargerServiceUrl}/api/chargers`);

    if (!response.ok) {
      throw new Error(`Failed to fetch chargers: ${response.statusText}`);
    }

    return response.json();
  }

  async getCharger(id: string) {
    const response = await fetch(`${this.chargerServiceUrl}/api/chargers/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch charger: ${response.statusText}`);
    }

    return response.json();
  }

  async updateCharger(id: string, dto: Partial<CreateChargerDto>) {
    const response = await fetch(`${this.chargerServiceUrl}/api/chargers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error(`Failed to update charger: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteCharger(id: string) {
    const response = await fetch(`${this.chargerServiceUrl}/api/chargers/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete charger: ${response.statusText}`);
    }

    return response.json();
  }
}
