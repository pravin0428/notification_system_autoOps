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

export interface Rule {
  _id: string;
  name: string;
  event: EventType;
  conditions: Condition[];
  recipients: string[];
  channel: NotificationChannelType;
  template: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  ruleId: { _id: string; name: string } | string;
  ruleName: string;
  eventId: string;
  recipient: string;
  channel: NotificationChannelType;
  message: string;
  status: NotificationStatus;
  error?: string;
  providerMessageId?: string;
  createdAt: string;
  sentAt?: string;
}

export interface EventTriggerResult {
  eventId: string;
  rulesMatched: number;
  notificationsGenerated: number;
  successful: number;
  failed: number;
  results: Array<{
    ruleId: string;
    ruleName: string;
    recipient: string;
    channel: NotificationChannelType;
    status: NotificationStatus;
    error?: string;
  }>;
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

export interface DashboardStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
  activeRules: number;
}
