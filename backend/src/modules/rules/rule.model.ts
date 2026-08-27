import mongoose, { Schema, Document } from 'mongoose';
import { EventType, NotificationChannelType, Condition, ConditionOperator } from '../../common/types';

export interface IRule extends Document {
  name: string;
  event: EventType;
  conditions: Condition[];
  recipients: string[];
  channel: NotificationChannelType;
  template: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConditionSchema = new Schema<Condition>(
  {
    field: { type: String, required: true },
    operator: {
      type: String,
      required: true,
      enum: Object.values(ConditionOperator),
    },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const RuleSchema = new Schema<IRule>(
  {
    name: { type: String, required: true, trim: true },
    event: {
      type: String,
      required: true,
      enum: Object.values(EventType),
    },
    conditions: { type: [ConditionSchema], default: [] },
    recipients: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one recipient is required',
      },
    },
    channel: {
      type: String,
      required: true,
      enum: Object.values(NotificationChannelType),
    },
    template: { type: String, required: true, trim: true },
    enabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

RuleSchema.index({ event: 1 });
RuleSchema.index({ enabled: 1 });
RuleSchema.index({ event: 1, enabled: 1 });

export const Rule = mongoose.model<IRule>('Rule', RuleSchema);
