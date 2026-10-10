import {
  PlaceRepository,
  PlaceFilterOptions,
  CreatePlaceInput,
} from '../../domain/repositories/PlaceRepository';
import { Place } from '../../domain/entities/Place';
import { AUTH_EXPIRED_EVENT } from '../../shared/constants/authEvents';

/**
 * API response envelope returned by all backend endpoints.
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
}

/**
 * ApiPlaceRepository
 *
 * Concrete implementation of PlaceRepository that fetches data from
 * the HiddenAtlas Node.js + MongoDB backend via the Fetch API.
 *
 * Set VITE_API_URL in your .env file to point at the backend.
 * Defaults to http://localhost:5000 for local development.
 *
 * Authenticated mutations (e.g. POST /api/places) automatically attach
 * the JWT provided via `setAuthToken()` (managed by AuthContext).
 */
export class ApiPlaceRepository implements PlaceRepository {
  private readonly baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ??
      (import.meta.env.VITE_API_URL as string | undefined) ??
      'http://localhost:5000';
  }

  /** Stores the JWT used for authenticated requests (null clears it). */
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private buildUrl(path: string, params?: Record<string, string | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '' && val !== 'all') {
          url.searchParams.set(key, val);
        }
      });
    }
    return url.toString();
  }

  private async fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const response = await fetch(url, {
      headers,
      ...init,
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      // Broadcast 401 so the AuthProvider can clear the expired session
      if (response.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
      }
      throw new Error(body.error ?? `API error ${response.status}`);
    }

    const json = (await response.json()) as ApiResponse<T>;
    if (!json.success) {
      throw new Error(json.error ?? 'Unknown API error');
    }
    return json.data;
  }

  // ─── PlaceRepository implementation ─────────────────────────────────────────

  async getAll(filter?: PlaceFilterOptions): Promise<Place[]> {
    const url = this.buildUrl('/api/places', {
      q: filter?.query,
      category: filter?.category,
      type: filter?.type,
      sortBy: filter?.sortBy,
      tags: filter?.tags?.join(','),
    });
    return this.fetchJson<Place[]>(url);
  }

  async getById(id: string): Promise<Place | null> {
    try {
      return await this.fetchJson<Place>(this.buildUrl(`/api/places/${id}`));
    } catch (err) {
      // Return null if the place is not found (404)
      if (err instanceof Error && err.message.includes('404')) return null;
      throw err;
    }
  }

  async search(options: PlaceFilterOptions): Promise<Place[]> {
    const url = this.buildUrl('/api/places/search', {
      q: options.query,
      category: options.category,
      type: options.type,
      sortBy: options.sortBy,
      tags: options.tags?.join(','),
    });
    return this.fetchJson<Place[]>(url);
  }

  async create(input: CreatePlaceInput): Promise<Place> {
    return this.fetchJson<Place>(this.buildUrl('/api/places'), {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getSavedPlaces(savedIds: string[]): Promise<Place[]> {
    if (!savedIds || savedIds.length === 0) return [];
    return this.fetchJson<Place[]>(this.buildUrl('/api/places/saved'), {
      method: 'POST',
      body: JSON.stringify({ ids: savedIds }),
    });
  }
}

/** Singleton instance for the application. */
export const apiPlaceRepository = new ApiPlaceRepository();
