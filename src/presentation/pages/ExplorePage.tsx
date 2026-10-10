import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { PlaceCategory, PlaceType } from '../../domain/entities/Place';
import { SortOption } from '../../domain/repositories/PlaceRepository';
import { usePlaces } from '../context/PlacesContext';
import { FilterBar } from '../components/places/FilterBar';
import { PlaceGrid } from '../components/places/PlaceGrid';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { places, isLoading } = usePlaces();

  // Read initial filter values from URL search params
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = (searchParams.get('category') as PlaceCategory) || 'all';
  const initialType = (searchParams.get('type') as PlaceType) || 'all';
  const initialSort = (searchParams.get('sort') as SortOption) || 'newest';

  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>(initialCategory);
  const [selectedType, setSelectedType] = useState<PlaceType | 'all'>(initialType);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);

  // Sync state if URL search parameters change externally
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const catParam = (searchParams.get('category') as PlaceCategory) || 'all';
    const typeParam = (searchParams.get('type') as PlaceType) || 'all';
    const sortParam = (searchParams.get('sort') as SortOption) || 'newest';

    setSearchQuery(qParam);
    setSelectedCategory(catParam);
    setSelectedType(typeParam);
    setSortBy(sortParam);
  }, [searchParams]);

  // Update URL params when filters change
  const updateParams = (
    newQuery: string,
    newCat: PlaceCategory | 'all',
    newType: PlaceType | 'all',
    newSort: SortOption
  ) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newCat !== 'all') params.set('category', newCat);
    if (newType !== 'all') params.set('type', newType);
    if (newSort !== 'newest') params.set('sort', newSort);
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    updateParams(q, selectedCategory, selectedType, sortBy);
  };

  const handleCategoryChange = (cat: PlaceCategory | 'all') => {
    setSelectedCategory(cat);
    updateParams(searchQuery, cat, selectedType, sortBy);
  };

  const handleTypeChange = (type: PlaceType | 'all') => {
    setSelectedType(type);
    updateParams(searchQuery, selectedCategory, type, sortBy);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    updateParams(searchQuery, selectedCategory, selectedType, sort);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSortBy('newest');
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    sortBy !== 'newest';

  // Filter and sort places in-memory using strict domain rules
  const filteredPlaces = useMemo(() => {
    let result = [...places];

    // Filter by type
    if (selectedType !== 'all') {
      result = result.filter((p) => p.type === selectedType);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search text
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.story && p.story.toLowerCase().includes(q)) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        return result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'alphabetical':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case 'popular':
      case 'rating':
        return result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default:
        return result;
    }
  }, [places, searchQuery, selectedCategory, selectedType, sortBy]);

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <div className="container">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Explore Atlas' }]} />

        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="section-eyebrow">
            <Compass size={14} />
            <span>Destination Catalog</span>
          </div>
          <h1 className="section-title">Explore Hidden Gems & Landmarks</h1>
          <p className="section-subtitle">
            Search our growing repository of verified community spots, secluded nature escapes, and authentic cultural locations.
          </p>
        </div>

        {/* Interactive Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          totalResults={filteredPlaces.length}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Destination Cards Grid */}
        <PlaceGrid
          places={filteredPlaces}
          isLoading={isLoading}
          emptyTitle="No matching destinations found"
          emptyMessage={`No places matched your query "${searchQuery || 'current filters'}". Try resetting filters or browsing other categories.`}
          onResetFilters={handleClearFilters}
        />
      </div>
    </div>
  );
};
