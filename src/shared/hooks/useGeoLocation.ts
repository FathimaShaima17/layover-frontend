import { useState, useCallback } from 'react';
import { LatLng, KOZHIKODE_BEACH } from '../utils/geo';

export type LocationMode = 'demo' | 'device';

export interface LocationState {
  mode: LocationMode;
  coords: LatLng;
  requesting: boolean;
  error: string | null;
}

export interface UseLocationReturn extends LocationState {
  requestDeviceLocation: () => void;
  resetToDemo: () => void;
}

/**
 * Manages the active location for the 3D World.
 * Starts in "demo" mode centred on Kozhikode Beach.
 * requestDeviceLocation() prompts the browser for GPS access;
 * on denial or error, it falls back gracefully to demo mode.
 */
export function useGeoLocation(): UseLocationReturn {
  const [state, setState] = useState<LocationState>({
    mode: 'demo',
    coords: KOZHIKODE_BEACH,
    requesting: false,
    error: null,
  });

  const requestDeviceLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser. Using demo location.',
      }));
      return;
    }

    setState((prev) => ({ ...prev, requesting: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          mode: 'device',
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          requesting: false,
          error: null,
        });
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Location permission denied. Using Kozhikode Beach demo location.',
          2: 'Location unavailable. Using Kozhikode Beach demo location.',
          3: 'Location request timed out. Using Kozhikode Beach demo location.',
        };
        setState({
          mode: 'demo',
          coords: KOZHIKODE_BEACH,
          requesting: false,
          error: messages[err.code] ?? 'Location error. Using demo location.',
        });
      },
      { timeout: 8000, maximumAge: 30_000 }
    );
  }, []);

  const resetToDemo = useCallback(() => {
    setState({
      mode: 'demo',
      coords: KOZHIKODE_BEACH,
      requesting: false,
      error: null,
    });
  }, []);

  return { ...state, requestDeviceLocation, resetToDemo };
}
