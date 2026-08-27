import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { ApiResponse, NotificationStatus, NotificationChannelType } from '../../common/types';

const notificationService = new NotificationService();

export class NotificationController {
  async getAll(req: Request, res: Response): Promise<void> {
    const { page, limit, status, channel } = req.query;
    const result = await notificationService.findAll({
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
      status: status as NotificationStatus | undefined,
      channel: channel as NotificationChannelType | undefined,
    });
    const response: ApiResponse = {
      success: true,
      data: result.notifications,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
    res.json(response);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const notification = await notificationService.findById(req.params.id);
    const response: ApiResponse = { success: true, data: notification };
    res.json(response);
  }

  async getStats(_req: Request, res: Response): Promise<void> {
    const stats = await notificationService.getStats();
    const response: ApiResponse = { success: true, data: stats };
    res.json(response);
  }
}
