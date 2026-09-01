import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import { createTranslator } from '../../content/translations/translator';
import { ErrorPanel } from './ErrorPanel';

it('names the failed operation, preserved state and one primary recovery action', async () => {
  const onRetry = vi.fn();
  render(
    <ErrorPanel
      translator={createTranslator('it')}
      error={{ type: 'migration-failed', code: 'UPGRADE_FAILED', safeState: 'preserved' }}
      onRetry={onRetry}
    />,
  );

  expect(screen.getByRole('alert')).toHaveTextContent('Aggiornamento dei dati non riuscito.');
  expect(screen.getByRole('alert')).toHaveTextContent('Lo stato precedente è al sicuro.');
  expect(screen.getByText('UPGRADE_FAILED')).toBeInTheDocument();
  expect(screen.getAllByRole('button')).toHaveLength(1);
  await userEvent.click(screen.getByRole('button', { name: 'Riprova' }));
  expect(onRetry).toHaveBeenCalledOnce();
});
