import { Coordinates } from '../../domain/entities/Place';
import { isValidCoordinates } from '../../domain/value-objects/Coordinates';
import { CATEGORIES, CategoryMeta } from '../constants/categories';

export function getDirectionsUrl(coords?: Coordinates): string | null {
  if (!coords || !isValidCoordinates(coords.latitude, coords.longitude)) {
    return null;
  }
  // Standard external Google Maps search URL with exact coordinates
  return `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}

export function truncate(text: string, maxLen: number): string {
  if (!text || text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}...`;
}

export function getCategoryMeta(categoryKey: string): CategoryMeta {
  const found = CATEGORIES.find((c) => c.key === categoryKey);
  if (found) return found;
  return {
    key: 'nature',
    label: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
    description: 'Explore natural and cultural destinations.',
    iconName: 'Compass',
    accentColor: '#2D6A4F',
    bgLight: '#E8F5E9',
  };
}
