import type { Pricing } from '@cerca/src';

export interface CreateListingInput {
  categoryId: string;
  title: string;
  pricing: Pricing;
  latitude?: number;
  longitude?: number;
  photos: string[];
}

export interface CreatedListing {
  id: string;
}

export interface ListingRepository {
  create(input: CreateListingInput): Promise<CreatedListing>;
}
