// src/services/api.ts
import { refreshSession } from '@/features/auth/auth.api';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '@/features/auth/session';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// El accessToken dura poco (~15 min). Varias requests en paralelo pueden
// expirar al mismo tiempo, así que compartimos la misma promesa de refresh
// en vez de canjear el refreshToken una vez por request.
let refreshInFlight: Promise<boolean> | null = null;

async function tryRefreshAccessToken(): Promise<boolean> {
  if (refreshInFlight === null) {
    refreshInFlight = (async () => {
      const refreshToken = await getRefreshToken();
      if (refreshToken === null) return false;

      try {
        const renewed = await refreshSession(refreshToken);
        await saveTokens(renewed.accessToken, renewed.refreshToken);
        return true;
      } catch {
        await clearTokens();
        return false;
      }
    })();
  }

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

// El backend responde errores en formato Problem+JSON (RFC 7807):
// { detail, title, code }, no { message, error }.
function extractErrorMessage(data: unknown, status: number): string {
  const body = data as { message?: string; error?: string; detail?: string; title?: string } | null;
  return body?.message || body?.error || body?.detail || body?.title || `Error HTTP ${status}`;
}

async function request<T>(
  endpoint: string,
  init: RequestInit,
  logLabel: string,
): Promise<{ data: T }> {
  let response = await fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers: { ...init.headers, ...(await authHeaders()) },
  });

  // El token expiró a mitad de la sesión: canjeamos el refreshToken y
  // reintentamos la misma request una vez con el accessToken nuevo.
  if (response.status === 401) {
    const refreshed = await tryRefreshAccessToken();
    if (refreshed) {
      response = await fetch(`${API_URL}${endpoint}`, {
        ...init,
        headers: { ...init.headers, ...(await authHeaders()) },
      });
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error(logLabel, {
      url: `${API_URL}${endpoint}`,
      status: response.status,
      data,
    });

    throw new Error(extractErrorMessage(data, response.status));
  }

  return { data };
}

export const api = {
  async get<T>(endpoint: string): Promise<{ data: T }> {
    return request<T>(endpoint, {}, 'GET ERROR:');
  },

  async post<T>(
    endpoint: string,
    body: unknown
  ): Promise<{ data: T }> {
    return request<T>(
      endpoint,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      'POST ERROR:',
    );
  },

  async patch<T>(
    endpoint: string,
    body: unknown
  ): Promise<{ data: T }> {
    return request<T>(
      endpoint,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      'PATCH ERROR:',
    );
  },
};