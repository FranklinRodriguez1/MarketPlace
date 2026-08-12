// src/services/api.ts

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = {
  async get<T>(endpoint: string): Promise<{ data: T }> {
    const response = await fetch(`${API_URL}${endpoint}`);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('GET ERROR:', {
        url: `${API_URL}${endpoint}`,
        status: response.status,
        data,
      });

      throw new Error(
        data?.message ||
        data?.error ||
        `Error HTTP ${response.status}`
      );
    }

    return { data };
  },

  async post<T>(
    endpoint: string,
    body: unknown
  ): Promise<{ data: T }> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('POST ERROR:', {
        url: `${API_URL}${endpoint}`,
        status: response.status,
        data,
        body,
      });

      throw new Error(
        data?.message ||
        data?.error ||
        `Error HTTP ${response.status}`
      );
    }

    return { data };
  },
};