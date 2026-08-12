import { api } from './api'

export interface Listing {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  statusKind: 'draft' | 'published' | 'paused' | 'under_review' | 'removed';
  priceMinorFrom: number | null;
  currency: string | null;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}
 export async function getMyListing(): Promise<Listing[]> {
    const response = await api.get<Listing[]>('/me/listings');
     
    return response.data;
 } 

 export interface CreateListingInput {
  categoryId: string;
  title: string;
  description: string;
  pricing: unknown;
  priceMinorFrom?: number;
  currency?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export async function createListing( data: CreateListingInput): Promise<Listing> {
    const response = await api.post<Listing>('/listings', data);

    return response.data
}