import { describe, expect, it } from 'vitest';

import { parseHash, routeToHash } from './hashRouter';

describe('hash router', () => {
  it.each([
    ['#/', { type: 'home' }],
    ['', { type: 'home' }],
    ['#/settings', { type: 'settings' }],
    ['#/missing', { type: 'unknown', raw: '#/missing' }],
  ] as const)('parses %s', (hash, expected) => {
    expect(parseHash(hash)).toEqual(expected);
  });

  it('serializes only top-level routes', () => {
    expect(routeToHash({ type: 'home' })).toBe('#/');
    expect(routeToHash({ type: 'settings' })).toBe('#/settings');
  });
});
