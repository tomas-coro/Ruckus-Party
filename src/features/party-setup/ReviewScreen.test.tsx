import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import { createTranslator } from '../../content/translations/translator';
import { ReviewScreen } from './ReviewScreen';

it('shows the complete setup and confirms it', async () => {
  const onConfirm = vi.fn();
  render(
    <ReviewScreen
      translator={createTranslator('it')}
      players={[{ id: 'p1', name: 'Ada' }, { id: 'p2', name: 'Luca' }]}
      setup={{ duration: 'standard', resources: ['phone'], contentCategories: ['general'] }}
      onConfirm={onConfirm}
      onBack={vi.fn()}
    />,
  );

  expect(screen.getByText('Ada')).toBeInTheDocument();
  expect(screen.getByText('Luca')).toBeInTheDocument();
  expect(screen.getByText('Standard')).toBeInTheDocument();
  expect(screen.getByText('Solo telefono')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Conferma setup' }));
  expect(onConfirm).toHaveBeenCalledOnce();
});
