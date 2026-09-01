export interface RandomSource {
  nextInt(max: number): number;
}

export interface RandomState {
  readonly seed: number;
  readonly position: number;
}
