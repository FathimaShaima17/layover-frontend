import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../presentation/components/layout/Layout';
import { HomePage } from '../presentation/pages/HomePage';
import { ExplorePage } from '../presentation/pages/ExplorePage';
import { PlaceDetailsPage } from '../presentation/pages/PlaceDetailsPage';
import { AddPlacePage } from '../presentation/pages/AddPlacePage';
import { SavedPlacesPage } from '../presentation/pages/SavedPlacesPage';
import { SignInPage } from '../presentation/pages/SignInPage';

export const AppRouter: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/place/:id" element={<PlaceDetailsPage />} />
        <Route path="/add" element={<AddPlacePage />} />
        <Route path="/saved" element={<SavedPlacesPage />} />
        <Route path="/profile" element={<SignInPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};
