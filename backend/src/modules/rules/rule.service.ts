import { Rule, IRule } from './rule.model';
import { NotFoundError } from '../../common/errors';

export class RuleService {
  async findAll(filters?: { event?: string; enabled?: boolean }): Promise<IRule[]> {
    const query: Record<string, unknown> = {};
    if (filters?.event) query.event = filters.event;
    if (filters?.enabled !== undefined) query.enabled = filters.enabled;
    return Rule.find(query).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IRule> {
    const rule = await Rule.findById(id);
    if (!rule) throw new NotFoundError('Rule');
    return rule;
  }

  async create(data: Partial<IRule>): Promise<IRule> {
    return Rule.create(data);
  }

  async update(id: string, data: Partial<IRule>): Promise<IRule> {
    const rule = await Rule.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!rule) throw new NotFoundError('Rule');
    return rule;
  }

  async updateStatus(id: string, enabled: boolean): Promise<IRule> {
    const rule = await Rule.findByIdAndUpdate(id, { enabled }, { new: true, runValidators: true });
    if (!rule) throw new NotFoundError('Rule');
    return rule;
  }

  async delete(id: string): Promise<void> {
    const rule = await Rule.findByIdAndDelete(id);
    if (!rule) throw new NotFoundError('Rule');
  }

  async findMatchingRules(eventType: string): Promise<IRule[]> {
    return Rule.find({ event: eventType, enabled: true });
  }
}
