import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './Modal';

describe('Modal', () => {
  it('moves focus inside, locks the page, closes on Escape and restores focus', async () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <>
        <button type="button">Apri</button>
        <Modal open={false} title="Conferma" onClose={onClose}>
          <button type="button">Annulla</button>
        </Modal>
      </>,
    );
    const opener = screen.getByRole('button', { name: 'Apri' });
    opener.focus();

    rerender(
      <>
        <button type="button">Apri</button>
        <Modal open title="Conferma" onClose={onClose}>
          <button type="button">Annulla</button>
        </Modal>
      </>,
    );

    expect(screen.getByRole('dialog')).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();

    rerender(
      <>
        <button type="button">Apri</button>
        <Modal open={false} title="Conferma" onClose={onClose}>
          <button type="button">Annulla</button>
        </Modal>
      </>,
    );
    expect(document.body.style.overflow).toBe('');
    expect(opener).toHaveFocus();
  });
});
