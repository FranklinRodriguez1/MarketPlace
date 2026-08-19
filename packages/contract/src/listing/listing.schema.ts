import { z } from 'zod';
import { coordinatesSchema } from '../geo/coordinates.schema';
import { listingStatusSchema } from './listing-status.schema';
import { pricingSchema } from '../pricing/pricing.schema';

export const listingSchema = z.object({
    id: z.string().min(1),
    categoryId: z.string().min(1),
    title: z.string().trim().min(1).max(80),
    providerName: z.string().min(1),
    pricing: pricingSchema,
    location: coordinatesSchema,
    photos: z.array(z.string()).min(1),
    status: listingStatusSchema,
    ratingAverage: z.number().min(0).max(5).optional(),
    ratingCount: z.number().int().nonnegative().optional(),
});

export type ListingSchema = z.infer<typeof listingSchema>;
