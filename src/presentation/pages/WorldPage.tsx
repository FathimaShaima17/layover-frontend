import React, { useState, useCallback, Suspense, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, PlusCircle, Loader } from 'lucide-react';
import { Place } from '../../domain/entities/Place';
import { usePlaces } from '../context/PlacesContext';
import { WorldScene } from '../components/world/WorldScene';
import { WorldInfoPanel } from '../components/world/WorldInfoPanel';
import { WorldSidebar } from '../components/world/WorldSidebar';
import { useGeoLocation } from '../../shared/hooks/useGeoLocation';
import { haversineKm } from '../../shared/utils/geo';

// ─── Kozhikode Beach Demo Places ─────────────────────────────────────────────
// Fictional sample destinations near Kozhikode Beach, Kerala, India.
// All coordinates are plausible but these places are demo data only.

export const KOZHIKODE_DEMO_PLACES: Place[] = [
  {
    id: 'kzd-01',
    name: 'Kappad Beach',
    description:
      'A historic beach where Vasco da Gama landed in 1498, flanked by ancient laterite rocks and golden sand. Local fishing boats still dot the shoreline at dawn.',
    category: 'beaches',
    type: 'hidden-gem',
    location: 'Kappad, Kozhikode, Kerala',
    coordinates: { latitude: 11.3086, longitude: 75.7246 },
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['historic-beach', 'vasco-da-gama', 'fishing', 'kozhikode'],
    status: 'approved',
    createdAt: new Date().toISOString(),
    rating: 4.6,
    reviewsCount: 31,
  },
  {
    id: 'kzd-02',
    name: 'Thusharagiri Waterfalls',
    description:
      'Three-tiered waterfalls cascading through dense forest in the Wayanad foothills. Misty gorges, trekking paths, and emerald pools await at each level.',
    category: 'nature',
    type: 'hidden-gem',
    location: 'Thusharagiri, Kozhikode District',
    coordinates: { latitude: 11.4012, longitude: 75.9425 },
    images: [
      'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['waterfall', 'forest-trek', 'three-tier', 'kozhikode'],
    status: 'approved',
    createdAt: new Date().toISOString(),
    rating: 4.8,
    reviewsCount: 47,
  },
  {
    id: 'kzd-03',
    name: 'Payyoli Beach Viewpoint',
    description:
      'A quiet crescent of golden sand north of Kozhikode where Olive Ridley turtles nest every winter. The view of the Arabian Sea at sunset is unmatched.',
    category: 'beaches',
    type: 'hidden-gem',
    location: 'Payyoli, Kozhikode District',
    coordinates: { latitude: 11.5221, longitude: 75.6407 },
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['turtle-nesting', 'quiet-beach', 'sunset', 'kozhikode'],
    status: 'approved',
    createdAt: new Date().toISOString(),
    rating: 4.5,
    reviewsCount: 22,
  },
  {
    id: 'kzd-04',
    name: 'Kadalundi Bird Sanctuary',
    description:
      'A cluster of tiny islands at the Kadalundi River estuary. Over 70 migratory bird species arrive here from Siberia and Europe between November and March.',
    category: 'nature',
    type: 'hidden-gem',
    location: 'Kadalundi, Kozhikode District',
    coordinates: { latitude: 11.1356, longitude: 75.8282 },
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['bird-sanctuary', 'migratory-birds', 'estuary', 'kozhikode'],
    status: 'approved',
    createdAt: new Date().toISOString(),
    rating: 4.7,
    reviewsCount: 39,
  },
  {
    id: 'kzd-05',
    name: 'Tali Shiva Temple',
    description:
      'A 14th-century temple built by the Zamorins of Calicut, featuring Kerala-style wooden carvings and a serene pond inside stone-walled courtyards.',
    category: 'history',
    type: 'hidden-gem',
    location: 'Tali, Kozhikode City',
    coordinates: { latitude: 11.2530, longitude: 75.7707 },
    images: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['temple', 'zamorin', 'ancient', 'kozhikode'],
    status: 'approved',
    createdAt: new Date().toISOString(),
    rating: 4.7,
    reviewsCount: 28,
  },
  {
    id: 'kzd-06',
    name: 'Sweet Meat Street (S.M. Street)',
    description:
      'The legendary Mittayi Theruvu of old Calicut – 300 metres of halwa shops, spice traders, and old-fashioned Kerala bakeries. The scent of ghee and cardamom fills the air.',
    category: 'food',
    type: 'hidden-gem',
    location: 'S.M. Street, Kozhikode City',
    coordinates: { latitude: 11.2525, longitude: 75.7757 },
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['street-food', 'halwa', 'spice-market', 'kozhikode'],
    status: 'approved',
    createdAt: new Date().toISOString(),
    rating: 4.9,
    reviewsCount: 83,
  },
];

// ─── Empty world overlay ──────────────────────────────────────────────────────

const EmptyWorldOverlay: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -60%)',
      textAlign: 'center',
      zIndex: 20,
      pointerEvents: 'none',
      userSelect: 'none',
    }}
  >
    <div
      style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'rgba(45, 106, 79, 0.18)',
        backdropFilter: 'blur(4px)',
        border: '1.5px solid rgba(82, 183, 136, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.2rem',
      }}
    >
      <Globe size={28} color="#52B788" />
    </div>
    <h2
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
        fontWeight: 700,
        color: '#FFFFFF',
        textShadow: '0 2px 12px rgba(0,0,0,0.4)',
        marginBottom: '0.5rem',
        lineHeight: 1.2,
      }}
    >
      Your world starts here.
    </h2>
    <p
      style={{
        fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
        color: 'rgba(255,255,255,0.82)',
        textShadow: '0 1px 6px rgba(0,0,0,0.4)',
        maxWidth: '340px',
        lineHeight: 1.6,
        marginBottom: '1.5rem',
        fontFamily: 'var(--font-sans)',
      }}
    >
      Discover the places people add to HiddenAtlas.<br />
      Every contribution becomes part of this shared world.
    </p>
    <div style={{ pointerEvents: 'auto' }}>
      <Link
        to="/add"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.7rem 1.5rem',
          backgroundColor: 'var(--color-forest)',
          color: '#FFFFFF',
          borderRadius: '12px',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontWeight: 700,
          fontFamily: 'var(--font-nesiota)',
          boxShadow: '0 4px 18px rgba(45,106,79,0.45)',
          border: '1px solid var(--color-forest-dark)',
        }}
      >
        <PlusCircle size={16} />
        Add a Place
      </Link>
    </div>
  </div>
);

