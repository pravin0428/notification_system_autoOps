import { NotificationPayload, NotificationResult } from '../../common/types';
import { NotificationChannel } from './notification-channel';

export class InAppChannel implements NotificationChannel {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    console.log(`[IN-APP] Delivering notification to ${payload.recipient}: ${payload.message}`);

    return {
      success: true,
      providerMessageId: `in-app-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    };
  }
}
