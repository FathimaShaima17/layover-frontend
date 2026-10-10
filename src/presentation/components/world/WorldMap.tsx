import {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';
import { Place } from '../../../domain/entities/Place';
import {
  MAP_STYLE,
  TERRAIN_SOURCE_URL,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  DEFAULT_MAP_PITCH,
  DEFAULT_MAP_BEARING,
  CLUSTER_MAX_ZOOM,
  CLUSTER_RADIUS,
} from '../../../infrastructure/map/MapConfig';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface MapHandle {
  flyTo(lng: number, lat: number, zoom?: number, pitch?: number): void;
  resetView(): void;
  fitBounds(places: Place[]): void;
  toggle3D(enable3D: boolean): void;
}

interface WorldMapProps {
  places: Place[];
  selectedPlace: Place | null;
  onMarkerClick: (place: Place) => void;
  onMapClick?: () => void;
  is3DMode?: boolean;
}

// ─── Category → colour mapping ──────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  nature: '#2D6A4F',
  beaches: '#0284C7',
  mountains: '#7C3AED',
  history: '#92400E',
  food: '#C86D51',
  culture: '#B45309',
  'hidden-gems': '#1B4332',
  attractions: '#DC2626',
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? '#2D6A4F';
}

// ─── Marker SVG factories ───────────────────────────────────────────────────

function createMarkerSvg(color: string, isGem: boolean, isSelected: boolean): string {
  const size = isSelected ? 48 : 38;
  const innerR = isSelected ? 12 : 9;
  const outerR = isSelected ? 20 : 16;
  const stroke = isSelected ? 3 : 2;
  const gem = isGem
    ? `<polygon points="12,4 20,4 24,12 12,22 0,12 4,4" fill="#FFFFFF" opacity="0.95" transform="translate(${size / 2 - 12}, ${size / 2 - 13})"/>`
    : `<circle cx="${size / 2}" cy="${size / 2}" r="${innerR}" fill="#FFFFFF" opacity="0.95"/>`;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-${isSelected ? 'sel' : 'def'}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.35"/>
        </filter>
      </defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${outerR}" fill="${color}" stroke="#FFFFFF" stroke-width="${stroke}" filter="url(#shadow-${isSelected ? 'sel' : 'def'})"/>
      ${gem}
      ${isSelected ? `<circle cx="${size / 2}" cy="${size / 2}" r="${outerR + 5}" fill="none" stroke="${color}" stroke-width="2.5" opacity="0.5"/>` : ''}
    </svg>`.trim();
}

function createClusterSvg(count: number, hasGems: boolean): string {
  const size = count > 50 ? 50 : count > 10 ? 44 : 38;
  const r = size / 2 - 3;
  const bgColor = hasGems ? '#1B4332' : '#2D6A4F';

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="cluster-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="${bgColor}" stroke="#FFFFFF" stroke-width="2.5" filter="url(#cluster-shadow)"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r + 4}" fill="none" stroke="${bgColor}" stroke-width="1.5" opacity="0.4"/>
      <text x="${size / 2}" y="${size / 2 + 4.5}" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="${count > 99 ? 11 : 13}" font-weight="700">${count > 999 ? '999+' : count}</text>
    </svg>`.trim();
}

// ─── GeoJSON Point Feature Type ─────────────────────────────────────────────

