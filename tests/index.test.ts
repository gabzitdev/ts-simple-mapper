import { describe, expect, it } from 'vitest';
import { simpleMap } from '../src';
import { MapOptions } from '../src/types';

describe('simpleMap', () => {
  it('should map simple objects', () => {
    // Arrange
    type Source = {
      name: string;
      age: number;
      email: string;
    };
    const source: Source = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
    };

    // Act
    const result = simpleMap<Source, Source>(source);

    // Assert
    expect(result).toEqual(source);
    expect(result).not.toBe(source); // Should create a new object
  });

  it('should exclude specified fields', () => {
    // Arrange
    type Source = {
      name: string;
      age: number;
      internalId: string;
    };
    type Target = Omit<Source, 'internalId'>;
    const source: Source = {
      name: 'John',
      age: 30,
      internalId: '123',
    };
    const options: MapOptions = {
      exclude: ['internalId'],
    };

    // Act
    const result = simpleMap<Source, Target>(source, options);

    // Assert
    expect(result).toEqual({
      name: 'John',
      age: 30,
    });
    expect(result).not.toHaveProperty('internalId');
  });

  it('should apply custom transformations', () => {
    // Arrange
    type Source = {
      name: string;
      birthDate: string;
      amount: string;
    };
    type Target = {
      name: string;
      birthDate: Date;
      amount: number;
    };
    const source: Source = {
      name: 'John',
      birthDate: '1990-01-01',
      amount: '100.50',
    };
    const options: MapOptions = {
      transforms: {
        birthDate: (value: string) => new Date(value),
        amount: (value: string) => parseFloat(value),
      },
    };

    // Act
    const result = simpleMap<Source, Target>(source, options);

    // Assert
    expect(result.name).toBe('John');
    expect(result.birthDate).toBeInstanceOf(Date);
    expect(result.amount).toBe(100.5);
  });

  it('should map field names according to fieldMappings', () => {
    // Arrange
    type Source = {
      full_name: string;
      user_id: string;
      email_address: string;
    };
    type Target = {
      name: string;
      id: string;
      email: string;
    };
    const source: Source = {
      full_name: 'John Doe',
      user_id: '123',
      email_address: 'john@example.com',
    };
    const options: MapOptions = {
      fieldMappings: {
        name: 'full_name',
        id: 'user_id',
        email: 'email_address',
      } as const,
    };

    // Act
    const result = simpleMap<Source, Target>(source, options);

    // Assert
    expect(result).toEqual({
      name: 'John Doe',
      id: '123',
      email: 'john@example.com',
    });
  });

  it('should handle nested objects', () => {
    // Arrange
    type Source = {
      nested: { value: number };
    };
    const source: Source = {
      nested: { value: 42 },
    };

    // Act
    const result = simpleMap<Source, Source>(source);

    // Assert
    expect(result).toEqual(source);
    expect(result.nested).not.toBe(source.nested); // Should create a deep copy
  });

  it('should handle arrays', () => {
    // Arrange
    type Source = {
      items: number[];
    };
    const source: Source = {
      items: [1, 2, 3],
    };

    // Act
    const result = simpleMap<Source, Source>(source);

    // Assert
    expect(result).toEqual(source);
    expect(result.items).not.toBe(source.items); // Should create a deep copy
  });

  it('should handle dates', () => {
    // Arrange
    type Source = {
      date: Date;
    };
    const source: Source = {
      date: new Date('2024-01-01'),
    };

    // Act
    const result = simpleMap<Source, Source>(source);

    // Assert
    expect(result).toEqual(source);
    expect(result.date).not.toBe(source.date); // Should create a new Date
  });

  describe('special cases', () => {
    it('should handle null values', () => {
      // Arrange
      type Source = {
        value: null;
      };
      const source: Source = { value: null };
      const options: MapOptions = {};

      // Act
      const result = simpleMap<Source, Source>(source, options);

      // Assert
      expect(result).toEqual({ value: null });
    });

    it('should handle undefined values', () => {
      // Arrange
      type Source = {
        value: undefined;
      };
      const source: Source = { value: undefined };
      const options: MapOptions = {};

      // Act
      const result = simpleMap<Source, Source>(source, options);

      // Assert
      expect(result).toEqual({ value: undefined });
    });

    it('should handle empty objects', () => {
      // Arrange
      type Source = Record<string, never>;
      const source: Source = {};
      const options: MapOptions = {};

      // Act
      const result = simpleMap<Source, Source>(source, options);

      // Assert
      expect(result).toEqual({});
    });

    it('should handle objects with circular references', () => {
      // Arrange
      type Source = {
        self?: Source;
      };
      const source: Source = {};
      source.self = source;

      // Act & Assert
      expect(() => simpleMap<Source, Source>(source)).toThrowError(
        'Circular reference detected during deep cloning'
      );
    });
  });
});
