/* Context providers intentionally export their matching consumer hook. */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';

import type { Result } from '../../application/result';
import type { ActiveSession } from '../../domain/session/activeSession';
import type { SessionCommand } from '../../domain/session/sessionCommand';
import { useAppServices } from './AppServicesContext';

export type PartyNightStatus = 'idle' | 'saving';

export interface PartyNightContextValue {
  readonly session: ActiveSession | null;
  readonly status: PartyNightStatus;
  startFreeNight(): Promise<Result<ActiveSession>>;
  cancelPartyNight(): Promise<Result<void>>;
  dispatch(command: SessionCommand): Promise<Result<ActiveSession>>;
}

const PartyNightContext = createContext<PartyNightContextValue | null>(null);

export function PartyNightProvider({ children }: { readonly children: ReactNode }) {
  const { service } = useAppServices();
  const session = useSyncExternalStore(
    (subscriber) => service.subscribe(subscriber),
    () => service.getSnapshot(),
    () => service.getSnapshot(),
  );
  const [status, setStatus] = useState<PartyNightStatus>('idle');

  const startFreeNight = useCallback(async () => {
    setStatus('saving');
    try {
      return await service.startFreeNight();
    } finally {
      setStatus('idle');
    }
  }, [service]);

  const dispatch = useCallback(async (command: SessionCommand) => {
    setStatus('saving');
    try {
      return await service.dispatch(command);
    } finally {
      setStatus('idle');
    }
  }, [service]);

  const cancelPartyNight = useCallback(async () => {
    setStatus('saving');
    try {
      return await service.cancelPartyNight();
    } finally {
      setStatus('idle');
    }
  }, [service]);

  const value = useMemo(
    () => ({ session, status, startFreeNight, cancelPartyNight, dispatch }),
    [cancelPartyNight, dispatch, session, startFreeNight, status],
  );
  return <PartyNightContext.Provider value={value}>{children}</PartyNightContext.Provider>;
}

export function usePartyNight(): PartyNightContextValue {
  const context = useContext(PartyNightContext);
  if (context === null) {
    throw new Error('usePartyNight must be used inside PartyNightProvider.');
  }
  return context;
}
