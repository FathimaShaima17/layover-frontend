import { PlaceCategory } from '../../domain/entities/Place';

export interface CategoryMeta {
  key: PlaceCategory;
  label: string;
  description: string;
  iconName: string;
  countLabel?: string;
  accentColor: string;
  bgLight: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: 'nature',
    label: 'Nature & Waterfalls',
    description: 'Mossy canyons, cascading falls, secluded lagoons, and pristine wilderness.',
    iconName: 'Trees',
    accentColor: '#2D6A4F',
    bgLight: '#E8F5E9',
  },
  {
    key: 'beaches',
    label: 'Beaches & Coves',
    description: 'Pebble bays, secret sea caves, and secluded azure inlets.',
    iconName: 'Waves',
    accentColor: '#0077B6',
    bgLight: '#E0F2FE',
  },
  {
    key: 'mountains',
    label: 'Mountains & Peaks',
    description: 'Jagged ridgelines, alpine tarns, high viewpoints, and summit trails.',
    iconName: 'Mountain',
    accentColor: '#4A5568',
    bgLight: '#EDF2F7',
  },
  {
    key: 'history',
    label: 'Historical Places',
    description: 'Medieval monasteries, coastal fortresses, ancient ruins, and forgotten towers.',
    iconName: 'Landmark',
    accentColor: '#9C6644',
    bgLight: '#FBECE1',
  },
  {
    key: 'food',
    label: 'Local Food & Wine',
    description: 'Cellar taverns, family vineyards, spice quarters, and regional delicacies.',
    iconName: 'Utensils',
    accentColor: '#C86D51',
    bgLight: '#FDF0ED',
  },
  {
    key: 'culture',
    label: 'Cultural Experiences',
    description: 'Bamboo groves, ancient craft workshops, hermitages, and local traditions.',
    iconName: 'Compass',
    accentColor: '#6B46C1',
    bgLight: '#F3E8FF',
  },
  {
    key: 'hidden-gems',
    label: 'Hidden Gems',
    description: 'Unmarked paths, community secrets, and places off the tourist map.',
    iconName: 'Sparkles',
    accentColor: '#1B4332',
    bgLight: '#D8F3DC',
  },
  {
    key: 'attractions',
    label: 'Iconic Attractions',
    description: 'Famous architectural marvels, historic landmarks, and world-renowned vistas.',
    iconName: 'Star',
    accentColor: '#D97706',
    bgLight: '#FEF3C7',
  },
];
