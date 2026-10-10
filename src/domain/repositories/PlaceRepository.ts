import { Place, PlaceCategory, PlaceType, PlaceStatus } from '../entities/Place';

export type SortOption = 'newest' | 'alphabetical' | 'popular' | 'rating';

export interface PlaceFilterOptions {
  query?: string;
  category?: PlaceCategory | 'all';
  type?: PlaceType | 'all';
  status?: PlaceStatus;
  sortBy?: SortOption;
  tags?: string[];
}

export type CreatePlaceInput = Omit<Place, 'id' | 'createdAt' | 'status'>;

export interface PlaceRepository {
  getAll(filter?: PlaceFilterOptions): Promise<Place[]>;
  getById(id: string): Promise<Place | null>;
  search(options: PlaceFilterOptions): Promise<Place[]>;
  create(input: CreatePlaceInput): Promise<Place>;
  getSavedPlaces(savedIds: string[]): Promise<Place[]>;
}
