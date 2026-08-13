import { createSearchListingsUseCase } from '@/application/use-cases/search-listings.use-case';

import { CITY_OPTIONS, MockListingSearchRepository } from './adapters/listing-search-repository.mock';
import { ExpoLocationProvider } from './adapters/location-provider.expo';

// TEMPORAL: usamos el repositorio mock (datos de prueba en memoria) porque el
// backend todavía no está operativo. Revertir a HttpListingSearchRepository
// (ver ./adapters/listing-search-repository.http.ts) apenas haya API real.
const listingSearchRepository = new MockListingSearchRepository();

export const searchListings = createSearchListingsUseCase(listingSearchRepository);
export const locationProvider = new ExpoLocationProvider();
export const cityOptions = CITY_OPTIONS;
