import mongoose from 'mongoose';
import { Rule } from '../../src/modules/rules/rule.model';
import { Event } from '../../src/modules/events/event.model';
import { Notification } from '../../src/modules/notifications/notification.model';
import { connectTestDB, disconnectTestDB, clearTestDB } from './setup';
import request from 'supertest';
import app from '../../src/app';

jest.setTimeout(30000);

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await clearTestDB();
  await disconnectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('Rules API', () => {
  const validRule = {
    name: 'High Value Order',
    event: 'ORDER_CREATED',
    conditions: [{ field: 'order.total', operator: 'GREATER_THAN', value: 10000 }],
    recipients: ['admin@example.com'],
    channel: 'EMAIL',
    template: 'High value order {{order.id}}',
    enabled: true,
  };

  describe('POST /api/rules', () => {
    it('should create a new rule', async () => {
      const res = await request(app).post('/api/rules').send(validRule).expect(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('High Value Order');
      expect(res.body.data.event).toBe('ORDER_CREATED');
    });

    it('should reject invalid rule data', async () => {
      const res = await request(app)
        .post('/api/rules')
        .send({ name: '', event: 'INVALID' })
        .expect(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject rule without recipients', async () => {
      const res = await request(app)
        .post('/api/rules')
        .send({ ...validRule, recipients: [] })
        .expect(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/rules', () => {
    it('should return all rules', async () => {
      await Rule.create(validRule);
      const res = await request(app).get('/api/rules').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('should return empty array when no rules', async () => {
      const res = await request(app).get('/api/rules').expect(200);
      expect(res.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/rules/:id', () => {
    it('should return a specific rule', async () => {
      const rule = await Rule.create(validRule);
      const res = await request(app).get(`/api/rules/${rule._id}`).expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('High Value Order');
    });

    it('should return 404 for non-existent rule', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app).get(`/api/rules/${fakeId}`).expect(404);
    });
  });

  describe('PUT /api/rules/:id', () => {
    it('should update a rule', async () => {
      const rule = await Rule.create(validRule);
      const res = await request(app)
        .put(`/api/rules/${rule._id}`)
        .send({ ...validRule, name: 'Updated Rule' })
        .expect(200);
      expect(res.body.data.name).toBe('Updated Rule');
    });
  });

  describe('PATCH /api/rules/:id/status', () => {
    it('should toggle rule status', async () => {
      const rule = await Rule.create(validRule);
      const res = await request(app)
        .patch(`/api/rules/${rule._id}/status`)
        .send({ enabled: false })
        .expect(200);
      expect(res.body.data.enabled).toBe(false);
    });
  });

  describe('DELETE /api/rules/:id', () => {
    it('should delete a rule', async () => {
      const rule = await Rule.create(validRule);
      await request(app).delete(`/api/rules/${rule._id}`).expect(200);
      const deleted = await Rule.findById(rule._id);
      expect(deleted).toBeNull();
    });
  });
});

describe('Events API', () => {
  it('should process event and generate notifications', async () => {
    await Rule.create({
      name: 'High Value Order',
      event: 'ORDER_CREATED',
      conditions: [{ field: 'order.total', operator: 'GREATER_THAN', value: 10000 }],
      recipients: ['admin@example.com'],
      channel: 'EMAIL',
      template: 'High value order {{order.id}}',
      enabled: true,
    });

    const res = await request(app)
      .post('/api/events')
      .send({
        type: 'ORDER_CREATED',
        data: { order: { id: 'ORD-1001', total: 15000 } },
        eventId: 'evt-api-001',
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.rulesMatched).toBe(1);
    expect(res.body.data.successful).toBe(1);
  });

  it('should handle duplicate events (idempotency)', async () => {
    await Rule.create({
      name: 'Test Rule',
      event: 'ORDER_CREATED',
      conditions: [],
      recipients: ['admin@example.com'],
      channel: 'EMAIL',
      template: 'Test',
      enabled: true,
    });

    const eventData = {
      type: 'ORDER_CREATED',
      data: { order: { id: 'ORD-1001', total: 15000 } },
      eventId: 'evt-duplicate-001',
    };

    const first = await request(app).post('/api/events').send(eventData).expect(201);
    expect(first.body.data.notificationsGenerated).toBe(1);

    const second = await request(app).post('/api/events').send(eventData).expect(201);
    expect(second.body.data.notificationsGenerated).toBe(0);
  });

  it('should reject invalid event type', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ type: 'INVALID_EVENT', data: {} })
      .expect(400);
    expect(res.body.success).toBe(false);
  });
});

describe('Notifications API', () => {
  it('should return notifications with pagination', async () => {
    const rule = await Rule.create({
      name: 'Test Rule',
      event: 'ORDER_CREATED',
      conditions: [],
      recipients: ['admin@example.com'],
      channel: 'EMAIL',
      template: 'Test',
      enabled: true,
    });

    await Notification.create({
      ruleId: rule._id,
      ruleName: rule.name,
      eventId: 'evt-notif-001',
      recipient: 'admin@example.com',
      channel: 'EMAIL',
      message: 'Test message',
      status: 'SENT',
      sentAt: new Date(),
    });

    const res = await request(app).get('/api/notifications?page=1&limit=10').expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination.total).toBe(1);
  });

  it('should filter by status', async () => {
    const rule = await Rule.create({
      name: 'Test Rule',
      event: 'ORDER_CREATED',
      conditions: [],
      recipients: ['admin@example.com'],
      channel: 'EMAIL',
      template: 'Test',
      enabled: true,
    });

    await Notification.create({
      ruleId: rule._id,
      ruleName: rule.name,
      eventId: 'evt-filter-001',
      recipient: 'admin@example.com',
      channel: 'EMAIL',
      message: 'Sent message',
      status: 'SENT',
      sentAt: new Date(),
    });

    await Notification.create({
      ruleId: rule._id,
      ruleName: rule.name,
      eventId: 'evt-filter-002',
      recipient: 'admin@example.com',
      channel: 'EMAIL',
      message: 'Failed message',
      status: 'FAILED',
      error: 'Test error',
    });

    const sentRes = await request(app).get('/api/notifications?status=SENT').expect(200);
    expect(sentRes.body.data).toHaveLength(1);

    const failedRes = await request(app).get('/api/notifications?status=FAILED').expect(200);
    expect(failedRes.body.data).toHaveLength(1);
  });

  it('should return dashboard stats', async () => {
    const res = await request(app).get('/api/notifications/stats').expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('total');
    expect(res.body.data).toHaveProperty('sent');
    expect(res.body.data).toHaveProperty('failed');
    expect(res.body.data).toHaveProperty('pending');
    expect(res.body.data).toHaveProperty('activeRules');
  });
});
