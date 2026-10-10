import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  MapPin,
  ExternalLink,
  Navigation,
  Star,
  ChevronRight,
  Layers,
  Bookmark,
  Route,
  Check,
  Compass,
} from 'lucide-react';
import { Place } from '../../../domain/entities/Place';
import { formatCoordinates } from '../../../domain/value-objects/Coordinates';
import { CATEGORIES } from '../../../shared/constants/categories';
import { getNearbyPlacesUseCase } from '../../../application/use-cases/GetNearbyPlaces';
import { useSavedPlaces } from '../../context/SavedPlacesContext';

interface PlacePreviewPanelProps {
  place: Place;
  allPlaces: Place[];
  onClose: () => void;
  onNearbySelect: (place: Place) => void;
  isInTrail?: boolean;
  onToggleTrail?: (place: Place) => void;
  onOpenTrailPlanner?: () => void;
  trailCount?: number;
}

function getCategoryLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  nature: '🌿',
  beaches: '🏖️',
  mountains: '🏔️',
  history: '🏛️',
  food: '🍽️',
  culture: '🎭',
  'hidden-gems': '💎',
  attractions: '⭐',
};

export const PlacePreviewPanel: React.FC<PlacePreviewPanelProps> = ({
  place,
  allPlaces,
  onClose,
  onNearbySelect,
  isInTrail = false,
  onToggleTrail,
  onOpenTrailPlanner,
  trailCount = 0,
}) => {
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedPlaces();
  const [showNearby, setShowNearby] = useState(false);
  const [nearbyRadiusKm, setNearbyRadiusKm] = useState<number>(50);

  const saved = isSaved(place.id);

  const nearbyResults = useMemo(
    () => getNearbyPlacesUseCase.executeWithDistance(place, allPlaces, nearbyRadiusKm),
    [place, allPlaces, nearbyRadiusKm]
  );

  const directionsUrl = place.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.latitude},${place.coordinates.longitude}`
    : null;

  const coverImage = place.images?.[0];

  return (
    <article
      aria-label={`Preview card for ${place.name}`}
      style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '1.5rem',
        width: 'min(420px, calc(100vw - 3rem))',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 48px rgba(15, 23, 42, 0.22)',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        overflow: 'hidden',
        zIndex: 20,
        maxHeight: 'calc(100vh - 6rem)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUpFade 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Cover Image & Quick Badges */}
      {coverImage ? (
        <div style={{ position: 'relative', height: '175px', flexShrink: 0 }}>
          <img
            src={coverImage}
            alt={place.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.1) 60%, transparent 100%)',
            }}
          />

          {/* Badges on image */}
          <div
            style={{
              position: 'absolute',
              bottom: '0.8rem',
              left: '0.85rem',
              display: 'flex',
              gap: '0.4rem',
              flexWrap: 'wrap',
            }}
          >
            <span
              className={place.type === 'hidden-gem' ? 'badge badge-gem' : 'badge badge-famous'}
              style={{ fontSize: '0.72rem', fontWeight: 700 }}
            >
              {place.type === 'hidden-gem' ? '✨ Hidden Gem' : '⭐ Famous Landmark'}
            </span>
            <span
              className="badge"
              style={{
                fontSize: '0.72rem',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {CATEGORY_EMOJIS[place.category] ?? '📍'} {getCategoryLabel(place.category)}
            </span>
          </div>

          {/* Top actions: Save & Close */}
          <div
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              display: 'flex',
              gap: '0.4rem',
            }}
          >
            <button
              type="button"
              onClick={() => toggleSave(place)}
              aria-label={saved ? 'Remove from saved places' : 'Save place'}
              title={saved ? 'Saved in your favorites' : 'Save to favorites'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                color: saved ? '#E76F51' : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.15s ease',
              }}
            >
              <Bookmark size={15} fill={saved ? '#E76F51' : 'none'} />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close destination preview"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.15s ease',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.15rem',
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          }}
        >
          <span
            className={place.type === 'hidden-gem' ? 'badge badge-gem' : 'badge badge-famous'}
            style={{ fontSize: '0.72rem' }}
          >
            {place.type === 'hidden-gem' ? '✨ Hidden Gem' : '⭐ Famous Landmark'}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close destination preview"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Body content */}
      <div
        style={{
          padding: '1rem 1.15rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}
      >
        {/* Name */}
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.18rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {place.name}
        </h3>

        {/* Location & GPS coordinates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              fontWeight: 500,
            }}
          >
            <MapPin size={13} style={{ color: 'var(--color-primary-light)', flexShrink: 0 }} />
            <span>{place.location}</span>
          </div>

          {place.coordinates && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                color: 'var(--color-text-muted)',
                fontFamily: 'monospace',
              }}
            >
              <Compass size={12} style={{ flexShrink: 0 }} />
              <span>{formatCoordinates(place.coordinates)}</span>
            </div>
          )}
        </div>

        {/* Rating & reviews */}
        {place.rating !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Star size={14} fill="#D97706" color="#D97706" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#92400E' }}>
              {place.rating.toFixed(1)}
            </span>
            {place.reviewsCount && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                ({place.reviewsCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Short description */}
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {place.description}
        </p>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/place/${place.id}`)}
            style={{ flex: 1, minWidth: '120px' }}
          >
            <span>Full Story</span>
            <ChevronRight size={14} />
          </button>

          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                textDecoration: 'none',
              }}
              title="Navigate with Google Maps"
            >
              <Navigation size={13} />
              Directions
            </a>
          )}

          {onToggleTrail && (
            <button
              type="button"
              className={isInTrail ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
              onClick={() => onToggleTrail(place)}
              title={isInTrail ? 'Remove from discovery trail' : 'Add to discovery trail'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              {isInTrail ? <Check size={13} /> : <Route size={13} />}
              {isInTrail ? 'In Trail' : 'Add Trail'}
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowNearby((v) => !v)}
            title="Discover places nearby using Haversine calculation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: showNearby ? 'var(--color-primary-subtle)' : undefined,
              borderColor: showNearby ? 'var(--color-primary-light)' : undefined,
            }}
          >
            <Layers size={13} />
            Nearby
          </button>
        </div>

        {/* Trail status shortcut */}
        {trailCount > 0 && onOpenTrailPlanner && (
          <button
            type="button"
            onClick={onOpenTrailPlanner}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.45rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(232, 245, 233, 0.8)',
              border: '1px solid #B7E4C7',
              color: '#1B4332',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Route size={13} />
              <span>Current Discovery Trail: {trailCount} stops</span>
            </div>
            <span>View Trail →</span>
          </button>
        )}

        {/* Nearby Discoveries Section */}
        {showNearby && (
          <div
            style={{
              marginTop: '0.4rem',
              paddingTop: '0.65rem',
              borderTop: '1px solid rgba(226, 232, 240, 0.8)',
            }}
          >
            {/* Radius selector */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Nearby Discoveries ({nearbyResults.length})
              </span>

              <div style={{ display: 'flex', gap: '0.2rem' }}>
                {[25, 50, 100].map((rad) => (
                  <button
                    key={rad}
                    type="button"
                    onClick={() => setNearbyRadiusKm(rad)}
                    style={{
                      border: 'none',
                      backgroundColor:
                        nearbyRadiusKm === rad
                          ? 'var(--color-primary)'
                          : 'rgba(241, 245, 249, 0.8)',
                      color: nearbyRadiusKm === rad ? '#FFFFFF' : 'var(--color-text-secondary)',
                      borderRadius: 'var(--radius-full)',
                      padding: '2px 6px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {rad}km
                  </button>
                ))}
              </div>
            </div>

            {/* Places list with exact distance */}
            {nearbyResults.length === 0 ? (
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  fontStyle: 'italic',
                  margin: '0.4rem 0',
                }}
              >
                No other community discoveries within {nearbyRadiusKm} km yet. Be the first to share one!
              </p>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  maxHeight: '180px',
                  overflowY: 'auto',
                }}
              >
                {nearbyResults.map(({ place: np, distanceKm }) => (
                  <button
                    key={np.id}
                    type="button"
                    onClick={() => onNearbySelect(np)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.45rem 0.55rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(226, 232, 240, 0.7)',
                      backgroundColor: 'rgba(248, 250, 252, 0.7)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'var(--color-primary-subtle)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'rgba(248, 250, 252, 0.7)')
                    }
                  >
                    {np.images?.[0] ? (
                      <img
                        src={np.images[0]}
                        alt={np.name}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-sm)',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-primary-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '1rem',
                        }}
                      >
                        {CATEGORY_EMOJIS[np.category] ?? '📍'}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: 'var(--color-primary)',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {np.name}
                      </p>
                      <p
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--color-text-muted)',
                          margin: 0,
                        }}
                      >
                        <strong style={{ color: 'var(--color-primary-light)' }}>
                          {distanceKm} km
                        </strong>{' '}
                        away · {np.type === 'hidden-gem' ? '✨ Gem' : '⭐ Landmark'}
                      </p>
                    </div>
                    <ExternalLink
                      size={13}
                      style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
