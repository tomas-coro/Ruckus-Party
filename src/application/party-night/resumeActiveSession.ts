import type { ActiveSession } from '../../domain/session/activeSession';

export function resumeActiveSession(session: ActiveSession | null): ActiveSession | null {
  if (session?.phase !== 'privateRevealReady') return session;

  return {
    ...session,
    phase: 'privateRevealCovered',
  };
}
