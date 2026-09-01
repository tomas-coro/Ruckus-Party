import type { Locale } from '../domain/localization/translationKey';
import type { Result } from './result';

export interface Clock {
  now(): number;
}

export interface SeedSource {
  createSeed(): number;
}

export interface SessionRepository<TSession> {
  load(): Promise<Result<TSession | null>>;
  save(session: TSession): Promise<Result<void>>;
  clear(): Promise<Result<void>>;
}

export interface LocalSettings {
  locale: Locale;
}

export interface SettingsRepository {
  load(): Promise<Result<LocalSettings>>;
  save(settings: LocalSettings): Promise<Result<void>>;
}

export type DiagnosticContextValue = string | number | boolean | null;

export interface DiagnosticEvent {
  code: string;
  occurredAt: number;
  context: Readonly<Record<string, DiagnosticContextValue>>;
}

export interface DiagnosticsPort {
  record(event: DiagnosticEvent): Promise<void>;
  export(): Promise<Result<Blob>>;
}

export type UpdateCheckResult = 'current' | 'ready';

export interface UpdatePort {
  check(): Promise<Result<UpdateCheckResult>>;
  activate(): Promise<Result<void>>;
  defer(): Promise<void>;
}
