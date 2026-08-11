import { snapToGrid } from '@cerca/src';
import type { Coordinates, ListingSearchFilters } from '@cerca/src';

export function listingSearchKey(filters: ListingSearchFilters, near?: Coordinates) {
  const snapped = near ? snapToGrid(near) : undefined;

  return [
    'listings',
    'search',
    filters.query ?? null,
    filters.categoryId ?? null,
    filters.priceMaxMinor ?? null,
    snapped ? `${snapped.latitude},${snapped.longitude}` : 'no-location',
  ] as const;
}
