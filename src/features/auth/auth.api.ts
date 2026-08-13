import { API_URL, ApiError, fetchWithTimeout, parseApiError } from '@/services/api-client';

import { authResponseSchema, type AuthResponse } from './auth.schemas';

// Alias del error del cliente HTTP compartido — se mantiene el nombre por
// compatibilidad con quien distinga errores de auth vía `instanceof`.
export { ApiError as AuthApiError };

// Mensajes canned para los dos status que la UI de login/registro distingue
// explícitamente; para el resto se usa el .detail/.errors del problem+json
// (validación, cold start, etc.) que ya arma parseApiError.
async function postAuth(
  endpoint: string,
  body: { email: string; password: string; displayName?: string },
): Promise<AuthResponse> {
  const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new ApiError('Correo o contraseña incorrectos.', 401);
    }
    if (response.status === 409) {
      throw new ApiError('Este correo ya está registrado.', 409);
    }
    throw await parseApiError(response);
  }

  // parse() valida la forma exacta de la respuesta — falla si el servidor cambia el contrato.
  const raw: unknown = await response.json();
  return authResponseSchema.parse(raw);
}

export function signIn(email: string, password: string): Promise<AuthResponse> {
  return postAuth('/auth/sign-in', { email, password });
}

export function signUp(email: string, password: string, displayName: string): Promise<AuthResponse> {
  return postAuth('/auth/sign-up', { email, password, displayName });
}

// El accessToken lleva las capacities embebidas como claims: activar una
// capacidad nueva (ej. provider) no la refleja en el token ya emitido.
// Hay que canjear el refreshToken para obtener un accessToken con los
// claims al día. El refreshToken rota en cada canje — services/api.ts
// guarda el par nuevo y descarta el refreshToken usado.
export async function refreshSession(refreshToken: string): Promise<AuthResponse> {
  const response = await fetchWithTimeout(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const raw: unknown = await response.json();
  return authResponseSchema.parse(raw);
}
