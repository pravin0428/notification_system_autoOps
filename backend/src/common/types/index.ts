export enum EventType {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_UPDATED = 'ORDER_UPDATED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export enum NotificationChannelType {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
}

export enum ConditionOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export interface Condition {
  field: string;
  operator: ConditionOperator;
  value: unknown;
}

export interface NotificationPayload {
  ruleId: string;
  ruleName: string;
  eventId: string;
  recipient: string;
  channel: NotificationChannelType;
  message: string;
  data: Record<string, unknown>;
}

export interface NotificationResult {
  success: boolean;
  providerMessageId?: string;
  error?: string;
}

export interface EventTriggerData {
  type: EventType;
  data: Record<string, unknown>;
  eventId?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown[];
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
