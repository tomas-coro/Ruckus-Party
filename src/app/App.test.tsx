import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';

import type { DiagnosticsPort, SettingsRepository } from '../application/ports';
import type { PartyNightService } from '../application/party-night/partyNightService';
import type { Result } from '../application/result';
import { App } from './App';
import type { ReadyBootstrapState } from './bootstrap';

vi.mock('../infrastructure/pwa/usePwaLifecycle', () => ({
  usePwaLifecycle: () => ({
    offlineReady: false,
    updatePort: {
      check: () => Promise.resolve({ ok: true, value: 'current' } as const),
      activate: () => Promise.resolve({ ok: true, value: undefined } as const),
      defer: () => Promise.resolve(),
    },
  }),
}));

beforeEach(() => {
  window.location.hash = '#/';
});

it('renders the Ruckus Party application landmark', () => {
  render(<App />);

  expect(screen.getByRole('main', { name: 'Ruckus Party' })).toBeInTheDocument();
});

it('persists a Home language change before publishing the new locale', async () => {
  const saveSettings = vi.fn(
    (): Promise<Result<void>> => Promise.resolve({ ok: true, value: undefined }),
  );
  const settingsRepository: SettingsRepository = {
    load: () => Promise.resolve({ ok: true, value: { locale: 'it' } }),
    save: saveSettings,
  };
  const service: PartyNightService = {
    startFreeNight: vi.fn(),
    cancelPartyNight: vi.fn(),
    dispatch: vi.fn(),
    subscribe: () => () => undefined,
    getSnapshot: () => null,
  };
  const diagnostics: DiagnosticsPort = {
    record: () => Promise.resolve(),
    export: () => Promise.resolve({ ok: true, value: new Blob() }),
  };
  const state: ReadyBootstrapState = {
    status: 'ready',
    session: null,
    settings: { locale: 'it' },
    service,
    diagnostics,
    settingsRepository,
    clock: { now: () => 100 },
  };

  render(<App bootstrapState={state} />);
  await userEvent.click(screen.getByRole('button', { name: 'Passa all’inglese' }));

  expect(saveSettings).toHaveBeenCalledWith({ locale: 'en' });
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Switch to Italian' })).toBeInTheDocument();
  });
});
