import { z } from 'zod';

import { actorSchema } from '@/features/auth/auth.schemas';
import { api } from '@/services/api';

// actorSchema tiene { capacities, platformRole }.
// El endpoint /me devuelve lo mismo más un id.
// email es opcional: el backend desplegado todavía no lo incluye en /me
// (ver CERCA-21) — cuando lo agregue, esto empieza a llegar solo.
const meSchema = actorSchema.extend({ id: z.string(), email: z.string().email().optional() });

export type MeData = z.infer<typeof meSchema>;

// — API pública ————————————————————————————————————————————

export async function getMe(): Promise<MeData> {
  const response = await api.get<unknown>('/me');
  return meSchema.parse(response.data);
}

export async function activateProvider(): Promise<MeData> {
  const response = await api.post<unknown>('/me/capacities/provider', {});
  return meSchema.parse(response.data);
}
