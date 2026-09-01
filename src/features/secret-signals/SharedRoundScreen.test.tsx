import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import { createTranslator } from '../../content/translations/translator';
import { SharedRoundScreen } from './SharedRoundScreen';

it('selects the correct accuser without rendering private assignments', async () => {
  const onConfirmAccusation = vi.fn();
  render(
    <SharedRoundScreen
      translator={createTranslator('it')}
      players={[{ id: 'p1', name: 'Ada' }, { id: 'p2', name: 'Luca' }]}
      onConfirmAccusation={onConfirmAccusation}
    />,
  );

  expect(screen.getByRole('heading', { name: 'I segreti sono nascosti' })).toBeInTheDocument();
  expect(screen.queryByText(/Tocca l’orecchio|Tocca il naso/)).not.toBeInTheDocument();
  const confirm = screen.getByRole('button', { name: 'Conferma accusa' });
  expect(confirm).toBeDisabled();
  await userEvent.click(screen.getByRole('radio', { name: 'Ada' }));
  await userEvent.click(confirm);
  expect(onConfirmAccusation).toHaveBeenCalledWith('p1');
});
