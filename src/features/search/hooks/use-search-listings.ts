import { useQuery } from '@tanstack/react-query';
import type { Coordinates, ListingSearchFilters } from '@cerca/src';

import { searchListings } from '@/infrastructure/composition';
import { listingSearchKey } from '@/infrastructure/query/query-keys';

export function useSearchListings(filters: ListingSearchFilters, near?: Coordinates, enabled = true) {
  return useQuery({
    queryKey: listingSearchKey(filters, near),
    queryFn: () => searchListings({ ...filters, near }),
    enabled,
  });
}
