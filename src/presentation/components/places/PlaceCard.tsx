import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bookmark, Heart, Compass } from 'lucide-react';
import { Place } from '../../../domain/entities/Place';
import { Badge } from '../common/Badge';
import { StarRating } from '../common/StarRating';
import { useSavedPlaces } from '../../context/SavedPlacesContext';
import { getCategoryMeta, truncate } from '../../../shared/utils/formatters';

interface PlaceCardProps {
  place: Place;
  featured?: boolean;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, featured = false }) => {
  const { isSaved, toggleSave } = useSavedPlaces();
  const saved = isSaved(place.id);
  const categoryMeta = getCategoryMeta(place.category);
  const [imgError, setImgError] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
  const coverImage =
    !imgError && place.images && place.images.length > 0 ? place.images[0] : fallbackImage;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(place);
  };

  // Deterministic tape position so cards in a grid have authentic variety
  const tapeClass =
    place.id.charCodeAt(place.id.length - 1) % 3 === 0
      ? 'tape-top-left'
      : place.id.charCodeAt(place.id.length - 1) % 3 === 1
      ? 'tape-top-right'
      : 'tape-top-center';

  return (
    <article
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '3px',
        padding: '13px 13px 16px 13px',
        border: '1px solid rgba(221, 212, 192, 0.75)',
        boxShadow: '0 12px 32px rgba(45, 42, 35, 0.12), 0 2px 8px rgba(45, 42, 35, 0.06)',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
      className={`place-card ${tapeClass}`}
    >
      {/* Cover Image (Polaroid Photo Print) */}
      <Link
        to={`/place/${place.id}`}
        style={{
          position: 'relative',
          width: '100%',
          height: featured ? '260px' : '220px',
          overflow: 'hidden',
          backgroundColor: '#EDE8DE',
          display: 'block',
          borderRadius: '1px',
          boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.08)',
        }}
      >
        <img
          src={coverImage}
          alt={place.name}
          onError={() => setImgError(true)}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          className="place-card-img"
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '0.65rem',
            left: '0.65rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            zIndex: 2,
          }}
        >
          <Badge type={place.type} />
          {place.status === 'pending' && <Badge status="pending" />}
        </div>

        {/* Bookmark Action Button */}
        <button
          onClick={handleBookmarkClick}
          aria-label={saved ? `Remove ${place.name} from saved` : `Save ${place.name}`}
          style={{
            position: 'absolute',
            top: '0.65rem',
            right: '0.65rem',
            zIndex: 2,
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: saved ? 'var(--color-error)' : 'var(--color-forest)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid rgba(221, 212, 192, 0.6)',
            transition: 'transform 0.15s ease, background-color 0.15s ease',
          }}
          className="bookmark-btn"
        >
          {saved ? (
            <Heart size={16} fill="var(--color-error)" strokeWidth={0} />
          ) : (
            <Bookmark size={16} strokeWidth={2} />
          )}
        </button>

        {/* Category Tag Bottom Right */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.65rem',
            right: '0.65rem',
            zIndex: 2,
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(41, 43, 37, 0.82)',
            backdropFilter: 'blur(4px)',
            color: '#FFFFFF',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {categoryMeta.label}
        </div>
      </Link>

      {/* Polaroid Chin: Handwritten Caption from Reference Image */}
      <div
        style={{
          padding: '0.75rem 0.25rem 0.35rem',
          textAlign: 'center',
        }}
      >
        <Link
          to={`/place/${place.id}`}
          style={{
            fontFamily: 'var(--font-handwritten)',
            fontSize: '1.45rem',
            fontWeight: 600,
            lineHeight: 1.25,
            color: 'var(--color-forest)',
            display: 'inline-block',
            letterSpacing: '0.01em',
            transition: 'color var(--transition-fast)',
          }}
          className="place-title-link"
        >
          "{place.name}"
        </Link>
      </div>

      {/* Explorer Field Details underneath Chin */}
      <div
        style={{
          padding: '0.25rem 0.35rem 0.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Location & Rating Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '0.45rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--color-earth)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <MapPin size={14} style={{ flexShrink: 0, color: 'var(--color-earth)' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.location}</span>
          </div>

          <StarRating rating={place.rating} reviewsCount={place.reviewsCount} />
        </div>

        {/* Summary Description */}
        <p
          style={{
            fontSize: '0.85rem',
            lineHeight: 1.55,
            color: 'var(--color-charcoal-muted)',
            marginBottom: '0.85rem',
            flex: 1,
          }}
        >
          {truncate(place.description, 95)}
        </p>

        {/* Bottom Metadata & Tags */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.65rem',
            borderTop: '1px solid var(--color-border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--color-charcoal-light)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {place.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  backgroundColor: 'var(--color-parchment-warm)',
                  padding: '0.18rem 0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  color: 'var(--color-earth-dark)',
                  border: '1px solid var(--color-border)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {place.coordinates && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-earth)' }}>
              <Compass size={12} />
              <span>Verified Log</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .place-card:hover {
          transform: translateY(-5px) scale(1.015);
          box-shadow: 0 16px 38px rgba(45, 42, 35, 0.18), 0 4px 12px rgba(45, 42, 35, 0.08);
          border-color: rgba(45, 106, 79, 0.35);
          z-index: 5;
        }
        .place-card:hover .place-card-img {
          transform: scale(1.04);
        }
        .place-title-link:hover {
          color: var(--color-forest-dark);
        }
        .bookmark-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </article>
  );
};
