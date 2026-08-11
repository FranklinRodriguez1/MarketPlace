import { createSearchListingsUseCase } from '@/application/use-cases/search-listings.use-case';

import { CITY_OPTIONS, MockListingSearchRepository } from './adapters/listing-search-repository.mock';
import { ExpoLocationProvider } from './adapters/location-provider.expo';

const listingSearchRepository = new MockListingSearchRepository();

export const searchListings = createSearchListingsUseCase(listingSearchRepository);
export const locationProvider = new ExpoLocationProvider();
export const cityOptions = CITY_OPTIONS;
