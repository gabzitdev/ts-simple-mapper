import { describe, it, expect } from 'vitest';
import { greet } from '../src/index';
import { add } from '../src/utils/helper';

describe('Library Tests', () => {
  it('should greet properly', () => {
    expect(greet('World')).toBe('Hello, World!');
  });

  it('should add numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });
});
