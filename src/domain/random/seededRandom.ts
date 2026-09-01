import type { RandomSource, RandomState } from './randomSource';

export interface StatefulRandomSource extends RandomSource {
  state(): RandomState;
}

function valueAt(seed: number, position: number): number {
  let value = (seed + Math.imul(position + 1, 0x6d2b79f5)) | 0;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
}

export function createSeededRandom(initialState: RandomState): StatefulRandomSource {
  if (!Number.isInteger(initialState.seed) || !Number.isInteger(initialState.position)) {
    throw new TypeError('Random seed and position must be integers.');
  }
  if (initialState.position < 0) {
    throw new RangeError('Random position cannot be negative.');
  }

  let position = initialState.position;

  return {
    nextInt(max: number): number {
      if (!Number.isInteger(max) || max <= 0) {
        throw new RangeError('Random maximum must be a positive integer.');
      }
      const result = Math.floor(valueAt(initialState.seed, position) * max);
      position += 1;
      return result;
    },
    state(): RandomState {
      return { seed: initialState.seed, position };
    },
  };
}
