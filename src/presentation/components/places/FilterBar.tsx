import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { PlaceCategory, PlaceType } from '../../../domain/entities/Place';
import { SortOption } from '../../../domain/repositories/PlaceRepository';
import { CATEGORIES } from '../../../shared/constants/categories';
import { CategoryPill } from './CategoryPill';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: PlaceCategory | 'all';
  onCategoryChange: (category: PlaceCategory | 'all') => void;
  selectedType: PlaceType | 'all';
  onTypeChange: (type: PlaceType | 'all') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResults: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  totalResults,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <div
      className="form-polaroid tape-top-left"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '3px',
        border: '1px solid rgba(221, 212, 192, 0.75)',
        padding: '1.85rem 1.5rem 1.5rem',
        boxShadow: '0 12px 30px rgba(45, 42, 35, 0.1), 0 2px 6px rgba(45, 42, 35, 0.05)',
        marginBottom: '2.5rem',
        position: 'relative',
      }}
    >
      {/* Top Row: Search Input & Sort Selector */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}
      >
        {/* Search Bar with clear button */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 320px',
            maxWidth: '540px',
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search by destination name, canyon, region, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 2.5rem 0.75rem 2.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              backgroundColor: 'var(--bg-app)',
              fontSize: '0.9375rem',
              color: 'var(--color-text-primary)',
              transition: 'border-color var(--transition-fast), background-color var(--transition-fast)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
              }}
              aria-label="Clear search text"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Right Section: Sort Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label
            htmlFor="sort-select"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
            }}
          >
            <ArrowUpDown size={15} />
            <span>Sort by:</span>
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              backgroundColor: 'var(--bg-app)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            <option value="newest">Newest Discoveries</option>
            <option value="popular">Highest Rated & Popular</option>
            <option value="alphabetical">Alphabetical (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Middle Row: Place Type Tabs (All / Hidden Gems / Famous Attractions) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--color-border-subtle)',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.25rem' }}>
            Type:
          </span>
          <button
            onClick={() => onTypeChange('all')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              backgroundColor: selectedType === 'all' ? 'var(--color-primary)' : 'var(--bg-surface-subtle)',
              color: selectedType === 'all' ? '#FFFFFF' : 'var(--color-text-secondary)',
              border: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            All Destinations
          </button>
          <button
            onClick={() => onTypeChange('hidden-gem')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              backgroundColor: selectedType === 'hidden-gem' ? '#1B4332' : 'var(--bg-surface-subtle)',
              color: selectedType === 'hidden-gem' ? '#D8F3DC' : 'var(--color-text-secondary)',
              border: selectedType === 'hidden-gem' ? '1px solid #2D6A4F' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            ✨ Hidden Gems Only
          </button>
          <button
            onClick={() => onTypeChange('famous-attraction')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              backgroundColor: selectedType === 'famous-attraction' ? '#92400E' : 'var(--bg-surface-subtle)',
              color: selectedType === 'famous-attraction' ? '#FEF3C7' : 'var(--color-text-secondary)',
              border: selectedType === 'famous-attraction' ? '1px solid #B45309' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            ⭐ Famous Landmarks
          </button>
        </div>

        {/* Clear Filters CTA */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#B91C1C',
              backgroundColor: '#FEE2E2',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              transition: 'background-color 0.15s ease',
            }}
          >
            <X size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Bottom Category Scroll / Pills */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.35rem',
          scrollbarWidth: 'thin',
        }}
      >
        <CategoryPill
          category="all"
          isSelected={selectedCategory === 'all'}
          onClick={() => onCategoryChange('all')}
        />
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat.key}
            category={cat.key}
            label={cat.label}
            isSelected={selectedCategory === cat.key}
            onClick={() => onCategoryChange(cat.key)}
          />
        ))}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Active filters:
          </span>

          {searchQuery && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              Search: "{searchQuery}"
              <button
                type="button"
                onClick={() => onSearchChange('')}
                style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}
                aria-label="Remove search filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {selectedCategory !== 'all' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              Category: {CATEGORIES.find((c) => c.key === selectedCategory)?.label || selectedCategory}
              <button
                type="button"
                onClick={() => onCategoryChange('all')}
                style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}
                aria-label="Remove category filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {selectedType !== 'all' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              Type: {selectedType === 'hidden-gem' ? 'Hidden Gems' : 'Famous Landmarks'}
              <button
                type="button"
                onClick={() => onTypeChange('all')}
                style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}
                aria-label="Remove type filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {sortBy !== 'newest' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              Sorted by: {sortBy === 'popular' ? 'Highest Rated' : 'Alphabetical'}
              <button
                type="button"
                onClick={() => onSortChange('newest')}
                style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}
                aria-label="Reset sort"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Result Counter Bottom Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: hasActiveFilters ? '0.75rem' : '1.25rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--color-border-subtle)',
          fontSize: '0.8125rem',
          color: 'var(--color-text-muted)',
        }}
      >
        <span>
          Showing <strong style={{ color: 'var(--color-primary)' }}>{totalResults}</strong> destination{totalResults === 1 ? '' : 's'}
        </span>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            style={{
              color: '#B91C1C',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};
