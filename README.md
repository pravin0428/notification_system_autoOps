# Configurable Notification System

A production-quality, configurable notification system built with Angular 21, Node.js/Express, TypeScript, and MongoDB.

Users can define notification rules that specify when they want to receive notifications, which events trigger them, what conditions must be met, who receives them, which channel to use, and what message template to send.

## Features

- **Rule Management** - Full CRUD for notification rules with dynamic condition builder
- **Event Processing** - Trigger events that automatically evaluate matching rules
- **Condition Engine** - Support for 6 operators (EQUALS, NOT_EQUALS, GREATER_THAN, LESS_THAN, GREATER_THAN_OR_EQUAL, LESS_THAN_OR_EQUAL) with nested field access and AND semantics
- **Template Engine** - Mustache-style placeholders with nested field support (`{{order.id}}`)
- **Notification Channels** - Strategy pattern abstraction with Email (mocked) and In-App channels
- **Idempotency** - Duplicate event detection prevents duplicate notifications
- **Notification History** - Full history with pagination, filtering by status and channel
- **Dashboard** - Stats overview and recent notifications
- **Responsive UI** - Professional Angular Material dashboard

## Architecture

```
Angular 21 Frontend
    |
    v
REST API (Express.js)
    |
    v
Rule Engine
    |
    +---> Condition Evaluator (pure functions, fully testable)
    +---> Template Service (pure function, fully testable)
    |
    v
Channel Factory (Strategy Pattern)
    |
    +---> EmailChannel (mocked provider)
    +---> InAppChannel (persists to MongoDB)
    |
    v
MongoDB (Mongoose ODM)
```

## Architecture Decisions

**MongoDB** - Flexible document storage suits the variable nature of rule conditions and event data. Mongoose provides schema validation and indexing.

**Strategy Pattern for Channels** - The `ChannelFactory` maps `NotificationChannelType` to channel implementations. Adding SMS, Slack, or Webhook requires only a new class implementing `NotificationChannel` and one line in the factory registry.

**Separate Rule Engine** - The condition evaluator and template service are pure functions with no side effects, making them independently testable and replaceable.

**Event IDs / Idempotency** - Each event can carry an `eventId`. If the same ID is submitted twice, the system detects the duplicate and skips reprocessing. Implemented via a unique compound index on `(eventId, ruleId, recipient, channel)` in the notifications collection.

**Modular Backend** - Each domain (rules, events, notifications) has its own model, service, controller, routes, and types. Controllers are thin; business logic lives in services.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 21, TypeScript, Angular Material, RxJS, Zone.js |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB 6.x, Mongoose 7.x |
| Testing | Jest, Supertest |
| Tooling | ESLint, Prettier |

## Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x running locally
- npm >= 8.x

## Setup

```bash
git clone <repository-url>
cd notification_system_autoOps

# Install all dependencies
npm run install:all
# Or individually:
cd backend && npm install && cd ../frontend && npm install && cd ..
```

## Environment

Copy the example env file:

```bash
cd backend
cp .env.example .env
```

The `.env` file contains:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/notification-system
NODE_ENV=development
```

## Seed Data

To populate the database with demo rules:

```bash
npm run seed
```

This creates three rules:
- **High Value Order** - Triggers on `ORDER_CREATED` when `order.total > 10000`, sends EMAIL
- **Payment Failed Alert** - Triggers on any `PAYMENT_FAILED`, sends EMAIL to admin and billing
- **Order Updated Notification** - Triggers on `ORDER_UPDATED` with `order.status == "CONFIRMED"`, sends IN_APP

## Run

```bash
# Start both backend and frontend concurrently
npm run dev

# Or separately:
npm run dev:backend    # Backend on http://localhost:3000
npm run dev:frontend   # Frontend on http://localhost:4200
```

## Production Build

```bash
npm run build
```

Output:
- Backend: `backend/dist/`
- Frontend: `frontend/dist/frontend/`

## API Documentation

### Rules

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/rules` | List all rules |
| `GET` | `/api/rules/:id` | Get rule by ID |
| `POST` | `/api/rules` | Create a rule |
| `PUT` | `/api/rules/:id` | Update a rule |
| `PATCH` | `/api/rules/:id/status` | Enable/disable a rule |
| `DELETE` | `/api/rules/:id` | Delete a rule |

**Create Rule:**

```json
POST /api/rules
{
  "name": "High Value Order",
  "event": "ORDER_CREATED",
  "conditions": [
    { "field": "order.total", "operator": "GREATER_THAN", "value": 10000 }
  ],
  "recipients": ["admin@example.com"],
  "channel": "EMAIL",
  "template": "High value order {{order.id}} has value {{order.total}}",
  "enabled": true
}
```

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/events` | Trigger an event |

**Trigger Event:**

```json
POST /api/events
{
  "type": "ORDER_CREATED",
  "data": {
    "order": {
      "id": "ORD-1001",
      "total": 15000
    }
  },
  "eventId": "evt-123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "eventId": "evt-123",
    "rulesMatched": 1,
    "notificationsGenerated": 1,
    "successful": 1,
    "failed": 0,
    "results": [...]
  }
}
```

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | List notifications (paginated) |
| `GET` | `/api/notifications/:id` | Get notification by ID |
| `GET` | `/api/notifications/stats` | Dashboard statistics |

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `status` - Filter by SENT, FAILED, or PENDING
- `channel` - Filter by EMAIL or IN_APP

### Supported Events

- `ORDER_CREATED`
- `ORDER_UPDATED`
- `PAYMENT_FAILED`

### Condition Operators

- `EQUALS`, `NOT_EQUALS`
- `GREATER_THAN`, `LESS_THAN`
- `GREATER_THAN_OR_EQUAL`, `LESS_THAN_OR_EQUAL`

## Demo Flow

1. Start the application (`npm run dev`)
2. Open `http://localhost:4200`
3. Seed rules or create a new one:
   - Name: "High Value Order"
   - Event: ORDER_CREATED
   - Condition: `order.total` > `10000`
   - Recipient: `admin@example.com`
   - Channel: EMAIL
   - Template: `High value order {{order.id}} has value {{order.total}}`
