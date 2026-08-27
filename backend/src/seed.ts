import mongoose from 'mongoose';
import { env } from './config/env';
import { Rule } from './modules/rules/rule.model';
import { EventType, NotificationChannelType, ConditionOperator } from './common/types';

const seedRules = [
  {
    name: 'High Value Order',
    event: EventType.ORDER_CREATED,
    conditions: [
      { field: 'order.total', operator: ConditionOperator.GREATER_THAN, value: 10000 },
    ],
    recipients: ['admin@example.com'],
    channel: NotificationChannelType.EMAIL,
    template: 'High value order {{order.id}} has been created with total {{order.total}}',
    enabled: true,
  },
  {
    name: 'Payment Failed Alert',
    event: EventType.PAYMENT_FAILED,
    conditions: [],
    recipients: ['billing@example.com', 'admin@example.com'],
    channel: NotificationChannelType.EMAIL,
    template: 'Payment failed for order {{order.id}}. Reason: {{payment.reason}}',
    enabled: true,
  },
  {
    name: 'Order Updated Notification',
    event: EventType.ORDER_UPDATED,
    conditions: [
      { field: 'order.status', operator: ConditionOperator.EQUALS, value: 'CONFIRMED' },
    ],
    recipients: ['customer@example.com'],
    channel: NotificationChannelType.IN_APP,
    template: 'Your order {{order.id}} has been updated to status: {{order.status}}',
    enabled: true,
  },
];

const seed = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('Connected to MongoDB');

    await Rule.deleteMany({});
    console.log('Cleared existing rules');

    const created = await Rule.insertMany(seedRules);
    console.log(`Seeded ${created.length} rules`);

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
