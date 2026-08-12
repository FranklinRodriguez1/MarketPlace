import type { Pricing } from '@cerca/src';

export interface CreateListingForm {
    categoryId: string;
    title: string;
    pricing: Pricing;
    latitude?: number;
    longitude?: number;
    photos: string[];
}