import type { IDBPDatabase } from 'idb';

import type {
  DiagnosticContextValue,
  DiagnosticEvent,
  DiagnosticsPort,
} from '../../application/ports';
import type { Result } from '../../application/result';
import type { RuckusDb } from '../persistence/schema';
import { exportDiagnosticsBlob } from './exportDiagnostics';

const MAX_EVENTS = 100;
const ALLOWED_CONTEXT_KEYS = new Set([
  'attempt',
  'operation',
  'phase',
  'route',
  'status',
  'store',
]);

function redactContext(
  context: Readonly<Record<string, DiagnosticContextValue>>,
): Readonly<Record<string, DiagnosticContextValue>> {
  return Object.fromEntries(
    Object.entries(context).filter(([key]) => ALLOWED_CONTEXT_KEYS.has(key)),
  );
}

function errorCode(error: unknown): string {
  return error instanceof DOMException ? error.name : 'INDEXED_DB_ERROR';
}

export class LocalDiagnostics implements DiagnosticsPort {
  constructor(
    private readonly database: Promise<IDBPDatabase<RuckusDb>>,
    private readonly appVersion: string,
  ) {}

  async record(event: DiagnosticEvent): Promise<void> {
    try {
      const database = await this.database;
      const transaction = database.transaction('diagnostics', 'readwrite');
      const keys = await transaction.store.getAllKeys();
      const overflow = keys.length - MAX_EVENTS + 1;
      if (overflow > 0) {
        await Promise.all(keys.slice(0, overflow).map((key) => transaction.store.delete(key)));
      }
      await transaction.store.add({
        code: event.code,
        occurredAt: event.occurredAt,
        context: redactContext(event.context),
      });
      await transaction.done;
    } catch (error: unknown) {
      throw new Error(`Diagnostics write failed: ${errorCode(error)}`, { cause: error });
    }
  }

  async export(): Promise<Result<Blob>> {
    try {
      const database = await this.database;
      const events = await database.getAll('diagnostics');
      return { ok: true, value: exportDiagnosticsBlob(events, this.appVersion) };
    } catch (error: unknown) {
      return {
        ok: false,
        error: { type: 'read-failed', code: errorCode(error), safeState: 'preserved' },
      };
    }
  }
}
