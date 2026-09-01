import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import { createTranslator } from '../../content/translations/translator';
import { CoveredRevealScreen } from './CoveredRevealScreen';

it('names the expected player without placing the secret in the DOM', async () => {
  const onConfirmPlayer = vi.fn();
  const onWrongPlayer = vi.fn();
  render(
    <CoveredRevealScreen
      translator={createTranslator('it')}
      playerName="Ada"
      onConfirmPlayer={onConfirmPlayer}
      onWrongPlayer={onWrongPlayer}
    />,
  );

  expect(screen.queryByText('Tocca l’orecchio sinistro')).not.toBeInTheDocument();
  expect(screen.getAllByText(/Ada/).length).toBeGreaterThan(0);
  await userEvent.click(screen.getByRole('button', { name: 'Il telefono è alla persona sbagliata' }));
  expect(onWrongPlayer).toHaveBeenCalledOnce();
  expect(onConfirmPlayer).not.toHaveBeenCalled();

  await userEvent.click(screen.getByRole('button', { name: 'Sono Ada' }));
  expect(onConfirmPlayer).toHaveBeenCalledOnce();
});
