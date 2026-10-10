import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Shield, Globe } from 'lucide-react';
import { CATEGORIES } from '../../../shared/constants/categories';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-charcoal)',
        color: '#EFECE6',
        paddingTop: '4.5rem',
        paddingBottom: '3rem',
        marginTop: '6rem',
        borderTop: '3px solid var(--color-earth)',
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
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-forest)',
                  border: '1px solid var(--color-sage)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Compass size={20} />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.45rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em',
                  }}
                >
                  HiddenAtlas
                </span>
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: 'var(--color-sand)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Expedition Journal
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.7,
                color: '#C8C4BA',
                marginBottom: '1.25rem',
              }}
            >
              A community-curated travel journal chronicling secret waterfalls, alpine tarns, secluded coves,
              and authentic stories beyond the crowded tourist trails.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.8125rem',
                color: 'var(--color-sand)',
                backgroundColor: 'rgba(197, 178, 140, 0.12)',
                border: '1px solid rgba(197, 178, 140, 0.25)',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <Globe size={14} />
              <span>Shared 3D Geographic Canvas Active</span>
            </div>
          </div>

          {/* Quick Discover Links */}
          <div>
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-sand)',
                marginBottom: '1.2rem',
              }}
            >
              Field Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link
                  to="/explore"
                  style={{
                    fontSize: '0.875rem',
                    color: '#C8C4BA',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  Curated Destination Atlas
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?type=hidden-gem"
                  style={{
                    fontSize: '0.875rem',
                    color: '#C8C4BA',
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
                    color: '#C8C4BA',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  Historic Monoliths & Landmarks
                </Link>
              </li>
              <li>
                <Link
                  to="/saved"
                  style={{
                    fontSize: '0.875rem',
                    color: '#C8C4BA',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  My Saved Discoveries
                </Link>
              </li>
              <li>
                <Link
                  to="/add"
                  style={{
                    fontSize: '0.875rem',
                    color: '#C8C4BA',
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
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-sand)',
                marginBottom: '1.2rem',
              }}
            >
              Expedition Themes
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.key}>
                  <Link
                    to={`/explore?category=${cat.key}`}
                    style={{
                      fontSize: '0.875rem',
                      color: '#C8C4BA',
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
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-sand)',
                marginBottom: '1.2rem',
              }}
            >
              Explorer's Creed
            </h4>
            <p
              style={{
                fontSize: '0.85rem',
                lineHeight: 1.65,
                color: '#C8C4BA',
                marginBottom: '1rem',
              }}
            >
              Take only photographs, leave only footprints. HiddenAtlas upholds Leave No Trace ethics, verified coordinates, and stewardship of fragile ecosystems.
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: 'var(--color-sand)',
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
            color: '#9C988D',
          }}
        >
          <div>
            © {new Date().getFullYear()} HiddenAtlas — Expedition Journal & Community Travel Scrapbook.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Clean Architecture</span>
            <span>TypeScript Strict</span>
            <span>Leave No Trace</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
