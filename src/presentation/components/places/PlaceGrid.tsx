import React from 'react';
import { Place } from '../../../domain/entities/Place';
import { PlaceCard } from './PlaceCard';
import { Compass, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

interface PlaceGridProps {
  places: Place[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onResetFilters?: () => void;
  featuredFirst?: boolean;
}

export const PlaceGrid: React.FC<PlaceGridProps> = ({
  places,
  isLoading = false,
  emptyTitle = 'No destinations found',
  emptyMessage = 'Try adjusting your search terms, changing categories, or resetting active filters.',
  onResetFilters,
  featuredFirst = false,
}) => {
  if (isLoading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              height: '380px',
              border: '1px solid var(--color-border)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              animation: 'pulse 1.5s infinite ease-in-out',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '210px',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            />
            <div
              style={{
                width: '60%',
                height: '18px',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: '4px',
              }}
            />
            <div
              style={{
                width: '85%',
                height: '14px',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: '4px',
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px dashed var(--color-border)',
          padding: '4rem 2rem',
          textAlign: 'center',
          maxWidth: '560px',
          margin: '2rem auto',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Compass size={32} />
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            color: 'var(--color-primary)',
            marginBottom: '0.75rem',
          }}
        >
          {emptyTitle}
        </h3>
        <p
          style={{
            fontSize: '0.9375rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.75rem',
          }}
        >
          {emptyMessage}
        </p>
        {onResetFilters && (
          <Button
            variant="outline"
            icon={<RotateCcw size={16} />}
            onClick={onResetFilters}
          >
            Clear All Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem',
      }}
    >
      {places.map((place, index) => (
        <PlaceCard
          key={place.id}
          place={place}
          featured={featuredFirst && index === 0}
        />
      ))}
    </div>
  );
};
