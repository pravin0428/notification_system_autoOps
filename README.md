# Configurable Notification System

A production-quality, configurable notification system built with Angular 21, Node.js/Express, TypeScript, and MongoDB.

Users can define notification rules that specify when they want to receive notifications, which events trigger them, what conditions must be met, who receives them, which channel to use, and what message template to send.

---

## Features

- **Rule Management** - Full CRUD for notification rules with dynamic condition builder

- **Event Processing** - Trigger events that automatically evaluate matching rules

- **Condition Engine** - Support for 6 operators (`EQUALS`, `NOT_EQUALS`, `GREATER_THAN`, `LESS_THAN`, `GREATER_THAN_OR_EQUAL`, `LESS_THAN_OR_EQUAL`) with nested field access and AND semantics

- **Template Engine** - Mustache-style placeholders with nested field support (`{{order.id}}`)

- **Notification Channels** - Strategy pattern abstraction with Email (mocked) and In-App channels

- **Idempotency** - Duplicate event detection prevents duplicate notifications

- **Notification History** - Full history with pagination, filtering by status and channel

- **Dashboard** - Stats overview and recent notifications

- **Responsive UI** - Professional Angular Material dashboard

- **Validation & Error Handling** - Centralized validation and consistent API error responses

- **Extensible Architecture** - New notification channels can be added with minimal changes

---

## Tech Stack

### Frontend

- Angular 21
- Angular Material
- TypeScript
- RxJS
- Zone.js

### Backend

- Node.js 20
- Express.js
- TypeScript
- Mongoose
- MongoDB
- Express Validator
- Helmet
- Morgan
- CORS
- dotenv

### Testing

- Jest
- Supertest
- Jasmine / Karma

### Tooling

- ESLint
- Prettier
- concurrently
- Angular CLI

---

# Screenshots

## Dashboard

The dashboard provides an overview of notification activity, including statistics and recent notifications.

![Dashboard](screenshots/dashboard.png)

---

## Rule Management

The Rules page allows users to search, filter, enable/disable, edit, and delete notification rules.

![Rules](screenshots/rules.png)

---

## Create / Edit Rule

Users can configure the event, recipients, notification channel, conditions, and message template.

![Rule Form](screenshots/rule-form.png)

---

## Event Processing

The event processing screen demonstrates the complete notification workflow, including matched rules, generated notifications, and delivery status.

![Event Processing](screenshots/event-processing.png)

---

# Architecture

```text
Angular 21 Frontend
        |
        | REST API
        v
Express.js API
        |
        v
Rule Engine
        |
        +----> Condition Evaluator
        |       (pure functions, fully testable)
        |
        +----> Template Service
        |       (pure function, fully testable)
        |
        v
Channel Factory
(Strategy Pattern)
        |
        +----> EmailChannel
        |       (mocked provider)
        |
        +----> InAppChannel
                (persists to MongoDB)
        |
        v
MongoDB
(Mongoose ODM)
```

---

## Event Processing Flow

```text
Client
  |
  | POST Event
  v
Event API
  |
  v
Event Service
  |
  v
Find Matching Rules
  |
  v
Evaluate Conditions
  |
  +---- No Match ----> Skip Rule
  |
  +---- Match -------> Render Template
                          |
                          v
                    Select Channel
                          |
                          v
                    Send Notification
                          |
                          v
                    Store Result
```

---

# How to Start the Project

## Prerequisites

Make sure the following are installed on your machine:

- Node.js 20+
- npm
- MongoDB 6+
- Git

Verify the installations:

```bash
node -v
npm -v
mongod --version
git --version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/pravin0428/notification_system_autoOps.git
cd notification_system_autoOps
```

---

## 2. Install Dependencies

From the project root:

```bash
npm run install:all
```

This installs dependencies for the root project, backend, and frontend.

---

## 3. Start MongoDB

The application uses a local MongoDB database.

MongoDB should be available at:

