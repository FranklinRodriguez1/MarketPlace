import { describe, expect, it } from 'vitest';
import { formatMoney } from './format-money';

describe('formatMoney', () => {
  it('formats COP amounts for an es-CO locale', () => {
    const formatted = formatMoney({ amountMinor: 5000000, currency: 'COP' }, 'es-CO');

    expect(formatted.replace(/ /g, ' ')).toContain('50.000');
  });

  it('formats USD amounts for an en-US locale', () => {
    const formatted = formatMoney({ amountMinor: 1999, currency: 'USD' }, 'en-US');

    expect(formatted).toBe('$19.99');
  });
});
