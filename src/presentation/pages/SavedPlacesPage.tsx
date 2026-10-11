import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Search, Sparkles, X } from 'lucide-react';
import { useSavedPlaces } from '../context/SavedPlacesContext';
import { PlaceCard } from '../components/places/PlaceCard';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';
import { Button } from '../components/common/Button';

export const SavedPlacesPage: React.FC = () => {
  const { savedPlaces, savedCount, isLoading } = useSavedPlaces();
  const [filterQuery, setFilterQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'hidden-gem' | 'famous-attraction'>('all');

  const filteredSaved = useMemo(() => {
    let result = [...savedPlaces];
    if (typeFilter !== 'all') {
      result = result.filter((p) => p.type === typeFilter);
    }
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [savedPlaces, filterQuery, typeFilter]);

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Saved Places' }]} />

        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <div className="section-eyebrow">
              <Bookmark size={14} />
              <span>Personal Collection</span>
            </div>
            <h1 className="section-title">My Saved Destinations</h1>
            <p className="section-subtitle">
              Your handpicked atlas of secret spots and iconic landmarks, preserved locally in your browser.
            </p>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            <Bookmark size={16} />
            <span>{savedCount} Bookmarked Place{savedCount === 1 ? '' : 's'}</span>
          </div>
        </div>

        {/* If user has no bookmarks at all */}
        {savedCount === 0 && !isLoading ? (
          <div
            className="form-polaroid tape-top-center"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '3px',
              border: '1px solid rgba(221, 212, 192, 0.75)',
              padding: '4rem 2rem 3rem',
              textAlign: 'center',
              maxWidth: '560px',
              margin: '3rem auto',
              boxShadow: '0 16px 44px rgba(45, 42, 35, 0.12), 0 3px 10px rgba(45, 42, 35, 0.06)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <Bookmark size={36} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                color: 'var(--color-primary)',
                marginBottom: '0.75rem',
              }}
            >
              Your Atlas is Empty
            </h2>
            <div style={{ fontFamily: 'var(--font-handwritten)', fontSize: '1.45rem', color: 'var(--color-forest)', marginBottom: '1rem' }}>
              "No secret coordinates pinned yet"
            </div>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                marginBottom: '2rem',
              }}
            >
              You haven't bookmarked any hidden gems or landmarks yet. Browse our catalog and click the bookmark button on any destination to save it here.
            </p>
            <Link to="/explore">
              <Button variant="primary" size="lg" icon={<Sparkles size={18} />}>
                Start Exploring Now
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Filter Bar within Saved Places */}
            <div
              className="form-polaroid tape-top-left"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '3px',
                border: '1px solid rgba(221, 212, 192, 0.75)',
                padding: '1.75rem 1.5rem 1.5rem',
                boxShadow: '0 10px 28px rgba(45, 42, 35, 0.1), 0 2px 6px rgba(45, 42, 35, 0.05)',
                marginBottom: '2.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              {/* Search input */}
              <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '420px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Filter saved destinations..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 2rem 0.65rem 2.3rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--bg-app)',
                    fontSize: '0.875rem',
                  }}
                />
                {filterQuery && (
                  <button
                    onClick={() => setFilterQuery('')}
                    style={{
                      position: 'absolute',
                      right: '0.65rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Type Filter */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={() => setTypeFilter('all')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    backgroundColor: typeFilter === 'all' ? 'var(--color-primary)' : 'var(--bg-app)',
                    color: typeFilter === 'all' ? '#FFFFFF' : 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  All ({savedPlaces.length})
                </button>
                <button
                  onClick={() => setTypeFilter('hidden-gem')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    backgroundColor: typeFilter === 'hidden-gem' ? '#1B4332' : 'var(--bg-app)',
                    color: typeFilter === 'hidden-gem' ? '#D8F3DC' : 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  ✨ Hidden Gems
                </button>
                <button
                  onClick={() => setTypeFilter('famous-attraction')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    backgroundColor: typeFilter === 'famous-attraction' ? '#92400E' : 'var(--bg-app)',
                    color: typeFilter === 'famous-attraction' ? '#FEF3C7' : 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  ⭐ Landmarks
                </button>
              </div>
            </div>

            {/* Results Grid */}
            {filteredSaved.length === 0 ? (
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '3rem',
                  textAlign: 'center',
                  color: 'var(--color-text-secondary)',
                }}
              >
                No saved places match your filter "{filterQuery}".
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '2rem',
                }}
              >
                {filteredSaved.map((place) => (
                  <div key={place.id} style={{ position: 'relative' }}>
                    <PlaceCard place={place} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
