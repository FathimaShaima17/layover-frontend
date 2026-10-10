import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Place } from '../../domain/entities/Place';
import { PlaceFilterOptions } from '../../domain/repositories/PlaceRepository';
import { apiPlaceRepository } from '../../infrastructure/repositories/ApiPlaceRepository';
import { GetPlacesUseCase } from '../../application/use-cases/GetPlaces';
import { GetPlaceByIdUseCase } from '../../application/use-cases/GetPlaceById';
import { SearchPlacesUseCase } from '../../application/use-cases/SearchPlaces';
import { SubmitPlaceUseCase } from '../../application/use-cases/SubmitPlace';
import { SubmitPlaceFormDto } from '../../application/dto/PlaceDto';

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
      setPlaces(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load destinations';
      setError(message);
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
      const created = await submitPlaceUseCase.execute(dto);
      // Immediately reflect newly created place in context state
      setPlaces((prev) => [created, ...prev]);
      return created;
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
