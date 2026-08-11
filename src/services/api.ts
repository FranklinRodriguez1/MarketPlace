// src/services/api.ts

const API_URL = process.env.EXPO_PUBLIC_API_URL;;

export const api = {
  async get<T>(endpoint: string): Promise<{ data: T }> {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error('Error en la petición');
    }

    const data = await response.json();

    return { data };
  },

  async post<T>(endpoint: string, body: unknown): Promise<{ data: T }> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Error en la petición');
    }

    const data = await response.json();

    return { data };
  },
};