// ─── Loading overlay ──────────────────────────────────────────────────────────

const LoadingOverlay: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: '#1C2B22',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      zIndex: 50,
      color: '#FFFFFF',
    }}
  >
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.15)',
        borderTopColor: '#52B788',
        animation: 'worldSpin 1s linear infinite',
      }}
    />
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700 }}>
        Entering 3D World…
      </div>
      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.3rem', fontFamily: 'var(--font-nesiota)' }}>
        Building the landscape
      </div>
    </div>
    <style>{`
      @keyframes worldSpin { to { transform: rotate(360deg); } }
    `}</style>
  </div>
);

// ─── WebGL check ─────────────────────────────────────────────────────────────

function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

// ─── WorldPage ────────────────────────────────────────────────────────────────

export const WorldPage: React.FC = () => {
  const { places, isLoading } = usePlaces();
  const location = useGeoLocation();

  const routerLocation = useLocation();
  const routeState = routerLocation.state as { selectedPlaceId?: string } | undefined;

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [extraPlaces, setExtraPlaces] = useState<Place[]>([]);
  const [demoLoaded, setDemoLoaded] = useState(false);
  const [emptyMode, setEmptyMode] = useState(false);
  const [nearbyRadiusKm, setNearbyRadiusKm] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Merge context places with any locally-added extra places and default Kozhikode demo destinations
  const allPlaces = useMemo(() => {
    if (emptyMode) return [];
    const base = places.length > 0 ? places : KOZHIKODE_DEMO_PLACES;
    const baseIds = new Set(base.map((p) => p.id));
    const withKozhikode = [
      ...base,
      ...KOZHIKODE_DEMO_PLACES.filter(
        (p) => !baseIds.has(p.id) && !base.some((b) => b.name.toLowerCase() === p.name.toLowerCase())
      ),
    ];
    // De-duplicate by id; extra places (newly submitted) take priority
    const extraIds = new Set(extraPlaces.map((p) => p.id));
    return [...extraPlaces, ...withKozhikode.filter((p) => !extraIds.has(p.id))];
  }, [emptyMode, places, extraPlaces]);

  const approvedPlaces = useMemo(
    () => allPlaces.filter((p) => p.status === 'approved'),
    [allPlaces]
  );

  // Places within radius of active location
  const nearbyPlaces = useMemo(() => {
    return approvedPlaces.filter((p) => {
      if (!p.coordinates) return false;
      const dist = haversineKm(location.coords, p.coordinates);
      return dist <= nearbyRadiusKm;
    });
  }, [approvedPlaces, location.coords, nearbyRadiusKm]);

  // When navigated to with a specific submitted place, focus and open its info panel
  useEffect(() => {
    if (routeState?.selectedPlaceId && approvedPlaces.length > 0) {
      const found = approvedPlaces.find((p) => p.id === routeState.selectedPlaceId);
      if (found) {
        setSelectedPlace(found);
      }
    }
  }, [routeState?.selectedPlaceId, approvedPlaces]);

  const handleSelectPlace = useCallback((place: Place | null) => {
    setSelectedPlace(place);
  }, []);

  const handleResetView = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  const handleLoadDemo = useCallback(() => {
    setExtraPlaces(KOZHIKODE_DEMO_PLACES);
    setDemoLoaded(true);
  }, []);

  const handleClearToEmpty = useCallback(() => {
    setEmptyMode(true);
    setExtraPlaces([]);
    setDemoLoaded(false);
    setSelectedPlace(null);
  }, []);

  const handleRestoreAll = useCallback(() => {
    setEmptyMode(false);
    setSelectedPlace(null);
  }, []);

  // When a new place is submitted via the form it is added to context;
  // we also inject it into extraPlaces so it shows immediately in the world.
  // The PlacesContext already pushes it to `places`, but status is 'pending'.
  // For demo purposes, auto-approve locally-submitted places so they appear in 3D.
  const handleLocalSubmit = useCallback((place: Place) => {
    setExtraPlaces((prev) => {
      if (prev.some((p) => p.id === place.id)) return prev;
      return [{ ...place, status: 'approved' }, ...prev];
    });
  }, []);

  // Check WebGL
  if (!isWebGLSupported()) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-app)',
        }}
      >
        <Globe size={48} color="var(--color-charcoal-light)" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '0.75rem' }}>
          WebGL Not Available
        </h2>
        <p style={{ maxWidth: '440px', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
          The 3D World requires WebGL support. Please use a modern browser like Chrome, Firefox, or
          Edge, and ensure hardware acceleration is enabled.
        </p>
        <Link to="/explore" className="btn btn-primary" style={{ marginTop: '1.5rem', textDecoration: 'none' }}>
          Explore 2D Catalog Instead
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        flex: 1,
        minHeight: '500px',
        overflow: 'hidden',
        backgroundColor: '#1C2B22',
      }}
    >
      {/* 3D Canvas */}
      <Suspense fallback={<LoadingOverlay />}>
        <WorldScene
          places={allPlaces}
          selectedPlace={selectedPlace}
          onPlaceSelect={handleSelectPlace}
          activeLocation={location.coords}
          locationMode={location.mode}
        />
      </Suspense>

      {/* Empty world overlay (only shown when no approved places) */}
      {!isLoading && approvedPlaces.length === 0 && <EmptyWorldOverlay />}

      {/* Place info panel */}
      {selectedPlace && (
        <WorldInfoPanel
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          activeLocation={location.coords}
        />
      )}

      {/* Sidebar: controls + place list */}
      <WorldSidebar
        places={allPlaces}
        nearbyPlaces={nearbyPlaces}
        selectedPlace={selectedPlace}
        onSelectPlace={handleSelectPlace}
        onResetView={handleResetView}
        onLoadDemo={handleLoadDemo}
        demoLoaded={demoLoaded}
        isEmptyMode={emptyMode}
        onClearToEmpty={handleClearToEmpty}
        onRestoreAll={handleRestoreAll}
        activeLocation={location.coords}
        locationMode={location.mode}
        locationRequesting={location.requesting}
        locationError={location.error}
        onRequestDeviceLocation={location.requestDeviceLocation}
        onResetToDemo={location.resetToDemo}
        nearbyRadiusKm={nearbyRadiusKm}
        onNearbyRadiusChange={setNearbyRadiusKm}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        onLocalSubmit={handleLocalSubmit}
      />

      {/* Loading indicator while context fetches */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(28, 43, 34, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: '999px',
            padding: '0.35rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#D8F3DC',
            zIndex: 40,
            fontFamily: 'var(--font-nesiota)',
          }}
        >
          <Loader size={13} style={{ animation: 'worldSpin 1s linear infinite' }} />
          Loading discoveries…
        </div>
      )}
    </div>
  );
};
