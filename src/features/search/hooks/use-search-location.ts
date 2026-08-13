import { useCallback, useEffect, useState } from 'react';
import type { Coordinates } from '@cerca/src';

import { cityOptions, locationProvider } from '@/infrastructure/composition';

export type LocationStatus = 'resolving' | 'granted' | 'manual';

interface LocationCache {
  status: LocationStatus;
  coordinates?: Coordinates;
  cityId?: string;
}

// Cache a nivel de módulo: sin esto, cada pantalla que usa este hook
// (Catálogo, Search) vuelve a pedir GPS/ciudad al montarse, aunque el
// usuario ya la haya resuelto en otra pantalla segundos antes.
let cache: LocationCache = { status: 'resolving' };

export function useSearchLocation() {
  const [status, setStatus] = useState<LocationStatus>(cache.status);
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>(cache.coordinates);
  const [cityId, setCityId] = useState<string | undefined>(cache.cityId);

  const resolve = useCallback(async () => {
    cache = { status: 'resolving' };
    setStatus('resolving');

    const current = await locationProvider.getCurrentLocation();
    cache = current
      ? { status: 'granted', coordinates: current, cityId: undefined }
      : { status: 'manual' };

    setStatus(cache.status);
    setCoordinates(cache.coordinates);
    setCityId(cache.cityId);
  }, []);

  useEffect(() => {
    // Ya hay una ubicación resuelta de otra pantalla — no hace falta
    // volver a pedir GPS ni mostrar el selector de ciudad de nuevo.
    if (cache.status !== 'resolving') return;
    resolve();
  }, [resolve]);

  const selectCity = useCallback((id: string) => {
    const city = cityOptions.find((option) => option.id === id);
    if (!city) return;

    cache = { status: 'manual', coordinates: city.coordinates, cityId: city.id };
    setStatus(cache.status);
    setCoordinates(cache.coordinates);
    setCityId(cache.cityId);
  }, []);

  return {
    status,
    coordinates,
    cityId,
    retryGps: resolve,
    selectCity,
    cities: cityOptions,
  };
}
