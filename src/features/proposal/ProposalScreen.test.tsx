import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { secretSignalsDefinition } from '../../content/games/secretSignalsDefinition';
import { createTranslator } from '../../content/translations/translator';
import { GameRegistry } from '../../domain/game/gameRegistry';
import { ProposalScreen } from './ProposalScreen';

const registry = new GameRegistry([secretSignalsDefinition]);

describe('ProposalScreen', () => {
  it('derives and starts the compatible localized proposal', async () => {
    const onStart = vi.fn();
    render(
      <ProposalScreen
        translator={createTranslator('it')}
        registry={registry}
        playerCount={2}
        setup={{ duration: 'standard', resources: ['phone'], contentCategories: ['general'] }}
        onStart={onStart}
        onModifySetup={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Segnali segreti' })).toBeInTheDocument();
    expect(screen.getByText('2-6 giocatori')).toBeInTheDocument();
    expect(screen.getByText('Solo telefono')).toBeInTheDocument();
    expect(screen.getByText('Virtual')).toBeInTheDocument();
    expect(screen.getByText('Funziona con i giocatori e le risorse selezionate.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Indietro' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Inizia gioco' }));
    expect(onStart).toHaveBeenCalledWith('secret-signals');
  });

  it('names the blocking resource and offers one recovery action', async () => {
    const onModifySetup = vi.fn();
    render(
      <ProposalScreen
        translator={createTranslator('it')}
        registry={registry}
        playerCount={2}
        setup={{ duration: 'standard', resources: [], contentCategories: ['general'] }}
        onStart={vi.fn()}
        onModifySetup={onModifySetup}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Nessun gioco compatibile' })).toBeInTheDocument();
    expect(screen.getByText(/Solo telefono/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Inizia gioco' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Modifica setup' }));
    expect(onModifySetup).toHaveBeenCalledOnce();
  });
});
