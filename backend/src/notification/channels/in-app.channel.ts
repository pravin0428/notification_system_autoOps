import { Notification, INotification } from '../../modules/notifications/notification.model';
import { NotificationPayload, NotificationResult, NotificationStatus } from '../../common/types';
import { NotificationChannel } from './notification-channel';

export class InAppChannel implements NotificationChannel {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    console.log(`[IN-APP] Creating notification for ${payload.recipient}`);

    try {
      const notification: INotification = await Notification.create({
        ruleId: payload.ruleId,
        ruleName: payload.ruleName,
        eventId: payload.eventId,
        recipient: payload.recipient,
        channel: payload.channel,
        message: payload.message,
        status: NotificationStatus.SENT,
        sentAt: new Date(),
        providerMessageId: `in-app-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      });

      return {
        success: true,
        providerMessageId: notification.providerMessageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'In-app notification failed',
      };
    }
  }
}
