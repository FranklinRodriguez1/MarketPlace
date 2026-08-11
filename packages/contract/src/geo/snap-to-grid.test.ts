import { describe, expect, it } from 'vitest';
import { snapToGrid } from './snap-to-grid';

describe('snapToGrid', () => {
  it('rounds coordinates to the given decimal precision', () => {
    const snapped = snapToGrid({ latitude: 4.710989, longitude: -74.072092 }, 2);

    expect(snapped).toEqual({ latitude: 4.71, longitude: -74.07 });
  });

  it('maps nearby coordinates (GPS jitter) to the same grid cell', () => {
    const a = snapToGrid({ latitude: 4.7109, longitude: -74.0721 }, 2);
    const b = snapToGrid({ latitude: 4.7108, longitude: -74.0719 }, 2);

    expect(a).toEqual(b);
  });

  it('maps coordinates far apart to different grid cells', () => {
    const bogota = snapToGrid({ latitude: 4.7109, longitude: -74.0721 }, 2);
    const medellin = snapToGrid({ latitude: 6.2442, longitude: -75.5812 }, 2);

    expect(bogota).not.toEqual(medellin);
  });

  it('defaults to 2 decimals', () => {
    const snapped = snapToGrid({ latitude: 4.710989, longitude: -74.072092 });

    expect(snapped).toEqual({ latitude: 4.71, longitude: -74.07 });
  });
});
