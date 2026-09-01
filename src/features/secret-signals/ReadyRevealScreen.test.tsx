import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { createTranslator } from '../../content/translations/translator';
import { ReadyRevealScreen } from './ReadyRevealScreen';

const secret = 'Tocca l’orecchio sinistro';

function renderReady(onMemorized = vi.fn()) {
  return {
    onMemorized,
    ...render(
      <ReadyRevealScreen
        translator={createTranslator('it')}
        playerId="p1"
        playerName="Ada"
        secret={secret}
        onMemorized={onMemorized}
      />,
    ),
  };
}

describe('ReadyRevealScreen', () => {
  it('reveals only while held and requires one successful reveal before continuing', async () => {
    const { onMemorized } = renderReady();
    const hold = screen.getByRole('button', { name: 'Tieni premuto per mostrare il segreto' });
    const memorized = screen.getByRole('button', { name: 'Ho memorizzato' });

    expect(screen.queryByText(secret)).not.toBeInTheDocument();
    expect(memorized).toBeDisabled();
    fireEvent.pointerDown(hold);
    expect(screen.getByText(secret)).toBeInTheDocument();
    fireEvent.pointerUp(hold);
    expect(screen.queryByText(secret)).not.toBeInTheDocument();
    expect(memorized).toBeEnabled();

    await userEvent.click(memorized);
    expect(screen.queryByText(secret)).not.toBeInTheDocument();
    expect(onMemorized).toHaveBeenCalledOnce();
  });

  it.each([
    ['pointer cancel', () => fireEvent.pointerCancel(screen.getByTestId('hold-reveal'))],
    ['window blur', () => fireEvent.blur(window)],
  ])('hides the secret on %s', (_name, hide) => {
    renderReady();
    fireEvent.pointerDown(screen.getByTestId('hold-reveal'));
    expect(screen.getByText(secret)).toBeInTheDocument();
    hide();
    expect(screen.queryByText(secret)).not.toBeInTheDocument();
  });

  it('hides on document visibility loss and player phase change', () => {
    const { rerender } = renderReady();
    const visibilityState = vi.spyOn(document, 'visibilityState', 'get');
    fireEvent.pointerDown(screen.getByTestId('hold-reveal'));
    visibilityState.mockReturnValue('hidden');
    fireEvent(document, new Event('visibilitychange'));
    expect(screen.queryByText(secret)).not.toBeInTheDocument();

    visibilityState.mockReturnValue('visible');
    fireEvent.pointerDown(screen.getByTestId('hold-reveal'));
    rerender(
      <ReadyRevealScreen
        translator={createTranslator('it')}
        playerId="p2"
        playerName="Luca"
        secret="Tocca il naso"
        onMemorized={vi.fn()}
      />,
    );
    expect(screen.queryByText(secret)).not.toBeInTheDocument();
    visibilityState.mockRestore();
  });

  it('supports a two-tap accessible reveal alternative', async () => {
    renderReady();
    const toggle = screen.getByRole('button', { name: 'Tocca per mostrare o nascondere il segreto' });
    await userEvent.click(toggle);
    expect(screen.getByText(secret)).toBeInTheDocument();
    await userEvent.click(toggle);
    expect(screen.queryByText(secret)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ho memorizzato' })).toBeEnabled();
  });
});
