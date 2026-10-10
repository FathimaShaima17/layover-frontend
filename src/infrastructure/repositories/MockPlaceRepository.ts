import { Place } from '../../domain/entities/Place';
import {
  PlaceRepository,
  PlaceFilterOptions,
  CreatePlaceInput,
} from '../../domain/repositories/PlaceRepository';
import { INITIAL_MOCK_PLACES } from '../../data/mockPlaces';

export class MockPlaceRepository implements PlaceRepository {
  private places: Place[];

  constructor(initialData: Place[] = INITIAL_MOCK_PLACES) {
    // Clone initial dataset into in-memory state
    this.places = [...initialData];
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
      status: 'pending', // Per requirements: new submissions are marked as pending review
      rating: 5.0,
      reviewsCount: 1,
    };

    // Prepend to places so new discoveries appear at the top of lists
    this.places = [newPlace, ...this.places];
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
