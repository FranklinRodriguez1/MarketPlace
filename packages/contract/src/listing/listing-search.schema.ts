import { z } from 'zod';
import { coordinatesSchema } from '../geo/coordinates.schema';
import { listingSchema } from './listing.schema';

export const listingSearchFiltersSchema = z.object({
    query: z.string().trim().max(80).optional(),
    categoryId: z.string().min(1).optional(),
    near: coordinatesSchema.optional(),
    priceMaxMinor: z.number().int().positive().optional(),
    minRating: z.number().min(0).max(5).optional(),
});

export type ListingSearchFiltersSchema = z.infer<typeof listingSearchFiltersSchema>;

export const listingSearchResultSchema = z.object({
    items: z.array(listingSchema),
    nextCursor: z.string().optional(),
});

export type ListingSearchResultSchema = z.infer<typeof listingSearchResultSchema>;
