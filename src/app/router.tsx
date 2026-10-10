import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../presentation/components/layout/Layout';
import { HomePage } from '../presentation/pages/HomePage';
import { ExplorePage } from '../presentation/pages/ExplorePage';
import { WorldPage } from '../presentation/pages/WorldPage';
import { PlaceDetailsPage } from '../presentation/pages/PlaceDetailsPage';
import { AddPlacePage } from '../presentation/pages/AddPlacePage';
import { SavedPlacesPage } from '../presentation/pages/SavedPlacesPage';
import { SignInPage } from '../presentation/pages/SignInPage';
import { SignUpPage } from '../presentation/pages/SignUpPage';
import { ProfilePage } from '../presentation/pages/ProfilePage';
import { RequireAuth } from './RequireAuth';

export const AppRouter: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/world" element={<WorldPage />} />
        <Route path="/world" element={<Navigate to="/explore/world" replace />} />
        <Route path="/place/:id" element={<PlaceDetailsPage />} />

        {/* Authentication (public) */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected routes — require an authenticated explorer */}
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/add"
          element={
            <RequireAuth>
              <AddPlacePage />
            </RequireAuth>
          }
        />
        <Route
          path="/saved"
          element={
            <RequireAuth>
              <SavedPlacesPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};
