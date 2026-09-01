import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';

import { OfflineStatus } from './OfflineStatus';

it('announces whether the app is ready offline without relying on color', () => {
  const { rerender } = render(<OfflineStatus ready readyLabel="Pronta offline" unavailableLabel="Non pronta" />);
  expect(screen.getByRole('status')).toHaveTextContent('Pronta offline');

  rerender(<OfflineStatus ready={false} readyLabel="Pronta offline" unavailableLabel="Non pronta" />);
  expect(screen.getByRole('status')).toHaveTextContent('Non pronta');
});
