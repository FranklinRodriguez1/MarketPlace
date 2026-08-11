import type { Coordinates } from './coordinates';

export function snapToGrid(coordinates: Coordinates, decimals = 2): Coordinates {
    const factor = 10 ** decimals;

    return {
        latitude: Math.round(coordinates.latitude * factor) / factor,
        longitude: Math.round(coordinates.longitude * factor) / factor,
    };
}
