import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getUsers(): { id: number; name: string }[] {
    return [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
  }
}