4. Save the rule
5. Navigate to **Trigger Event**
6. Select ORDER_CREATED, enter Order ID "ORD-1001", total 15000
7. Click **Trigger Event** - see results: 1 rule matched, 1 notification sent
8. Navigate to **Notification History** - see the SENT notification
9. Trigger the same event with the same eventId again - notice duplicate detection (0 new notifications)

## Duplicate Event Demo

```
First trigger with eventId "evt-test":
  -> 1 notification generated

Second trigger with same eventId "evt-test":
  -> Duplicate detected
  -> 0 notifications generated
```

This is handled by a unique compound index on `(eventId, ruleId, recipient, channel)`.

## Testing

```bash
# Run all backend tests
npm test

# Run specific test suites
cd backend
node node_modules/jest/bin/jest.js --testPathPattern="condition-evaluator"
node node_modules/jest/bin/jest.js --testPathPattern="template.service"
```

### Test Coverage

| Suite | Type | Requires MongoDB | Tests |
|-------|------|-------------------|-------|
| Condition Evaluator | Unit | No | 25 |
| Template Service | Unit | No | 9 |
| Channels | Integration | Yes | 4 |
| Rule Engine | Integration | Yes | 5 |
| API (Rules, Events, Notifications) | Integration | Yes | 16 |

**Unit tests (34 total):** Run without any infrastructure. Test pure functions for condition evaluation and template rendering.

**Integration tests (25 total):** Require a running MongoDB instance. Test channel delivery, rule engine processing, and API endpoints.

## Error Handling

All API errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [...]
  }
}
```

Custom error types: `ValidationError` (400), `NotFoundError` (404), `ConflictError` (409), `UnsupportedChannelError` (400).

Failed notifications do not crash the event processing pipeline. Each rule evaluation is independent - one failure does not affect others.

## Database Indexes

- `Rule.event` + `Rule.enabled` - Fast rule lookup by event type
- `Event.eventId` (unique) - Event deduplication
- `Notification (eventId, ruleId, recipient, channel)` (unique) - Notification idempotency
- `Notification.status`, `Notification.channel` - Filter performance
- `Notification.createdAt` (descending) - History pagination

## Production Improvements

The current implementation keeps external providers mocked and processing synchronous for assignment scope. In production:

```
Current:                          Production:
API                               API
  |                                 |
Rule Engine                       Rule Engine
  |                                 |
Channel (sync)                    Job Queue (Redis/BullMQ)
  |                                 |
DB                                Workers
                                    |
                                  Providers (SendGrid, FCM, etc.)
                                    |
                                  Retry / Dead Letter Queue
                                    |
                                  Notification History (DB)
```

**Recommended improvements:**
- **Message Queue** - Redis/BullMQ for async processing and retry
- **Real Providers** - SendGrid for email, Firebase for push, Twilio for SMS
- **Retry/Backoff** - Exponential backoff with max retries
- **Dead Letter Queue** - Capture permanently failed notifications
- **Authentication** - JWT-based auth with role-based access
- **Rate Limiting** - Protect API endpoints
- **Observability** - Structured logging, metrics, distributed tracing
- **Horizontal Scaling** - Stateless workers behind a load balancer
- **CI/CD** - Automated testing and deployment pipeline

## Project Structure

```
notification_system_autoOps/
├── backend/
│   └── src/
│       ├── common/           # Errors, types, middleware
│       ├── config/           # Database, environment
│       ├── modules/          # Domain modules
│       │   ├── rules/        # Rule CRUD
│       │   ├── events/       # Event processing
│       │   └── notifications/# Notification history
│       ├── notification/     # Core notification engine
│       │   ├── channels/     # Email, In-App, Factory
│       │   ├── rule-engine/  # Condition evaluator
│       │   └── template/     # Template service
│       ├── __tests__/        # Test suites
│       ├── app.ts            # Express app
│       └── server.ts         # Entry point
├── frontend/
│   └── src/app/
│       ├── core/             # Models, services
│       ├── shared/           # Material module
│       ├── features/
│       │   ├── dashboard/
│       │   ├── rules/        # List, Form, Condition Builder
│       │   ├── events/       # Event Trigger
│       │   └── notifications/# History
│       ├── app.module.ts
│       └── app-routing.module.ts
├── package.json              # Root scripts
├── .gitignore
└── README.md
```
