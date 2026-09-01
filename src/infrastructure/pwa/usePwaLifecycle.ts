import { useMemo, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

import type { UpdatePort } from '../../application/ports';
import { createPwaAdapter } from './pwaAdapter';

export interface PwaLifecycle {
  readonly updatePort: UpdatePort;
  readonly offlineReady: boolean;
}

export function usePwaLifecycle(): PwaLifecycle {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();
  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_scriptUrl, registration) {
      setRegistration(registration);
      if (
        navigator.onLine
        && navigator.serviceWorker.controller !== null
        && registration !== undefined
      ) {
        void registration.update().catch(() => {
          console.error('Automatic service worker update check failed.');
        });
      }
    },
    onRegisterError() {
      console.error('Service worker registration failed.');
    },
  });

  const updatePort = useMemo(
    () => createPwaAdapter({
      registration: () => registration,
      needsRefresh: () => needRefresh,
      activateWaitingWorker: () => updateServiceWorker(true),
    }),
    [needRefresh, registration, updateServiceWorker],
  );

  return { updatePort, offlineReady };
}
