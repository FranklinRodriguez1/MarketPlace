import type { Coordinates } from '../geo/coordinates';
import type { Listing } from './listing';

export interface ListingSearchFilters {
    readonly query?: string;
    readonly categoryId?: string;
    readonly near?: Coordinates;
    readonly priceMaxMinor?: number;
}

export interface ListingSearchResult {
    readonly items: Listing[];
    readonly nextCursor?: string;
}
