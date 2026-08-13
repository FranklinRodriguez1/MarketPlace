import { Pricing } from "@cerca/src";

export interface CreateListingForm {
  categoryId: string;
  title: string;
  description: string;

  pricing: Pricing;

  latitude?: number;
  longitude?: number;

  photos: string[];
}