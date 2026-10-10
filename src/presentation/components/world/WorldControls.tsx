import React, { useState } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  Globe,
  LocateFixed,
  Maximize2,
  Box,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PlaceCategory, PlaceType } from '../../../domain/entities/Place';
import { CATEGORIES } from '../../../shared/constants/categories';

interface WorldControlsProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: PlaceCategory | 'all';
  onCategoryChange: (c: PlaceCategory | 'all') => void;
  selectedType: PlaceType | 'all';
  onTypeChange: (t: PlaceType | 'all') => void;
  matchCount: number;
  totalCount?: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  onResetView: () => void;
  onFitBounds: () => void;
  onLocateUser: () => void;
  isLocating: boolean;
  is3DMode: boolean;
  onToggle3D: () => void;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  nature: '🌿',
  beaches: '🏖️',
  mountains: '🏔️',
  history: '🏛️',
  food: '🍽️',
  culture: '🎭',
  'hidden-gems': '💎',
  attractions: '⭐',
};

export const WorldControls: React.FC<WorldControlsProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  matchCount,
  totalCount,
  onClearFilters,
  hasActiveFilters,
  onResetView,
  onFitBounds,
  onLocateUser,
  isLocating,
  is3DMode,
  onToggle3D,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      aria-label="World exploration controls"
      style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        width: 'min(360px, calc(100vw - 2rem))',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      {/* Main card */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
          pointerEvents: 'all',
          transition: 'all 0.25s ease',
        }}
      >
        {/* Search header row */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.9rem',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search places, towns, regions…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem 4.5rem 0.8rem 2.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              color: 'var(--color-text-primary)',
              outline: 'none',
              fontWeight: 500,
            }}
            aria-label="Search destinations in the 3D world"
          />

          <div
            style={{
              position: 'absolute',
              right: '0.6rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search query"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={15} />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsCollapsed((v) => !v)}
              aria-label={isCollapsed ? 'Expand filter controls' : 'Collapse filter controls'}
              title={isCollapsed ? 'Expand controls' : 'Collapse controls'}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isCollapsed ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
            </button>
          </div>
        </div>

        {/* Collapsible filter section */}
        {!isCollapsed && (
          <>
            {/* Type tabs (All / Hidden Gems / Famous Landmarks) */}
            <div
              style={{
                display: 'flex',
                borderTop: '1px solid rgba(226, 232, 240, 0.7)',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {(
                [
                  ['all', 'All Places'],
                  ['hidden-gem', '✨ Hidden Gems'],
                  ['famous-attraction', '⭐ Landmarks'],
                ] as const
              ).map(([val, label]) => {
                const isSelected = selectedType === val;
                const activeBg =
                  val === 'hidden-gem'
                    ? '#1B4332'
                    : val === 'famous-attraction'
                    ? '#92400E'
                    : 'var(--color-primary)';
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onTypeChange(val as PlaceType | 'all')}
                    style={{
                      flex: 1,
                      padding: '0.55rem 0.25rem',
                      backgroundColor: isSelected ? activeBg : 'transparent',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                      transition: 'all 0.15s ease',
                      border: 'none',
                      cursor: 'pointer',
                      borderRight:
                        val !== 'famous-attraction'
                          ? '1px solid rgba(226, 232, 240, 0.7)'
                          : 'none',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Category chips scroll row */}
            <div
              style={{
                display: 'flex',
                gap: '0.35rem',
                padding: '0.6rem 0.75rem',
                overflowX: 'auto',
                borderTop: '1px solid rgba(226, 232, 240, 0.7)',
                scrollbarWidth: 'none',
              }}
            >
              <button
                type="button"
                onClick={() => onCategoryChange('all')}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor:
                    selectedCategory === 'all'
                      ? 'var(--color-primary)'
                      : 'rgba(241, 245, 249, 0.8)',
                  color: selectedCategory === 'all' ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                const emoji = CATEGORY_EMOJIS[cat.key] ?? '📍';
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => onCategoryChange(cat.key as PlaceCategory)}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: isSelected
                        ? 'var(--color-primary-light)'
                        : 'rgba(241, 245, 249, 0.8)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                      border: 'none',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {emoji} {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Match status & reset */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                borderTop: '1px solid rgba(226, 232, 240, 0.7)',
                fontSize: '0.75rem',
                backgroundColor: 'rgba(248, 250, 252, 0.6)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                <SlidersHorizontal size={13} />
                <span>
                  Showing{' '}
                  <strong style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    {matchCount}
                  </strong>
                  {totalCount !== undefined ? ` of ${totalCount}` : ''} real coordinates
                </span>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  style={{
                    color: '#B91C1C',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px 4px',
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Camera & Geographic quick actions toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.45rem',
          pointerEvents: 'all',
        }}
      >
        {/* Reset view */}
        <button
          type="button"
          onClick={onResetView}
          title="Reset camera to world overview"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.85rem',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Globe size={14} />
          World View
        </button>

        {/* Fit to all visible */}
        <button
          type="button"
          onClick={onFitBounds}
          title="Fit view to all matching destinations"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.85rem',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Maximize2 size={14} />
          Fit Bounds
        </button>

        {/* 2D / 3D Perspective Toggle */}
        <button
          type="button"
          onClick={onToggle3D}
          title={is3DMode ? 'Switch to 2D Top-down View' : 'Switch to 3D Tilted Perspective'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.85rem',
            backgroundColor: is3DMode ? 'var(--color-primary-subtle)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
            border: is3DMode
              ? '1px solid var(--color-primary-light)'
              : '1px solid rgba(226, 232, 240, 0.8)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: is3DMode ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Box size={14} />
          {is3DMode ? '3D Tilt' : '2D Flat'}
        </button>

        {/* Locate user */}
        <button
          type="button"
          onClick={onLocateUser}
          disabled={isLocating}
          title="Fly to your approximate GPS location"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.85rem',
            backgroundColor: isLocating
              ? 'var(--color-primary-subtle)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
            border: isLocating
              ? '1px solid var(--color-primary-light)'
              : '1px solid rgba(226, 232, 240, 0.8)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: isLocating ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            cursor: isLocating ? 'wait' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <LocateFixed size={14} />
          {isLocating ? 'Locating…' : 'Near Me'}
        </button>
      </div>
    </aside>
  );
};
