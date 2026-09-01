import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

import { AppErrorBoundary } from './AppErrorBoundary';

function BrokenScreen(): never {
  throw new Error('Player Ada private value');
}

it('replaces an unexpected render failure and reports only the fixed diagnostic code', () => {
  const onUnexpected = vi.fn();
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  render(
    <AppErrorBoundary
      fallback={<section role="alert">Recovery</section>}
      onUnexpected={onUnexpected}
    >
      <BrokenScreen />
    </AppErrorBoundary>,
  );

  expect(screen.getByRole('alert')).toHaveTextContent('Recovery');
  expect(onUnexpected).toHaveBeenCalledWith('UNEXPECTED_UI_ERROR');
  expect(JSON.stringify(onUnexpected.mock.calls)).not.toContain('Ada');
  consoleError.mockRestore();
});
