// categories.service.ts

export type Category = {
  id: string;
  slug: string;
  name: string;
};

export async function getCategories(): Promise<Category[]> {
  const response = await fetch('/categories');

  if (!response.ok) {
    throw new Error('No se pudieron obtener las categorías');
  }

  return response.json();
}