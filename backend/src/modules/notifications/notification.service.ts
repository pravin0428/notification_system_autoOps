import { Notification, INotification } from './notification.model';
import { NotFoundError } from '../../common/errors';
import { NotificationStatus, NotificationChannelType } from '../../common/types';

export class NotificationService {
  async findAll(filters?: {
    page?: number;
    limit?: number;
    status?: NotificationStatus;
    channel?: NotificationChannelType;
  }): Promise<{ notifications: INotification[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.channel) query.channel = filters.channel;

    const [notifications, total] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('ruleId', 'name'),
      Notification.countDocuments(query),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<INotification> {
    const notification = await Notification.findById(id).populate('ruleId', 'name');
    if (!notification) throw new NotFoundError('Notification');
    return notification;
  }

  async getStats(): Promise<{
    total: number;
    sent: number;
    failed: number;
    pending: number;
    activeRules: number;
  }> {
    const { Rule } = await import('../rules/rule.model');

    const [total, sent, failed, pending, activeRules] = await Promise.all([
      Notification.countDocuments(),
      Notification.countDocuments({ status: NotificationStatus.SENT }),
      Notification.countDocuments({ status: NotificationStatus.FAILED }),
      Notification.countDocuments({ status: NotificationStatus.PENDING }),
      Rule.countDocuments({ enabled: true }),
    ]);

    return { total, sent, failed, pending, activeRules };
  }
}
