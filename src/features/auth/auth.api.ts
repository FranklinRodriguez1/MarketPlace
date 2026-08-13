import { authResponseSchema, type AuthResponse } from './auth.schemas';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Error específico de autenticación que incluye el HTTP status.
// Permite distinguir 401 (credenciales) de 409 (correo existente) en el catch.
export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

async function postAuth(
  endpoint: string,
  body: { email: string; password: string; displayName?: string },
): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new AuthApiError('Correo o contraseña incorrectos.', 401);
    }
    if (response.status === 409) {
      throw new AuthApiError('Este correo ya está registrado.', 409);
    }
    throw new AuthApiError('Error inesperado. Intenta de nuevo.', response.status);
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
// claims al día.
export async function refreshSession(refreshToken: string): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new AuthApiError('No se pudo renovar la sesión.', response.status);
  }

  const raw: unknown = await response.json();
  return authResponseSchema.parse(raw);
}
