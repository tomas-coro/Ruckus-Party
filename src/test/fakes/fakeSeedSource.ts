import type { SeedSource } from '../../application/ports';

export class FakeSeedSource implements SeedSource {
  constructor(private readonly seed: number) {}

  createSeed(): number {
    return this.seed;
  }
}
