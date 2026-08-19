// categories.service.ts
import { api } from './api';

export interface Category {
  id: string;
  slug: string;
  name: string;
};

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>('/categories');

//   if (!response.data) {
//     throw new Error('No se pudieron obtener las categorías');
//   }

  return response.data;
}