import * as Location from 'expo-location';

import type { LocationProvider } from '@/application/ports/location-provider';
import type { Coordinates } from '@cerca/src';

export class ExpoLocationProvider implements LocationProvider {
  async getCurrentLocation(): Promise<Coordinates | null> {
    const current = await Location.getForegroundPermissionsAsync();
    const permission = current.granted ? current : await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      return null;
    }

    const position = await Location.getCurrentPositionAsync();

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  }
}
