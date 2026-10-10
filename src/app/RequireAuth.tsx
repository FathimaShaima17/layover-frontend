import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../presentation/context/AuthContext';

/**
 * Route guard for pages that require an authenticated explorer.
 *
 * Redirects to /signin (remembering the requested URL) when
 * no session exists, and shows a skeleton while the stored
 * token is being validated on startup.
 */
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div style={{ height: '400px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-xl)' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
