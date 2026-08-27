import mongoose, { Schema, Document } from 'mongoose';
import { NotificationChannelType, NotificationStatus } from '../../common/types';

export interface INotification extends Document {
  ruleId: mongoose.Types.ObjectId;
  ruleName: string;
  eventId: string;
  recipient: string;
  channel: NotificationChannelType;
  message: string;
  status: NotificationStatus;
  error?: string;
  providerMessageId?: string;
  createdAt: Date;
  sentAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    ruleId: { type: Schema.Types.ObjectId, ref: 'Rule', required: true },
    ruleName: { type: String, required: true },
    eventId: { type: String, required: true },
    recipient: { type: String, required: true },
    channel: {
      type: String,
      required: true,
      enum: Object.values(NotificationChannelType),
    },
    message: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.PENDING,
    },
    error: { type: String },
    providerMessageId: { type: String },
    sentAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

NotificationSchema.index({ eventId: 1, ruleId: 1, recipient: 1, channel: 1 }, { unique: true });
NotificationSchema.index({ ruleId: 1 });
NotificationSchema.index({ status: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ channel: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
