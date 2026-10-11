import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, MapPin, ExternalLink, ChevronLeft, ChevronRight, Star, Tag, Navigation } from 'lucide-react';
import { Place } from '../../../domain/entities/Place';
import { LatLng, haversineKm, formatDistance } from '../../../shared/utils/geo';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

const CATEGORY_LABELS: Record<string, string> = {
  nature: 'Nature',
  beaches: 'Beach',
  mountains: 'Mountain',
  history: 'Historical Site',
  food: 'Local Food',
  culture: 'Culture',
  'hidden-gems': 'Hidden Gem',
  attractions: 'Attraction',
};

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

const CATEGORY_BG: Record<string, string> = {
  nature: '#D8F3DC',
  beaches: '#E0F2FE',
  mountains: '#F1F5F9',
  history: '#FEF3C7',
  food: '#FFEDD5',
  culture: '#FEF9C3',
  'hidden-gems': '#D1FAE5',
  attractions: '#FEE2E2',
};

interface WorldInfoPanelProps {
  place: Place;
  onClose: () => void;
  activeLocation?: LatLng;
}

export const WorldInfoPanel: React.FC<WorldInfoPanelProps> = ({ place, onClose, activeLocation }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const images = place.images.length > 0 ? place.images : [FALLBACK_IMAGE];
  const catColor = CATEGORY_COLORS[place.category] ?? '#2D6A4F';
  const catBg = CATEGORY_BG[place.category] ?? '#D8F3DC';
  const catLabel = CATEGORY_LABELS[place.category] ?? 'Place';

  const prevImg = () => setImgIndex((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIndex((i) => (i + 1) % images.length);

  const distance =
    activeLocation && place.coordinates
      ? haversineKm(activeLocation, place.coordinates)
      : null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '1.5rem',
        width: 'min(360px, calc(100vw - 3rem))',
        backgroundColor: '#FFFFFF',
        borderRadius: '3px',
        padding: '13px 13px 16px 13px',
        border: '1px solid rgba(221, 212, 192, 0.75)',
        boxShadow: '0 16px 48px rgba(41, 43, 37, 0.28), 0 4px 14px rgba(41, 43, 37, 0.12)',
        zIndex: 30,
        animation: 'slideUpFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="tape-top-center"
    >
      {/* Polaroid Photographic Print Viewport */}
      <div style={{ position: 'relative', height: '185px', backgroundColor: '#1C2B22', overflow: 'hidden', borderRadius: '1px' }}>
        <img
          src={images[imgIndex]}
          alt={place.name}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Subtle vignette gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)',
        }} />

        {/* Photo nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImg}
              style={{
                position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImg}
              style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF',
              }}
            >
              <ChevronRight size={16} />
            </button>
            <div style={{
              position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '4px',
            }}>
              {images.map((_, i) => (
                <div key={i} style={{
                  width: i === imgIndex ? '14px' : '6px', height: '6px', borderRadius: '3px',
                  backgroundColor: i === imgIndex ? '#FFF' : 'rgba(255,255,255,0.45)',
                  transition: 'width 0.2s',
                }} />
              ))}
            </div>
          </>
        )}

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: '8px', left: '8px',
          backgroundColor: catBg, color: catColor,
          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
          textTransform: 'uppercase', padding: '3px 9px',
          borderRadius: '999px', border: `1px solid ${catColor}33`,
          fontFamily: 'var(--font-nesiota)',
        }}>
          {catLabel}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF',
          }}
          title="Close panel"
        >
          <X size={15} />
        </button>
      </div>

      {/* Polaroid Chin: Handwritten Caption */}
      <div style={{ padding: '0.75rem 0.25rem 0.35rem', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-handwritten)',
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'var(--color-forest)',
          lineHeight: 1.25,
          letterSpacing: '0.01em',
        }}>
          "{place.name}"
        </div>
      </div>

      {/* Explorer Field Details Content */}
      <div style={{ padding: '0.25rem 0.25rem 0' }}>
        {/* Location + Distance */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          fontSize: '0.775rem', color: '#6B5740',
          marginBottom: '0.4rem',
          fontFamily: 'var(--font-nesiota)',
        }}>
          <MapPin size={12} color="#92400E" />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.location}</span>
          {place.rating && (
            <span style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '3px',
              color: '#9A6518', fontWeight: 700, flexShrink: 0,
            }}>
              <Star size={11} fill="#F59E0B" color="#F59E0B" />
              {place.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Distance from current location */}
        {distance !== null && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            fontSize: '0.73rem',
            color: distance < 2 ? '#16A34A' : distance < 10 ? '#B45309' : '#6B7280',
            fontWeight: 600,
            marginBottom: '0.6rem',
            fontFamily: 'var(--font-nesiota)',
          }}>
            <Navigation size={11} />
            <span>📏 {formatDistance(distance)} (straight-line)</span>
            {place.coordinates && (
              <span style={{ marginLeft: 'auto', fontSize: '0.62rem', color: '#9CA3AF', fontWeight: 400 }}>
                {place.coordinates.latitude.toFixed(4)}, {place.coordinates.longitude.toFixed(4)}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p style={{
          fontSize: '0.82rem',
          color: '#4A4035',
          lineHeight: 1.6,
          marginBottom: '0.85rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          fontFamily: 'var(--font-sans)',
        }}>
          {place.description}
        </p>

        {/* Tags */}
        {place.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '0.85rem' }}>
            {place.tags.slice(0, 4).map((tag) => (
              <span key={tag} style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                fontSize: '0.68rem', fontWeight: 600,
                backgroundColor: 'var(--color-parchment-warm)',
                color: 'var(--color-earth)',
                padding: '2px 8px', borderRadius: '999px',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-nesiota)',
              }}>
                <Tag size={9} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <Link
          to={`/place/${place.id}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            width: '100%', padding: '0.62rem 1rem',
            backgroundColor: catColor, color: '#FFFFFF',
            borderRadius: '10px', textDecoration: 'none',
            fontSize: '0.82rem', fontWeight: 700,
            fontFamily: 'var(--font-nesiota)',
            transition: 'filter 0.15s',
            boxShadow: `0 2px 8px ${catColor}44`,
          }}
        >
          <ExternalLink size={13} />
          View Full Discovery
        </Link>
      </div>

      <style>{`
        @keyframes slideUpFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
