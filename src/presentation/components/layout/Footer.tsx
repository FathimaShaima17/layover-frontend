import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Shield, Globe } from 'lucide-react';
import { CATEGORIES } from '../../../shared/constants/categories';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#16281F',
        color: '#E8EFEA',
        paddingTop: '4.5rem',
        paddingBottom: '3rem',
        marginTop: '6rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Brand Column */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9px',
                  backgroundColor: 'var(--color-primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Compass size={20} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                }}
              >
                HiddenAtlas
              </span>
            </div>
            <p
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.65,
                color: '#B0C2B8',
                marginBottom: '1.25rem',
              }}
            >
              A community-curated travel atlas dedicated to discovering secret gorges,
              ancient shrines, secluded coves, and remarkable sights beyond the tourist trails.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.8125rem',
                color: '#A2D2B5',
                backgroundColor: 'rgba(45, 106, 79, 0.35)',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Globe size={14} />
              <span>3D Geographic World — Phase 2 In Progress</span>
            </div>
          </div>

          {/* Quick Discover Links */}
          <div>
            <h4
              style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#FFFFFF',
                marginBottom: '1.2rem',
              }}
            >
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link
                  to="/explore"
                  style={{
                    fontSize: '0.875rem',
                    color: '#B0C2B8',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  All Destinations
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?type=hidden-gem"
                  style={{
                    fontSize: '0.875rem',
                    color: '#B0C2B8',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  Hidden Gems Only
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?type=famous-attraction"
                  style={{
                    fontSize: '0.875rem',
                    color: '#B0C2B8',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  Famous Landmarks
                </Link>
              </li>
              <li>
                <Link
                  to="/saved"
                  style={{
                    fontSize: '0.875rem',
                    color: '#B0C2B8',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  My Saved Atlas
                </Link>
              </li>
              <li>
                <Link
                  to="/add"
                  style={{
                    fontSize: '0.875rem',
                    color: '#B0C2B8',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  Submit a Discovery
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4
              style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#FFFFFF',
                marginBottom: '1.2rem',
              }}
            >
              Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.key}>
                  <Link
                    to={`/explore?category=${cat.key}`}
                    style={{
                      fontSize: '0.875rem',
                      color: '#B0C2B8',
                      transition: 'color var(--transition-fast)',
                    }}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Stewardship */}
          <div>
            <h4
              style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#FFFFFF',
                marginBottom: '1.2rem',
              }}
            >
              Responsible Travel
            </h4>
            <p
              style={{
                fontSize: '0.85rem',
                lineHeight: 1.6,
                color: '#B0C2B8',
                marginBottom: '1rem',
              }}
            >
              Protect sacred sites and pristine habitats. HiddenAtlas promotes Leave No Trace principles,
              verified trail safety, and respecting local community traditions.
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: '#E9D8A6',
              }}
            >
              <Shield size={16} />
              <span>Community Reviewed & Curated</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: '#899E92',
          }}
        >
          <div>
            © {new Date().getFullYear()} HiddenAtlas. Clean Architecture React + TypeScript Platform.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Clean Architecture</span>
            <span>Domain Driven Design</span>
            <span>TypeScript Strict</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
