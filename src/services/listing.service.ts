import type { Pricing } from '@cerca/src';

import { api } from './api'

export interface Listing {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  pricing: Pricing;
  status: 'draft' | 'published' | 'paused' | 'under_review' | 'removed';
  priceFrom: { amountMinor: number; currency: string } | null;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
}

interface ListListingsResponse {
  items: Listing[];
  nextCursor: string | null;
}

 export async function getMyListing(): Promise<Listing[]> {
    const response = await api.get<ListListingsResponse>('/me/listings');

    return response.data.items;
 }

 export interface CreateListingInput {
  categoryId: string;
  title: string;
  description: string;
  pricing: unknown;
  location?: {
    lat: number;
    lng: number;
  };
}

export async function createListing( data: CreateListingInput): Promise<Listing> {
    const response = await api.post<Listing>('/listings', data);

    return response.data
}

export async function getListing(id: string): Promise<Listing> {
  const response = await api.get<Listing>(`/listings/${id}`);
  return response.data;
}

// El backend (UpdateListingDto) solo acepta estos tres campos — categoryId
// y location no se pueden editar, un PATCH con esas keys responde 422.
export interface UpdateListingInput {
  title?: string;
  description?: string;
  pricing?: Pricing;
}

export async function updateListing(id: string, data: UpdateListingInput): Promise<Listing> {
  const response = await api.patch<Listing>(`/listings/${id}`, data);
  return response.data;
}

export async function publishListing(id: string): Promise<Listing> {
  const response = await api.post<Listing>(`/listings/${id}/publish`, {});
  return response.data;
}

export async function pauseListing(id: string): Promise<Listing> {
  const response = await api.post<Listing>(`/listings/${id}/pause`, {});
  return response.data;
}