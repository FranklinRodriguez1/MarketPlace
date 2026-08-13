// Base URL del backend (Cerca API) — incluye el prefijo /v1, así que los
// endpoints en el resto del código se escriben sin él (ej. '/auth/sign-in').
export const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Forma de error del backend — application/problem+json, no { message } plano.
export interface ProblemDetails {
  type?: string;
  status?: number;
  code?: string;
  title?: string;
  detail?: string;
  instance?: string;
  traceId?: string;
  errors?: { path: string; message: string }[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly traceId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// El backend corre en el tier gratuito de Render: "duerme" tras 15 min sin
// tráfico y el primer request tras eso puede tardar 30-60s en responder.
const REQUEST_TIMEOUT_MS = 60_000;

const COLD_START_MESSAGE =
  'El servidor está iniciando, esto puede tardar unos segundos. Intentá de nuevo.';

export async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(COLD_START_MESSAGE, 0, 'cold_start_timeout');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

// Construye el ApiError a partir de una respuesta no-ok, leyendo el body
// problem+json (.detail / .errors[]), no un { message: string } genérico.
export async function parseApiError(response: Response): Promise<ApiError> {
  const body: ProblemDetails | null = await response.json().catch(() => null);

  // 502/503 en este backend casi siempre es Render despertando la instancia.
  if (response.status === 502 || response.status === 503) {
    return new ApiError(COLD_START_MESSAGE, response.status, body?.code ?? 'cold_start', body?.traceId);
  }

  const fieldMessage = body?.errors?.map((fieldError) => fieldError.message).join(' ');
  const message = fieldMessage || body?.detail || body?.title || `Error HTTP ${response.status}`;

  return new ApiError(message, response.status, body?.code, body?.traceId);
}
