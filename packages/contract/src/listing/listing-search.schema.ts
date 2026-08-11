import { z } from 'zod';
import { coordinatesSchema } from '../geo/coordinates.schema';

export const listingSearchFiltersSchema = z.object({
    query: z.string().trim().max(80).optional(),
    categoryId: z.string().min(1).optional(),
    near: coordinatesSchema.optional(),
    priceMaxMinor: z.number().int().positive().optional(),
});

export type ListingSearchFiltersSchema = z.infer<typeof listingSearchFiltersSchema>;
