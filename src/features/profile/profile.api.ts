import { z } from 'zod';

import { actorSchema } from '@/features/auth/auth.schemas';
import { getAccessToken } from '@/features/auth/session';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// actorSchema tiene { capacities, platformRole }.
// El endpoint /me devuelve lo mismo más un id.
const meSchema = actorSchema.extend({ id: z.string() });

export type MeData = z.infer<typeof meSchema>;

// — helper interno —————————————————————————————————————————

async function authorizedFetch(endpoint: string, method: 'GET' | 'POST' = 'GET'): Promise<unknown> {
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
  });

  if (!response.ok) {
    throw new Error(`Error del servidor (${response.status}). Intenta de nuevo.`);
  }

  return response.json();
}

// — API pública ————————————————————————————————————————————

export async function getMe(): Promise<MeData> {
  const raw = await authorizedFetch('/me');
  return meSchema.parse(raw);
}

export async function activateProvider(): Promise<MeData> {
  const raw = await authorizedFetch('/me/capacities/provider', 'POST');
  return meSchema.parse(raw);
}
