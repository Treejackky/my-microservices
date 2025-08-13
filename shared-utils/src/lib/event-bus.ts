import { EventEmitter } from 'events';

/**
 * Simple EventEmitter based bus for demo purposes.
 * In production this could be backed by RabbitMQ or another broker.
 */
export const eventBus = new EventEmitter();

export enum EventTopics {
  UserCreated = 'user_created',
  ChargerUpdated = 'charger_updated',
}

export type EventPayloads = {
  [EventTopics.UserCreated]: { id: number; name: string };
  [EventTopics.ChargerUpdated]: { id: string; status: string };
};
