import { z } from 'zod';
import { pricingSchema } from '@cerca/src'

// Los mensajes son claves de i18n (ver createListing.errors en en.json/es.json),
// traducidas donde se muestra fieldState.error.message con translateFieldError().
export const createListingSchema = z.object({
    categoryId: z.string().min(1, 'createListing.errors.categoryRequired'),
    title: z.string().trim().min(1, 'createListing.errors.titleRequired').max(80, 'createListing.errors.titleTooLong'),
     description: z
    .string()
    .min(20, 'createListing.errors.descriptionTooShort'),
    pricing: pricingSchema,
    latitude: z.number({ message: 'createListing.errors.confirmLocation' }),
    longitude: z.number({ message: 'createListing.errors.confirmLocation' }),
    photos: z.array(z.string()).min(1, 'createListing.errors.photosRequired'),
});

export type CreateListingForm = z.infer<typeof createListingSchema>;