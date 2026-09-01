import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import { createTranslator } from '../../content/translations/translator';
import { RecoveryScreen } from './RecoveryScreen';

it('never resets on retry and resets only after explicit confirmation', async () => {
  const onRetry = vi.fn();
  const onExportDiagnostics = vi.fn(() => Promise.resolve());
  const resetAllData = vi.fn(() => Promise.resolve({ ok: true, value: undefined } as const));
  render(
    <RecoveryScreen
      translator={createTranslator('it')}
      error={{ type: 'storage-unavailable', code: 'IDB_BLOCKED', safeState: 'preserved' }}
      onRetry={onRetry}
      onExportDiagnostics={onExportDiagnostics}
      onResetAllData={resetAllData}
    />,
  );

  await userEvent.click(screen.getByRole('button', { name: 'Riprova' }));
  expect(onRetry).toHaveBeenCalledOnce();
  expect(resetAllData).not.toHaveBeenCalled();

  await userEvent.click(screen.getByRole('button', { name: 'Esporta diagnostica' }));
  expect(onExportDiagnostics).toHaveBeenCalledOnce();
  expect(resetAllData).not.toHaveBeenCalled();

  await userEvent.click(screen.getByRole('button', { name: 'Reimposta dati' }));
  expect(screen.getByRole('dialog')).toHaveTextContent(
    'La sessione e le impostazioni su questo dispositivo verranno eliminate.',
  );
  expect(resetAllData).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Reimposta dati definitivamente' }));
  expect(resetAllData).toHaveBeenCalledOnce();
});
