import { Request, Response } from 'express';
import { EventService } from './event.service';
import { ApiResponse } from '../../common/types';

const eventService = new EventService();

export class EventController {
  async trigger(req: Request, res: Response): Promise<void> {
    const result = await eventService.processEvent(req.body);
    const response: ApiResponse = { success: true, data: result };
    res.status(201).json(response);
  }
}
