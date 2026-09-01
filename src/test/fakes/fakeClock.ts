import type { Clock } from '../../application/ports';

export class FakeClock implements Clock {
  constructor(private current: number) {}

  now(): number {
    const value = this.current;
    this.current += 1;
    return value;
  }
}
