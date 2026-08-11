import type { Coordinates, Listing, ListingSearchFilters, ListingSearchResult } from '@cerca/src';

import type { ListingSearchRepository } from '@/application/ports/listing-search-repository';

const BOGOTA: Coordinates = { latitude: 4.7109, longitude: -74.0721 };
const MEDELLIN: Coordinates = { latitude: 6.2442, longitude: -75.5812 };

const SEED_LISTINGS: Listing[] = [
  {
    id: 'listing-1',
    categoryId: 'plumbing',
    title: 'Reparación de tuberías a domicilio',
    providerName: 'Carlos Ramírez',
    pricing: { model: 'fixed', price: { amountMinor: 8000000, currency: 'COP' } },
    location: { latitude: 4.6982, longitude: -74.0801 },
    photos: ['https://picsum.photos/seed/listing-1/400'],
    status: { kind: 'published', publishedAt: '2026-06-01T00:00:00.000Z' },
    ratingAverage: 4.8,
    ratingCount: 132,
  },
  {
    id: 'listing-2',
    categoryId: 'electrician',
    title: 'Instalaciones eléctricas residenciales',
    providerName: 'Luz Eléctrica SAS',
    pricing: { model: 'hourly', hourlyRate: { amountMinor: 4500000, currency: 'COP' }, minimumHours: 2 },
    location: { latitude: 4.7231, longitude: -74.0654 },
    photos: ['https://picsum.photos/seed/listing-2/400'],
    status: { kind: 'published', publishedAt: '2026-05-20T00:00:00.000Z' },
    ratingAverage: 4.6,
    ratingCount: 58,
  },
  {
    id: 'listing-3',
    categoryId: 'cleaning',
    title: 'Limpieza profunda de apartamentos',
    providerName: 'Hogar Impecable',
    pricing: { model: 'fixed', price: { amountMinor: 12000000, currency: 'COP' } },
    location: { latitude: 4.6588, longitude: -74.0937 },
    photos: ['https://picsum.photos/seed/listing-3/400'],
    status: { kind: 'published', publishedAt: '2026-04-11T00:00:00.000Z' },
    ratingAverage: 4.9,
    ratingCount: 210,
  },
  {
    id: 'listing-4',
    categoryId: 'painting',
    title: 'Pintura interior y exterior',
    providerName: 'Colores del Sur',
    pricing: { model: 'quote' },
    location: { latitude: 4.7541, longitude: -74.0479 },
    photos: ['https://picsum.photos/seed/listing-4/400'],
    status: { kind: 'published', publishedAt: '2026-03-02T00:00:00.000Z' },
    ratingAverage: 4.3,
    ratingCount: 24,
  },
  {
    id: 'listing-5',
    categoryId: 'plumbing',
    title: 'Destape de desagües 24/7',
    providerName: 'Plomería Express',
    pricing: { model: 'fixed', price: { amountMinor: 6500000, currency: 'COP' } },
    location: { latitude: 4.6316, longitude: -74.0837 },
    photos: ['https://picsum.photos/seed/listing-5/400'],
    status: { kind: 'published', publishedAt: '2026-06-15T00:00:00.000Z' },
    ratingAverage: 4.5,
    ratingCount: 87,
  },
  {
    id: 'listing-6',
    categoryId: 'electrician',
    title: 'Mantenimiento de tableros eléctricos',
    providerName: 'Voltia Servicios',
    pricing: { model: 'hourly', hourlyRate: { amountMinor: 5200000, currency: 'COP' }, minimumHours: 1 },
    location: { latitude: 6.2308, longitude: -75.5906 },
    photos: ['https://picsum.photos/seed/listing-6/400'],
    status: { kind: 'published', publishedAt: '2026-05-01T00:00:00.000Z' },
    ratingAverage: 4.7,
    ratingCount: 41,
  },
  {
    id: 'listing-7',
    categoryId: 'cleaning',
    title: 'Limpieza de oficinas',
    providerName: 'CleanCo Medellín',
    pricing: { model: 'fixed', price: { amountMinor: 9500000, currency: 'COP' } },
    location: { latitude: 6.2077, longitude: -75.5657 },
    photos: ['https://picsum.photos/seed/listing-7/400'],
    status: { kind: 'published', publishedAt: '2026-02-18T00:00:00.000Z' },
    ratingAverage: 4.4,
    ratingCount: 19,
  },
  {
    id: 'listing-8',
    categoryId: 'gardening',
    title: 'Diseño y mantenimiento de jardines',
    providerName: 'Verde Vivo',
    pricing: { model: 'hourly', hourlyRate: { amountMinor: 3800000, currency: 'COP' }, minimumHours: 3 },
    location: { latitude: 6.2617, longitude: -75.5731 },
    photos: ['https://picsum.photos/seed/listing-8/400'],
    status: { kind: 'published', publishedAt: '2026-01-25T00:00:00.000Z' },
    ratingAverage: 4.9,
    ratingCount: 76,
  },
];

const SEARCH_RADIUS_KM = 15;
const SIMULATED_DELAY_MS = 700;

function haversineDistanceKm(a: Coordinates, b: Coordinates): number {
  const earthRadiusKm = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockListingSearchRepository implements ListingSearchRepository {
  async search(filters: ListingSearchFilters): Promise<ListingSearchResult> {
    await delay(SIMULATED_DELAY_MS);

    // Gancho de demo: buscar "error" simula una falla de red para poder ver el estado de error.
    if (filters.query?.trim().toLowerCase() === 'error') {
      throw new Error('No se pudieron cargar los resultados.');
    }

    const items = SEED_LISTINGS.filter((listing) => {
      if (filters.categoryId && listing.categoryId !== filters.categoryId) {
        return false;
      }

      if (filters.priceMaxMinor !== undefined) {
        const priceMinor =
          listing.pricing.model === 'fixed'
            ? listing.pricing.price.amountMinor
            : listing.pricing.model === 'hourly'
              ? listing.pricing.hourlyRate.amountMinor
              : undefined;

        if (priceMinor === undefined || priceMinor > filters.priceMaxMinor) {
          return false;
        }
      }

      if (filters.query) {
        const needle = filters.query.trim().toLowerCase();
        if (!listing.title.toLowerCase().includes(needle)) {
          return false;
        }
      }

      if (filters.near && haversineDistanceKm(filters.near, listing.location) > SEARCH_RADIUS_KM) {
        return false;
      }

      return true;
    });

    return { items };
  }
}

export const CITY_OPTIONS: { id: string; label: string; coordinates: Coordinates }[] = [
  { id: 'bogota', label: 'Bogotá', coordinates: BOGOTA },
  { id: 'medellin', label: 'Medellín', coordinates: MEDELLIN },
];
