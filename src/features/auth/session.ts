import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'cerca_access_token';
const REFRESH_TOKEN_KEY = 'cerca_refresh_token';

// expo-secure-store no tiene implementación nativa en web (su build .web.ts
// exporta un objeto vacío), así que ahí usamos localStorage como fallback.
// `localStorage` solo existe en un navegador real; en nativo (Hermes) es
// undefined, así que basta con detectarlo — sin importar 'react-native'
// (que rompe la carga de este módulo bajo vitest, cuyo entorno de test es
// 'node' y no transforma la sintaxis Flow de react-native/index.js).
const webStorage = typeof globalThis.localStorage !== 'undefined' ? globalThis.localStorage : undefined;

const store = {
  async getItem(key: string): Promise<string | null> {
    if (webStorage) {
      return webStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (webStorage) {
      webStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async deleteItem(key: string): Promise<void> {
    if (webStorage) {
      webStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  await store.setItem(ACCESS_TOKEN_KEY, accessToken);
  await store.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getAccessToken(): Promise<string | null> {
  return store.getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return store.getItem(REFRESH_TOKEN_KEY);
}

// clearTokens se usará en logout (CERCA-9 o similar)
export async function clearTokens(): Promise<void> {
  await store.deleteItem(ACCESS_TOKEN_KEY);
  await store.deleteItem(REFRESH_TOKEN_KEY);
}
