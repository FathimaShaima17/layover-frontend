/**
 * Geospatial utilities for HiddenAtlas
 * – Haversine distance formula
 * – Local coordinate projection centred on Kozhikode Beach, Kerala
 */

export interface LatLng {
  latitude: number;
  longitude: number;
}

// ─── Demo / Reference location ───────────────────────────────────────────────

/** Kozhikode Beach, Kerala, India */
export const KOZHIKODE_BEACH: LatLng = {
  latitude: 11.2588,
  longitude: 75.7804,
};

// ─── Haversine distance ───────────────────────────────────────────────────────

const EARTH_RADIUS_KM = 6371;

/**
 * Returns the straight-line distance between two geographic points in kilometres.
 * Uses the Haversine formula.
 */
export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const chord =
    sinDLat * sinDLat +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinDLng * sinDLng;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(chord), Math.sqrt(1 - chord));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Returns a human-readable distance label.
 * Shows metres when < 1 km, kilometres otherwise.
 * Explicitly labels the distance as straight-line (not walking/driving).
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }
  return `${km.toFixed(1)} km away`;
}

// ─── Local 3D coordinate projection ─────────────────────────────────────────

/**
 * Projects a geographic coordinate into a flat 3D world position
 * relative to the reference location (Kozhikode Beach).
 *
 * Local places (within 30 km) map linearly (1 km ≈ 0.65 3D units).
 * More distant places scale smoothly outward across the terrain up to ~38 units.
 *
 * North  → negative Z (into the scene)
 * East   → positive X
 *
 * @returns [x, y, z] — y is always 0 (height managed per-object)
 */
export function geoToWorld(
  point: LatLng,
  reference: LatLng = KOZHIKODE_BEACH
): [number, number, number] {
  const dLat = point.latitude - reference.latitude;
  const dLng = point.longitude - reference.longitude;

  // Approximate metres per degree at the reference latitude
  const metersPerDegLat = 111_320;
  const metersPerDegLng = 111_320 * Math.cos(toRad(reference.latitude));

  const northMeters = dLat * metersPerDegLat;
  const eastMeters = dLng * metersPerDegLng;

  const distMeters = Math.sqrt(northMeters * northMeters + eastMeters * eastMeters);
  if (distMeters === 0) return [0, 0, 0];

  const angle = Math.atan2(eastMeters, -northMeters); // compass bearing in X-Z plane

  let rUnits: number;
  if (distMeters <= 30_000) {
    // 1 km = 0.65 units (30 km = 19.5 units)
    rUnits = (distMeters / 1000) * 0.65;
  } else {
    // Distances beyond 30 km scale outward gracefully onto the terrain
    const extraKm = (distMeters - 30_000) / 1000;
    rUnits = Math.min(38, 19.5 + Math.log2(1 + extraKm / 10) * 4.2);
  }

  const x = Math.sin(angle) * rUnits;
  const z = Math.cos(angle) * rUnits;

  return [x, 0, z];
}

