import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { createTranslator } from '../../content/translations/translator';
import { HomeScreen } from './HomeScreen';

describe('HomeScreen', () => {
  it('shows one dominant Party Night action and no excluded modes', () => {
    render(
      <HomeScreen
        translator={createTranslator('it')}
        locale="it"
        hasActiveSession={false}
        offlineReady
        localeError={false}
        onStart={vi.fn()}
        onResume={vi.fn()}
        onLocaleChange={vi.fn()}
        onSettings={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Ruckus Party' })).toBeInTheDocument();
    expect(screen.getAllByTestId('dominant-action')).toHaveLength(1);
    expect(screen.getByRole('button', { name: /Inizia serata/i })).toBeInTheDocument();
    expect(
      screen.getByText('Un gioco completo, dall’inizio alla classifica.'),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Quick Play|Catalogo|Torneo/i)).not.toBeInTheDocument();
    expect(screen.getByText('Disponibile anche offline')).toBeInTheDocument();
  });

  it('requests language, settings and resume actions', async () => {
    const onLocaleChange = vi.fn();
    const onSettings = vi.fn();
    const onResume = vi.fn();
    render(
      <HomeScreen
        translator={createTranslator('it')}
        locale="it"
        hasActiveSession
        offlineReady={false}
        localeError={false}
        onStart={vi.fn()}
        onResume={onResume}
        onLocaleChange={onLocaleChange}
        onSettings={onSettings}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Riprendi serata' }));
    await userEvent.click(screen.getByRole('button', { name: 'Passa all’inglese' }));
    await userEvent.click(screen.getByRole('button', { name: 'Impostazioni' }));

    expect(onResume).toHaveBeenCalledOnce();
    expect(onLocaleChange).toHaveBeenCalledWith('en');
    expect(onSettings).toHaveBeenCalledOnce();
  });

  it('makes the complete logo immediately visible with reduced motion', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    render(
      <HomeScreen
        translator={createTranslator('it')}
        locale="it"
        hasActiveSession={false}
        offlineReady
        localeError={false}
        onStart={vi.fn()}
        onResume={vi.fn()}
        onLocaleChange={vi.fn()}
        onSettings={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Ruckus Party' })).toBeInTheDocument();
    expect(screen.getByText('Ruckus')).toBeInTheDocument();
    expect(screen.getByText('Party')).toBeInTheDocument();
  });
});
