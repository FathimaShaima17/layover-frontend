import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Bookmark, PlusCircle, Globe, Menu, X } from 'lucide-react';
import { useSavedPlaces } from '../../context/SavedPlacesContext';
import { useAuth } from '../../context/AuthContext';
import { FutureWorldModal } from '../common/FutureWorldModal';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const location = useLocation();
  const { savedCount } = useSavedPlaces();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(250, 248, 245, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        height: 'var(--nav-height)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Compass size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              HiddenAtlas
            </div>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Community Travel
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav"
        >
          <Link
            to="/explore"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: isActive('/explore') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: isActive('/explore') ? '2px solid var(--color-primary)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'color var(--transition-fast)',
            }}
          >
            Explore
          </Link>

          <Link
            to="/saved"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: isActive('/saved') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: isActive('/saved') ? '2px solid var(--color-primary)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Bookmark size={16} />
            <span>Saved Places</span>
            {savedCount > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  borderRadius: '999px',
                  padding: '1px 6px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}
              >
                {savedCount}
              </span>
            )}
          </Link>

          {/* 3D Atlas Coming Soon indicator button */}
          <button
            type="button"
            onClick={() => setIs3DModalOpen(true)}
            title="Learn about the Phase 2 3D World architecture"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-primary-light)',
              backgroundColor: 'var(--color-primary-subtle)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              border: '1px solid #B7E4C7',
              transition: 'all 0.15s ease',
            }}
          >
            <Globe size={13} />
            <span>3D World • Soon</span>
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
          className="desktop-actions"
        >
          <Link to="/add">
            <button
              className="btn btn-primary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <PlusCircle size={16} />
              <span>Share a Place</span>
            </button>
          </Link>

          <Link
            to="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--bg-surface)',
              transition: 'border-color var(--transition-fast)',
            }}
            title="Explorer Profile"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                maxWidth: '90px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user.name.split(' ')[0]}
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          style={{
            display: 'none',
            padding: '0.5rem',
            color: 'var(--color-primary)',
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--nav-height)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              color: 'var(--color-primary)',
            }}
          >
            Explore Destinations
          </Link>
          <Link
            to="/saved"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'var(--color-primary)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bookmark size={18} />
              <span>Saved Places</span>
            </span>
            {savedCount > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: '999px',
                  padding: '2px 8px',
                }}
              >
                {savedCount}
              </span>
            )}
          </Link>
          <Link
            to="/add"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.5rem 0',
            }}
          >
            <button className="btn btn-primary" style={{ width: '100%' }}>
              <PlusCircle size={18} />
              <span>Share a Place</span>
            </button>
          </Link>
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.role}</div>
            </div>
          </Link>
        </div>
      )}

      {/* Embedded CSS for responsive navbar toggle */}
      <style>{`
        @media (max-width: 820px) {
          .desktop-nav, .desktop-actions {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
      {/* 3D World Information Modal */}
      <FutureWorldModal isOpen={is3DModalOpen} onClose={() => setIs3DModalOpen(false)} />
    </header>
  );
};
