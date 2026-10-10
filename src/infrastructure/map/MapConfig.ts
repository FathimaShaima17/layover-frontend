/**
 * MapConfig — Infrastructure adapter for MapLibre GL + MapTiler / CartoDB / OSM.
 *
 * All map-provider specifics live here so the domain + application layers
 * remain completely provider-agnostic.
 *
 * Environment variable: VITE_MAPTILER_API_KEY
 */

const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env[key] as string | undefined) ?? '';
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] ?? '';
  }
  return '';
};

export const API_KEY: string = getEnvVar('VITE_MAPTILER_API_KEY');

const isDev =
  (typeof import.meta !== 'undefined' && import.meta.env?.DEV) ||
  (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production');

if (!API_KEY && isDev) {
  console.info(
    '[HiddenAtlas] VITE_MAPTILER_API_KEY is not set. ' +
      'Using free high-resolution CartoDB Voyager vector tiles. ' +
      'Add a MapTiler key to my-app/.env for custom satellite & 3D terrain elevation.'
  );
}

/**
 * Primary style URL:
 * - If MapTiler key is provided, uses MapTiler Outdoor v2 with terrain.
 * - If not, uses CartoDB Voyager GL vector style (free, public, global streets & landmarks up to zoom 20).
 */
export const MAP_STYLE: string = API_KEY
  ? `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${API_KEY}`
  : 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

/** MapTiler terrain RGB TileJSON URL (requires API key). */
export const TERRAIN_SOURCE_URL: string | null = API_KEY
  ? `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${API_KEY}`
  : null;

/**
 * Built-in zero-network fallback style specification.
 * Directly streams OpenStreetMap raster tiles if external style JSON is blocked or unreachable.
 */
export const FALLBACK_OSM_STYLE = {
  version: 8 as const,
  sources: {
    'osm-tiles': {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster' as const,
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

/** Default map viewport — centres on Europe / Mediterranean world discovery region. */
export const DEFAULT_MAP_CENTER: [number, number] = [13.5, 46.0]; // [lng, lat]
export const DEFAULT_MAP_ZOOM = 4.5;
export const DEFAULT_MAP_PITCH = 45; // degrees tilt for 3D terrain perspective
export const DEFAULT_MAP_BEARING = 0;

/** Zoom levels at which cluster expansion becomes single markers. */
export const CLUSTER_MAX_ZOOM = 14;
export const CLUSTER_RADIUS = 50; // px

/** Distance (km) used for "nearby places" discovery. */
export const NEARBY_RADIUS_KM = 50;
