import type { Coordinates } from '../geo/coordinates';
import type { ListingType } from './listing-status';
import type { Pricing } from '../pricing/pricing';

export interface Listing {
    readonly id: string;
    readonly categoryId: string;
    readonly title: string;
    readonly providerName: string;
    readonly pricing: Pricing;
    readonly location: Coordinates;
    readonly photos: string[];
    readonly status: ListingType;
    readonly ratingAverage?: number;
    readonly ratingCount?: number;
}
