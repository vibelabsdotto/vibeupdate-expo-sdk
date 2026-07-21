import { describe, expect, it } from 'vitest';
import { shouldRecheckInForeground } from '../src/foreground.js';

describe('foreground interval', () => {
  const sixHours = 6 * 60 * 60 * 1000;

  it('rechecks when no successful check exists', () => {
    expect(shouldRecheckInForeground(null, 10, sixHours)).toBe(true);
  });

  it('waits until the interval has elapsed', () => {
    expect(shouldRecheckInForeground(100, 100 + sixHours - 1, sixHours)).toBe(false);
    expect(shouldRecheckInForeground(100, 100 + sixHours, sixHours)).toBe(true);
  });

  it('treats invalid stored timestamps as missing', () => {
    expect(shouldRecheckInForeground('not-a-number', 100, sixHours)).toBe(true);
  });
});
