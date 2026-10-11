import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  PlusCircle,
  List,
  ChevronRight,
  X,
  RotateCcw,
  Sparkles,
  Search,
  LayoutGrid,
  MapPin,
  Navigation,
  Radio,
  Sliders,
  AlertCircle,
  Info,
} from 'lucide-react';
import { Place } from '../../../domain/entities/Place';
import { LatLng, haversineKm, formatDistance } from '../../../shared/utils/geo';
import type { LocationMode } from '../../../shared/hooks/useGeoLocation';

const CATEGORY_COLORS: Record<string, string> = {
  nature: '#2D6A4F',
  beaches: '#0284C7',
  mountains: '#6B7280',
  history: '#92400E',
  food: '#C86D51',
  culture: '#B45309',
  'hidden-gems': '#1B4332',
  attractions: '#DC2626',
};

const CATEGORY_ICONS: Record<string, string> = {
  nature: '🌿',
  beaches: '🏖',
  mountains: '⛰',
  history: '🏛',
  food: '🍲',
  culture: '🎭',
  'hidden-gems': '💎',
  attractions: '🗺',
};

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  nature: 'Nature',
  beaches: 'Beach',
  mountains: 'Mountain',
  history: 'Heritage',
  food: 'Food',
  culture: 'Culture',
  'hidden-gems': 'Hidden Gem',
  attractions: 'Attraction',
};

const RADIUS_OPTIONS = [1, 5, 10, 25, 50, 100];

interface WorldSidebarProps {
  places: Place[];
  nearbyPlaces: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onResetView: () => void;
  onLoadDemo: () => void;
  demoLoaded: boolean;
  isEmptyMode?: boolean;
  onClearToEmpty?: () => void;
  onRestoreAll?: () => void;
  activeLocation: LatLng;
  locationMode: LocationMode;
  locationRequesting: boolean;
  locationError: string | null;
  onRequestDeviceLocation: () => void;
  onResetToDemo: () => void;
  nearbyRadiusKm: number;
  onNearbyRadiusChange: (km: number) => void;
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLocalSubmit?: (place: Place) => void;
}

