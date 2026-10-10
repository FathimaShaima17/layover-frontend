import { ISavedPlacesStorage } from '../../application/use-cases/SavePlace';

const SAVED_PLACES_KEY = 'hiddenatlas_saved_place_ids';
const USER_PROFILE_KEY = 'hiddenatlas_user_profile';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  role: string;
  contributionsCount: number;
}

export class LocalStorageService implements ISavedPlacesStorage {
  private isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  getSavedIds(): string[] {
    if (!this.isAvailable()) return [];
    try {
      const raw = window.localStorage.getItem(SAVED_PLACES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveId(id: string): void {
    if (!this.isAvailable()) return;
    try {
      const current = this.getSavedIds();
      if (!current.includes(id)) {
        current.push(id);
        window.localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(current));
      }
    } catch {
      // Graceful fallback if storage quota exceeded
    }
  }

  removeId(id: string): void {
    if (!this.isAvailable()) return;
    try {
      const current = this.getSavedIds();
      const filtered = current.filter((item) => item !== id);
      window.localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(filtered));
    } catch {
      // Graceful fallback
    }
  }

  isSaved(id: string): boolean {
    const current = this.getSavedIds();
    return current.includes(id);
  }

  // Prototype User Profile persistence
  saveUserProfile(profile: UserProfile): void {
    if (!this.isAvailable()) return;
    try {
      window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Graceful fallback
    }
  }
}

export const localStorageService = new LocalStorageService();
