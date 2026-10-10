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

  return (
    <article
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
      className="place-card"
    >
      {/* Cover Image Container */}
      <Link
        to={`/place/${place.id}`}
        style={{
          position: 'relative',
          width: '100%',
          height: featured ? '260px' : '220px',
          overflow: 'hidden',
          backgroundColor: '#EDE8DE',
          display: 'block',
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
            top: '0.85rem',
            left: '0.85rem',
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
            top: '0.85rem',
            right: '0.85rem',
            zIndex: 2,
            width: '36px',
            height: '36px',
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
            <Heart size={18} fill="var(--color-error)" strokeWidth={0} />
          ) : (
            <Bookmark size={18} strokeWidth={2} />
          )}
        </button>

        {/* Category Tag Bottom Right */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            zIndex: 2,
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.25rem 0.6rem',
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

      {/* Card Content */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          backgroundColor: '#FFFFFF',
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

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.3,
            color: 'var(--color-forest)',
            marginBottom: '0.5rem',
          }}
        >
          <Link
            to={`/place/${place.id}`}
            style={{
              color: 'inherit',
              transition: 'color var(--transition-fast)',
            }}
            className="place-title-link"
          >
            {place.name}
          </Link>
        </h3>

        {/* Summary Description */}
        <p
          style={{
            fontSize: '0.875rem',
            lineHeight: 1.6,
            color: 'var(--color-charcoal-muted)',
            marginBottom: '1rem',
            flex: 1,
          }}
        >
          {truncate(place.description, 110)}
        </p>

        {/* Bottom Metadata & Tags */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
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
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
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
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-forest-light);
        }
        .place-card:hover .place-card-img {
          transform: scale(1.05);
        }
        .place-title-link:hover {
          color: var(--color-forest-light);
        }
        .bookmark-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </article>
  );
};
