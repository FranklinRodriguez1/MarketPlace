import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as SecureStore from 'expo-secure-store';

import { clearTokens, getAccessToken, saveTokens } from './session';

// expo-secure-store is a native module — it calls into the device keychain,
// which doesn't exist in Node.js. We stub it with vi.fn() stubs and back
// them with an in-memory Map in beforeEach so each test starts clean.
vi.mock('expo-secure-store', () => ({
  setItemAsync: vi.fn(),
  getItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

const fakeStore = new Map<string, string>();

beforeEach(() => {
  fakeStore.clear();

  vi.mocked(SecureStore.setItemAsync).mockImplementation((key, value) => {
    fakeStore.set(key, value);
    return Promise.resolve();
  });

  vi.mocked(SecureStore.getItemAsync).mockImplementation((key) =>
    Promise.resolve(fakeStore.get(key) ?? null),
  );

  vi.mocked(SecureStore.deleteItemAsync).mockImplementation((key) => {
    fakeStore.delete(key);
    return Promise.resolve();
  });
});

describe('saveTokens', () => {
  it('guarda el accessToken y el refreshToken en las claves correctas', async () => {
    await saveTokens('access-abc', 'refresh-xyz');
    expect(fakeStore.get('cerca_access_token')).toBe('access-abc');
    expect(fakeStore.get('cerca_refresh_token')).toBe('refresh-xyz');
  });
});

describe('getAccessToken', () => {
  it('devuelve el token guardado si existe', async () => {
    await saveTokens('access-abc', 'refresh-xyz');
    await expect(getAccessToken()).resolves.toBe('access-abc');
  });

  it('devuelve null si no hay token guardado', async () => {
    await expect(getAccessToken()).resolves.toBeNull();
  });
});

describe('clearTokens', () => {
  it('borra ambos tokens y getAccessToken devuelve null después', async () => {
    await saveTokens('access-abc', 'refresh-xyz');
    await clearTokens();
    await expect(getAccessToken()).resolves.toBeNull();
    expect(fakeStore.has('cerca_access_token')).toBe(false);
    expect(fakeStore.has('cerca_refresh_token')).toBe(false);
  });
});
