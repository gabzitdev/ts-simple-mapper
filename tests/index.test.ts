import { describe, it, expect } from 'vitest';
import { simpleMap } from '../src';

describe('simpleMap', () => {
  // Basic mapping tests
  describe('Basic mapping', () => {
    it('should map simple objects', () => {
      const source = {
        name: 'John',
        age: 30,
        email: 'john@example.com'
      };

      const map = simpleMap<typeof source, typeof source>();
      const result = map(source);

      expect(result).toEqual(source);
      expect(result).not.toBe(source); // Should create a new object
    });

    it('should exclude specified fields', () => {
      const source = {
        name: 'John',
        age: 30,
        internalId: '123'
      };

      const map = simpleMap<typeof source, Omit<typeof source, 'internalId'>>({
        exclude: ['internalId']
      });

      const result = map(source);

      expect(result).toEqual({
        name: 'John',
        age: 30
      });
      expect(result).not.toHaveProperty('internalId');
    });

    it('should apply custom transformations', () => {
      const source = {
        name: 'John',
        birthDate: '1990-01-01',
        amount: '100.50'
      };

      const map = simpleMap<typeof source, {
        name: string;
        birthDate: Date;
        amount: number;
      }>({
        transforms: {
          birthDate: (value) => new Date(value),
          amount: (value) => parseFloat(value)
        }
      });

      const result = map(source);

      expect(result.name).toBe('John');
      expect(result.birthDate).toBeInstanceOf(Date);
      expect(result.amount).toBe(100.50);
    });

    it('should map field names according to fieldMappings', () => {
      const source = {
        full_name: 'John Doe',
        user_id: '123',
        email_address: 'john@example.com'
      };

      const map = simpleMap<typeof source, {
        name: string;
        id: string;
        email: string;
      }>({
        fieldMappings: {
          name: 'full_name',
          id: 'user_id',
          email: 'email_address'
        }
      });

      const result = map(source);

      expect(result).toEqual({
        name: 'John Doe',
        id: '123',
        email: 'john@example.com'
      });
    });
  });

  // Deep cloning tests
  describe('Deep cloning', () => {
    it('should perform deep cloning when enabled', () => {
      const source = {
        nested: { value: 42 }
      };

      const map = simpleMap<typeof source, typeof source>({
        deep: true
      });

      const result = map(source);
      
      expect(result).toEqual(source);
      expect(result.nested).not.toBe(source.nested);
    });

    it('should not perform deep cloning when disabled', () => {
      const source = {
        nested: { value: 42 }
      };

      const map = simpleMap<typeof source, typeof source>({
        deep: false
      });

      const result = map(source);
      
      expect(result).toEqual(source);
      expect(result.nested).toBe(source.nested);
    });

    it('should handle arrays with deep cloning', () => {
      const source = {
        items: [1, 2, 3]
      };

      const map = simpleMap<typeof source, typeof source>({
        deep: true
      });

      const result = map(source);
      
      expect(result).toEqual(source);
      expect(result.items).not.toBe(source.items);
    });

    it('should handle dates with deep cloning', () => {
      const source = {
        date: new Date('2024-01-01')
      };

      const map = simpleMap<typeof source, typeof source>({
        deep: true
      });

      const result = map(source);
      
      expect(result).toEqual(source);
      expect(result.date).not.toBe(source.date);
      expect(result.date).toBeInstanceOf(Date);
    });
  });

  // Special cases
  describe('Special cases', () => {
    it('should handle null values', () => {
      const source = { value: null };
      const map = simpleMap<typeof source, typeof source>({});
      const result = map(source);
      expect(result).toEqual({ value: null });
    });

    it('should handle undefined values', () => {
      const source = { value: undefined };
      const map = simpleMap<typeof source, typeof source>({});
      const result = map(source);
      expect(result).toEqual({ value: undefined });
    });

    it('should handle empty objects', () => {
      const source = {};
      const map = simpleMap<typeof source, typeof source>({});
      const result = map(source);
      expect(result).toEqual({});
    });
  });
});
