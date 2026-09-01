import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import { createTranslator } from '../../content/translations/translator';
import { ResultConfirmationScreen } from './ResultConfirmationScreen';

it('shows an unscored result, allows correction, then requests confirmation', async () => {
  const onCorrect = vi.fn();
  const onConfirm = vi.fn();
  render(
    <ResultConfirmationScreen
      translator={createTranslator('it')}
      players={[{ id: 'p1', name: 'Ada' }, { id: 'p2', name: 'Luca' }]}
      winnerId="p1"
      scores={{ p1: 0, p2: 0 }}
      onCorrect={onCorrect}
      onConfirm={onConfirm}
    />,
  );

  expect(screen.getByRole('heading', { name: 'Ada' })).toBeInTheDocument();
  expect(screen.getByText('0 punti')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Correggi risultato' }));
  await userEvent.click(screen.getByRole('radio', { name: 'Luca' }));
  await userEvent.click(screen.getByRole('button', { name: 'Salva correzione' }));
  expect(onCorrect).toHaveBeenCalledWith('p2');

  await userEvent.click(screen.getByRole('button', { name: 'Conferma risultato' }));
  expect(onConfirm).toHaveBeenCalledOnce();
});
