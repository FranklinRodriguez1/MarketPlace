import { z } from 'zod';
import { moneySchema } from '../money/money.schema';

export const pricingSchema = z.discriminatedUnion('model', [
    z.object({
        model: z.literal('fixed'),
        price: moneySchema,
    }),
    z.object({
        model: z.literal('hourly'),
        hourlyRate: moneySchema,
        minimumHours: z.number().int().positive(),
    }),
    z.object({
        model: z.literal('quote'),
        startingFrom: moneySchema.optional(),
    }),
]);

export type PricingSchema = z.infer<typeof pricingSchema>;