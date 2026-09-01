import type { SessionRepository } from '../../application/ports';
import type { Result } from '../../application/result';

export class FakeSessionRepository<TSession> implements SessionRepository<TSession> {
  value: TSession | null = null;
  failNextSave = false;

  constructor(private readonly trace: string[] = []) {}

  load(): Promise<Result<TSession | null>> {
    return Promise.resolve({ ok: true, value: this.value });
  }

  save(session: TSession): Promise<Result<void>> {
    this.trace.push('save:start');
    if (this.failNextSave) {
      this.failNextSave = false;
      this.trace.push('save:end');
      return Promise.resolve({
        ok: false,
        error: { type: 'write-failed', code: 'TEST_WRITE_FAILED', safeState: 'preserved' },
      });
    }
    this.value = session;
    this.trace.push('save:end');
    return Promise.resolve({ ok: true, value: undefined });
  }

  clear(): Promise<Result<void>> {
    this.value = null;
    return Promise.resolve({ ok: true, value: undefined });
  }
}
