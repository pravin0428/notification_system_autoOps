import { NotificationPayload, NotificationResult } from '../../common/types';
import { NotificationChannel } from './notification-channel';

export class EmailChannel implements NotificationChannel {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    console.log(`[EMAIL] Sending to ${payload.recipient}`);
    console.log(`[EMAIL] Subject: ${payload.ruleName}`);
    console.log(`[EMAIL] Body: ${payload.message}`);

    const shouldFail = payload.recipient.includes('fail');

    if (shouldFail) {
      return {
        success: false,
        error: 'Mock email provider failure: recipient address rejected',
      };
    }

    return {
      success: true,
      providerMessageId: `mock-email-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    };
  }
}
