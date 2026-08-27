import { evaluateCondition, evaluateConditions } from '../../src/notification/rule-engine/condition-evaluator';
import { ConditionOperator } from '../../src/common/types';

describe('Condition Evaluator', () => {
  const data = {
    order: {
      id: 'ORD-1001',
      total: 15000,
      status: 'CONFIRMED',
    },
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  };

  describe('EQUALS', () => {
    it('should match string equality', () => {
      const condition = { field: 'order.status', operator: ConditionOperator.EQUALS, value: 'CONFIRMED' };
      expect(evaluateCondition(data, condition)).toBe(true);
    });

    it('should not match string inequality', () => {
      const condition = { field: 'order.status', operator: ConditionOperator.EQUALS, value: 'PENDING' };
      expect(evaluateCondition(data, condition)).toBe(false);
    });

    it('should match numeric equality', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.EQUALS, value: 15000 };
      expect(evaluateCondition(data, condition)).toBe(true);
    });

    it('should not match numeric inequality', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.EQUALS, value: 10000 };
      expect(evaluateCondition(data, condition)).toBe(false);
    });
  });

  describe('NOT_EQUALS', () => {
    it('should match when values differ', () => {
      const condition = { field: 'order.status', operator: ConditionOperator.NOT_EQUALS, value: 'PENDING' };
      expect(evaluateCondition(data, condition)).toBe(true);
    });

    it('should not match when values are equal', () => {
      const condition = { field: 'order.status', operator: ConditionOperator.NOT_EQUALS, value: 'CONFIRMED' };
      expect(evaluateCondition(data, condition)).toBe(false);
    });
  });

  describe('GREATER_THAN', () => {
    it('should match when value is greater', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.GREATER_THAN, value: 10000 };
      expect(evaluateCondition(data, condition)).toBe(true);
    });

    it('should not match when value is equal', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.GREATER_THAN, value: 15000 };
      expect(evaluateCondition(data, condition)).toBe(false);
    });

    it('should not match when value is less', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.GREATER_THAN, value: 20000 };
      expect(evaluateCondition(data, condition)).toBe(false);
    });
  });

  describe('LESS_THAN', () => {
    it('should match when value is less', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.LESS_THAN, value: 20000 };
      expect(evaluateCondition(data, condition)).toBe(true);
    });

    it('should not match when value is equal', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.LESS_THAN, value: 15000 };
      expect(evaluateCondition(data, condition)).toBe(false);
    });

    it('should not match when value is greater', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.LESS_THAN, value: 10000 };
      expect(evaluateCondition(data, condition)).toBe(false);
    });
  });

  describe('GREATER_THAN_OR_EQUAL', () => {
    it('should match when value is greater', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.GREATER_THAN_OR_EQUAL, value: 10000 };
      expect(evaluateCondition(data, condition)).toBe(true);
    });

    it('should match when value is equal', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.GREATER_THAN_OR_EQUAL, value: 15000 };
      expect(evaluateCondition(data, condition)).toBe(true);
    });

    it('should not match when value is less', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.GREATER_THAN_OR_EQUAL, value: 20000 };
      expect(evaluateCondition(data, condition)).toBe(false);
    });
  });

  describe('LESS_THAN_OR_EQUAL', () => {
    it('should match when value is less', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.LESS_THAN_OR_EQUAL, value: 20000 };
      expect(evaluateCondition(data, condition)).toBe(true);
    });

    it('should match when value is equal', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.LESS_THAN_OR_EQUAL, value: 15000 };
      expect(evaluateCondition(data, condition)).toBe(true);
    });

    it('should not match when value is greater', () => {
      const condition = { field: 'order.total', operator: ConditionOperator.LESS_THAN_OR_EQUAL, value: 10000 };
      expect(evaluateCondition(data, condition)).toBe(false);
    });
  });

  describe('Missing fields', () => {
    it('should return false for missing field', () => {
      const condition = { field: 'order.nonexistent', operator: ConditionOperator.EQUALS, value: 'test' };
      expect(evaluateCondition(data, condition)).toBe(false);
    });

    it('should return false for deeply missing field', () => {
      const condition = { field: 'order.customer.name', operator: ConditionOperator.EQUALS, value: 'test' };
      expect(evaluateCondition(data, condition)).toBe(false);
    });

    it('should return false for entirely missing object', () => {
      const condition = { field: 'payment.amount', operator: ConditionOperator.GREATER_THAN, value: 0 };
      expect(evaluateCondition(data, condition)).toBe(false);
    });
  });

  describe('Nested fields', () => {
    it('should access deeply nested fields', () => {
      const condition = { field: 'customer.name', operator: ConditionOperator.EQUALS, value: 'John Doe' };
      expect(evaluateCondition(data, condition)).toBe(true);
    });
  });

  describe('Multiple conditions (AND semantics)', () => {
    it('should return true when all conditions pass', () => {
      const conditions = [
        { field: 'order.total', operator: ConditionOperator.GREATER_THAN, value: 10000 },
        { field: 'order.status', operator: ConditionOperator.EQUALS, value: 'CONFIRMED' },
      ];
      expect(evaluateConditions(data, conditions)).toBe(true);
    });

    it('should return false when any condition fails', () => {
      const conditions = [
        { field: 'order.total', operator: ConditionOperator.GREATER_THAN, value: 10000 },
        { field: 'order.status', operator: ConditionOperator.EQUALS, value: 'PENDING' },
      ];
      expect(evaluateConditions(data, conditions)).toBe(false);
    });

    it('should return true for empty conditions', () => {
      expect(evaluateConditions(data, [])).toBe(true);
    });
  });
});
