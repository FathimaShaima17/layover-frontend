import { Place } from '../../domain/entities/Place';
import {
  PlaceRepository,
  PlaceFilterOptions,
  CreatePlaceInput,
} from '../../domain/repositories/PlaceRepository';
import { INITIAL_MOCK_PLACES } from '../../data/mockPlaces';

const CUSTOM_PLACES_KEY = 'hiddenatlas_custom_places';

function getStoredCustomPlaces(): Place[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(CUSTOM_PLACES_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch (err) {
    console.warn('[HiddenAtlas] Failed to load custom places from localStorage:', err);
  }
  return [];
}

export class MockPlaceRepository implements PlaceRepository {
  private places: Place[];

  constructor(initialData: Place[] = INITIAL_MOCK_PLACES) {
    // Merge stored custom places with initial mock data
    const stored = getStoredCustomPlaces();
    const storedIds = new Set(stored.map((p) => p.id));
    this.places = [...stored, ...initialData.filter((p) => !storedIds.has(p.id))];
  }

  async getAll(filter?: PlaceFilterOptions): Promise<Place[]> {
    let result = [...this.places];

    if (!filter) {
      return result;
    }

    // Filter by status if specified
    if (filter.status) {
      result = result.filter((p) => p.status === filter.status);
    }

    // Filter by category
    if (filter.category && filter.category !== 'all') {
      result = result.filter((p) => p.category === filter.category);
    }

    // Filter by place type
    if (filter.type && filter.type !== 'all') {
      result = result.filter((p) => p.type === filter.type);
    }

    // Filter by search query
    if (filter.query && filter.query.trim()) {
      const q = filter.query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.story && p.story.toLowerCase().includes(q)) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      result = result.filter((p) =>
        filter.tags!.some((tag) => p.tags.includes(tag))
      );
    }

    // Sort
    result = this.sortPlaces(result, filter.sortBy);

    return result;
  }

  async getById(id: string): Promise<Place | null> {
    const found = this.places.find((p) => p.id === id);
    return found ? { ...found } : null;
  }

  async search(options: PlaceFilterOptions): Promise<Place[]> {
    return this.getAll(options);
  }

  async create(input: CreatePlaceInput): Promise<Place> {
    const newPlace: Place = {
      ...input,
      id: `place-custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      status: 'approved', // Auto-approved for interactive 3D world prototype
      rating: 5.0,
      reviewsCount: 1,
    };

    // Prepend to places so new discoveries appear at the top
    this.places = [newPlace, ...this.places];

    // Persist to localStorage for navigation & refresh resilience
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = getStoredCustomPlaces();
        localStorage.setItem(
          CUSTOM_PLACES_KEY,
          JSON.stringify([newPlace, ...stored.filter((p) => p.id !== newPlace.id)])
        );
      }
    } catch (err) {
      console.warn('[HiddenAtlas] Failed to save custom place to localStorage:', err);
    }

    return { ...newPlace };
  }

  async getSavedPlaces(savedIds: string[]): Promise<Place[]> {
    if (!savedIds || savedIds.length === 0) {
      return [];
    }
    const idSet = new Set(savedIds);
    return this.places.filter((p) => idSet.has(p.id));
  }

  private sortPlaces(places: Place[], sortBy?: string): Place[] {
    switch (sortBy) {
      case 'newest':
        return [...places].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'alphabetical':
        return [...places].sort((a, b) => a.name.localeCompare(b.name));
      case 'popular':
      case 'rating':
        return [...places].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default:
        return places;
    }
  }
}

// Singleton repository instance to guarantee shared state across pages during session
export const mockPlaceRepository = new MockPlaceRepository();
