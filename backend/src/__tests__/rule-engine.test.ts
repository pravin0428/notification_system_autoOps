import mongoose from 'mongoose';
import { Rule } from '../../src/modules/rules/rule.model';
import { Notification } from '../../src/modules/notifications/notification.model';
import { processEvent } from '../../src/notification/rule-engine/rule-engine.service';
import { EventType, NotificationChannelType, ConditionOperator, NotificationStatus } from '../../src/common/types';
import { EventTriggerData } from '../../src/common/types';
import { connectTestDB, disconnectTestDB, clearTestDB } from './setup';

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

describe('Rule Engine', () => {
  it('should trigger rule when event matches and conditions pass', async () => {
    const rule = await Rule.create({
      name: 'High Value Order',
      event: EventType.ORDER_CREATED,
      conditions: [{ field: 'order.total', operator: ConditionOperator.GREATER_THAN, value: 10000 }],
      recipients: ['admin@example.com'],
      channel: NotificationChannelType.EMAIL,
      template: 'Order {{order.id}} has value {{order.total}}',
      enabled: true,
    });

    const event: EventTriggerData = {
      type: EventType.ORDER_CREATED,
      data: { order: { id: 'ORD-1001', total: 15000 } },
      eventId: 'evt-001',
    };

    const results = await processEvent([rule], event);

    expect(results).toHaveLength(1);
    expect(results[0].status).toBe(NotificationStatus.SENT);
    expect(results[0].ruleName).toBe('High Value Order');
  });

  it('should not trigger rule when event matches but conditions fail', async () => {
    const rule = await Rule.create({
      name: 'High Value Order',
      event: EventType.ORDER_CREATED,
      conditions: [{ field: 'order.total', operator: ConditionOperator.GREATER_THAN, value: 10000 }],
      recipients: ['admin@example.com'],
      channel: NotificationChannelType.EMAIL,
      template: 'Order {{order.id}} has value {{order.total}}',
      enabled: true,
    });

    const event: EventTriggerData = {
      type: EventType.ORDER_CREATED,
      data: { order: { id: 'ORD-1002', total: 5000 } },
      eventId: 'evt-002',
    };

    const results = await processEvent([rule], event);
    expect(results).toHaveLength(0);
  });

  it('should not trigger disabled rules', async () => {
    const rule = await Rule.create({
      name: 'Disabled Rule',
      event: EventType.ORDER_CREATED,
      conditions: [],
      recipients: ['admin@example.com'],
      channel: NotificationChannelType.EMAIL,
      template: 'Test',
      enabled: false,
    });

    const event: EventTriggerData = {
      type: EventType.ORDER_CREATED,
      data: { order: { id: 'ORD-1001', total: 15000 } },
      eventId: 'evt-003',
    };

    const results = await processEvent([rule], event);
    expect(results).toHaveLength(0);
  });

  it('should use AND semantics for multiple conditions', async () => {
    const rule = await Rule.create({
      name: 'Confirmed High Value Order',
      event: EventType.ORDER_CREATED,
      conditions: [
        { field: 'order.total', operator: ConditionOperator.GREATER_THAN, value: 10000 },
        { field: 'order.status', operator: ConditionOperator.EQUALS, value: 'CONFIRMED' },
      ],
      recipients: ['admin@example.com'],
      channel: NotificationChannelType.EMAIL,
      template: 'Confirmed order {{order.id}}',
      enabled: true,
    });

    const eventPass: EventTriggerData = {
      type: EventType.ORDER_CREATED,
      data: { order: { id: 'ORD-1001', total: 15000, status: 'CONFIRMED' } },
      eventId: 'evt-004',
    };

    const resultsPass = await processEvent([rule], eventPass);
    expect(resultsPass).toHaveLength(1);
    expect(resultsPass[0].status).toBe(NotificationStatus.SENT);

    const eventFail: EventTriggerData = {
      type: EventType.ORDER_CREATED,
      data: { order: { id: 'ORD-1002', total: 15000, status: 'PENDING' } },
      eventId: 'evt-005',
    };

    const resultsFail = await processEvent([rule], eventFail);
    expect(resultsFail).toHaveLength(0);
  });

  it('should send to multiple recipients', async () => {
    const rule = await Rule.create({
      name: 'Payment Failed Alert',
      event: EventType.PAYMENT_FAILED,
      conditions: [],
      recipients: ['admin@example.com', 'billing@example.com'],
      channel: NotificationChannelType.EMAIL,
      template: 'Payment failed for {{order.id}}',
      enabled: true,
    });

    const event: EventTriggerData = {
      type: EventType.PAYMENT_FAILED,
      data: { order: { id: 'ORD-1001' } },
      eventId: 'evt-006',
    };

    const results = await processEvent([rule], event);
    expect(results).toHaveLength(2);
    results.forEach((r) => {
      expect(r.status).toBe(NotificationStatus.SENT);
    });
  });
});
