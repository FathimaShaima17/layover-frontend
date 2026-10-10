import { Place } from '../../domain/entities/Place';
import { NEARBY_RADIUS_KM } from '../../infrastructure/map/MapConfig';

/**
 * Haversine great-circle distance between two lat/lng points.
 * Returns distance in kilometres.
 */
export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export interface NearbyPlaceResult {
  place: Place;
  distanceKm: number;
}

/**
 * GetNearbyPlacesUseCase
 *
 * Finds all places within a configurable kilometre radius of the
 * supplied anchor coordinates, excluding the anchor place itself.
 *
 * Uses the Haversine formula — no external API required.
 */
export class GetNearbyPlacesUseCase {
  constructor(private readonly defaultRadiusKm: number = NEARBY_RADIUS_KM) {}

  execute(anchor: Place, allPlaces: Place[], radiusKm?: number): Place[] {
    return this.executeWithDistance(anchor, allPlaces, radiusKm).map((r) => r.place);
  }

  executeWithDistance(anchor: Place, allPlaces: Place[], radiusKm?: number): NearbyPlaceResult[] {
    if (!anchor.coordinates) return [];

    const effectiveRadius = radiusKm ?? this.defaultRadiusKm;
    const { latitude: lat1, longitude: lng1 } = anchor.coordinates;

    const results: NearbyPlaceResult[] = [];

    for (const p of allPlaces) {
      if (p.id === anchor.id) continue;
      if (!p.coordinates) continue;

      const dist = haversineDistanceKm(lat1, lng1, p.coordinates.latitude, p.coordinates.longitude);
      if (dist <= effectiveRadius) {
        results.push({
          place: p,
          distanceKm: Math.round(dist * 10) / 10,
        });
      }
    }

    // Sort by closest distance first
    return results.sort((a, b) => a.distanceKm - b.distanceKm);
  }
}

/** Singleton with default radius. */
export const getNearbyPlacesUseCase = new GetNearbyPlacesUseCase();
