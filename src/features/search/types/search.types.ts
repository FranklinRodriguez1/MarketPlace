export interface FilterState {
    categoryId?: string;
    priceMaxMinor?: number;
    minRating?: number;
}

export const RATING_OPTIONS = [3, 4, 4.5] as const;
