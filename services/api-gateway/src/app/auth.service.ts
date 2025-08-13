import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly authServiceUrl =
    process.env.AUTH_SERVICE_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'http://auth-service:3001'
      : 'http://localhost:3001');

  async createUser(createUserDto: { name: string }) {
    const response = await fetch(`${this.authServiceUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createUserDto),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return response.json();
  }

  async getUsers() {
    const response = await fetch(`${this.authServiceUrl}/api/users`);

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return response.json();
  }

  async getUser(id: number) {
    const response = await fetch(`${this.authServiceUrl}/api/users/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return response.json();
  }

  async updateUser(id: number, updateUserDto: { name: string }) {
    const response = await fetch(`${this.authServiceUrl}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateUserDto),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteUser(id: number) {
    const response = await fetch(`${this.authServiceUrl}/api/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`);
    }

    return response.json();
  }
}
