import type { Coordinates } from '@cerca/src';

import { createSearchListingsUseCase } from '@/application/use-cases/search-listings.use-case';

import { HttpListingSearchRepository } from './adapters/listing-search-repository.http';
import { ExpoLocationProvider } from './adapters/location-provider.expo';

const listingSearchRepository = new HttpListingSearchRepository();

export const searchListings = createSearchListingsUseCase(listingSearchRepository);
export const locationProvider = new ExpoLocationProvider();

// Ciudades donde el selector manual de ubicación ofrece coordenadas fijas
// (fallback cuando el usuario no comparte GPS). No son datos de negocio del
// backend, son cobertura de producto — se amplía a mano si se lanza en otra ciudad.
const BOGOTA: Coordinates = { latitude: 4.7109, longitude: -74.0721 };
const MEDELLIN: Coordinates = { latitude: 6.2442, longitude: -75.5812 };

export const cityOptions: { id: string; label: string; coordinates: Coordinates }[] = [
  { id: 'bogota', label: 'Bogotá', coordinates: BOGOTA },
  { id: 'medellin', label: 'Medellín', coordinates: MEDELLIN },
];
