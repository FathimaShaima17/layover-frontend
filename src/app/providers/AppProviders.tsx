import React from 'react';
import { ToastProvider } from '../../presentation/context/ToastContext';
import { PlacesProvider } from '../../presentation/context/PlacesContext';
import { SavedPlacesProvider } from '../../presentation/context/SavedPlacesContext';
import { MemoryProvider } from '../../presentation/context/MemoryContext';
import { AuthProvider } from '../../presentation/context/AuthContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ToastProvider>
      <PlacesProvider>
        <SavedPlacesProvider>
          <MemoryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </MemoryProvider>
        </SavedPlacesProvider>
      </PlacesProvider>
    </ToastProvider>
  );
};
