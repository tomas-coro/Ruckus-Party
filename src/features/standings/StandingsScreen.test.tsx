import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';

import { createTranslator } from '../../content/translations/translator';
import { StandingsScreen } from './StandingsScreen';

it('shows the confirmed point and no excluded continuation', () => {
  render(
    <StandingsScreen
      translator={createTranslator('it')}
      players={[{ id: 'p1', name: 'Ada' }, { id: 'p2', name: 'Luca' }]}
      standings={[{ playerId: 'p1', score: 1, rank: 1 }, { playerId: 'p2', score: 0, rank: 2 }]}
    />,
  );

  expect(screen.getByText('Ada')).toBeInTheDocument();
  expect(screen.getByText('1 punto')).toBeInTheDocument();
  expect(screen.getByText('0 punti')).toBeInTheDocument();
  expect(screen.queryByText(/Prossimo gioco|Finale|Torneo/)).not.toBeInTheDocument();
});
