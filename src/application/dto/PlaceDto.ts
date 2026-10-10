import { PlaceCategory, PlaceType } from '../../domain/entities/Place';
import { SortOption } from '../../domain/repositories/PlaceRepository';

export interface SubmitPlaceFormDto {
  name: string;
  description: string;
  story?: string;
  category: PlaceCategory;
  type: PlaceType;
  location: string;
  town?: string;
  district?: string;
  nearbyLandmark?: string;
  latitude?: number | '';
  longitude?: number | '';
  imageUrls: string[];
  bestTimeToVisit?: string;
  estimatedDuration?: string;
  routeDescription?: string;
  accessibility?: string;
  tags: string[];
}

export interface PlaceSearchFiltersDto {
  query?: string;
  category?: PlaceCategory | 'all';
  type?: PlaceType | 'all';
  sortBy?: SortOption;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
