import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { SettingsRepository, UpdatePort } from '../../application/ports';
import type { Result } from '../../application/result';
import { createTranslator } from '../../content/translations/translator';
import { createActiveSession } from '../../domain/session/activeSession';
import { SettingsScreen } from './SettingsScreen';

function createSettingsRepository() {
  const save = vi.fn(
    (): Promise<Result<void>> => Promise.resolve({ ok: true, value: undefined }),
  );
  const repository: SettingsRepository = {
    load: () => Promise.resolve({ ok: true, value: { locale: 'it' } }),
    save,
  };
  return { repository, save };
}

function createUpdatePort() {
  const check = vi.fn(
    (): ReturnType<UpdatePort['check']> => Promise.resolve({ ok: true, value: 'current' }),
  );
  const port: UpdatePort = {
    check,
    activate: vi.fn((): Promise<Result<void>> => Promise.resolve({ ok: true, value: undefined })),
    defer: vi.fn(() => Promise.resolve()),
  };
  return { port, check };
}

describe('SettingsScreen', () => {
  it('starts in Italian and publishes English only after saving it', async () => {
    const { repository, save } = createSettingsRepository();
    const onLocaleChange = vi.fn();
    const session = createActiveSession({
      id: 'session-1',
      contentVersion: 1,
      random: { seed: 7, position: 0 },
      createdAt: 10,
    });
    const snapshot = structuredClone(session);

    render(
      <SettingsScreen
        translator={createTranslator('it')}
        locale="it"
        session={session}
        settingsRepository={repository}
        updatePort={createUpdatePort().port}
        online
        offlineReady
        onLocaleChange={onLocaleChange}
        onBack={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Impostazioni' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(save).toHaveBeenCalledWith({ locale: 'en' });
    await waitFor(() => {
      expect(onLocaleChange).toHaveBeenCalledWith('en');
    });
    expect(session).toEqual(snapshot);
  });

  it('shows checking immediately and prevents duplicate checks', async () => {
    let finishCheck: ((value: Awaited<ReturnType<UpdatePort['check']>>) => void) | undefined;
    const { port: updatePort } = createUpdatePort();
    const delayedCheck = vi.fn((): ReturnType<UpdatePort['check']> => new Promise((resolve) => {
      finishCheck = resolve;
    }));
    updatePort.check = delayedCheck;

    render(
      <SettingsScreen
        translator={createTranslator('it')}
        locale="it"
        session={null}
        settingsRepository={createSettingsRepository().repository}
        updatePort={updatePort}
        online
        offlineReady={false}
        onLocaleChange={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    const checkButton = screen.getByRole('button', { name: 'Controlla aggiornamenti' });
    await userEvent.click(checkButton);
    expect(screen.getByText('Controllo in corso')).toBeInTheDocument();
    expect(checkButton).toBeDisabled();
    expect(delayedCheck).toHaveBeenCalledOnce();

    finishCheck?.({ ok: true, value: 'current' });
    await screen.findByText('App aggiornata');
  });

  it('reports offline without calling the update port', async () => {
    const { port: updatePort, check } = createUpdatePort();
    render(
      <SettingsScreen
        translator={createTranslator('it')}
        locale="it"
        session={null}
        settingsRepository={createSettingsRepository().repository}
        updatePort={updatePort}
        online={false}
        offlineReady={false}
        onLocaleChange={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Controlla aggiornamenti' }));
    expect(screen.getByText('Sei offline')).toBeInTheDocument();
    expect(check).not.toHaveBeenCalled();
  });
});
