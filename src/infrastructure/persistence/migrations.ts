import type { IDBPDatabase } from 'idb';

import type { RuckusDb } from './schema';

export function migrateRuckusDatabase(db: IDBPDatabase<RuckusDb>, oldVersion: number): void {
  if (oldVersion >= 1) return;

  db.createObjectStore('activeSession');
  db.createObjectStore('diagnostics', { autoIncrement: true });
  db.createObjectStore('meta');
  db.createObjectStore('settings');
}
