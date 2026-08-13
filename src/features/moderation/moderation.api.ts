import { z } from 'zod';

import { getAccessToken } from '@/features/auth/session';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Schema del reporte — solo los campos que usamos en la UI
const reportSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  reason: z.string(),
});

export type Report = z.infer<typeof reportSchema>;

const reportsSchema = z.array(reportSchema);

export type ListingStatus = 'under_review' | 'removed';

// — helper interno ————————————————————————————————————————————

async function authorizedFetch(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: Record<string, string>,
): Promise<unknown> {
  const token = await getAccessToken();
  if (token === null) {
    throw new Error('No hay sesión activa.');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Error del servidor (${response.status}). Intenta de nuevo.`);
  }

  // 204 No Content — no hay cuerpo que parsear
  if (response.status === 204) return {};
  return response.json();
}

// — API pública ————————————————————————————————————————————

export async function getReports(): Promise<Report[]> {
  const raw = await authorizedFetch('/reports');
  return reportsSchema.parse(raw);
}

export async function moderateListing(listingId: string, status: ListingStatus): Promise<void> {
  await authorizedFetch(`/listings/${listingId}/moderate`, 'POST', { status });
}

export async function resolveReport(reportId: string): Promise<void> {
  await authorizedFetch(`/reports/${reportId}/resolve`, 'POST');
}
