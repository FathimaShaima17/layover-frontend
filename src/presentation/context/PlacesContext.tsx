import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Place } from '../../domain/entities/Place';
import { PlaceFilterOptions } from '../../domain/repositories/PlaceRepository';
import { apiPlaceRepository } from '../../infrastructure/repositories/ApiPlaceRepository';
import { GetPlacesUseCase } from '../../application/use-cases/GetPlaces';
import { GetPlaceByIdUseCase } from '../../application/use-cases/GetPlaceById';
import { SearchPlacesUseCase } from '../../application/use-cases/SearchPlaces';
import { SubmitPlaceUseCase } from '../../application/use-cases/SubmitPlace';
import { SubmitPlaceFormDto } from '../../application/dto/PlaceDto';

import { mockPlaceRepository } from '../../infrastructure/repositories/MockPlaceRepository';

interface PlacesContextValue {
  places: Place[];
  isLoading: boolean;
  error: string | null;
  getPlaceById: (id: string) => Promise<Place | null>;
  searchPlaces: (filters: PlaceFilterOptions) => Promise<Place[]>;
  submitPlace: (dto: SubmitPlaceFormDto) => Promise<Place>;
  refreshPlaces: () => Promise<void>;
  hiddenGems: Place[];
  trendingPlaces: Place[];
  recentPlaces: Place[];
}

const PlacesContext = createContext<PlacesContextValue | undefined>(undefined);

export const PlacesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize application use-cases with infrastructure repository
  const getPlacesUseCase = useMemo(() => new GetPlacesUseCase(apiPlaceRepository), []);
  const getPlaceByIdUseCase = useMemo(() => new GetPlaceByIdUseCase(apiPlaceRepository), []);
  const searchPlacesUseCase = useMemo(() => new SearchPlacesUseCase(apiPlaceRepository), []);
  const submitPlaceUseCase = useMemo(() => new SubmitPlaceUseCase(apiPlaceRepository), []);

  const fetchAllPlaces = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPlacesUseCase.execute();
      const mockData = await mockPlaceRepository.getAll();
      if (data && data.length > 0) {
        // Merge backend places with any local custom places from mockPlaceRepository
        const dataIds = new Set(data.map((p) => p.id));
        const merged = [...data, ...mockData.filter((p) => !dataIds.has(p.id))];
        setPlaces(merged);
      } else {
        setPlaces(mockData);
      }
    } catch (err: unknown) {
      console.info('[HiddenAtlas] Backend unavailable, loading local discoveries dataset:', err);
      try {
        const fallback = await mockPlaceRepository.getAll();
        setPlaces(fallback);
      } catch (fallbackErr) {
        const message = fallbackErr instanceof Error ? fallbackErr.message : 'Failed to load destinations';
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [getPlacesUseCase]);

  useEffect(() => {
    fetchAllPlaces();
  }, [fetchAllPlaces]);

  const getPlaceById = useCallback(
    async (id: string): Promise<Place | null> => {
      // First check current in-memory state
      const local = places.find((p) => p.id === id);
      if (local) return local;
      return getPlaceByIdUseCase.execute(id);
    },
    [places, getPlaceByIdUseCase]
  );

  const searchPlaces = useCallback(
    async (filters: PlaceFilterOptions): Promise<Place[]> => {
      return searchPlacesUseCase.execute(filters);
    },
    [searchPlacesUseCase]
  );

  const submitPlace = useCallback(
    async (dto: SubmitPlaceFormDto): Promise<Place> => {
      try {
        const created = await submitPlaceUseCase.execute(dto);
        const approvedCreated = { ...created, status: 'approved' as const };
        // Immediately reflect newly created place in context state
        setPlaces((prev) => [approvedCreated, ...prev]);
        return approvedCreated;
      } catch (err: unknown) {
        console.warn('[HiddenAtlas] API submit fallback to mockPlaceRepository:', err);
        const created = await mockPlaceRepository.create({
          name: dto.name.trim(),
          description: dto.description.trim(),
          story: dto.story?.trim(),
          category: dto.category,
          type: dto.type,
          location: dto.location.trim(),
          coordinates:
            dto.latitude !== '' && dto.longitude !== '' && dto.latitude !== undefined && dto.longitude !== undefined
              ? { latitude: Number(dto.latitude), longitude: Number(dto.longitude) }
              : undefined,
          images: dto.imageUrls.filter((u) => u && u.trim().length > 0),
          bestTimeToVisit: dto.bestTimeToVisit?.trim(),
          tags: dto.tags.length > 0 ? dto.tags : ['community-discovery'],
          submittedBy: 'Community Explorer (You)',
        });
        setPlaces((prev) => [created, ...prev]);
        return created;
      }
    },
    [submitPlaceUseCase]
  );

  // Curated lists for home / editorial displays
  const hiddenGems = useMemo(
    () => places.filter((p) => p.type === 'hidden-gem'),
    [places]
  );

  const trendingPlaces = useMemo(
    () => [...places].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 4),
    [places]
  );

  const recentPlaces = useMemo(
    () =>
      [...places]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [places]
  );

  const value = useMemo(
    () => ({
      places,
      isLoading,
      error,
      getPlaceById,
      searchPlaces,
      submitPlace,
      refreshPlaces: fetchAllPlaces,
      hiddenGems,
      trendingPlaces,
      recentPlaces,
    }),
    [
      places,
      isLoading,
      error,
      getPlaceById,
      searchPlaces,
      submitPlace,
      fetchAllPlaces,
      hiddenGems,
      trendingPlaces,
      recentPlaces,
    ]
  );

  return <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>;
};

export const usePlaces = (): PlacesContextValue => {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces must be used within a PlacesProvider');
  }
  return context;
};
