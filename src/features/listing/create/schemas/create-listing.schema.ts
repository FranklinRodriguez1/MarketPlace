import { z } from 'zod';
import { pricingSchema } from '@cerca/src'

export const createListingSchema = z.object({
    categoryId: z.string().min(1, 'Category is required'),
    title: z.string().trim().min(1, 'Title is required').max(80, 'Title must be at most 80 characters'),
    pricing: pricingSchema,
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    photos: z.array(z.string()).min(1, 'At least one photo is required'),
});

export type CreateListingForm = z.infer<typeof createListingSchema>;