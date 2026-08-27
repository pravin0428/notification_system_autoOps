import { body, param, query, validationResult } from 'express-validator';
import { EventType, NotificationChannelType, ConditionOperator } from '../../common/types';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../common/errors';

export const handleValidationErrors = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Invalid request data', errors.array());
  }
  next();
};

export const createRuleValidation = [
  body('name').isString().trim().notEmpty().withMessage('Rule name is required'),
  body('event')
    .isString()
    .isIn(Object.values(EventType))
    .withMessage(`Event must be one of: ${Object.values(EventType).join(', ')}`),
  body('conditions').isArray().withMessage('Conditions must be an array'),
  body('conditions.*.field').isString().trim().notEmpty().withMessage('Condition field is required'),
  body('conditions.*.operator')
    .isString()
    .isIn(Object.values(ConditionOperator))
    .withMessage(`Operator must be one of: ${Object.values(ConditionOperator).join(', ')}`),
  body('conditions.*.value').exists().withMessage('Condition value is required'),
  body('recipients')
    .isArray({ min: 1 })
    .withMessage('At least one recipient is required'),
  body('recipients.*').isEmail().withMessage('Each recipient must be a valid email'),
  body('channel')
    .isString()
    .isIn(Object.values(NotificationChannelType))
    .withMessage(`Channel must be one of: ${Object.values(NotificationChannelType).join(', ')}`),
  body('template').isString().trim().notEmpty().withMessage('Template is required'),
  body('enabled').optional().isBoolean().withMessage('Enabled must be a boolean'),
  handleValidationErrors,
];

export const updateRuleValidation = [
  param('id').isMongoId().withMessage('Invalid rule ID'),
  body('name').optional().isString().trim().notEmpty().withMessage('Rule name cannot be empty'),
  body('event')
    .optional()
    .isString()
    .isIn(Object.values(EventType))
    .withMessage(`Event must be one of: ${Object.values(EventType).join(', ')}`),
  body('conditions').optional().isArray().withMessage('Conditions must be an array'),
  body('conditions.*.field').isString().trim().notEmpty().withMessage('Condition field is required'),
  body('conditions.*.operator')
    .isString()
    .isIn(Object.values(ConditionOperator))
    .withMessage(`Operator must be one of: ${Object.values(ConditionOperator).join(', ')}`),
  body('conditions.*.value').exists().withMessage('Condition value is required'),
  body('recipients')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one recipient is required'),
  body('recipients.*').optional().isEmail().withMessage('Each recipient must be a valid email'),
  body('channel')
    .optional()
    .isString()
    .isIn(Object.values(NotificationChannelType))
    .withMessage(`Channel must be one of: ${Object.values(NotificationChannelType).join(', ')}`),
  body('template').optional().isString().trim().notEmpty().withMessage('Template cannot be empty'),
  body('enabled').optional().isBoolean().withMessage('Enabled must be a boolean'),
  handleValidationErrors,
];

export const idValidation = [
  param('id').isMongoId().withMessage('Invalid ID'),
  handleValidationErrors,
];

export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isString()
    .withMessage('Status must be a string'),
  query('channel')
    .optional()
    .isString()
    .withMessage('Channel must be a string'),
  handleValidationErrors,
];

export const eventValidation = [
  body('type')
    .isString()
    .isIn(Object.values(EventType))
    .withMessage(`Event type must be one of: ${Object.values(EventType).join(', ')}`),
  body('data').isObject().withMessage('Data must be an object'),
  body('eventId').optional().isString().withMessage('eventId must be a string'),
  handleValidationErrors,
];
