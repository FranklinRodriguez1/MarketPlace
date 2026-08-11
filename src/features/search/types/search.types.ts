export interface FilterState {
    categoryId?: string;
    priceMaxMinor?: number;
}

export const CATEGORY_OPTIONS = [
    { id: 'plumbing', label: 'Plomería' },
    { id: 'electrician', label: 'Electricidad' },
    { id: 'cleaning', label: 'Limpieza' },
    { id: 'painting', label: 'Pintura' },
    { id: 'gardening', label: 'Jardinería' },
] as const;
