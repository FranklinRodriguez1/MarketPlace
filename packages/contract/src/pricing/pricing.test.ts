import { describe, expect, it } from 'vitest';
import { pricingSchema } from './pricing.schema';

describe('pricingSchema', () => {
  it('accepts fixed pricing', () => {
    const result = pricingSchema.safeParse({
      model: 'fixed',
      price: {
        amountMinor: 50000,
        currency: 'COP',
      },
    });

    expect(result.success).toBe(true);
  });

  it('accepts hourly pricing', () => {
    const result = pricingSchema.safeParse({
      model: 'hourly',
      hourlyRate: {
        amountMinor: 25000,
        currency: 'COP',
      },
      minimumHours: 2,
    });

    expect(result.success).toBe(true);
  });

  it('accepts quote pricing', () => {
    const result = pricingSchema.safeParse({
      model: 'quote',
    });

    expect(result.success).toBe(true);
  });

  it('rejects hourly pricing without minimumHours', () => {
    const result = pricingSchema.safeParse({
      model: 'hourly',
      hourlyRate: {
        amountMinor: 25000,
        currency: 'COP',
      },
    });

    expect(result.success).toBe(false);
  });
});