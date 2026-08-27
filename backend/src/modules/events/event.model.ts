import mongoose, { Schema, Document } from 'mongoose';
import { EventType, NotificationChannelType, NotificationStatus } from '../../common/types';

export interface IEvent extends Document {
  eventId: string;
  type: EventType;
  data: Record<string, unknown>;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    eventId: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(EventType),
    },
    data: { type: Schema.Types.Mixed, required: true, default: {} },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

EventSchema.index({ eventId: 1 }, { unique: true });

export const Event = mongoose.model<IEvent>('Event', EventSchema);
