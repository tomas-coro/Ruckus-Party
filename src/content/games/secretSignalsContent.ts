export const secretSignalsContent = [
  'signal.touch-left-ear',
  'signal.tap-two-fingers',
  'signal.scratch-chin',
  'signal.cross-ankles',
  'signal.adjust-sleeve',
  'signal.touch-nose',
] as const;

export type SecretSignalKey = (typeof secretSignalsContent)[number];
