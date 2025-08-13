# MyMicroservices

This repository demonstrates a simple event‑driven microservices architecture built with **NestJS** and managed with **Nx**.  The system contains the following services:

- **API Gateway** – receives HTTP requests, validates DTOs and forwards them to downstream services.
- **Auth Service** – manages user registration and emits a `user_created` event when a new user registers.
- **Charger Service** – manages charger state and emits a `charger_updated` event when a charger changes status.
- **Transaction Service** – subscribes to `charger_updated` events and could stop active transactions when a charger goes offline.
- **Email Service** – subscribes to `user_created` events to send welcome emails.

Every service (except the Email Service) would normally connect to its own PostgreSQL schema.  Services communicate through an event bus exposed in `shared-utils` which currently uses Node's `EventEmitter` for simplicity but can be replaced with RabbitMQ or another broker.

## Running locally

```bash
# build and run all services
docker-compose up --build
```

Each service exposes a basic HTTP endpoint for health checks and demo operations.  Events are logged to the console when they are published or handled.

## Adding new services

New NestJS services can be created inside the `services` directory following the existing pattern and using the shared event bus to communicate.