```text
mongodb://localhost:27017
```

### Windows

If MongoDB is installed locally, start it with:

```bash
mongod --dbpath "C:/data/db"
```

If the directory does not exist, create it first:

```bash
mkdir C:\data\db
```

Then start MongoDB:

```bash
mongod --dbpath "C:/data/db"
```

Keep the MongoDB terminal running.

---

## 4. Configure Backend Environment

Create a `.env` file inside the `backend` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/notification-system
NODE_ENV=development
```

The application uses the local MongoDB instance for development.

---

## 5. Seed Demo Data

After MongoDB is running, seed the database with sample data:

```bash
npm run seed
```

This creates sample notification rules that can be used to test the application.

---

## 6. Start Backend and Frontend Together

From the project root:

```bash
npm run dev
```

The root development script starts both services:

```text
Backend  → http://localhost:3000
Frontend → http://localhost:4200
```

Open the application in your browser:

```text
http://localhost:4200
```

---

# Running Services Separately

The services can also be started independently.

This is useful when debugging the frontend or backend separately.

## Backend

Open a terminal:

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

You should see:

```text
Connected to MongoDB
Server running on port 3000
```

---

## Frontend

Open another terminal:

```bash
cd frontend
npm start
```

The frontend will run on:

```text
http://localhost:4200
```

Open:

```text
http://localhost:4200
```

---

# Application Usage

## 1. Create a Notification Rule

Navigate to:

```text
Rules → Create Rule
```

Configure the following:

- Rule Name
- Trigger Event
- Notification Channel
- Recipients
- Optional Conditions
- Message Template

Example:

```text
Rule Name:
High Value Order

Trigger Event:
ORDER_CREATED

Notification Channel:
EMAIL

Recipient:
admin@example.com

Condition:
order.total GREATER_THAN 10000

Message Template:
High value order {{order.id}} worth {{order.total}}
```

Once the required fields are populated, the rule can be created.

---

# 2. Configure Conditions

Conditions are optional.

If no conditions are configured, the rule triggers for every matching event.

Example:

```text
Field: order.total
Operator: GREATER_THAN
Value: 10000
```

For multiple conditions, all conditions must match.

Example:

```text
order.total GREATER_THAN 10000
order.status EQUALS CONFIRMED
```

This uses AND semantics.

The rule triggers only when both conditions are satisfied.

---

# 3. Trigger an Event

Navigate to:

```text
Trigger Event
```

Select an event type and provide the event data.

Example:

```text
Event Type:
ORDER_CREATED

Event ID:
TEST-001

Order ID:
TEST-001

Order Total:
15000
```

The event is then evaluated against the configured rules.

---

# 4. Review Event Processing

After triggering an event, the application displays the processing result.

The result includes:

- Event ID
- Rules matched
- Notifications generated
- Successful notifications
- Failed notifications
- Notification details
- Delivery status

Example workflow:

```text
ORDER_CREATED
      |
      v
Find matching rules
      |
      v
Evaluate conditions
      |
      v
Generate notifications
      |
      v
Send through selected channel
      |
      v
