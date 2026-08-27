import { Condition, ConditionOperator } from '../../common/types';

const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current;
};

const compareValues = (actual: unknown, expected: unknown, operator: ConditionOperator): boolean => {
  if (actual === undefined || actual === null) {
    return false;
  }

  const numActual = typeof actual === 'number' ? actual : Number(actual);
  const numExpected = typeof expected === 'number' ? expected : Number(expected);

  const bothNumeric = !isNaN(numActual) && !isNaN(numExpected);

  switch (operator) {
    case ConditionOperator.EQUALS:
      if (bothNumeric) return numActual === numExpected;
      return String(actual) === String(expected);
    case ConditionOperator.NOT_EQUALS:
      if (bothNumeric) return numActual !== numExpected;
      return String(actual) !== String(expected);
    case ConditionOperator.GREATER_THAN:
      if (!bothNumeric) return false;
      return numActual > numExpected;
    case ConditionOperator.LESS_THAN:
      if (!bothNumeric) return false;
      return numActual < numExpected;
    case ConditionOperator.GREATER_THAN_OR_EQUAL:
      if (!bothNumeric) return false;
      return numActual >= numExpected;
    case ConditionOperator.LESS_THAN_OR_EQUAL:
      if (!bothNumeric) return false;
      return numActual <= numExpected;
    default:
      return false;
  }
};

export const evaluateCondition = (
  data: Record<string, unknown>,
  condition: Condition,
): boolean => {
  const actualValue = getNestedValue(data, condition.field);
  return compareValues(actualValue, condition.value, condition.operator);
};

export const evaluateConditions = (
  data: Record<string, unknown>,
  conditions: Condition[],
): boolean => {
  if (conditions.length === 0) return true;
  return conditions.every((condition) => evaluateCondition(data, condition));
};
