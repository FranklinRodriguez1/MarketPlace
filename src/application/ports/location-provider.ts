import type { Coordinates } from '@cerca/src';

export interface LocationProvider {
    getCurrentLocation(): Promise<Coordinates | null>;
}
