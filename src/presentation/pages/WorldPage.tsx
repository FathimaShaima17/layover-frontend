import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  LayoutGrid,
  Route,
  Compass,
  AlertCircle,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import { Place, PlaceCategory, PlaceType } from '../../domain/entities/Place';
import { usePlaces } from '../context/PlacesContext';
import { useToast } from '../context/ToastContext';
import { WorldMap, MapHandle } from '../components/world/WorldMap';
import { WorldControls } from '../components/world/WorldControls';
import { PlacePreviewPanel } from '../components/world/PlacePreviewPanel';
import { DiscoveryTrailPanel } from '../components/world/DiscoveryTrailPanel';

export const WorldPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { places, isLoading, error, refreshPlaces } = usePlaces();
  const { showToast } = useToast();

  const mapRef = useRef<MapHandle>(null);

  // Read initial filter values from URL search params
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = (searchParams.get('category') as PlaceCategory) || 'all';
  const initialType = (searchParams.get('type') as PlaceType) || 'all';

  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>(initialCategory);
  const [selectedType, setSelectedType] = useState<PlaceType | 'all'>(initialType);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Discovery Trail builder state
  const [trailStops, setTrailStops] = useState<Place[]>([]);
  const [isTrailPanelOpen, setIsTrailPanelOpen] = useState<boolean>(false);

  // Sync state if URL changes externally
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const catParam = (searchParams.get('category') as PlaceCategory) || 'all';
    const typeParam = (searchParams.get('type') as PlaceType) || 'all';

    setSearchQuery(qParam);
    setSelectedCategory(catParam);
    setSelectedType(typeParam);
  }, [searchParams]);

  // Update URL params
  const updateParams = (
    newQuery: string,
    newCat: PlaceCategory | 'all',
    newType: PlaceType | 'all'
  ) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newCat !== 'all') params.set('category', newCat);
    if (newType !== 'all') params.set('type', newType);
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    updateParams(q, selectedCategory, selectedType);
  };

  const handleCategoryChange = (cat: PlaceCategory | 'all') => {
    setSelectedCategory(cat);
    updateParams(searchQuery, cat, selectedType);
  };

  const handleTypeChange = (type: PlaceType | 'all') => {
    setSelectedType(type);
    updateParams(searchQuery, selectedCategory, type);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' || selectedCategory !== 'all' || selectedType !== 'all';

  // Filter approved places with valid coordinates
  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      // Must have valid coordinates to render in geographic world
      if (!p.coordinates) return false;

      // Filter by type
      if (selectedType !== 'all' && p.type !== selectedType) return false;

      // Filter by category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesLoc = p.location.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesLoc && !matchesDesc && !matchesTags) return false;
      }

      return true;
    });
  }, [places, searchQuery, selectedCategory, selectedType]);

  // Auto-fit bounds on initial destination load
  const hasAutoFitted = useRef(false);
  useEffect(() => {
    if (filteredPlaces.length > 0 && !hasAutoFitted.current) {
      hasAutoFitted.current = true;
      const timer = setTimeout(() => {
        mapRef.current?.fitBounds(filteredPlaces);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [filteredPlaces]);

  // Marker click handler
  const handleMarkerClick = useCallback((place: Place) => {
    setSelectedPlace(place);
    if (place.coordinates && mapRef.current) {
      mapRef.current.flyTo(
        place.coordinates.longitude,
        place.coordinates.latitude,
        13,
        55
      );
    }
  }, []);

  // Map blank canvas click
  const handleMapClick = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  // Reset view
  const handleResetView = () => {
    setSelectedPlace(null);
    mapRef.current?.resetView();
  };

  // Fit bounds to all matching places
  const handleFitBounds = () => {
    if (filteredPlaces.length > 0) {
      mapRef.current?.fitBounds(filteredPlaces);
    } else {
      showToast('No destinations match current filters to fit bounds.', 'info');
    }
  };

  // Toggle 3D perspective
  const handleToggle3D = () => {
    const nextMode = !is3DMode;
    setIs3DMode(nextMode);
    mapRef.current?.toggle3D(nextMode);
    showToast(nextMode ? '3D Perspective Enabled (60° Tilt)' : '2D Top-down View Enabled', 'info');
  };

  // Browser Geolocation
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { longitude, latitude } = pos.coords;
        mapRef.current?.flyTo(longitude, latitude, 12, is3DMode ? 55 : 0);
        showToast('Flew to your geographic location.', 'success');
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          showToast('Location permission denied. Please enable in your browser.', 'warning');
        } else {
          showToast('Unable to retrieve location: ' + err.message, 'error');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Discovery Trail management
  const handleToggleTrail = (place: Place) => {
    setTrailStops((prev) => {
      const exists = prev.some((p) => p.id === place.id);
      if (exists) {
        showToast(`Removed "${place.name}" from your discovery trail.`, 'info');
        return prev.filter((p) => p.id !== place.id);
      } else {
        showToast(`Added "${place.name}" to your discovery trail!`, 'success');
        setIsTrailPanelOpen(true);
        return [...prev, place];
      }
    });
  };

  const handleRemoveTrailStop = (placeId: string) => {
    setTrailStops((prev) => prev.filter((p) => p.id !== placeId));
  };

  const handleClearTrail = () => {
    setTrailStops([]);
    setIsTrailPanelOpen(false);
    showToast('Discovery trail cleared.', 'info');
  };

  const handleSelectTrailStop = (place: Place) => {
    setSelectedPlace(place);
    if (place.coordinates) {
      mapRef.current?.flyTo(place.coordinates.longitude, place.coordinates.latitude, 14, 55);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        flex: 1,
        minHeight: '500px',
        overflow: 'hidden',
        backgroundColor: '#0F172A',
      }}
    >
      {/* Top right HUD navigation bar */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          zIndex: 20,
        }}
      >
        {/* Switch to Catalog Grid */}
        <Link
          to={`/explore?${searchParams.toString()}`}
          title="Switch to 2D Catalog Grid View"
          className="btn btn-secondary btn-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
            textDecoration: 'none',
          }}
        >
          <LayoutGrid size={15} />
          <span>Catalog View</span>
        </Link>

        {/* Trail toggle button */}
        {trailStops.length > 0 && (
          <button
            type="button"
            onClick={() => setIsTrailPanelOpen((v) => !v)}
            title="Open Discovery Trail Planner"
            className="btn btn-primary btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 16px rgba(45, 106, 79, 0.35)',
            }}
          >
            <Route size={15} />
            <span>Trail ({trailStops.length})</span>
          </button>
        )}

        {/* Share a place CTA */}
        <Link
          to="/add"
          className="btn btn-primary btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
            textDecoration: 'none',
          }}
        >
          <PlusCircle size={15} />
          <span>Contribute</span>
        </Link>
      </div>

      {/* Main 3D World Map canvas */}
      <WorldMap
        ref={mapRef}
        places={filteredPlaces}
        selectedPlace={selectedPlace}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
        is3DMode={is3DMode}
      />

      {/* Exploration HUD Controls (top-left) */}
      <WorldControls
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        matchCount={filteredPlaces.length}
        totalCount={places.length}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        onResetView={handleResetView}
        onFitBounds={handleFitBounds}
        onLocateUser={handleLocateUser}
        isLocating={isLocating}
        is3DMode={is3DMode}
        onToggle3D={handleToggle3D}
      />

      {/* Selected Destination Preview Card (bottom-left) */}
      {selectedPlace && (
        <PlacePreviewPanel
          place={selectedPlace}
          allPlaces={places}
          onClose={() => setSelectedPlace(null)}
          onNearbySelect={handleMarkerClick}
          isInTrail={trailStops.some((p) => p.id === selectedPlace.id)}
          onToggleTrail={handleToggleTrail}
          onOpenTrailPlanner={() => setIsTrailPanelOpen(true)}
          trailCount={trailStops.length}
        />
      )}

      {/* Discovery Trail Panel (top-right drawer) */}
      <DiscoveryTrailPanel
        trailStops={trailStops}
        onRemoveStop={handleRemoveTrailStop}
        onClearTrail={handleClearTrail}
        onSelectStop={handleSelectTrailStop}
        isOpen={isTrailPanelOpen}
        onClose={() => setIsTrailPanelOpen(false)}
      />

      {/* Loading overlay */}
      {isLoading && places.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            color: '#FFFFFF',
            zIndex: 40,
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              borderTopColor: '#52B788',
              animation: 'spin 1s linear infinite',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Entering 3D Geographic World…
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.25rem 0 0' }}>
              Projecting community discoveries to real coordinates
            </p>
          </div>
        </div>
      )}

      {/* Error notification banner */}
      {error && (
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1.5rem',
            backgroundColor: 'rgba(185, 28, 28, 0.95)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.8125rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            zIndex: 30,
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
          <button
            type="button"
            onClick={refreshPlaces}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              padding: '3px 8px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      )}

      {/* Bottom status badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '0.75rem',
          right: '5rem',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          borderRadius: 'var(--radius-full)',
          padding: '0.3rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.7rem',
          color: '#E2E8F0',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <Compass size={12} style={{ color: '#52B788' }} />
        <span>Shared Real-World Coordinates</span>
      </div>
    </div>
  );
};
