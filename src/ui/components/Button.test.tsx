import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('provides a semantic 44px touch target and press feedback hook', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Continua</Button>);

    const button = screen.getByRole('button', { name: 'Continua' });
    expect(button).toHaveAttribute('data-touch-target', '44');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disables repeated actions while loading', () => {
    render(<Button loading>Salva</Button>);

    expect(screen.getByRole('button', { name: 'Salva' })).toBeDisabled();
  });
});
