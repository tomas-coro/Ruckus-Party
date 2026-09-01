import { describe, expect, it, vi } from 'vitest';

import { secretSignalsDefinition } from '../../content/games/secretSignalsDefinition';
import type { DiagnosticEvent, DiagnosticsPort } from '../ports';
import type { ActiveSession } from '../../domain/session/activeSession';
import { FakeClock } from '../../test/fakes/fakeClock';
import { FakeSessionRepository } from '../../test/fakes/fakeRepositories';
import { FakeSeedSource } from '../../test/fakes/fakeSeedSource';
import { createPartyNightService } from './partyNightService';

class FakeDiagnostics implements DiagnosticsPort {
  readonly events: DiagnosticEvent[] = [];

  record(event: DiagnosticEvent): Promise<void> {
    this.events.push(event);
    return Promise.resolve();
  }

  export() {
    return Promise.resolve({ ok: true, value: new Blob() } as const);
  }
}

function createService(repository: FakeSessionRepository<ActiveSession>, trace: string[] = []) {
  return createPartyNightService({
    repository,
    clock: new FakeClock(100),
    seedSource: new FakeSeedSource(123),
    diagnostics: new FakeDiagnostics(),
    game: secretSignalsDefinition,
    onTransition: () => trace.push('transition'),
  });
}

describe('PartyNightService', () => {
  it('keeps the published state unchanged when persistence fails', async () => {
    const repository = new FakeSessionRepository<ActiveSession>();
    repository.failNextSave = true;
    const service = createService(repository);
    const before = service.getSnapshot();

    const result = await service.startFreeNight();

    expect(result).toMatchObject({ ok: false, error: { type: 'write-failed' } });
    expect(service.getSnapshot()).toEqual(before);
  });

  it('saves before publishing a successful transition', async () => {
    const trace: string[] = [];
    const repository = new FakeSessionRepository<ActiveSession>(trace);
    const service = createService(repository, trace);
    service.subscribe(() => trace.push('subscriber'));

    await service.startFreeNight();

    expect(trace).toEqual(['transition', 'save:start', 'save:end', 'subscriber']);
  });

  it('clears persistence before publishing the end of a Party Night', async () => {
    const repository = new FakeSessionRepository<ActiveSession>();
    const service = createService(repository);
    await service.startFreeNight();
    const subscriber = vi.fn();
    service.subscribe(subscriber);

    const result = await service.cancelPartyNight();

    expect(result).toEqual({ ok: true, value: undefined });
    expect(repository.value).toBeNull();
    expect(service.getSnapshot()).toBeNull();
    expect(subscriber).toHaveBeenCalledOnce();
  });

  it('preserves the snapshot when dispatch persistence fails and records safe diagnostics', async () => {
    const repository = new FakeSessionRepository<ActiveSession>();
    const diagnostics = new FakeDiagnostics();
    const service = createPartyNightService({
      repository,
      clock: new FakeClock(100),
      seedSource: new FakeSeedSource(123),
      diagnostics,
      game: secretSignalsDefinition,
    });
    await service.startFreeNight();
    const before = service.getSnapshot();
    repository.failNextSave = true;

    const result = await service.dispatch({
      type: 'set-players',
      players: [
        { id: 'p1', name: 'Ada' },
        { id: 'p2', name: 'Luca' },
      ],
    });

    expect(result).toMatchObject({ ok: false, error: { type: 'write-failed' } });
    expect(service.getSnapshot()).toEqual(before);
    expect(diagnostics.events).toEqual([
      {
        code: 'TEST_WRITE_FAILED',
        occurredAt: 102,
        context: { phase: 'setupPreferences' },
      },
    ]);
    expect(JSON.stringify(diagnostics.events)).not.toContain('Ada');
  });
});
