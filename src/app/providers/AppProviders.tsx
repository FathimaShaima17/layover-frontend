import React from 'react';
import { ToastProvider } from '../../presentation/context/ToastContext';
import { PlacesProvider } from '../../presentation/context/PlacesContext';
import { SavedPlacesProvider } from '../../presentation/context/SavedPlacesContext';
import { AuthProvider } from '../../presentation/context/AuthContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ToastProvider>
      <PlacesProvider>
        <SavedPlacesProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SavedPlacesProvider>
      </PlacesProvider>
    </ToastProvider>
  );
};
