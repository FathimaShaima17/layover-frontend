import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserProfile, localStorageService } from '../../infrastructure/storage/LocalStorageService';
import { apiAuthRepository } from '../../infrastructure/repositories/ApiAuthRepository';
import { apiPlaceRepository } from '../../infrastructure/repositories/ApiPlaceRepository';
import { AUTH_EXPIRED_EVENT } from '../../shared/constants/authEvents';

const TOKEN_KEY = 'hiddenatlas_auth_token';
const USER_KEY = 'hiddenatlas_user_profile';

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateBio: (newBio: string) => Promise<void>;
  updateProfile: (patch: {
    name?: string;
    bio?: string;
    avatarUrl?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Reads the persisted token from localStorage (returns null when absent). */
function readStoredToken(): string | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Reads the persisted user profile from localStorage. */
function readStoredUser(): UserProfile | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(() => readStoredUser());
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(token));

  // ─── Session bootstrap: validate stored token against the backend ───
  useEffect(() => {
    let cancelled = false;

    async function bootstrap(): Promise<void> {
      const storedToken = readStoredToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await apiAuthRepository.me(storedToken);
        if (!cancelled) {
          setUser(profile);
          setToken(storedToken);
          localStorageService.saveUserProfile(profile);
          apiPlaceRepository.setAuthToken(storedToken);
        }
      } catch {
        // Token invalid/expired — clear the stale session
        if (!cancelled) {
          clearSession();
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Global 401 listener: auto-logout when any API call is rejected ─
  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleUnauthorized);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Persists token + user and wires the token into the places repository. */
  const persistSession = useCallback(
    (newToken: string, profile: UserProfile) => {
      try {
        window.localStorage.setItem(TOKEN_KEY, newToken);
        window.localStorage.setItem(USER_KEY, JSON.stringify(profile));
      } catch {
        // Storage unavailable — session lives in memory only
      }
      setToken(newToken);
      setUser(profile);
      apiPlaceRepository.setAuthToken(newToken);
    },
    []
  );

  /** Clears the session from state, storage and the places repository. */
  const clearSession = useCallback(() => {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
    apiPlaceRepository.setAuthToken(null);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const result = await apiAuthRepository.login(email, password);
      persistSession(result.token, result.user);
    },
    [persistSession]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<void> => {
      const result = await apiAuthRepository.register(name, email, password);
      persistSession(result.token, result.user);
    },
    [persistSession]
  );

  const logout = useCallback((): void => {
    clearSession();
  }, [clearSession]);

  const updateProfile = useCallback(
    async (patch: { name?: string; bio?: string; avatarUrl?: string }): Promise<void> => {
      const currentToken = readStoredToken();
      if (!currentToken) {
        throw new Error('You must be signed in to update your profile.');
      }
      const updated = await apiAuthRepository.updateProfile(currentToken, patch);
      localStorageService.saveUserProfile(updated);
      setUser(updated);
    },
    []
  );

  const updateBio = useCallback(
    async (newBio: string): Promise<void> => {
      await updateProfile({ bio: newBio });
    },
    [updateProfile]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      updateBio,
      updateProfile,
    }),
    [user, isLoading, login, register, logout, updateBio, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
