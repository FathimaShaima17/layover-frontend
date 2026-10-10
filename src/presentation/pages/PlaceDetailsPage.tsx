import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Bookmark,
  Heart,
  Share2,
  Navigation,
  Clock,
  Calendar,
  Compass,
  ShieldAlert,
  Sparkles,
  Tag,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { Place } from '../../domain/entities/Place';
import { usePlaces } from '../context/PlacesContext';
import { useSavedPlaces } from '../context/SavedPlacesContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { StarRating } from '../components/common/StarRating';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';
import { PlaceCard } from '../components/places/PlaceCard';
import { ShareModal } from '../components/common/ShareModal';
import { CommunityJournal } from '../components/places/CommunityJournal';
import {
  getDirectionsUrl,
  getCategoryMeta,
  formatDate,
} from '../../shared/utils/formatters';
import { formatCoordinates, isValidCoordinates } from '../../domain/value-objects/Coordinates';

export const PlaceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlaceById, places, isLoading: contextLoading } = usePlaces();
  const { isSaved, toggleSave } = useSavedPlaces();
  const { showToast } = useToast();

  const [place, setPlace] = useState<Place | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPlace() {
      if (!id) return;
      setIsLoading(true);
      const found = await getPlaceById(id);
      if (isMounted) {
        setPlace(found);
        setSelectedImageIndex(0);
        setIsLoading(false);
      }
    }
    loadPlace();
    return () => {
      isMounted = false;
    };
  }, [id, getPlaceById]);

  if (isLoading || contextLoading) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div style={{ height: '400px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-xl)' }} />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
          Destination Not Found
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          The destination you are looking for does not exist or may have been removed.
        </p>
        <Button variant="primary" onClick={() => navigate('/explore')}>
          Back to Explore
        </Button>
      </div>
    );
  }

  const saved = isSaved(place.id);
  const categoryMeta = getCategoryMeta(place.category);
  const directionsUrl = getDirectionsUrl(place.coordinates);
  const hasValidCoords = place.coordinates && isValidCoordinates(place.coordinates.latitude, place.coordinates.longitude);

  // Similar destinations in same category
  const similarPlaces = places
    .filter((p) => p.category === place.category && p.id !== place.id)
    .slice(0, 3);

  const handleShare = () => {
    setIsShareModalOpen(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Destination link copied to clipboard.', 'success');
    }
  };

  const images = place.images && place.images.length > 0
    ? place.images
    : ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div style={{ paddingTop: '1.5rem', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Explore Atlas', path: '/explore' },
            { label: categoryMeta.label, path: `/explore?category=${place.category}` },
            { label: place.name },
          ]}
        />

        {/* Header Title & Actions Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <Badge type={place.type} />
              <Badge status={place.status} />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: categoryMeta.bgLight,
                  color: categoryMeta.accentColor,
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {categoryMeta.label}
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: '0.65rem',
              }}
            >
              {place.name}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                flexWrap: 'wrap',
                fontSize: '0.9375rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={16} color="var(--color-secondary)" />
                <span style={{ fontWeight: 500 }}>{place.location}</span>
              </div>
              <StarRating rating={place.rating} reviewsCount={place.reviewsCount} size={16} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                Discovered {formatDate(place.createdAt)}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant={saved ? 'terracotta' : 'outline'}
              icon={saved ? <Heart size={16} fill="#FFFFFF" /> : <Bookmark size={16} />}
              onClick={() => toggleSave(place)}
            >
              {saved ? 'Saved in Atlas' : 'Save Place'}
            </Button>

            <Button
              variant="secondary"
              icon={<Share2 size={16} />}
              onClick={handleShare}
            >
              Share
            </Button>

            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Button
                  variant="primary"
                  icon={<Navigation size={16} />}
                >
                  Get Directions
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Photo Gallery & Showcase */}
        <div style={{ marginBottom: '3rem' }}>
          {/* Main Large Cover Display */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 'clamp(320px, 45vw, 540px)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--bg-surface-subtle)',
            }}
          >
            <img
              src={images[selectedImageIndex]}
              alt={`${place.name} photograph`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'opacity 0.2s ease',
              }}
            />
          </div>

          {/* Thumbnails row if more than 1 image */}
          {images.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '1rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
              }}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: '100px',
                    height: '68px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: `2px solid ${selectedImageIndex === idx ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    opacity: selectedImageIndex === idx ? 1 : 0.75,
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                    padding: 0,
                  }}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Layout: 2 Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 360px',
            gap: '3rem',
            alignItems: 'start',
          }}
          className="details-layout"
        >
          {/* Left Column: Editorial Overview & Story */}
          <div>
            {/* Overview Section */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.65rem',
                  color: 'var(--color-primary)',
                  marginBottom: '1rem',
                }}
              >
                About this Destination
              </h2>
              <p
                style={{
                  fontSize: '1.0625rem',
                  lineHeight: 1.75,
                  color: 'var(--color-text-primary)',
                }}
              >
                {place.description}
              </p>
            </section>

            {/* Local Story & History Box */}
            {place.story && (
              <section
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  border: '1px solid var(--color-border)',
                  borderLeft: '4px solid var(--color-primary-light)',
                  marginBottom: '2.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--color-primary)',
                    marginBottom: '0.75rem',
                  }}
                >
                  <Sparkles size={16} />
                  <span>Local Lore & Heritage</span>
                </div>
                <blockquote
                  style={{
                    fontStyle: 'italic',
                    fontSize: '1.025rem',
                    lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}
                >
                  "{place.story}"
                </blockquote>
                {place.submittedBy && (
                  <div
                    style={{
                      marginTop: '1rem',
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-muted)',
                      textAlign: 'right',
                    }}
                  >
                    — Chronicled by {place.submittedBy}
                  </div>
                )}
              </section>
            )}

            {/* Trail / Route Description */}
            {place.routeDescription && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.4rem',
                    color: 'var(--color-primary)',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Compass size={20} />
                  <span>Route & Access Instructions</span>
                </h3>
                <p
                  style={{
                    fontSize: '0.975rem',
                    lineHeight: 1.65,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {place.routeDescription}
                </p>
              </section>
            )}

            {/* Tags Section */}
            <section style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <Tag size={16} color="var(--color-primary)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  Tags & Highlights
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {place.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/explore?q=${tag}`}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--color-border)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      transition: 'border-color var(--transition-fast)',
                    }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Visitor Essentials & Geographic Details */}
          <aside
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.3rem',
                color: 'var(--color-primary)',
                margin: 0,
                borderBottom: '1px solid var(--color-border-subtle)',
                paddingBottom: '0.75rem',
              }}
            >
              Visitor Essentials
            </h3>

            {/* Best Time to Visit */}
            {place.bestTimeToVisit && (
              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <Calendar size={20} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                    Best Time to Visit
                  </div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {place.bestTimeToVisit}
                  </div>
                </div>
              </div>
            )}

            {/* Estimated Duration */}
            {place.estimatedDuration && (
              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <Clock size={20} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                    Suggested Duration
                  </div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {place.estimatedDuration}
                  </div>
                </div>
              </div>
            )}

            {/* Accessibility and Terrain */}
            {place.accessibility && (
              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <ShieldAlert size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                    Terrain & Accessibility
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {place.accessibility}
                  </div>
                </div>
              </div>
            )}

            {/* Coordinates Box */}
            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                Verified Geographic Coordinates
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                {formatCoordinates(place.coordinates)}
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {hasValidCoords && (
                  <Link
                    to={`/explore/world?q=${encodeURIComponent(place.name)}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      backgroundColor: 'var(--color-primary-subtle)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                    }}
                    title="Locate this place on the shared 3D geographic canvas"
                  >
                    <Globe size={13} />
                    <span>View in 3D World</span>
                  </Link>
                )}

                {hasValidCoords && directionsUrl ? (
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--color-primary-light)',
                      textDecoration: 'none',
                    }}
                  >
                    <span>External Maps</span>
                    <ExternalLink size={13} />
                  </a>
                ) : null}
              </div>
            </div>

            {/* Nearby Landmarks if available */}
            {place.nearbyLandmarks && place.nearbyLandmarks.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                  Nearby Landmarks
                </div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {place.nearbyLandmarks.map((lm, idx) => (
                    <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ color: 'var(--color-primary-light)' }}>•</span>
                      <span>{lm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safety & Stewardship Reminder */}
            <div
              style={{
                paddingTop: '1rem',
                borderTop: '1px solid var(--color-border-subtle)',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.5,
              }}
            >
              🌿 <strong>Leave No Trace:</strong> Stay on marked footpaths, carry out all waste, and respect local residents and wildlife habitats.
            </div>
          </aside>
        </div>

        {/* Community Photo Journal: "Seen Through Your Eyes" */}
        <CommunityJournal placeId={place.id} placeName={place.name} />

        {/* Similar Destinations Section */}
        {similarPlaces.length > 0 && (
          <section style={{ marginTop: '5rem', paddingTop: '3.5rem', borderTop: '1px solid var(--color-border)' }}>
            <div className="section-header">
              <div className="section-eyebrow">
                <Compass size={14} />
                <span>Related Discoveries</span>
              </div>
              <h2 className="section-title">Similar Destinations in {categoryMeta.label}</h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}
            >
              {similarPlaces.map((simPlace) => (
                <PlaceCard key={simPlace.id} place={simPlace} />
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .details-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Share Modal */}
      {place && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          place={place}
        />
      )}
    </div>
  );
};
