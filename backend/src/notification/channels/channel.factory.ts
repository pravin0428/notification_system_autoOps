import { NotificationChannelType } from '../../common/types';
import { NotificationChannel } from './notification-channel';
import { EmailChannel } from './email.channel';
import { InAppChannel } from './in-app.channel';
import { UnsupportedChannelError } from '../../common/errors';

const channels = new Map<NotificationChannelType, () => NotificationChannel>();

channels.set(NotificationChannelType.EMAIL, () => new EmailChannel());
channels.set(NotificationChannelType.IN_APP, () => new InAppChannel());

export const getChannel = (channelType: NotificationChannelType): NotificationChannel => {
  const factory = channels.get(channelType);
  if (!factory) {
    throw new UnsupportedChannelError(channelType);
  }
  return factory();
};

export const registerChannel = (
  channelType: NotificationChannelType,
  factory: () => NotificationChannel,
): void => {
  channels.set(channelType, factory);
};
