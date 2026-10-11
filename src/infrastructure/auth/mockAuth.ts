import { UserProfile } from '../storage/LocalStorageService';

/**
 * Frontend-only mock authentication for demo purposes.
 *
 * No network calls are made. A preset demo account always works and
 * new sign-ups are persisted in the browser's localStorage, so the app
 * can be demonstrated without the backend running.
 *
 * Storage keys:
 *   - `ha_mock_users`   — accounts created through mockSignup (demo only)
 *   - `ha_mock_session` — the currently signed-in explorer (never includes the password)
 *
 * Enable with VITE_USE_MOCK_AUTH=true.
 */

/** Public explorer profile — same shape the rest of the app expects. */
export type MockUser = UserProfile;

/** Placeholder token handed to the app while mock auth is enabled. */
export const MOCK_AUTH_TOKEN = 'ha-mock-session-token';

const MOCK_USERS_KEY = 'ha_mock_users';
const MOCK_SESSION_KEY = 'ha_mock_session';

const DEMO_EMAIL = 'demo@hiddenatlas.com';
const DEMO_PASSWORD = 'demo1234';

/** Preset account that always works, even before any signup. */
const DEMO_USER: MockUser = {
  id: 'mock-user-demo',
  name: 'Elena',
  email: DEMO_EMAIL,
  bio: 'Preset demo explorer — no backend required.',
  avatarUrl: '',
  role: 'Explorer',
  contributionsCount: 0,
};

/** Stored signup record — the only place passwords are kept (demo only). */
interface StoredMockUser extends MockUser {
  password: string;
}

/** True when the app should use the frontend mock instead of the backend. */
export function isMockAuthEnabled(): boolean {
  try {
    return import.meta.env?.VITE_USE_MOCK_AUTH === 'true';
  } catch {
    return false;
  }
}

/** Email matching is trimmed and case-insensitive. */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isBrowserStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

// ─── Persisted signups (ha_mock_users) ─────────────────────────

function readStoredUsers(): StoredMockUser[] {
  if (!isBrowserStorageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(MOCK_USERS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as StoredMockUser[]).filter(
      (user) =>
        Boolean(user) &&
        typeof user.email === 'string' &&
        typeof user.password === 'string'
    );
  } catch {
    return [];
  }
}

function writeStoredUsers(users: StoredMockUser[]): void {
  if (!isBrowserStorageAvailable()) return;
  try {
    window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  } catch {
    // Storage unavailable (private mode / quota) — signups live for this session only
  }
}

// ─── Active session (ha_mock_session — never contains the password) ──

function saveSession(user: MockUser): void {
  if (!isBrowserStorageAvailable()) return;
  try {
    window.localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
  } catch {
    // Storage unavailable — session lives in memory only
  }
}

function readSession(): MockUser | null {
  if (!isBrowserStorageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(MOCK_SESSION_KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

function removeSession(): void {
  if (!isBrowserStorageAvailable()) return;
  try {
    window.localStorage.removeItem(MOCK_SESSION_KEY);
  } catch {
    // ignore
  }
}

/** Strips the password from a stored signup record. */
function toPublicUser(stored: StoredMockUser): MockUser {
  return {
    id: stored.id,
    name: stored.name,
    email: stored.email,
    bio: stored.bio,
    avatarUrl: stored.avatarUrl,
    role: stored.role,
    contributionsCount: stored.contributionsCount,
  };
}

// ─── Public mock auth API ──────────────────────────────────────

export async function mockLogin(
  email: string,
  password: string
): Promise<MockUser> {
  const normalized = normalizeEmail(email);

  // Preset demo account — always available, even before any signup.
  if (normalized === normalizeEmail(DEMO_EMAIL)) {
    if (password !== DEMO_PASSWORD) {
      throw new Error('Invalid email or password');
    }
    const user: MockUser = { ...DEMO_USER };
    saveSession(user);
    return user;
  }

  const match = readStoredUsers().find(
    (user) => normalizeEmail(user.email) === normalized
  );
  if (!match || match.password !== password) {
    throw new Error('Invalid email or password');
  }

  const user = toPublicUser(match);
  saveSession(user);
  return user;
}

export async function mockSignup(
  name: string,
  email: string,
  password: string
): Promise<MockUser> {
  const normalized = normalizeEmail(email);

  // The preset demo account occupies its own address.
  if (normalized === normalizeEmail(DEMO_EMAIL)) {
    throw new Error('An account with this email already exists');
  }

  const users = readStoredUsers();
  const exists = users.some((user) => normalizeEmail(user.email) === normalized);
  if (exists) {
    throw new Error('An account with this email already exists');
  }

  const created: StoredMockUser = {
    id: `mock-user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    name: name.trim(),
    email: normalized,
    bio: '',
    avatarUrl: '',
    role: 'Explorer',
    contributionsCount: 0,
    password,
  };
  writeStoredUsers([created, ...users]);

  const user = toPublicUser(created);
  saveSession(user);
  return user;
}

export function mockLogout(): void {
  removeSession();
}

export function getMockSession(): MockUser | null {
  return readSession();
}

/**
 * Applies a profile patch to the active mock session.
 * Local fallback for PATCH /api/auth/profile (returns null when
 * no mock session exists).
 */
export function mockUpdateProfile(patch: {
  name?: string;
  bio?: string;
  avatarUrl?: string;
}): MockUser | null {
  const current = readSession();
  if (!current) return null;

  const updated: MockUser = {
    ...current,
    name: patch.name !== undefined ? patch.name : current.name,
    bio: patch.bio !== undefined ? patch.bio : current.bio,
    avatarUrl: patch.avatarUrl !== undefined ? patch.avatarUrl : current.avatarUrl,
  };
  saveSession(updated);

  // Keep the stored signup record in sync when the session belongs to one.
  const users = readStoredUsers();
  const index = users.findIndex(
    (user) => normalizeEmail(user.email) === normalizeEmail(updated.email)
  );
  if (index !== -1) {
    users[index] = {
      ...users[index],
      name: updated.name,
      bio: updated.bio,
      avatarUrl: updated.avatarUrl,
    };
    writeStoredUsers(users);
  }

  return updated;
}