Display processing result
```

---

# 5. Notification History

Navigate to:

```text
Notification History
```

The notification history displays generated notifications.

Users can view:

- Notification message
- Recipient
- Channel
- Status
- Creation time

The page supports pagination and filtering.

---

# 6. Dashboard

The dashboard provides a high-level overview of the notification system.

It displays:

- Total Notifications
- Sent Notifications
- Failed Notifications
- Pending Notifications
- Active Rules
- Recent Notifications

---

# Notification Channels

The notification system uses a channel abstraction based on the Strategy Pattern.

Currently supported channels are:

## Email

The Email channel uses a mocked provider for the assignment.

The provider boundary is isolated so that a real email provider can be introduced later without changing the rule engine.

---

## In-App

The In-App channel persists notifications to MongoDB.

These notifications can then be displayed through:

- Notification History
- Dashboard
- Event processing results

---

# Rule Engine

The rule engine is responsible for evaluating incoming events against configured rules.

It contains two major parts:

## Condition Evaluator

The condition evaluator determines whether an event satisfies a rule's conditions.

Supported operators:

```text
EQUALS
NOT_EQUALS
GREATER_THAN
LESS_THAN
GREATER_THAN_OR_EQUAL
LESS_THAN_OR_EQUAL
```

Nested fields are supported.

For example:

```text
order.total
```

Given this event:

```json
{
  "order": {
    "id": "ORD-001",
    "total": 15000
  }
}
```

The condition:

```text
order.total GREATER_THAN 10000
```

evaluates to:

```text
15000 > 10000
```

Therefore the condition matches.

---

# Template Engine

The template engine supports Mustache-style placeholders using double curly braces.

Example:

```text
Order {{order.id}} has been created for {{order.total}}
```

Given:

```json
{
  "order": {
    "id": "ORD-001",
    "total": 15000
  }
}
```

The generated notification message becomes:

```text
Order ORD-001 has been created for 15000
```

Nested fields are supported.

---

# Idempotency

Events can contain an `eventId`.

The system uses database uniqueness constraints to prevent duplicate processing of the same event.

Notification uniqueness is enforced using:

```text
(eventId, ruleId, recipient, channel)
```

This prevents duplicate notifications when the same event is replayed.

For example, if:

```text
eventId = TEST-001
```

is submitted multiple times, the system prevents duplicate notifications for the same rule, recipient, and channel.

---

# Backend Architecture

The backend follows a modular architecture.

```text
backend/src
│
├── common/
│   ├── errors/
│   ├── types/
│   └── utils/
│
├── config/
│   └── database.ts
│
├── modules/
│   ├── events/
│   │   ├── event.model.ts
│   │   ├── event.routes.ts
│   │   ├── event.service.ts
│   │   └── event.types.ts
│   │
│   ├── notifications/
│   │   ├── notification.model.ts
│   │   ├── notification.routes.ts
│   │   ├── notification.service.ts
│   │   └── notification.types.ts
│   │
│   └── rules/
│       ├── rule.model.ts
│       ├── rule.routes.ts
│       ├── rule.service.ts
│       └── rule.types.ts
│
├── notification/
│   ├── channels/
│   │   ├── email.channel.ts
│   │   ├── in-app.channel.ts
│   │   └── channel.factory.ts
│   │
│   ├── rule-engine/
│   │   └── condition-evaluator.ts
│   │
│   └── template/
│       └── template.service.ts
│
├── __tests__/
│
├── app.ts
└── server.ts
```

---

# Frontend Architecture

The frontend is organized around Angular features.

```text
frontend/src
│
├── core/
│   ├── models/
│   └── services/
│
├── shared/
│   └── Material modules
│
├── features/
│   ├── dashboard/
│   │
│   ├── rules/
│   │   ├── rule-list/
│   │   ├── rule-form/
│   │   └── condition-builder/
│   │
│   ├── events/
│   │   └── event-trigger/
│   │
│   └── notifications/
│       └── notification-history/
│
├── app.component.ts
├── app.module.ts
└── app-routing.module.ts
```

---

# Key Architecture Decisions

## 1. Separate Pure Rule Engine

Condition evaluation and template rendering are kept independent from infrastructure and external services.

This makes them:

- Easy to unit test
- Easy to reason about
- Independent from MongoDB
- Reusable in a future background worker

---

## 2. Strategy Pattern for Notification Channels

Notification delivery is abstracted behind a common channel interface.

The `ChannelFactory` selects the appropriate implementation.

Current channels:

```text
ChannelFactory
     |
     +---- EmailChannel
     |
     +---- InAppChannel
