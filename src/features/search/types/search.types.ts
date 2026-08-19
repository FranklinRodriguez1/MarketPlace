export interface FilterState {
    categoryId?: string;
    priceMaxMinor?: number;
    minRating?: number;
}

export const RATING_OPTIONS = [3, 4, 4.5] as const;

export const CATEGORY_OPTIONS = [
    { id: 'plumbing', label: 'Plomería' },
    { id: 'electrician', label: 'Electricidad' },
    { id: 'cleaning', label: 'Limpieza' },
    { id: 'painting', label: 'Pintura' },
    { id: 'gardening', label: 'Jardinería' },
] as const;
