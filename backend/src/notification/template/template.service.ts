const TEMPLATE_REGEX = /\{\{(.+?)\}\}/g;

const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
  const keys = path.trim().split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current;
};

export const renderTemplate = (template: string, data: Record<string, unknown>): string => {
  return template.replace(TEMPLATE_REGEX, (_match, key: string) => {
    const value = getNestedValue(data, key);
    if (value === undefined || value === null) {
      return `[MISSING: ${key}]`;
    }
    return String(value);
  });
};
