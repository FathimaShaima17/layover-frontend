import React from 'react';
import {
  Route,
  X,
  Navigation,
  Trash2,
  MapPin,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Place } from '../../../domain/entities/Place';
import { calculateDiscoveryTrailUseCase } from '../../../application/use-cases/CalculateDiscoveryTrail';

interface DiscoveryTrailPanelProps {
  trailStops: Place[];
  onRemoveStop: (placeId: string) => void;
  onClearTrail: () => void;
  onSelectStop: (place: Place) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DiscoveryTrailPanel: React.FC<DiscoveryTrailPanelProps> = ({
  trailStops,
  onRemoveStop,
  onClearTrail,
  onSelectStop,
  isOpen,
  onClose,
}) => {
  if (!isOpen || trailStops.length === 0) return null;

  const trail = calculateDiscoveryTrailUseCase.execute(trailStops);

  return (
    <div
      aria-label="Discovery Trail Planner"
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        width: 'min(380px, calc(100vw - 2rem))',
        maxHeight: 'calc(100vh - 5rem)',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.22)',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 25,
        animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          backgroundColor: '#16281F',
          color: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(45, 106, 79, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D8F3DC',
            }}
          >
            <Route size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              Discovery Trail
            </h3>
            <p style={{ fontSize: '0.72rem', color: '#B0C2B8', margin: 0 }}>
              {trailStops.length} stop{trailStops.length !== 1 ? 's' : ''} ·{' '}
              <strong style={{ color: '#D8F3DC' }}>{trail.totalDistanceKm} km</strong> trail
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={onClearTrail}
            title="Clear all trail waypoints"
            style={{
              background: 'none',
              border: 'none',
              color: '#F87171',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Trash2 size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close trail planner"
            style={{
              background: 'none',
              border: 'none',
              color: '#E2E8F0',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Waypoints list */}
      <div
        style={{
          padding: '1rem 1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          maxHeight: '360px',
        }}
      >
        {trailStops.map((stop, index) => {
          const leg = trail.legs[index];
          return (
            <React.Fragment key={stop.id}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  backgroundColor: 'rgba(248, 250, 252, 0.7)',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Number badge */}
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>

                {/* Stop info */}
                <div
                  style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                  onClick={() => onSelectStop(stop)}
                  title="Fly to this waypoint"
                >
                  <p
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      margin: 0,
                      color: 'var(--color-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {stop.name}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.72rem',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <MapPin size={11} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {stop.location}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => onRemoveStop(stop.id)}
                  title="Remove from trail"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Leg connector distance indicator */}
              {leg && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    paddingLeft: '1.25rem',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      width: '2px',
                      height: '14px',
                      backgroundColor: 'var(--color-primary-light)',
                      borderRadius: '1px',
                    }}
                  />
                  <span>
                    ↓ <strong style={{ color: 'var(--color-primary)' }}>{leg.distanceKm} km</strong> direct
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Footer & Disclaimer */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
          backgroundColor: 'rgba(248, 250, 252, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.45rem',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.4,
          }}
        >
          <Info size={13} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-primary)' }} />
          <span>{trail.disclaimer}</span>
        </div>

        {trail.googleMapsUrl && (
          <a
            href={trail.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              textDecoration: 'none',
            }}
          >
            <Navigation size={15} />
            <span>Open Multi-Stop Route in Maps</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  );
};
