export type PlaceType = 'hidden-gem' | 'famous-attraction';

export type PlaceStatus = 'pending' | 'approved' | 'rejected';

export type PlaceCategory =
  | 'nature'
  | 'beaches'
  | 'mountains'
  | 'history'
  | 'food'
  | 'culture'
  | 'hidden-gems'
  | 'attractions';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  story?: string;
  category: PlaceCategory;
  type: PlaceType;
  location: string;
  coordinates?: Coordinates;
  images: string[];
  bestTimeToVisit?: string;
  routeDescription?: string;
  accessibility?: string;
  tags: string[];
  status: PlaceStatus;
  createdAt: string;
  rating?: number;
  reviewsCount?: number;
  estimatedDuration?: string;
  nearbyLandmarks?: string[];
  submittedBy?: string;
}
