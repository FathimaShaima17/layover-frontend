import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Place } from '../../domain/entities/Place';
import { SavePlaceUseCase } from '../../application/use-cases/SavePlace';
import { apiPlaceRepository } from '../../infrastructure/repositories/ApiPlaceRepository';
import { localStorageService } from '../../infrastructure/storage/LocalStorageService';
import { useToast } from './ToastContext';

interface SavedPlacesContextValue {
  savedIds: string[];
  savedPlaces: Place[];
  isSaved: (id: string) => boolean;
  toggleSave: (place: Place) => void;
  removeSave: (id: string) => void;
  savedCount: number;
  isLoading: boolean;
}

const SavedPlacesContext = createContext<SavedPlacesContextValue | undefined>(undefined);

export const SavedPlacesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const savePlaceUseCase = useMemo(
    () => new SavePlaceUseCase(apiPlaceRepository, localStorageService),
    []
  );

  const loadSavedPlaces = useCallback(async () => {
    setIsLoading(true);
    try {
      const ids = savePlaceUseCase.getSavedIds();
      setSavedIds(ids);
      const places = await savePlaceUseCase.getSavedPlaces();
      setSavedPlaces(places);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [savePlaceUseCase]);

  useEffect(() => {
    loadSavedPlaces();
  }, [loadSavedPlaces]);

  const isSaved = useCallback(
    (id: string): boolean => {
      return savedIds.includes(id);
    },
    [savedIds]
  );

  const toggleSave = useCallback(
    async (place: Place) => {
      const saved = savePlaceUseCase.toggleSave(place.id);
      const updatedIds = savePlaceUseCase.getSavedIds();
      setSavedIds(updatedIds);

      if (saved) {
        setSavedPlaces((prev) => [place, ...prev.filter((p) => p.id !== place.id)]);
        showToast('Saved to Favorites', `${place.name} has been added to your atlas bookmarks.`, 'success');
      } else {
        setSavedPlaces((prev) => prev.filter((p) => p.id !== place.id));
        showToast('Removed from Favorites', `${place.name} was removed from your saved places.`, 'info');
      }
    },
    [savePlaceUseCase, showToast]
  );

  const removeSave = useCallback(
    (id: string) => {
      savePlaceUseCase.toggleSave(id);
      const updatedIds = savePlaceUseCase.getSavedIds();
      setSavedIds(updatedIds);
      setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
      showToast('Removed from Saved', 'Destination removed from your saved places.', 'info');
    },
    [savePlaceUseCase, showToast]
  );

  const value = useMemo(
    () => ({
      savedIds,
      savedPlaces,
      isSaved,
      toggleSave,
      removeSave,
      savedCount: savedIds.length,
      isLoading,
    }),
    [savedIds, savedPlaces, isSaved, toggleSave, removeSave, isLoading]
  );

  return <SavedPlacesContext.Provider value={value}>{children}</SavedPlacesContext.Provider>;
};

export const useSavedPlaces = (): SavedPlacesContextValue => {
  const context = useContext(SavedPlacesContext);
  if (!context) {
    throw new Error('useSavedPlaces must be used within a SavedPlacesProvider');
  }
  return context;
};
