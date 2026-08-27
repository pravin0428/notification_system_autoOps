import { renderTemplate } from '../../src/notification/template/template.service';

describe('Template Service', () => {
  const data = {
    order: {
      id: 'ORD-1001',
      total: 15000,
      status: 'CONFIRMED',
    },
    customer: {
      name: 'John Doe',
    },
  };

  describe('Simple placeholders', () => {
    it('should replace a single placeholder', () => {
      const result = renderTemplate('Order {{order.id}}', data);
      expect(result).toBe('Order ORD-1001');
    });

    it('should replace multiple placeholders', () => {
      const result = renderTemplate('Order {{order.id}} has total {{order.total}}', data);
      expect(result).toBe('Order ORD-1001 has total 15000');
    });
  });

  describe('Nested placeholders', () => {
    it('should support nested field access', () => {
      const result = renderTemplate('Customer: {{customer.name}}', data);
      expect(result).toBe('Customer: John Doe');
    });

    it('should support mixed nesting levels', () => {
      const result = renderTemplate('{{customer.name}} ordered {{order.id}}', data);
      expect(result).toBe('John Doe ordered ORD-1001');
    });
  });

  describe('Missing placeholders', () => {
    it('should replace missing fields with MISSING marker', () => {
      const result = renderTemplate('Order {{order.id}} - {{order.note}}', data);
      expect(result).toBe('Order ORD-1001 - [MISSING: order.note]');
    });

    it('should handle completely missing nested objects', () => {
      const result = renderTemplate('Payment: {{payment.amount}}', data);
      expect(result).toBe('Payment: [MISSING: payment.amount]');
    });
  });

  describe('Edge cases', () => {
    it('should return template unchanged if no placeholders', () => {
      const result = renderTemplate('No placeholders here', data);
      expect(result).toBe('No placeholders here');
    });

    it('should handle empty template', () => {
      const result = renderTemplate('', data);
      expect(result).toBe('');
    });

    it('should handle placeholder with spaces', () => {
      const result = renderTemplate('{{ order.id }}', data);
      expect(result).toBe('ORD-1001');
    });
  });
});
