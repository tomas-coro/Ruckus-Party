import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import { ConfirmationModal } from './ConfirmationModal';

it('traps the destructive confirmation and restores focus to its trigger', async () => {
  const onCancel = vi.fn();
  const trigger = document.createElement('button');
  trigger.textContent = 'Reset';
  document.body.append(trigger);
  trigger.focus();

  const { unmount } = render(
    <ConfirmationModal
      title="Cancellare i dati locali?"
      body="La sessione e le impostazioni su questo dispositivo verranno eliminate."
      confirmLabel="Conferma reset"
      cancelLabel="Annulla"
      onConfirm={vi.fn()}
      onCancel={onCancel}
    />,
  );

  expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
  expect(document.body).toHaveStyle({ overflow: 'hidden' });
  await userEvent.click(screen.getByRole('button', { name: 'Annulla' }));
  expect(onCancel).toHaveBeenCalledOnce();
  unmount();
  expect(trigger).toHaveFocus();
  trigger.remove();
});
