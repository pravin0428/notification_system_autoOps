import { NotificationPayload, NotificationResult } from '../../common/types';

export interface NotificationChannel {
  send(payload: NotificationPayload): Promise<NotificationResult>;
}
