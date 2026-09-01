import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { LanguageSwitch } from './LanguageSwitch';

describe('LanguageSwitch', () => {
  it('announces and requests the other language', async () => {
    const onChange = vi.fn();
    render(<LanguageSwitch locale="it" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Passa all’inglese' }));

    expect(onChange).toHaveBeenCalledWith('en');
  });
});
