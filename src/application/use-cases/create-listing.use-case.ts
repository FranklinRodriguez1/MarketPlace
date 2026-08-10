import { z } from 'zod';
import { pricingSchema } from '@cerca/src';

import type { CreatedListing, CreateListingInput, ListingRepository } from '../ports/listing-repository';

const createListingInputSchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().trim().min(1).max(80),
  pricing: pricingSchema,
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  photos: z.array(z.string()).min(1),
});

export function createCreateListingUseCase(repository: ListingRepository) {
  return async function createListing(input: CreateListingInput): Promise<CreatedListing> {
    const validInput = createListingInputSchema.parse(input);
    return repository.create(validInput);
  };
}