interface PlacePointProperties {
  placeId: string;
  isGem: boolean;
  category: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const WorldMap = forwardRef<MapHandle, WorldMapProps>(
  ({ places, selectedPlace, onMarkerClick, onMapClick, is3DMode = true }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const placesRef = useRef<Place[]>(places);
    const selectedPlaceRef = useRef<Place | null>(selectedPlace);
    const is3DModeRef = useRef<boolean>(is3DMode);
    const superclusterRef = useRef<Supercluster<PlacePointProperties, object> | null>(null);

    // Keep refs in sync
    useEffect(() => {
      placesRef.current = places;
    }, [places]);

    useEffect(() => {
      selectedPlaceRef.current = selectedPlace;
    }, [selectedPlace]);

    useEffect(() => {
      is3DModeRef.current = is3DMode;
      if (mapRef.current) {
        mapRef.current.easeTo({
          pitch: is3DMode ? DEFAULT_MAP_PITCH : 0,
          duration: 800,
        });
      }
    }, [is3DMode]);

    // ─── Supercluster Index Builder ─────────────────────────────────────────

    const buildClusterIndex = useCallback((ps: Place[]) => {
      const points: GeoJSON.Feature<GeoJSON.Point, PlacePointProperties>[] = ps
        .filter((p) => p.coordinates !== undefined)
        .map((p) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [p.coordinates!.longitude, p.coordinates!.latitude],
          },
          properties: {
            placeId: p.id,
            isGem: p.type === 'hidden-gem',
            category: p.category,
          },
        }));

      const sc = new Supercluster<PlacePointProperties, object>({
        radius: CLUSTER_RADIUS,
        maxZoom: CLUSTER_MAX_ZOOM,
      });
      sc.load(points);
      superclusterRef.current = sc;
    }, []);

    // ─── Clear current markers ──────────────────────────────────────────────

    const clearMarkers = useCallback(() => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    }, []);

    // ─── Render markers using Supercluster ──────────────────────────────────

    const updateMarkers = useCallback(() => {
      const map = mapRef.current;
      const sc = superclusterRef.current;
      if (!map || !sc) return;

      let clusters: ReturnType<
        Supercluster<PlacePointProperties, object>['getClusters']
      > = [];

      try {
        const bounds = map.getBounds();
        const west = bounds.getWest();
        const south = Math.max(-85, bounds.getSouth());
        const east = bounds.getEast();
        const north = Math.min(85, bounds.getNorth());
        const zoom = Math.max(0, Math.min(20, Math.floor(map.getZoom())));

        if (east - west >= 360 || west < -180 || east > 180) {
          clusters = sc.getClusters([-180, -85, 180, 85], zoom);
        } else {
          clusters = sc.getClusters([west, south, east, north], zoom);
        }
      } catch {
        clusters = sc.getClusters([-180, -85, 180, 85], 2);
      }

      clearMarkers();

      const placeMap = new Map<string, Place>(placesRef.current.map((p) => [p.id, p]));
      const selPlace = selectedPlaceRef.current;

      clusters.forEach((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const isCluster =
          feature.properties &&
          'cluster' in feature.properties &&
          Boolean(feature.properties.cluster);

        if (isCluster) {
          const clusterCount = (feature.properties as { point_count: number }).point_count;
          const clusterId = (feature.properties as { cluster_id: number }).cluster_id;

          const el = document.createElement('div');
          el.className = 'ha-map-cluster';
          el.style.cssText = `
            cursor: pointer;
            transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
            will-change: transform;
            z-index: 6;
          `;
          el.innerHTML = createClusterSvg(clusterCount, true);
          el.title = `${clusterCount} community discoveries in this area`;

          el.addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.12)';
          });
          el.addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)';
          });
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            const expansionZoom = sc.getClusterExpansionZoom(clusterId);
            map.flyTo({
              center: [lng, lat],
              zoom: Math.min(expansionZoom, 15),
              duration: 900,
            });
          });

          const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat([lng, lat])
            .addTo(map);

          markersRef.current.push(marker);
        } else {
          // Individual destination pin
          const placeId = (feature.properties as PlacePointProperties).placeId;
          const place = placeMap.get(placeId);
          if (!place) return;

          const isGem = place.type === 'hidden-gem';
          const isSelected = selPlace?.id === place.id;
          const color = getCategoryColor(place.category);

          const el = document.createElement('div');
          el.className = 'ha-map-marker';
          el.style.cssText = `
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            will-change: transform;
            ${isSelected ? 'transform: scale(1.2); z-index: 10;' : ''}
          `;
          el.innerHTML = createMarkerSvg(color, isGem, isSelected);
          el.title = `${place.name} (${place.location})`;

          el.addEventListener('mouseenter', () => {
            if (!isSelected) el.style.transform = 'scale(1.15)';
          });
          el.addEventListener('mouseleave', () => {
            if (!isSelected) el.style.transform = 'scale(1)';
          });
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            onMarkerClick(place);
          });

          const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat([lng, lat])
            .addTo(map);

          markersRef.current.push(marker);
        }
      });
    }, [clearMarkers, onMarkerClick]);

    // ─── Expose imperative handle ──────────────────────────────────────────

    useImperativeHandle(ref, () => ({
      flyTo(lng: number, lat: number, zoom = 13, pitch = is3DModeRef.current ? 55 : 0) {
        mapRef.current?.flyTo({
          center: [lng, lat],
          zoom,
          pitch,
          duration: 1600,
        });
      },
      resetView() {
        mapRef.current?.flyTo({
          center: DEFAULT_MAP_CENTER,
          zoom: DEFAULT_MAP_ZOOM,
          pitch: is3DModeRef.current ? DEFAULT_MAP_PITCH : 0,
          bearing: DEFAULT_MAP_BEARING,
          duration: 1200,
        });
      },
      fitBounds(ps: Place[]) {
        const coords = ps.filter((p) => p.coordinates !== undefined);
        if (coords.length === 0) return;
        if (coords.length === 1 && coords[0].coordinates) {
          mapRef.current?.flyTo({
            center: [coords[0].coordinates.longitude, coords[0].coordinates.latitude],
            zoom: 11,
            pitch: is3DModeRef.current ? 50 : 0,
            duration: 1200,
          });
          return;
        }
        const lngs = coords.map((p) => p.coordinates!.longitude);
        const lats = coords.map((p) => p.coordinates!.latitude);
        mapRef.current?.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ],
          {
            padding: 80,
            duration: 1200,
            maxZoom: 12,
            pitch: is3DModeRef.current ? 35 : 0,
          }
        );
      },
      toggle3D(enable3D: boolean) {
        is3DModeRef.current = enable3D;
        mapRef.current?.easeTo({
          pitch: enable3D ? DEFAULT_MAP_PITCH : 0,
          duration: 800,
        });
      },
    }));

    // ─── Map initialisation ───────────────────────────────────────────────

    useEffect(() => {
      if (!containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: DEFAULT_MAP_CENTER,
        zoom: DEFAULT_MAP_ZOOM,
        pitch: is3DModeRef.current ? DEFAULT_MAP_PITCH : 0,
        bearing: DEFAULT_MAP_BEARING,
        attributionControl: false,
      });

      mapRef.current = map;

      // Navigation controls (zoom + compass tilt)
      map.addControl(
        new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
        'bottom-right'
      );

      // Attribution
      map.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        'bottom-left'
      );

      // Deselect when clicking blank canvas
      map.on('click', () => {
        onMapClick?.();
      });

      // Update clustered markers on camera movement & render
      map.on('move', () => {
        updateMarkers();
      });
      map.on('moveend', () => {
        updateMarkers();
      });
      map.on('zoom', () => {
        updateMarkers();
      });
      map.on('idle', () => {
        updateMarkers();
      });

      // Log map events in dev mode without canceling active tile loading
      map.on('error', (e) => {
        if (import.meta.env.DEV) {
          console.debug('[HiddenAtlas Map Event]:', e.error?.message ?? e);
        }
      });

      map.on('load', () => {
        // Trigger resize calculation to guarantee canvas fills container
        map.resize();

        // 3D Terrain: MapTiler Outdoor v2 already includes 'terrain-rgb' in its style.json
        if (TERRAIN_SOURCE_URL) {
          try {
            if (map.getSource('terrain-rgb')) {
              map.setTerrain({ source: 'terrain-rgb', exaggeration: 1.4 });
            } else if (!map.getSource('terrain-source')) {
              map.addSource('terrain-source', {
                type: 'raster-dem',
                url: TERRAIN_SOURCE_URL,
              });
              map.setTerrain({ source: 'terrain-source', exaggeration: 1.4 });
            }
          } catch (terrainErr) {
            console.warn('[HiddenAtlas] 3D terrain setup:', terrainErr);
          }
        }

        buildClusterIndex(placesRef.current);
        updateMarkers();
      });

      // Resize observer to ensure WebGL canvas continuously responds to DOM changes
      const ro = new ResizeObserver(() => {
        map.resize();
      });
      ro.observe(containerRef.current);

      // Multiple resize ticks to cover animation frame delays
      const t1 = setTimeout(() => map.resize(), 100);
      const t2 = setTimeout(() => map.resize(), 400);

      return () => {
        ro.disconnect();
        clearTimeout(t1);
        clearTimeout(t2);
        clearMarkers();
        map.remove();
        mapRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Re-index and re-render when places change ─────────────────────────

    useEffect(() => {
      buildClusterIndex(places);
      updateMarkers();
    }, [places, buildClusterIndex, updateMarkers]);

    // ─── Re-render when selectedPlace changes ─────────────────────────────

    useEffect(() => {
      updateMarkers();
    }, [selectedPlace, updateMarkers]);

    return (
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#1E293B',
        }}
        aria-label="Shared 3D Geographic World Map"
        role="application"
      />
    );
  }
);

WorldMap.displayName = 'WorldMap';
