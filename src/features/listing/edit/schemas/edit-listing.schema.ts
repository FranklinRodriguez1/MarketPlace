import { z } from 'zod';
import { pricingSchema } from '@cerca/src';

// Espeja las reglas de UpdateListingDto en el backend: solo title,
// description y pricing son editables (categoryId/location no se aceptan).
// Los mensajes son claves de i18n (ver editListing.errors en en.json/es.json),
// traducidas donde se muestra fieldState.error.message con translateFieldError().
export const editListingSchema = z.object({
  title: z.string().trim().min(3, 'editListing.errors.titleTooShort').max(120, 'editListing.errors.titleTooLong'),
  description: z.string().min(1, 'editListing.errors.descriptionRequired').max(4000, 'editListing.errors.descriptionTooLong'),
  pricing: pricingSchema,
});

export type EditListingForm = z.infer<typeof editListingSchema>;
