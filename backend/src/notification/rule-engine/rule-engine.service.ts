import { IRule } from '../../modules/rules/rule.model';
import { evaluateConditions } from './condition-evaluator';
import { renderTemplate } from '../template/template.service';
import { getChannel } from '../channels/channel.factory';
import {
  EventTriggerData,
  NotificationPayload,
  NotificationStatus,
  NotificationChannelType,
} from '../../common/types';
import { Notification } from '../../modules/notifications/notification.model';

export interface ProcessingResult {
  ruleId: string;
  ruleName: string;
  recipient: string;
  channel: NotificationChannelType;
  status: NotificationStatus;
  error?: string;
  providerMessageId?: string;
}

export const processEvent = async (
  rules: IRule[],
  event: EventTriggerData,
): Promise<ProcessingResult[]> => {
  const results: ProcessingResult[] = [];

  for (const rule of rules) {
    if (!rule.enabled) continue;

    const conditionsPass = evaluateConditions(event.data, rule.conditions);
    if (!conditionsPass) continue;

    for (const recipient of rule.recipients) {
      const message = renderTemplate(rule.template, event.data);

      const notification = await Notification.create({
        ruleId: rule._id,
        ruleName: rule.name,
        eventId: event.eventId!,
        recipient,
        channel: rule.channel,
        message,
        status: NotificationStatus.PENDING,
      });

      try {
        const channel = getChannel(rule.channel);
        const payload: NotificationPayload = {
          ruleId: rule._id.toString(),
          ruleName: rule.name,
          eventId: event.eventId!,
          recipient,
          channel: rule.channel,
          message,
          data: event.data,
        };

        const result = await channel.send(payload);

        notification.status = result.success
          ? NotificationStatus.SENT
          : NotificationStatus.FAILED;
        notification.error = result.error;
        notification.providerMessageId = result.providerMessageId;
        notification.sentAt = result.success ? new Date() : undefined;
        await notification.save();

        results.push({
          ruleId: rule._id.toString(),
          ruleName: rule.name,
          recipient,
          channel: rule.channel,
          status: notification.status,
          error: result.error,
          providerMessageId: result.providerMessageId,
        });
      } catch (error) {
        notification.status = NotificationStatus.FAILED;
        notification.error = error instanceof Error ? error.message : 'Unknown error';
        await notification.save();

        results.push({
          ruleId: rule._id.toString(),
          ruleName: rule.name,
          recipient,
          channel: rule.channel,
          status: NotificationStatus.FAILED,
          error: notification.error,
        });
      }
    }
  }

  return results;
};
