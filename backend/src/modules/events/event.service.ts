import { Event } from './event.model';
import { v4 as uuidv4 } from 'uuid';
import { EventTriggerData } from '../../common/types';

export class EventService {
  async processEvent(eventData: EventTriggerData): Promise<{
    eventId: string;
    rulesMatched: number;
    notificationsGenerated: number;
    successful: number;
    failed: number;
    results: unknown[];
  }> {
    const eventId = eventData.eventId || `evt-${uuidv4()}`;

    const existingEvent = await Event.findOne({ eventId });
    if (existingEvent) {
      return {
        eventId,
        rulesMatched: 0,
        notificationsGenerated: 0,
        successful: 0,
        failed: 0,
        results: [],
      };
    }

    await Event.create({
      eventId,
      type: eventData.type,
      data: eventData.data,
    });

    const { processEvent: processEngine } = await import(
      '../../notification/rule-engine/rule-engine.service'
    );
    const { Rule } = await import('../rules/rule.model');

    const matchingRules = await Rule.find({ event: eventData.type, enabled: true });
    const results = await processEngine(matchingRules, { ...eventData, eventId });

    const successful = results.filter((r) => r.status === 'SENT').length;
    const failed = results.filter((r) => r.status === 'FAILED').length;

    return {
      eventId,
      rulesMatched: matchingRules.length,
      notificationsGenerated: results.length,
      successful,
      failed,
      results,
    };
  }
}
