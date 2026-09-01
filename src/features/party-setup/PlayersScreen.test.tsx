import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { createTranslator } from '../../content/translations/translator';
import { PlayersScreen } from './PlayersScreen';

describe('PlayersScreen', () => {
  it('requires two unique non-empty names with associated errors', async () => {
    const onSubmit = vi.fn();
    render(
      <PlayersScreen
        translator={createTranslator('it')}
        players={[]}
        onSubmit={onSubmit}
        onBack={vi.fn()}
      />,
    );

    const inputs = screen.getAllByRole('textbox', { name: /Nome giocatore/i });
    const [firstInput, secondInput] = inputs;
    if (firstInput === undefined || secondInput === undefined) {
      throw new Error('Expected two player inputs');
    }
    const continueButton = screen.getByRole('button', { name: 'Continua' });
    expect(inputs).toHaveLength(2);
    expect(firstInput).toHaveAttribute('aria-describedby');
    expect(continueButton).toBeDisabled();

    await userEvent.type(firstInput, 'Ada');
    await userEvent.type(secondInput, 'Ada');
    expect(screen.getByText('Usa nomi diversi e non vuoti.')).toBeInTheDocument();
    expect(continueButton).toBeDisabled();

    await userEvent.clear(secondInput);
    await userEvent.type(secondInput, 'Luca');
    expect(continueButton).toBeEnabled();
    await userEvent.click(continueButton);
    expect(onSubmit).toHaveBeenCalledWith([
      { id: 'player-1', name: 'Ada' },
      { id: 'player-2', name: 'Luca' },
    ]);
  });

  it('adds and removes players only within the 2-6 range', async () => {
    render(
      <PlayersScreen
        translator={createTranslator('it')}
        players={[]}
        onSubmit={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    const add = screen.getByRole('button', { name: 'Aggiungi giocatore' });
    for (let index = 0; index < 4; index += 1) await userEvent.click(add);
    expect(screen.getAllByRole('textbox')).toHaveLength(6);
    expect(add).toBeDisabled();

    const removeButtons = screen.getAllByRole('button', { name: 'Rimuovi giocatore' });
    const lastRemove = removeButtons.at(-1);
    if (lastRemove === undefined) throw new Error('Expected a remove button');
    await userEvent.click(lastRemove);
    expect(screen.getAllByRole('textbox')).toHaveLength(5);
  });
});
