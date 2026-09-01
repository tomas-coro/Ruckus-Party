import type { UpdatePort } from '../../application/ports';

export interface PwaRuntime {
  readonly registration: () => ServiceWorkerRegistration | undefined;
  readonly needsRefresh: () => boolean;
  readonly activateWaitingWorker: () => Promise<void>;
}

export function createPwaAdapter(runtime: PwaRuntime): UpdatePort {
  return {
    async check() {
      const registration = runtime.registration();
      if (registration === undefined) {
        return {
          ok: false,
          error: { type: 'update-check-failed', code: 'SERVICE_WORKER_NOT_REGISTERED' },
        };
      }
      try {
        const updatedRegistration = await registration.update();
        const installing = updatedRegistration.installing;
        if (installing !== null) {
          await new Promise<void>((resolve) => {
            const finish = () => {
              if (installing.state === 'installed' || installing.state === 'redundant') resolve();
            };
            installing.addEventListener('statechange', finish);
            finish();
          });
        }
        return {
          ok: true,
          value: runtime.needsRefresh() || updatedRegistration.waiting !== null ? 'ready' : 'current',
        };
      } catch (error: unknown) {
        return {
          ok: false,
          error: {
            type: 'update-check-failed',
            code: error instanceof DOMException ? error.name : 'SERVICE_WORKER_UPDATE_FAILED',
          },
        };
      }
    },
    async activate() {
      try {
        await runtime.activateWaitingWorker();
        return { ok: true, value: undefined };
      } catch (error: unknown) {
        return {
          ok: false,
          error: {
            type: 'update-check-failed',
            code: error instanceof DOMException ? error.name : 'SERVICE_WORKER_ACTIVATION_FAILED',
          },
        };
      }
    },
    defer() {
      return Promise.resolve();
    },
  };
}
