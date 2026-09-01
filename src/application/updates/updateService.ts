import type { UpdateCheckResult, UpdatePort } from '../ports';
import type { Result } from '../result';

export interface UpdateCheckOptions {
  readonly online: boolean;
}

export interface AutomaticUpdateCheckOptions extends UpdateCheckOptions {
  readonly onReady: () => void;
}

export interface UpdateActivationOptions {
  readonly hasActiveSession: boolean;
}

export type UpdateActivationResult = 'activated' | 'deferred';

export interface UpdateService {
  check(options: UpdateCheckOptions): Promise<Result<UpdateCheckResult>>;
  checkAutomatically(options: AutomaticUpdateCheckOptions): Promise<void>;
  activate(options: UpdateActivationOptions): Promise<Result<UpdateActivationResult>>;
}

export function createUpdateService(port: UpdatePort): UpdateService {
  async function check({ online }: UpdateCheckOptions): Promise<Result<UpdateCheckResult>> {
    if (!online) {
      return {
        ok: false,
        error: { type: 'update-offline', code: 'UPDATE_OFFLINE' },
      };
    }
    return port.check();
  }

  return {
    check,
    async checkAutomatically(options): Promise<void> {
      const result = await check(options);
      if (result.ok && result.value === 'ready') options.onReady();
    },
    async activate({ hasActiveSession }): Promise<Result<UpdateActivationResult>> {
      if (hasActiveSession) {
        await port.defer();
        return { ok: true, value: 'deferred' };
      }
      const result = await port.activate();
      if (!result.ok) return result;
      return { ok: true, value: 'activated' };
    },
  };
}
