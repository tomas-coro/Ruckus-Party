import 'fake-indexeddb/auto';

import { describe, expect, it } from 'vitest';

import { openRuckusDatabase } from '../persistence/schema';
import { LocalDiagnostics } from './localDiagnostics';

let databaseSequence = 0;

function uniqueDbName(): string {
  databaseSequence += 1;
  return `diagnostics-test-${String(databaseSequence)}`;
}

describe('LocalDiagnostics', () => {
  it('keeps only the latest 100 events', async () => {
    const db = await openRuckusDatabase({ name: uniqueDbName() });
    const diagnostics = new LocalDiagnostics(Promise.resolve(db), '0.0.0');

    for (let index = 0; index < 105; index += 1) {
      await diagnostics.record({
        code: `EVENT_${String(index)}`,
        occurredAt: index,
        context: { phase: 'setupPlayers' },
      });
    }

    const exported = await diagnostics.export();
    if (!exported.ok) throw new Error('Expected diagnostics export to succeed');
    const payload = JSON.parse(await exported.value.text()) as {
      events: { code: string }[];
    };
    expect(payload.events).toHaveLength(100);
    expect(payload.events[0]?.code).toBe('EVENT_5');
    expect(payload.events[99]?.code).toBe('EVENT_104');
    db.close();
  });

  it('exports only allow-listed technical context', async () => {
    const db = await openRuckusDatabase({ name: uniqueDbName() });
    const diagnostics = new LocalDiagnostics(Promise.resolve(db), '0.0.0');

    await diagnostics.record({
      code: 'WRITE_FAILED',
      occurredAt: 42,
      context: {
        phase: 'privateRevealReady',
        operation: 'save',
        playerName: 'Ada',
        secret: 'signal.touch-left-ear',
      },
    });

    const exported = await diagnostics.export();
    if (!exported.ok) throw new Error('Expected diagnostics export to succeed');
    const text = await exported.value.text();
    expect(text).toContain('privateRevealReady');
    expect(text).toContain('save');
    expect(text).not.toContain('Ada');
    expect(text).not.toContain('touch-left-ear');
    db.close();
  });
});
