import { listingSearchFiltersSchema } from '@cerca/src';
import type { ListingSearchFilters, ListingSearchResult } from '@cerca/src';

import type { ListingSearchRepository } from '../ports/listing-search-repository';

export function createSearchListingsUseCase(repository: ListingSearchRepository) {
  return async function searchListings(
    filters: ListingSearchFilters,
    cursor?: string
  ): Promise<ListingSearchResult> {
    const validFilters = listingSearchFiltersSchema.parse(filters);
    return repository.search(validFilters, cursor);
  };
}
