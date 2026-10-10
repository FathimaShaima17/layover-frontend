import { UserProfile } from '../storage/LocalStorageService';

/**
 * API response envelope returned by the auth endpoints.
 */
interface AuthApiResponse {
  success: boolean;
  data: { token: string; user: UserProfile } | UserProfile;
  error?: string;
}

/**
 * ApiAuthRepository
 *
 * Talks to the HiddenAtlas backend authentication endpoints:
 *   POST   /api/auth/register
 *   POST   /api/auth/login
 *   GET    /api/auth/me
 *   PATCH  /api/auth/profile
 *
 * Set VITE_API_URL in your .env file to point at the backend.
 * Defaults to http://localhost:5000 for local development.
 */
export class ApiAuthRepository {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ??
      (import.meta.env.VITE_API_URL as string | undefined) ??
      'http://localhost:5000';
  }

  // ─── Private helpers ────────────────────────────────────────────────

  private buildUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private async request<T>(
    path: string,
    init: RequestInit
  ): Promise<T> {
    const response = await fetch(this.buildUrl(path), init);

    const body = (await response.json().catch(() => ({}))) as AuthApiResponse;

    if (!response.ok || body.success === false) {
      throw new Error(body.error ?? `API error ${response.status}`);
    }

    return body.data as T;
  }

  private jsonInit(
    method: 'POST' | 'PATCH' | 'GET',
    body?: unknown,
    token?: string | null
  ): RequestInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };
  }

  // ─── Auth API ───────────────────────────────────────────────────────

  async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    return this.request<{ token: string; user: UserProfile }>(
      '/api/auth/login',
      this.jsonInit('POST', { email, password })
    );
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ token: string; user: UserProfile }> {
    return this.request<{ token: string; user: UserProfile }>(
      '/api/auth/register',
      this.jsonInit('POST', { name, email, password })
    );
  }

  async me(token: string): Promise<UserProfile> {
    return this.request<UserProfile>('/api/auth/me', this.jsonInit('GET', undefined, token));
  }

  async updateProfile(
    token: string,
    patch: { name?: string; bio?: string; avatarUrl?: string }
  ): Promise<UserProfile> {
    return this.request<UserProfile>(
      '/api/auth/profile',
      this.jsonInit('PATCH', patch, token)
    );
  }
}

/** Singleton instance for the application. */
export const apiAuthRepository = new ApiAuthRepository();