```

A new channel such as:

```text
SMS
Slack
Webhook
Push
```

can be added by implementing the notification channel interface and registering it with the factory.

---

## 3. Modular Backend

The backend is separated by domain:

```text
modules/
├── rules/
├── events/
└── notifications/
```

Each module owns its:

- Model
- Service
- Routes
- Types

This keeps domain logic isolated and makes the system easier to maintain.

---

## 4. MongoDB Document Model

Rules contain a flexible `conditions[]` array:

```json
[
  {
    "field": "order.total",
    "operator": "GREATER_THAN",
    "value": "10000"
  }
]
```

This maps naturally to MongoDB documents and supports variable event payloads.

---

## 5. Event Idempotency

The application uses event IDs and MongoDB uniqueness constraints to make event processing replay-safe.

This is important for distributed systems where the same event may occasionally be delivered more than once.

---

## 6. Centralized Async Error Handling

Express 4 does not automatically forward rejected promises from asynchronous route handlers to the error middleware.

The application therefore uses an `asyncHandler` utility to forward asynchronous errors to the centralized error handler.

This keeps route handlers clean and ensures consistent API error responses.

---

# Error Handling

The API uses a consistent error response structure.

```json
{
  "success": false,
  "error": {
    "code": "...",
    "message": "...",
    "details": []
  }
}
```

The application includes custom error types for:

- Validation errors
- Not found errors
- Conflict errors
- Unsupported notification channels

A failure while processing one rule does not stop the processing of other matching rules.

---

# Data Model

## Rule

A rule contains:

```text
name
event
conditions[]
recipients[]
channel
template
enabled
```

---

## Event

An event contains:

```text
type
data
eventId
```

---

## Notification

A notification contains:

```text
eventId
ruleId
recipient
channel
status
message
createdAt
```

---

# Database Indexes

The application uses indexes for performance and idempotency.

### Notification Idempotency

```text
(eventId, ruleId, recipient, channel)
```

Unique compound index.

### Event Deduplication

```text
Event.eventId
```

Unique index.

### Rule Lookup

```text
Rule.event + Rule.enabled
```

Used to efficiently locate active rules for an incoming event.

### Notification History

```text
Notification.status
Notification.channel
Notification.createdAt
```

Used for filtering and history queries.

---

# API Overview

The backend exposes REST APIs for the main application domains.

## Rules

```text
GET    /api/rules
GET    /api/rules/:id
POST   /api/rules
PUT    /api/rules/:id
DELETE /api/rules/:id
```

---

## Events

```text
POST /api/events
```

Used to trigger an event and process matching notification rules.

---

## Notifications

```text
GET /api/notifications
```

Used to retrieve notification history with filtering and pagination.

---

# Testing

The backend contains unit and integration tests using Jest and Supertest.

Run tests from the project root:

```bash
npm test
```

Or from the backend directory:

```bash
cd backend
npm test
```

The test suite requires MongoDB to be running locally.

Current verified result:

```text
5 test suites passed
61 tests passed
```

---

# Production Considerations

The current implementation is intentionally scoped for the assignment. Before taking this system to production, I would make the following improvements.

## 1. Asynchronous Event Processing

Currently, notification processing is synchronous.

For production, event processing and notification delivery should be moved to background workers.

For example:

```text
API
 |
 v
Job Queue
 |
 +---- Worker 1
 |
 +---- Worker 2
 |
 +---- Worker 3
 |
 v
Notification Providers
```

A queue such as Redis/BullMQ could be introduced.

This would prevent slow notification providers from blocking API requests.

---

## 2. Retry and Backoff

Temporary notification provider failures should be retried using exponential backoff with a maximum retry policy.

Example:

```text
Attempt 1
   |
   v
Failure
   |
   v
Wait
   |
   v
Attempt 2
   |
   v
Failure
   |
   v
Longer Wait
   |
   v
