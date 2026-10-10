import { Place } from '../../domain/entities/Place';
import { haversineDistanceKm } from './GetNearbyPlaces';

export interface TrailLeg {
  from: Place;
  to: Place;
  distanceKm: number;
}

export interface DiscoveryTrail {
  stops: Place[];
  legs: TrailLeg[];
  totalDistanceKm: number;
  googleMapsUrl: string | null;
  disclaimer: string;
}

/**
 * CalculateDiscoveryTrailUseCase
 *
 * Computes sequential straight-line legs and cumulative distance across
 * multiple community discoveries to form a local travel trail.
 *
 * Clean Architecture Application Layer: pure business logic, provider-agnostic.
 */
export class CalculateDiscoveryTrailUseCase {
  execute(stops: Place[]): DiscoveryTrail {
    const validStops = stops.filter((p) => p.coordinates !== undefined);

    if (validStops.length < 2) {
      return {
        stops: validStops,
        legs: [],
        totalDistanceKm: 0,
        googleMapsUrl: validStops.length === 1 && validStops[0].coordinates
          ? `https://www.google.com/maps/dir/?api=1&destination=${validStops[0].coordinates.latitude},${validStops[0].coordinates.longitude}`
          : null,
        disclaimer: 'Straight-line geographic trail between community discoveries.',
      };
    }

    const legs: TrailLeg[] = [];
    let totalDistanceKm = 0;

    for (let i = 0; i < validStops.length - 1; i++) {
      const from = validStops[i];
      const to = validStops[i + 1];
      const dist = haversineDistanceKm(
        from.coordinates!.latitude,
        from.coordinates!.longitude,
        to.coordinates!.latitude,
        to.coordinates!.longitude
      );
      legs.push({
        from,
        to,
        distanceKm: Math.round(dist * 10) / 10,
      });
      totalDistanceKm += dist;
    }

    // Build Google Maps multi-point directions URL
    const origin = `${validStops[0].coordinates!.latitude},${validStops[0].coordinates!.longitude}`;
    const destination = `${validStops[validStops.length - 1].coordinates!.latitude},${validStops[validStops.length - 1].coordinates!.longitude}`;
    
    let googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    
    if (validStops.length > 2) {
      const intermediateWaypoints = validStops
        .slice(1, -1)
        .map((p) => `${p.coordinates!.latitude},${p.coordinates!.longitude}`)
        .join('|');
      googleMapsUrl += `&waypoints=${encodeURIComponent(intermediateWaypoints)}`;
    }

    return {
      stops: validStops,
      legs,
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
      googleMapsUrl,
      disclaimer: 'Straight-line geographic distance between community discoveries. Please check real road/trail conditions, opening hours, and terrain before departing.',
    };
  }
}

export const calculateDiscoveryTrailUseCase = new CalculateDiscoveryTrailUseCase();
