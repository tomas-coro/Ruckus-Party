import type { DiagnosticEvent } from '../../application/ports';

export interface DiagnosticsExport {
  readonly appVersion: string;
  readonly schemaVersion: 1;
  readonly events: readonly DiagnosticEvent[];
}

export function exportDiagnosticsBlob(
  events: readonly DiagnosticEvent[],
  appVersion: string,
): Blob {
  const payload: DiagnosticsExport = {
    appVersion,
    schemaVersion: 1,
    events,
  };
  return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
}
