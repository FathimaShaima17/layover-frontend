import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ToastContainer } from '../common/Toast';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isWorldPage =
    location.pathname.startsWith('/explore/world') || location.pathname === '/world';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: isWorldPage ? '100vh' : undefined,
        overflow: isWorldPage ? 'hidden' : undefined,
      }}
    >
      <Navbar />
      <main
        style={{
          flex: 1,
          position: 'relative',
          overflow: isWorldPage ? 'hidden' : undefined,
          display: isWorldPage ? 'flex' : undefined,
          flexDirection: isWorldPage ? 'column' : undefined,
        }}
      >
        {children}
      </main>
      {!isWorldPage && <Footer />}
      <ToastContainer />
    </div>
  );
};
