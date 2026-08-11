import type { ListingSearchFilters, ListingSearchResult } from '@cerca/src';

export interface ListingSearchRepository {
    search(filters: ListingSearchFilters, cursor?: string): Promise<ListingSearchResult>;
}
