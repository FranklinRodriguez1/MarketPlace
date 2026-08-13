import { z } from 'zod';

import { api } from '@/services/api';

// Schema del reporte — solo los campos que usamos en la UI
const reportSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  reason: z.string(),
});

export type Report = z.infer<typeof reportSchema>;

const reportsSchema = z.array(reportSchema);

export type ListingStatus = 'under_review' | 'removed';

// — API pública ————————————————————————————————————————————

export async function getReports(): Promise<Report[]> {
  const response = await api.get<unknown>('/reports');
  return reportsSchema.parse(response.data);
}

export async function moderateListing(listingId: string, status: ListingStatus): Promise<void> {
  await api.post(`/listings/${listingId}/moderate`, { status });
}

export async function resolveReport(reportId: string): Promise<void> {
  await api.post(`/reports/${reportId}/resolve`, {});
}