export const WorldSidebar: React.FC<WorldSidebarProps> = ({
  places,
  nearbyPlaces,
  selectedPlace,
  onSelectPlace,
  onResetView,
  onLoadDemo,
  demoLoaded,
  isEmptyMode = false,
  onClearToEmpty,
  onRestoreAll,
  activeLocation,
  locationMode,
  locationRequesting,
  locationError,
  onRequestDeviceLocation,
  onResetToDemo,
  nearbyRadiusKm,
  onNearbyRadiusChange,
  categoryFilter,
  onCategoryFilterChange,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showAllPlaces, setShowAllPlaces] = useState(false);

  const approvedPlaces = places.filter((p) => p.status === 'approved');

  // Apply category + search filter
  const filteredNearby = useMemo(() => {
    let list = nearbyPlaces;
    if (categoryFilter !== 'all') {
      list = list.filter((p) => p.category === categoryFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    // Sort by distance
    return list.slice().sort((a, b) => {
      const da = a.coordinates ? haversineKm(activeLocation, a.coordinates) : Infinity;
      const db = b.coordinates ? haversineKm(activeLocation, b.coordinates) : Infinity;
      return da - db;
    });
  }, [nearbyPlaces, categoryFilter, query, activeLocation]);

  // All approved for "show all" mode
  const filteredAll = useMemo(() => {
    let list = approvedPlaces;
    if (categoryFilter !== 'all') {
      list = list.filter((p) => p.category === categoryFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    // Sort all places by distance from active location
    return list.slice().sort((a, b) => {
      const da = a.coordinates ? haversineKm(activeLocation, a.coordinates) : Infinity;
      const db = b.coordinates ? haversineKm(activeLocation, b.coordinates) : Infinity;
      return da - db;
    });
  }, [approvedPlaces, categoryFilter, query, activeLocation]);

  const displayList = showAllPlaces ? filteredAll : filteredNearby;

  const locationLabel =
    locationMode === 'device'
      ? `${activeLocation.latitude.toFixed(4)}, ${activeLocation.longitude.toFixed(4)}`
      : 'Kozhikode Beach, Kerala';

  return (
    <>
      {/* ── Top-right HUD bar ─────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.55rem',
          zIndex: 25,
        }}
      >
        {/* Row 1: navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Link
            to="/explore"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              backgroundColor: 'rgba(250, 247, 240, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(197, 178, 140, 0.55)',
              borderRadius: '10px',
              fontSize: '0.78rem', fontWeight: 700,
              color: 'var(--color-forest)',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(41,43,37,0.12)',
              fontFamily: 'var(--font-nesiota)',
            }}
          >
            <LayoutGrid size={14} />
            Back to Explore
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              backgroundColor: open ? 'rgba(45,106,79,0.15)' : 'rgba(250, 247, 240, 0.95)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${open ? 'rgba(45,106,79,0.5)' : 'rgba(197, 178, 140, 0.55)'}`,
              borderRadius: '10px',
              fontSize: '0.78rem', fontWeight: 700,
              color: open ? 'var(--color-forest)' : 'var(--color-charcoal)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(41,43,37,0.12)',
              fontFamily: 'var(--font-nesiota)',
            }}
          >
            <List size={14} />
            <span>
              {nearbyPlaces.length === 0
                ? '0 nearby'
                : `${nearbyPlaces.length} nearby`}
            </span>
          </button>

          <Link
            to="/add"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              backgroundColor: 'var(--color-forest)',
              border: '1px solid var(--color-forest-dark)',
              borderRadius: '10px',
              fontSize: '0.78rem', fontWeight: 700,
              color: '#FFFFFF',
              textDecoration: 'none',
              boxShadow: '0 3px 10px rgba(45,106,79,0.38)',
              fontFamily: 'var(--font-nesiota)',
            }}
          >
            <PlusCircle size={14} />
            Add a Place
          </Link>
        </div>

        {/* Row 2: utility controls */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            onClick={onResetView}
            title="Reset camera view"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.38rem 0.7rem',
              backgroundColor: 'rgba(250, 247, 240, 0.88)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(197, 178, 140, 0.45)',
              borderRadius: '8px',
              fontSize: '0.72rem', fontWeight: 600,
              color: 'var(--color-charcoal-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-nesiota)',
            }}
          >
            <RotateCcw size={12} />
            Reset View
          </button>

          {isEmptyMode ? (
            <button
              onClick={onRestoreAll}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.38rem 0.7rem',
                backgroundColor: 'rgba(216, 243, 220, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(45, 106, 79, 0.4)',
                borderRadius: '8px',
                fontSize: '0.72rem', fontWeight: 600,
                color: 'var(--color-forest)',
                cursor: 'pointer',
                fontFamily: 'var(--font-nesiota)',
              }}
            >
              <Globe size={12} />
              Restore All Places
            </button>
          ) : (
            <button
              onClick={onClearToEmpty}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.38rem 0.7rem',
                backgroundColor: 'rgba(250, 247, 240, 0.88)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(197, 178, 140, 0.45)',
                borderRadius: '8px',
                fontSize: '0.72rem', fontWeight: 600,
                color: 'var(--color-charcoal-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-nesiota)',
              }}
            >
              <RotateCcw size={12} />
              Start Empty World
            </button>
          )}

          {!demoLoaded && (
            <button
              onClick={onLoadDemo}
              title="Load Kozhikode sample demo places"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.38rem 0.7rem',
                backgroundColor: 'rgba(252, 243, 220, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(234, 179, 8, 0.4)',
                borderRadius: '8px',
                fontSize: '0.72rem', fontWeight: 600,
                color: '#92400E',
                cursor: 'pointer',
                fontFamily: 'var(--font-nesiota)',
              }}
            >
              <Sparkles size={12} />
              Load Kozhikode Demo
            </button>
          )}
        </div>
      </div>

      {/* ── Nearby panel ──────────────────────────────────────────── */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            marginTop: '5.5rem',
            width: 'min(340px, calc(100vw - 2rem))',
            maxHeight: 'calc(100vh - 9rem)',
            backgroundColor: 'rgba(250, 247, 240, 0.97)',
            backdropFilter: 'blur(18px)',
            borderRadius: '14px',
            border: '1px solid rgba(197, 178, 140, 0.5)',
            boxShadow: '0 12px 36px rgba(41,43,37,0.18)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 24,
            animation: 'fadeSlideIn 0.22s ease',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '0.9rem 1rem 0.7rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Globe size={15} color="var(--color-forest)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest)', fontFamily: 'var(--font-nesiota)' }}>
                {showAllPlaces ? 'All Discoveries' : `Nearby (${nearbyRadiusKm} km)`}
              </span>
            </div>
            <button onClick={() => setOpen(false)} style={{ padding: '2px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-charcoal-light)' }}>
              <X size={15} />
            </button>
          </div>

          {/* Location pill */}
          <div style={{
            padding: '0.5rem 0.9rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.7rem',
            color: locationMode === 'device' ? '#1D4ED8' : '#92400E',
            backgroundColor: locationMode === 'device' ? '#EFF6FF' : '#FFFBEB',
          }}>
            <Navigation size={11} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-nesiota)' }}>
              {locationMode === 'device' ? '📱 Device GPS: ' : '🗺 Demo: '}
              {locationLabel}
            </span>
            {locationMode === 'demo' ? (
              <button
                onClick={onRequestDeviceLocation}
                disabled={locationRequesting}
                style={{
                  flexShrink: 0,
                  fontSize: '0.62rem', fontWeight: 700,
                  color: '#1D4ED8', border: '1px solid #BFDBFE',
                  backgroundColor: '#EFF6FF', borderRadius: '6px',
                  padding: '2px 6px', cursor: 'pointer',
                  fontFamily: 'var(--font-nesiota)',
                }}
              >
                {locationRequesting ? '…' : 'Use My Location'}
              </button>
            ) : (
              <button
                onClick={onResetToDemo}
                style={{
                  flexShrink: 0,
                  fontSize: '0.62rem', fontWeight: 700,
                  color: '#92400E', border: '1px solid #FDE68A',
                  backgroundColor: '#FFFBEB', borderRadius: '6px',
                  padding: '2px 6px', cursor: 'pointer',
                  fontFamily: 'var(--font-nesiota)',
                }}
              >
                Use Demo
              </button>
            )}
          </div>

          {locationError && (
            <div style={{
              padding: '0.45rem 0.9rem',
              backgroundColor: '#FFFBEB',
              borderBottom: '1px solid #FDE68A',
              fontSize: '0.68rem',
              color: '#78350F',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.35rem',
              fontFamily: 'var(--font-sans)',
            }}>
              <AlertCircle size={11} style={{ flexShrink: 0, marginTop: '2px' }} />
              {locationError}
            </div>
          )}

          {/* Radius + Category controls */}
          <div style={{ padding: '0.6rem 0.9rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
            {/* Radius slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sliders size={11} color="var(--color-charcoal-light)" />
              <span style={{ fontSize: '0.7rem', color: 'var(--color-charcoal-light)', fontFamily: 'var(--font-nesiota)', whiteSpace: 'nowrap' }}>
                Radius:
              </span>
              <div style={{ display: 'flex', gap: '3px', flex: 1, flexWrap: 'wrap' }}>
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => onNearbyRadiusChange(r)}
                    style={{
                      padding: '2px 7px',
                      borderRadius: '6px',
                      border: `1px solid ${nearbyRadiusKm === r ? 'var(--color-forest)' : 'var(--color-border)'}`,
                      backgroundColor: nearbyRadiusKm === r ? '#D8F3DC' : 'transparent',
                      color: nearbyRadiusKm === r ? 'var(--color-forest)' : 'var(--color-charcoal-light)',
                      fontSize: '0.65rem',
                      fontWeight: nearbyRadiusKm === r ? 700 : 500,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-nesiota)',
                    }}
                  >
                    {r < 1000 ? `${r}km` : '100km'}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
              {(['all', 'nature', 'beaches', 'mountains', 'history', 'food', 'culture', 'hidden-gems', 'attractions'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryFilterChange(cat)}
                  style={{
                    padding: '2px 7px',
                    borderRadius: '6px',
                    border: `1px solid ${categoryFilter === cat ? (CATEGORY_COLORS[cat] ?? 'var(--color-forest)') : 'var(--color-border)'}`,
                    backgroundColor: categoryFilter === cat ? `${CATEGORY_COLORS[cat] ?? '#2D6A4F'}18` : 'transparent',
                    color: categoryFilter === cat ? (CATEGORY_COLORS[cat] ?? 'var(--color-forest)') : 'var(--color-charcoal-light)',
                    fontSize: '0.62rem',
                    fontWeight: categoryFilter === cat ? 700 : 500,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-nesiota)',
                  }}
                >
                  {cat === 'all' ? '🌍 All' : `${CATEGORY_ICONS[cat] ?? ''} ${CATEGORY_LABELS[cat] ?? cat}`}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div style={{ padding: '0.6rem 0.9rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-charcoal-light)' }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search places…"
                style={{
                  width: '100%', padding: '0.42rem 0.7rem 0.42rem 1.9rem',
                  borderRadius: '8px', border: '1px solid var(--color-border)',
                  backgroundColor: '#FFF', fontSize: '0.78rem',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-nesiota)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Toggle nearby / all */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <button
              onClick={() => setShowAllPlaces(false)}
              style={{
                flex: 1, padding: '0.45rem',
                fontSize: '0.72rem', fontWeight: showAllPlaces ? 500 : 700,
                color: showAllPlaces ? 'var(--color-charcoal-light)' : 'var(--color-forest)',
                borderBottom: showAllPlaces ? 'none' : '2px solid var(--color-forest)',
                backgroundColor: 'transparent', border: 'none',
                cursor: 'pointer', fontFamily: 'var(--font-nesiota)',
              }}
            >
              Nearby ({nearbyPlaces.length})
            </button>
            <button
              onClick={() => setShowAllPlaces(true)}
              style={{
                flex: 1, padding: '0.45rem',
                fontSize: '0.72rem', fontWeight: showAllPlaces ? 700 : 500,
                color: showAllPlaces ? 'var(--color-forest)' : 'var(--color-charcoal-light)',
                borderBottom: showAllPlaces ? '2px solid var(--color-forest)' : 'none',
                backgroundColor: 'transparent', border: 'none',
                cursor: 'pointer', fontFamily: 'var(--font-nesiota)',
              }}
            >
              All ({approvedPlaces.length})
            </button>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {displayList.length === 0 ? (
              <div style={{
                padding: '1.5rem 1rem', textAlign: 'center',
                color: 'var(--color-charcoal-light)', fontSize: '0.78rem',
                fontFamily: 'var(--font-sans)',
              }}>
                <Info size={28} style={{ margin: '0 auto 0.6rem', display: 'block', opacity: 0.4 }} />
                {showAllPlaces
                  ? 'No places match your filters.'
                  : `No places found within ${nearbyRadiusKm} km. Try increasing the radius or loading the Kozhikode demo.`}
              </div>
            ) : (
              displayList.map((place) => {
                const isSelected = selectedPlace?.id === place.id;
                const color = CATEGORY_COLORS[place.category] ?? '#2D6A4F';
                const icon = CATEGORY_ICONS[place.category] ?? '📍';
                const dist = place.coordinates
                  ? haversineKm(activeLocation, place.coordinates)
                  : null;

                return (
                  <button
                    key={place.id}
                    onClick={() => { onSelectPlace(place); setOpen(false); }}
                    style={{
                      width: '100%', padding: '0.65rem 1rem',
                      display: 'flex', alignItems: 'center', gap: '0.65rem',
                      textAlign: 'left', border: 'none',
                      backgroundColor: isSelected ? `${color}14` : 'transparent',
                      borderLeft: isSelected ? `3px solid ${color}` : '3px solid transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.8rem', fontWeight: 700,
                        color: isSelected ? color : 'var(--color-charcoal)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        fontFamily: 'var(--font-serif)',
                      }}>
                        {place.name}
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                        fontSize: '0.68rem', color: 'var(--color-charcoal-light)',
                        marginTop: '2px',
                        fontFamily: 'var(--font-nesiota)',
                      }}>
                        <MapPin size={10} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {place.location}
                        </span>
                      </div>
                      {dist !== null && (
                        <div style={{
                          fontSize: '0.65rem',
                          color: dist < 2 ? '#16A34A' : dist < 10 ? '#B45309' : 'var(--color-charcoal-light)',
                          fontWeight: 600,
                          marginTop: '1px',
                          fontFamily: 'var(--font-nesiota)',
                        }}>
                          📏 {formatDistance(dist)} (straight-line)
                        </div>
                      )}
                    </div>
                    <ChevronRight size={13} color={isSelected ? color : 'var(--color-charcoal-light)'} />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div style={{
            padding: '0.5rem 0.9rem',
            borderTop: '1px solid var(--color-border-subtle)',
            fontSize: '0.62rem',
            color: 'var(--color-charcoal-light)',
            fontFamily: 'var(--font-sans)',
            lineHeight: 1.4,
          }}>
            ℹ️ Distances are approximate straight-line distances, not walking or driving distances.
            {locationMode === 'demo' && ' Demo location: Kozhikode Beach, Kerala.'}
          </div>
        </div>
      )}

      {/* ── Bottom status pill ─────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: 'rgba(28, 43, 34, 0.72)',
          backdropFilter: 'blur(8px)',
          borderRadius: '999px',
          padding: '0.3rem 0.75rem',
          fontSize: '0.7rem',
          color: '#D8F3DC',
          zIndex: 15,
          pointerEvents: 'none',
          fontFamily: 'var(--font-nesiota)',
        }}
      >
        <Globe size={11} color="#52B788" />
        <span>
          {approvedPlaces.length === 0
            ? 'World awaiting its first discovery'
            : `${approvedPlaces.length} ${approvedPlaces.length === 1 ? 'discovery' : 'discoveries'} · ${nearbyPlaces.length} nearby`}
        </span>
      </div>

      {/* ── Location mode pill (bottom-left) ──────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: locationMode === 'device' ? 'rgba(29, 78, 216, 0.75)' : 'rgba(146, 64, 14, 0.72)',
          backdropFilter: 'blur(8px)',
          borderRadius: '999px',
          padding: '0.3rem 0.75rem',
          fontSize: '0.7rem',
          color: '#FFFFFF',
          zIndex: 15,
          pointerEvents: 'none',
          fontFamily: 'var(--font-nesiota)',
        }}
      >
        <Radio size={11} />
        <span>
          {locationMode === 'device' ? '📱 Device GPS active' : '🗺 Demo: Kozhikode Beach'}
        </span>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};
