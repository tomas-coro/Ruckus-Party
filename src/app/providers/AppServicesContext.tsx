/* Context providers intentionally export their matching consumer hook. */
/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode, useContext, useMemo } from 'react';

import type { UpdatePort } from '../../application/ports';
import type { ReadyBootstrapState } from '../bootstrap';

export interface AppServicesContextValue extends ReadyBootstrapState {
  readonly updatePort: UpdatePort;
  readonly offlineReady: boolean;
}

const AppServicesContext = createContext<AppServicesContextValue | null>(null);

export interface AppServicesProviderProps {
  readonly services: ReadyBootstrapState;
  readonly updatePort: UpdatePort;
  readonly offlineReady: boolean;
  readonly children: ReactNode;
}

export function AppServicesProvider({
  services,
  updatePort,
  offlineReady,
  children,
}: AppServicesProviderProps) {
  const value = useMemo(
    () => ({ ...services, updatePort, offlineReady }),
    [offlineReady, services, updatePort],
  );
  return <AppServicesContext.Provider value={value}>{children}</AppServicesContext.Provider>;
}

export function useAppServices(): AppServicesContextValue {
  const services = useContext(AppServicesContext);
  if (services === null) {
    throw new Error('useAppServices must be used inside AppServicesProvider.');
  }
  return services;
}
