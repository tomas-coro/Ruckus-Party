import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { createTranslator } from '../../content/translations/translator';
import { UpdatePrompt } from './UpdatePrompt';

describe('UpdatePrompt', () => {
  it('offers install and restart when no Party Night is active', async () => {
    const onActivate = vi.fn();
    render(
      <UpdatePrompt
        translator={createTranslator('it')}
        status="ready"
        hasActiveSession={false}
        onCheck={vi.fn()}
        onActivate={onActivate}
        onDefer={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Installa e riavvia' }));
    expect(onActivate).toHaveBeenCalledOnce();
  });

  it('defers a ready update while a Party Night is active', async () => {
    const onDefer = vi.fn();
    render(
      <UpdatePrompt
        translator={createTranslator('it')}
        status="ready"
        hasActiveSession
        onCheck={vi.fn()}
        onActivate={vi.fn()}
        onDefer={onDefer}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Installa e riavvia' })).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: 'Installa dopo la Party Night' }),
    );
    expect(onDefer).toHaveBeenCalledOnce();
  });

  it('shows one retry action after an update error', async () => {
    const onCheck = vi.fn();
    render(
      <UpdatePrompt
        translator={createTranslator('it')}
        status="error"
        hasActiveSession={false}
        onCheck={onCheck}
        onActivate={vi.fn()}
        onDefer={vi.fn()}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Controllo aggiornamenti non riuscito');
    expect(screen.getAllByRole('button')).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: 'Riprova' }));
    expect(onCheck).toHaveBeenCalledOnce();
  });
});
