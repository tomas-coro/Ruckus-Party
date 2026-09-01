import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

import type { DiagnosticEvent, LocalSettings } from '../../application/ports';
import type { ActiveSession } from '../../domain/session/activeSession';
import { migrateRuckusDatabase } from './migrations';

export interface RuckusDb extends DBSchema {
  activeSession: {
    key: 'current';
    value: ActiveSession;
  };
  diagnostics: {
    key: number;
    value: DiagnosticEvent;
  };
  meta: {
    key: string;
    value: string | number | boolean;
  };
  settings: {
    key: 'local';
    value: LocalSettings;
  };
}

export interface OpenRuckusDatabaseOptions {
  readonly name?: string;
}

export function openRuckusDatabase(
  options: OpenRuckusDatabaseOptions = {},
): Promise<IDBPDatabase<RuckusDb>> {
  return openDB<RuckusDb>(options.name ?? 'ruckus-party', 1, {
    upgrade(database, oldVersion) {
      migrateRuckusDatabase(database, oldVersion);
    },
  });
}