Attempt 3
```

---

## 3. Dead Letter Queue

Notifications that permanently fail after the maximum retry count should be moved to a dead-letter queue.

This allows failed notifications to be investigated or retried manually.

---

## 4. Real Notification Providers

The current Email provider is mocked for the assignment.

For production, it could be replaced with a real provider.

Additional channels could also be implemented:

```text
Email
SMS
Push
Slack
Webhook
```

The Strategy Pattern already provides the abstraction required for this extension.

---

## 5. Authentication and Authorization

The current assignment implementation does not include authentication.

Before production deployment, I would add:

- JWT authentication
- Role-based access control
- User-level rule ownership
- Permission checks for event and notification APIs

---

## 6. Rate Limiting

Public endpoints should have rate limiting to protect the system from abuse.

This is particularly important for event-triggering endpoints.

---

## 7. Observability

Production deployment should include:

- Structured logging
- Request tracing
- Metrics
- Error monitoring
- Application performance monitoring

Metrics should include:

- Events processed
- Rules matched
- Notifications generated
- Notification failures
- Processing latency
- Queue depth

---

## 8. Horizontal Scaling

API and worker processes should remain stateless so multiple instances can run behind a load balancer.

The notification idempotency constraints help maintain replay-safe behavior across multiple instances.

---

## 9. Security Hardening

The application already includes security-related middleware such as Helmet and CORS configuration.

For production, I would additionally:

- Restrict CORS origins
- Use HTTPS
- Store secrets securely
- Add authentication
- Add rate limiting
- Validate all external input
- Avoid exposing internal errors
- Configure secure MongoDB access

---

# Development Scripts

From the project root:

```bash
npm run dev
```

Starts both backend and frontend.

```bash
npm run dev:backend
```

Starts only the backend.

```bash
npm run dev:frontend
```

Starts only the frontend.

```bash
npm run build
```

Builds the application.

```bash
npm test
```

Runs backend tests.

```bash
npm run seed
```

Seeds demo data.

```bash
npm run lint
```

Runs linting.

---

# Project Structure

```text
notification_system_autoOps/
│
├── backend/
│   ├── src/
│   │   ├── common/
│   │   │   ├── errors/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   │
│   │   ├── config/
│   │   │   └── database.ts
│   │   │
│   │   ├── modules/
│   │   │   ├── events/
│   │   │   ├── notifications/
│   │   │   └── rules/
│   │   │
│   │   ├── notification/
│   │   │   ├── channels/
│   │   │   ├── rule-engine/
│   │   │   └── template/
│   │   │
│   │   ├── __tests__/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── jest.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── core/
│   │   ├── shared/
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   ├── rules/
│   │   │   ├── events/
│   │   │   └── notifications/
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   │
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── screenshots/
│   ├── dashboard.png
│   ├── rules.png
│   ├── rule-form.png
│   └── event-processing.png
│
├── doc.txt
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

---

# Assignment Documentation

Additional documentation is available in:

```text
doc.txt
```

It contains:

- Architecture explanation
- Key architectural decisions
- Error handling approach
- Data model and indexes
- Testing information
- Production considerations
- Project structure

---

# Current Implementation Scope

The assignment implementation focuses on:

- Configurable notification rules
- Rule condition evaluation
- Event processing
- Notification generation
- Email and In-App channels
- Idempotent event handling
- Notification history
- Dashboard
- REST APIs
- Angular Material UI
- Backend unit and integration testing

External notification providers are mocked as part of the assignment scope.

---

# Conclusion

This project demonstrates a modular and extensible notification system where notification behavior is driven by configurable rules rather than hard-coded business logic.

The architecture separates:

```text
Event Processing
      |
      v
Rule Evaluation
      |
      v
Template Rendering
      |
      v
Channel Selection
      |
      v
Notification Delivery
```

This separation allows the system to evolve independently as additional notification channels, event types, rule conditions, and production infrastructure are introduced.

---

## License

This project was created as a technical assignment demonstrating a configurable notification system using Angular, Node.js, Express, TypeScript, and MongoDB.
