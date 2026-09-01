import { deleteDB, type IDBPDatabase } from 'idb';

import type {
  LocalSettings,
  SessionRepository,
  SettingsRepository,
} from '../../application/ports';
import type { Result } from '../../application/result';
import type { ActiveSession } from '../../domain/session/activeSession';
import type { RuckusDb } from './schema';

function errorCode(error: unknown): string {
  return error instanceof DOMException ? error.name : 'INDEXED_DB_ERROR';
}

export class IndexedDbSessionRepository implements SessionRepository<ActiveSession> {
  constructor(private readonly database: Promise<IDBPDatabase<RuckusDb>>) {}

  async load(): Promise<Result<ActiveSession | null>> {
    try {
      const database = await this.database;
      const session = await database.get('activeSession', 'current');
      return { ok: true, value: session ?? null };
    } catch (error: unknown) {
      return {
        ok: false,
        error: { type: 'read-failed', code: errorCode(error), safeState: 'preserved' },
      };
    }
  }

  async save(session: ActiveSession): Promise<Result<void>> {
    try {
      const database = await this.database;
      await database.put('activeSession', session, 'current');
      return { ok: true, value: undefined };
    } catch (error: unknown) {
      return {
        ok: false,
        error: { type: 'write-failed', code: errorCode(error), safeState: 'preserved' },
      };
    }
  }

  async clear(): Promise<Result<void>> {
    try {
      const database = await this.database;
      await database.delete('activeSession', 'current');
      return { ok: true, value: undefined };
    } catch (error: unknown) {
      return {
        ok: false,
        error: { type: 'write-failed', code: errorCode(error), safeState: 'preserved' },
      };
    }
  }
}

export class IndexedDbSettingsRepository implements SettingsRepository {
  constructor(private readonly database: Promise<IDBPDatabase<RuckusDb>>) {}

  async load(): Promise<Result<LocalSettings>> {
    try {
      const database = await this.database;
      const settings = await database.get('settings', 'local');
      return { ok: true, value: settings ?? { locale: 'it' } };
    } catch (error: unknown) {
      return {
        ok: false,
        error: { type: 'read-failed', code: errorCode(error), safeState: 'preserved' },
      };
    }
  }

  async save(settings: LocalSettings): Promise<Result<void>> {
    try {
      const database = await this.database;
      await database.put('settings', settings, 'local');
      return { ok: true, value: undefined };
    } catch (error: unknown) {
      return {
        ok: false,
        error: { type: 'write-failed', code: errorCode(error), safeState: 'preserved' },
      };
    }
  }
}

export async function resetAllData(databaseName = 'ruckus-party'): Promise<Result<void>> {
  try {
    await deleteDB(databaseName);
    return { ok: true, value: undefined };
  } catch (error: unknown) {
    return {
      ok: false,
      error: { type: 'write-failed', code: errorCode(error), safeState: 'preserved' },
    };
  }
}
