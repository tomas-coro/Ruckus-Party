import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import { createTranslator } from '../../content/translations/translator';
import { createDefaultSetup } from '../../domain/selection/partySetup';
import { PreferencesScreen } from './PreferencesScreen';

it('starts with Standard and Phone only, then submits explicit preferences', async () => {
  const onSubmit = vi.fn();
  render(
    <PreferencesScreen
      translator={createTranslator('en')}
      setup={createDefaultSetup()}
      onSubmit={onSubmit}
      onBack={vi.fn()}
    />,
  );

  expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Phone only' })).toBeChecked();
  await userEvent.click(screen.getByRole('radio', { name: 'Short' }));
  await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

  expect(onSubmit).toHaveBeenCalledWith({
    duration: 'short',
    resources: ['phone'],
    contentCategories: ['general'],
  });
});
