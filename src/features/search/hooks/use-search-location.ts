import { useCallback, useEffect, useState } from 'react';
import type { Coordinates } from '@cerca/src';

import { cityOptions, locationProvider } from '@/infrastructure/composition';

export type LocationStatus = 'resolving' | 'granted' | 'manual';

export function useSearchLocation() {
  const [status, setStatus] = useState<LocationStatus>('resolving');
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>(undefined);
  const [cityId, setCityId] = useState<string | undefined>(undefined);

  const resolve = useCallback(async () => {
    setStatus('resolving');
    const current = await locationProvider.getCurrentLocation();

    if (current) {
      setCoordinates(current);
      setCityId(undefined);
      setStatus('granted');
    } else {
      setStatus('manual');
    }
  }, []);

  useEffect(() => {
    resolve();
  }, [resolve]);

  const selectCity = useCallback((id: string) => {
    const city = cityOptions.find((option) => option.id === id);
    if (!city) return;

    setCoordinates(city.coordinates);
    setCityId(city.id);
    setStatus('manual');
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
