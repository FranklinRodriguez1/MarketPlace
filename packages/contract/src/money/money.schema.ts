import { z } from 'zod';

export const moneySchema = z.object({
    amountMinor: z.number().int().nonnegative(),
    currency: z.enum(['COP', 'USD', 'EUR']),
});

export type MoneySchema = z.infer<typeof moneySchema>;