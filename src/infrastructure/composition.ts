import { createSearchListingsUseCase } from '@/application/use-cases/search-listings.use-case';

import { CITY_OPTIONS } from './adapters/listing-search-repository.mock';
import { HttpListingSearchRepository } from './adapters/listing-search-repository.http';
import { ExpoLocationProvider } from './adapters/location-provider.expo';

const listingSearchRepository = new HttpListingSearchRepository();

export const searchListings = createSearchListingsUseCase(listingSearchRepository);
export const locationProvider = new ExpoLocationProvider();
export const cityOptions = CITY_OPTIONS;
