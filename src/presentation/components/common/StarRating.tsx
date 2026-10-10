import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating?: number;
  reviewsCount?: number;
  showText?: boolean;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 4.8,
  reviewsCount,
  showText = true,
  size = 14,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
      <Star
        size={size}
        fill="#D97706"
        color="#D97706"
        strokeWidth={1.5}
      />
      {showText && (
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {rating.toFixed(1)}
        </span>
      )}
      {showText && reviewsCount !== undefined && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
