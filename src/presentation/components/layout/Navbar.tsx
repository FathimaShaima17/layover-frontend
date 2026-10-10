import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Bookmark, PlusCircle, Globe, Menu, X, LogIn, LogOut } from 'lucide-react';
import { useSavedPlaces } from '../../context/SavedPlacesContext';
import { useAuth } from '../../context/AuthContext';
import { FutureWorldModal } from '../common/FutureWorldModal';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { savedCount } = useSavedPlaces();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(245, 240, 227, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        height: 'var(--nav-height)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo / Expedition Header Title */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-forest)',
              border: '1px solid var(--color-forest-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(52, 74, 55, 0.25)',
            }}
          >
            <Compass size={24} strokeWidth={2.2} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: 700,
                color: 'var(--color-forest)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              HiddenAtlas
            </div>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: 'var(--color-earth)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Expedition Journal
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="desktop-nav"
        >
          <Link
            to="/explore"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: isActive('/explore') ? 'var(--color-forest)' : 'var(--color-charcoal-muted)',
              borderBottom: isActive('/explore') ? '2px solid var(--color-forest)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'color var(--transition-fast)',
            }}
          >
            Explore Atlas
          </Link>

          <Link
            to="/saved"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: isActive('/saved') ? 'var(--color-forest)' : 'var(--color-charcoal-muted)',
              borderBottom: isActive('/saved') ? '2px solid var(--color-forest)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Bookmark size={16} />
            <span>Saved Places</span>
            {savedCount > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--color-forest)',
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

          {/* 3D Geographic World link */}
          <Link
            to="/explore/world"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: isActive('/explore/world') ? 'var(--color-forest)' : 'var(--color-charcoal-muted)',
              borderBottom: isActive('/explore/world') ? '2px solid var(--color-forest)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Globe size={16} />
            <span>3D World</span>
            <span
              style={{
                backgroundColor: 'var(--color-forest-light)',
                color: '#FFFFFF',
                fontSize: '0.625rem',
                fontWeight: 700,
                borderRadius: '999px',
                padding: '1px 6px',
                letterSpacing: '0.04em',
              }}
            >
              3D
            </span>
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
          className="desktop-actions"
        >
          <Link to="/add">
            <button
              className="btn btn-primary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <PlusCircle size={16} />
              <span>Share a Discovery</span>
            </button>
          </Link>

          {user ? (
            <>
              {/* Authenticated explorer chip */}
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
                  backgroundColor: '#FFFFFF',
                  transition: 'border-color var(--transition-fast)',
                }}
                title="Explorer Profile"
              >
                {user.avatarUrl ? (
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
                ) : (
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-forest)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-charcoal)',
                    maxWidth: '90px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.name.split(' ')[0]}
                </span>
              </Link>

              {/* Sign Out */}
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                aria-label="Sign out"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-charcoal-muted)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link to="/signin">
              <button
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          style={{
            display: 'none',
            padding: '0.5rem',
            color: 'var(--color-forest)',
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
            backgroundColor: 'var(--color-parchment-light)',
            borderBottom: '1px solid var(--color-border)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
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
              color: 'var(--color-forest)',
            }}
          >
            Explore Atlas
          </Link>
          <Link
            to="/explore/world"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-forest)',
            }}
          >
            <Globe size={18} />
            <span>3D Geographic World</span>
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
              color: 'var(--color-forest)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bookmark size={18} />
              <span>Saved Places</span>
            </span>
            {savedCount > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--color-forest)',
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
            style={{ padding: '0.5rem 0' }}
          >
            <button className="btn btn-primary" style={{ width: '100%' }}>
              <PlusCircle size={18} />
              <span>Share a Discovery</span>
            </button>
          </Link>

          {user ? (
            <>
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
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-forest)' }}>{user.name}</div>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--color-error)',
                  cursor: 'pointer',
                }}
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
              <Link to="/signin" onClick={() => setMobileMenuOpen(false)} style={{ flex: 1 }}>
                <button className="btn btn-secondary" style={{ width: '100%' }}>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} style={{ flex: 1 }}>
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  <span>Create Account</span>
                </button>
              </Link>
            </div>
          )}
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
      <FutureWorldModal isOpen={is3DModalOpen} onClose={() => setIs3DModalOpen(false)} />
    </header>
  );
};
