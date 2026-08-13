import { z } from 'zod';
import { pricingSchema } from '@cerca/src';

// Espeja las reglas de UpdateListingDto en el backend: solo title,
// description y pricing son editables (categoryId/location no se aceptan).
export const editListingSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120, 'Title must be at most 120 characters'),
  description: z.string().min(1, 'Description is required').max(4000, 'Description must be at most 4000 characters'),
  pricing: pricingSchema,
});

export type EditListingForm = z.infer<typeof editListingSchema>;
