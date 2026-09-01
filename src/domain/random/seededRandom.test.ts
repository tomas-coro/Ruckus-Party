import { describe, expect, it } from 'vitest';

import { createSeededRandom } from './seededRandom';

describe('createSeededRandom', () => {
  it('replays the same sequence from seed and position', () => {
    const first = createSeededRandom({ seed: 123456, position: 0 });
    const values = [first.nextInt(10), first.nextInt(10), first.nextInt(10)];
    const resumed = createSeededRandom({ seed: 123456, position: 2 });

    expect(resumed.nextInt(10)).toBe(values[2]);
  });

  it('exposes the advanced position for persistence', () => {
    const random = createSeededRandom({ seed: 42, position: 3 });

    random.nextInt(5);

    expect(random.state()).toEqual({ seed: 42, position: 4 });
  });

  it('rejects a non-positive integer maximum', () => {
    const random = createSeededRandom({ seed: 42, position: 0 });

    expect(() => random.nextInt(0)).toThrow(RangeError);
    expect(() => random.nextInt(1.5)).toThrow(RangeError);
  });
});
