import mongoose from 'mongoose';
import { EmailChannel } from '../../src/notification/channels/email.channel';
import { InAppChannel } from '../../src/notification/channels/in-app.channel';
import { getChannel } from '../../src/notification/channels/channel.factory';
import { NotificationChannelType, NotificationPayload } from '../../src/common/types';
import { Notification } from '../../src/modules/notifications/notification.model';
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

const mockPayload: NotificationPayload = {
  ruleId: new mongoose.Types.ObjectId().toString(),
  ruleName: 'Test Rule',
  eventId: 'evt-test-001',
  recipient: 'admin@example.com',
  channel: NotificationChannelType.EMAIL,
  message: 'Test notification message',
  data: { order: { id: 'ORD-1001', total: 15000 } },
};

describe('Email Channel', () => {
  it('should send email successfully', async () => {
    const channel = new EmailChannel();
    const result = await channel.send(mockPayload);
    expect(result.success).toBe(true);
    expect(result.providerMessageId).toBeDefined();
    expect(result.providerMessageId).toContain('mock-email-');
  });

  it('should fail for recipient containing "fail"', async () => {
    const payload = { ...mockPayload, recipient: 'fail@example.com' };
    const channel = new EmailChannel();
    const result = await channel.send(payload);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('In-App Channel', () => {
  it('should create in-app notification successfully', async () => {
    const channel = new InAppChannel();
    const result = await channel.send(mockPayload);
    expect(result.success).toBe(true);
    expect(result.providerMessageId).toBeDefined();
    expect(result.providerMessageId).toContain('in-app-');
  });
});

describe('Channel Factory', () => {
  it('should return EmailChannel for EMAIL type', () => {
    const channel = getChannel(NotificationChannelType.EMAIL);
    expect(channel).toBeInstanceOf(EmailChannel);
  });

  it('should return InAppChannel for IN_APP type', () => {
    const channel = getChannel(NotificationChannelType.IN_APP);
    expect(channel).toBeInstanceOf(InAppChannel);
  });

  it('should throw for unsupported channel', () => {
    expect(() => getChannel('SMS' as NotificationChannelType)).toThrow(
      'Unsupported notification channel',
    );
  });
});
