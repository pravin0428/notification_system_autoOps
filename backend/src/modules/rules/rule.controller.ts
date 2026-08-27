import { Request, Response } from 'express';
import { RuleService } from './rule.service';
import { ApiResponse } from '../../common/types';

const ruleService = new RuleService();

export class RuleController {
  async getAll(req: Request, res: Response): Promise<void> {
    const { event, enabled } = req.query;
    const rules = await ruleService.findAll({
      event: event as string,
      enabled: enabled !== undefined ? enabled === 'true' : undefined,
    });
    const response: ApiResponse = { success: true, data: rules };
    res.json(response);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const rule = await ruleService.findById(req.params.id);
    const response: ApiResponse = { success: true, data: rule };
    res.json(response);
  }

  async create(req: Request, res: Response): Promise<void> {
    const rule = await ruleService.create(req.body);
    const response: ApiResponse = { success: true, data: rule };
    res.status(201).json(response);
  }

  async update(req: Request, res: Response): Promise<void> {
    const rule = await ruleService.update(req.params.id, req.body);
    const response: ApiResponse = { success: true, data: rule };
    res.json(response);
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const { enabled } = req.body;
    const rule = await ruleService.updateStatus(req.params.id, enabled);
    const response: ApiResponse = { success: true, data: rule };
    res.json(response);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await ruleService.delete(req.params.id);
    const response: ApiResponse = { success: true, data: { message: 'Rule deleted successfully' } };
    res.json(response);
  }
}
