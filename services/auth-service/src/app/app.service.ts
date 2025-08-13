import { Injectable } from '@nestjs/common';
import { eventBus, EventTopics } from '@my-microservices/shared-utils';

interface User {
  id: number;
  name: string;
}

@Injectable()
export class AppService {
  private users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
  private nextId = 3;

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getUsers(): User[] {
    return this.users;
  }

  getUser(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  createUser(name: string): User {
    const user: User = { id: this.nextId++, name };
    this.users.push(user);
    eventBus.emit(EventTopics.UserCreated, user);
    return user;
  }

  updateUser(id: number, name?: string): User | undefined {
    const user = this.getUser(id);
    if (user && name !== undefined) {
      user.name = name;
    }
    return user;
  }

  deleteUser(id: number): User | undefined {
    const index = this.users.findIndex((u) => u.id === id);
    if (index >= 0) {
      const [removed] = this.users.splice(index, 1);
      return removed;
    }
    return undefined;
  }
}
