import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { localStorageService, UserProfile } from '../../infrastructure/storage/LocalStorageService';

interface AuthContextValue {
  user: UserProfile;
  isAuthenticated: boolean;
  loginAsDemoUser: (name: string, email: string) => void;
  logout: () => void;
  updateBio: (newBio: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => localStorageService.getUserProfile());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const loginAsDemoUser = useCallback((name: string, email: string) => {
    const updated: UserProfile = {
      ...user,
      name,
      email,
    };
    setUser(updated);
    setIsAuthenticated(true);
    localStorageService.saveUserProfile(updated);
  }, [user]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const updateBio = useCallback((newBio: string) => {
    const updated = { ...user, bio: newBio };
    setUser(updated);
    localStorageService.saveUserProfile(updated);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loginAsDemoUser,
      logout,
      updateBio,
    }),
    [user, isAuthenticated, loginAsDemoUser, logout, updateBio]
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
