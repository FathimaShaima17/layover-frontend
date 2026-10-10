import React from 'react';
import { PlaceCategory } from '../../../domain/entities/Place';
import { CATEGORIES } from '../../../shared/constants/categories';
import {
  Trees,
  Waves,
  Mountain,
  Landmark,
  Utensils,
  Compass,
  Sparkles,
  Star,
  Layers,
} from 'lucide-react';

interface CategoryPillProps {
  category: PlaceCategory | 'all';
  label?: string;
  isSelected: boolean;
  onClick: () => void;
  count?: number;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  category,
  label,
  isSelected,
  onClick,
  count,
}) => {
  const getIcon = () => {
    switch (category) {
      case 'nature':
        return <Trees size={15} />;
      case 'beaches':
        return <Waves size={15} />;
      case 'mountains':
        return <Mountain size={15} />;
      case 'history':
        return <Landmark size={15} />;
      case 'food':
        return <Utensils size={15} />;
      case 'culture':
        return <Compass size={15} />;
      case 'hidden-gems':
        return <Sparkles size={15} />;
      case 'attractions':
        return <Star size={15} />;
      case 'all':
      default:
        return <Layers size={15} />;
    }
  };

  const displayLabel =
    label ||
    (category === 'all'
      ? 'All Categories'
      : CATEGORIES.find((c) => c.key === category)?.label || category);

  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.55rem 1rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.875rem',
        fontWeight: 600,
        backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--bg-surface)',
        color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
        transition: 'all var(--transition-fast)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
      className="category-pill"
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>{getIcon()}</span>
      <span>{displayLabel}</span>
      {count !== undefined && (
        <span
          style={{
            fontSize: '0.6875rem',
            padding: '1px 5px',
            borderRadius: '999px',
            backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-surface-subtle)',
            color: isSelected ? '#FFFFFF' : 'var(--color-text-muted)',
            marginLeft: '0.15rem',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};
