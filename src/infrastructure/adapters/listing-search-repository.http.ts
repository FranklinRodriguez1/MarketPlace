import { listingSearchResultSchema } from '@cerca/src';
import type { ListingSearchFilters, ListingSearchResult } from '@cerca/src';

import type { ListingSearchRepository } from '@/application/ports/listing-search-repository';
import { api } from '@/services/api';

// Nombres de query param inferidos de la convención del resto del backend
// (mismo naming que ListingSearchFilters) — no hay un contrato de OpenAPI
// documentado para este endpoint todavía. Ajustar si el backend real usa
// otros nombres.
function buildQuery(filters: ListingSearchFilters, cursor?: string): string {
  const params = new URLSearchParams();

  if (filters.query) params.set('query', filters.query);
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.priceMaxMinor !== undefined) params.set('priceMaxMinor', String(filters.priceMaxMinor));
  if (filters.minRating !== undefined) params.set('minRating', String(filters.minRating));
  if (filters.near) {
    params.set('lat', String(filters.near.latitude));
    params.set('lng', String(filters.near.longitude));
  }
  if (cursor) params.set('cursor', cursor);

  const query = params.toString();
  return query ? `?${query}` : '';
}

export class HttpListingSearchRepository implements ListingSearchRepository {
  async search(filters: ListingSearchFilters, cursor?: string): Promise<ListingSearchResult> {
    const response = await api.get<unknown>(`/listings${buildQuery(filters, cursor)}`);
    return listingSearchResultSchema.parse(response.data);
  }
}
