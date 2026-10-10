import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Globe,
  Flame,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { usePlaces } from '../context/PlacesContext';
import { CATEGORIES } from '../../shared/constants/categories';
import { PlaceCard } from '../components/places/PlaceCard';
import { Button } from '../components/common/Button';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { hiddenGems, trendingPlaces, recentPlaces } = usePlaces();
  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/explore?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          paddingTop: '4.5rem',
          paddingBottom: '5.5rem',
          backgroundColor: '#FAF8F5',
          borderBottom: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative radial background */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(216, 243, 220, 0.45) 0%, rgba(250, 248, 245, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '980px', textAlign: 'center' }}>
          {/* Eyebrow badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            <Compass size={15} />
            <span>Community-Driven Travel Discovery</span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: 'var(--color-primary)',
              letterSpacing: '-0.025em',
              marginBottom: '1.5rem',
            }}
          >
            Discover the World Beyond the Tourist Map.
          </h1>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--color-text-secondary)',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Hidden waterfalls, untouched alpine viewpoints, secret coves, and historical shrines
            curated by local travelers and passionate explorers around the globe.
          </p>

          {/* Destination Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            style={{
              maxWidth: '680px',
              margin: '0 auto 2rem',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              padding: '0.5rem 0.5rem 0.5rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-lg)',
              border: '1.5px solid var(--color-border)',
            }}
          >
            <Search size={22} style={{ color: 'var(--color-primary-light)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search secret gorges, sea caves, mountain passes..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                backgroundColor: 'transparent',
                color: 'var(--color-text-primary)',
              }}
            />
            <Button type="submit" variant="primary" size="md">
              <span>Find Places</span>
            </Button>
          </form>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <Link to="/explore">
              <Button variant="primary" size="lg" icon={<Sparkles size={18} />}>
                Start Exploring
              </Button>
            </Link>

            <Link to="/add">
              <Button
                variant="outline"
                size="lg"
                icon={<PlusCircle size={18} />}
              >
                Share a Hidden Place
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Cards Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-eyebrow">
                <Compass size={14} />
                <span>Curated Landscapes</span>
              </div>
              <h2 className="section-title">Explore by Category</h2>
              <p className="section-subtitle">
                From secluded coastal grottos to century-old cellar taverns and high alpine ridgelines.
              </p>
            </div>
            <Link
              to="/explore"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: 600,
                color: 'var(--color-primary-light)',
                fontSize: '0.9375rem',
              }}
            >
              <span>View all categories</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {CATEGORIES.map((category) => (
              <Link
                key={category.key}
                to={`/explore?category=${category.key}`}
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  border: '1px solid var(--color-border)',
                  transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  textDecoration: 'none',
                }}
                className="category-card"
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: category.bgLight,
                    color: category.accentColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  <Compass size={22} color={category.accentColor} />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.2rem',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {category.label}
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {category.description}
                </p>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-primary-light)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span>Discover spots</span>
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hidden Gems Near You Section */}
      <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--bg-app)' }}>
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-eyebrow">
                <Sparkles size={14} />
                <span>Off The Beaten Path</span>
              </div>
              <h2 className="section-title">Hidden Gems Near You</h2>
              <p className="section-subtitle">
                Secluded natural wonders and peaceful sanctuaries without tourist crowds.
              </p>
            </div>
            <Link
              to="/explore?type=hidden-gem"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: 600,
                color: 'var(--color-primary-light)',
                fontSize: '0.9375rem',
              }}
            >
              <span>Explore all gems</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {hiddenGems.slice(0, 3).map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Destinations Section */}
      <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-eyebrow">
                <Flame size={14} color="#D97706" />
                <span style={{ color: '#D97706' }}>Community Favorites</span>
              </div>
              <h2 className="section-title">Trending Destinations</h2>
              <p className="section-subtitle">
                Highest-rated discoveries currently capturing traveler imaginations.
              </p>
            </div>
            <Link
              to="/explore?sort=popular"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: 600,
                color: 'var(--color-primary-light)',
                fontSize: '0.9375rem',
              }}
            >
              <span>View all trending</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {trendingPlaces.slice(0, 3).map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Discovered Section */}
      <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--bg-app)' }}>
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-eyebrow">
                <Clock size={14} />
                <span>Latest Findings</span>
              </div>
              <h2 className="section-title">Recently Discovered</h2>
              <p className="section-subtitle">
                Fresh additions contributed by explorers in your current session and local guides.
              </p>
            </div>
            <Link
              to="/explore?sort=newest"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: 600,
                color: 'var(--color-primary-light)',
                fontSize: '0.9375rem',
              }}
            >
              <span>View newest</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {recentPlaces.slice(0, 3).map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>
      </section>

      {/* How HiddenAtlas Works Section */}
      <section
        style={{
          padding: '6rem 0',
          backgroundColor: '#1E382B',
          color: '#FFFFFF',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 4rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#D8F3DC',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem',
              }}
            >
              <Compass size={15} />
              <span>Community Ethos</span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.5rem',
                color: '#FFFFFF',
                marginBottom: '1rem',
              }}
            >
              How HiddenAtlas Works
            </h2>
            <p style={{ color: '#C4D7CC', fontSize: '1.0625rem', lineHeight: 1.6 }}>
              We believe in respectful exploration: uncovering untouched nature, preserving local communities, and keeping accurate geographical records.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.25rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(216, 243, 220, 0.15)',
                  color: '#D8F3DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}
              >
                01
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  marginBottom: '0.75rem',
                  color: '#FFFFFF',
                }}
              >
                Uncover Secret Spots
              </h3>
              <p style={{ color: '#B0C2B8', fontSize: '0.9375rem', lineHeight: 1.65 }}>
                Browse destinations mapped with exact GPS coordinates, verified terrain access notes, and local stories passed down by neighborhood scouts.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.25rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(216, 243, 220, 0.15)',
                  color: '#D8F3DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}
              >
                02
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  marginBottom: '0.75rem',
                  color: '#FFFFFF',
                }}
              >
                Experience Like a Local
              </h3>
              <p style={{ color: '#B0C2B8', fontSize: '0.9375rem', lineHeight: 1.65 }}>
                Skip tourist traps. Learn the best hours to visit, historical lore, secret cellar eateries, and trail markers that standard travel apps miss.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.25rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(216, 243, 220, 0.15)',
                  color: '#D8F3DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}
              >
                03
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  marginBottom: '0.75rem',
                  color: '#FFFFFF',
                }}
              >
                Protect & Share Responsibly
              </h3>
              <p style={{ color: '#B0C2B8', fontSize: '0.9375rem', lineHeight: 1.65 }}>
                Help safeguard delicate natural habitats and community sacred spots by following Leave No Trace ethics and responsible sharing guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future 3D World Teaser (Non-interactive informative preview per Section 8) */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-surface-subtle)' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              padding: '3rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-primary-light)',
                  backgroundColor: 'var(--color-primary-subtle)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '1rem',
                }}
              >
                <Globe size={14} />
                <span>Phase 2 Vision Preview</span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  color: 'var(--color-primary)',
                  marginBottom: '1rem',
                  lineHeight: 1.25,
                }}
              >
                The 3D World Atlas is Coming Soon
              </h3>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.65,
                  marginBottom: '1.5rem',
                }}
              >
                Our long-term architectural vision will project all verified GPS coordinates directly onto an interactive 3D digital globe. Destinations you discover or submit today are already stored with verified coordinates ready for the 3D phase.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                <CheckCircle size={16} color="var(--color-primary-light)" />
                <span>Domain models are pre-structured with verified latitude and longitude values</span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#16281F',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 2rem',
                color: '#FFFFFF',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(45, 106, 79, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  color: '#D8F3DC',
                }}
              >
                <Globe size={32} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Spatial Exploration
              </h4>
              <p style={{ fontSize: '0.8125rem', color: '#B0C2B8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Under development for a future release. Current focus: Clean Architecture, high-contrast UI, robust filtering, and community submissions.
              </p>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#A2D2B5',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                Future Phase
              </span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-primary-light);
        }
      `}</style>
    </div>
  );
};
