import type { SeedSource } from '../../application/ports';

export class CryptoSeedSource implements SeedSource {
  createSeed(): number {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    const seed = values[0];
    if (seed === undefined) {
      throw new Error('Web Crypto did not produce a seed.');
    }
    return seed;
  }
}
