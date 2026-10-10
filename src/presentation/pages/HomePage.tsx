import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Globe,
  Feather,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { usePlaces } from '../context/PlacesContext';
import { CATEGORIES } from '../../shared/constants/categories';
import { PlaceCard } from '../components/places/PlaceCard';
import { Button } from '../components/common/Button';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { hiddenGems, trendingPlaces } = usePlaces();
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
      {/* 1. Cinematic Expedition Hero */}
      <section
        style={{
          position: 'relative',
          paddingTop: '6rem',
          paddingBottom: '7.5rem',
          backgroundColor: '#1E2D22',
          color: '#FAF7F0',
          backgroundImage: `linear-gradient(180deg, rgba(30, 45, 34, 0.72) 0%, rgba(20, 31, 23, 0.88) 100%), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 3, maxWidth: '980px', textAlign: 'center' }}>
          {/* Expedition Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(197, 178, 140, 0.2)',
              border: '1px solid rgba(197, 178, 140, 0.45)',
              backdropFilter: 'blur(6px)',
              color: 'var(--color-sand)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '1.75rem',
            }}
          >
            <Compass size={15} />
            <span>Curated Expedition Journal & Community Atlas</span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#FAF7F0',
              letterSpacing: '-0.025em',
              marginBottom: '1.5rem',
              textShadow: '0 2px 14px rgba(0,0,0,0.3)',
            }}
          >
            Discover the World Beyond the Tourist Map.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'rgba(250, 247, 240, 0.88)',
              maxWidth: '740px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            A collective field log of secret gorges, misty alpine ridgelines, secluded coastal grottos,
            and personal stories chronicled by travelers who walked them.
          </p>

          {/* Search Field */}
          <form
            onSubmit={handleHeroSearch}
            style={{
              maxWidth: '680px',
              margin: '0 auto 2.25rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '0.5rem 0.5rem 0.5rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.28)',
              border: '2px solid var(--color-sand)',
            }}
          >
            <Search size={22} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search secret waterfalls, mountain passes, sea caves..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                backgroundColor: 'transparent',
                color: 'var(--color-charcoal)',
              }}
            />
            <Button type="submit" variant="primary" size="md">
              <span>Find Places</span>
            </Button>
          </form>

          {/* Actions */}
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
              <button
                className="btn btn-primary btn-lg"
                style={{
                  backgroundColor: 'var(--color-sand)',
                  color: 'var(--color-charcoal)',
                  borderColor: 'var(--color-sand)',
                }}
              >
                <Compass size={18} />
                <span>Begin Exploring</span>
              </button>
            </Link>

            <Link to="/add">
              <button
                className="btn btn-secondary btn-lg"
                style={{
                  backgroundColor: 'rgba(250, 247, 240, 0.15)',
                  color: '#FAF7F0',
                  borderColor: 'rgba(250, 247, 240, 0.4)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <PlusCircle size={18} />
                <span>Share a Discovery</span>
              </button>
            </Link>

            <Link to="/explore/world">
              <button
                className="btn btn-outline btn-lg"
                style={{
                  color: '#FAF7F0',
                  borderColor: 'rgba(197, 178, 140, 0.7)',
                }}
              >
                <Globe size={18} />
                <span>3D Geographic World</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Torn Paper Transition Divider */}
      <div className="torn-edge-bottom" style={{ backgroundColor: 'var(--color-parchment)', height: '24px' }} />

      {/* 3. Expedition Highlights by Theme / Category */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--color-parchment)' }}>
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-eyebrow">
                <Compass size={14} />
                <span>Atlas Chapters</span>
              </div>
              <h2 className="section-title">Expedition Categories</h2>
              <p className="section-subtitle">
                Explore curated archives arranged by geographic terrains, from emerald rivers to centuries-old stone monasteries.
              </p>
            </div>
            <Link
              to="/explore"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 700,
                color: 'var(--color-forest)',
                fontSize: '0.9375rem',
              }}
            >
              <span>View complete atlas</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {CATEGORIES.map((category) => (
              <Link
                key={category.key}
                to={`/explore?category=${category.key}`}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.75rem',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  textDecoration: 'none',
                }}
                className="category-card"
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: category.bgLight,
                    color: category.accentColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  <Compass size={24} color={category.accentColor} />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    color: 'var(--color-forest)',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {category.label}
                </h3>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-charcoal-muted)',
                    lineHeight: 1.6,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {category.description}
                </p>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-forest-light)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>Explore entries</span>
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Hidden Gems Editorial Section with Warm Parchment & Polaroid accents */}
      <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--color-parchment-light)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-eyebrow">
                <Sparkles size={14} />
                <span>Uncharted Discoveries</span>
              </div>
              <h2 className="section-title">Off the Beaten Path</h2>
              <p className="section-subtitle">
                Secluded spots, quiet viewpoints, and secret corners verified by local contributors.
              </p>
            </div>
            <Link
              to="/explore?type=hidden-gem"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 700,
                color: 'var(--color-forest)',
                fontSize: '0.9375rem',
              }}
            >
              <span>Explore all hidden gems</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {hiddenGems.slice(0, 3).map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Scrapbook Travel Manifesto & Explorer's Log */}
      <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--color-parchment)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Asymmetric Polaroid Composition */}
            <div style={{ position: 'relative', minHeight: '380px' }}>
              <div
                className="polaroid-card tape-top-left"
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '10px',
                  width: '260px',
                  transform: 'rotate(-4deg)',
                  zIndex: 2,
                }}
              >
                <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80"
                    alt="Canyon pool"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ fontFamily: 'var(--font-handwritten)', fontSize: '1.25rem', marginTop: '0.5rem', textAlign: 'center' }}>
                  "Morning dip in Soča River"
                </div>
              </div>

              <div
                className="polaroid-card tape-top-right"
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '20px',
                  width: '270px',
                  transform: 'rotate(5deg)',
                  zIndex: 3,
                }}
              >
                <div style={{ width: '100%', height: '190px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80"
                    alt="Meteora summit"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ fontFamily: 'var(--font-handwritten)', fontSize: '1.25rem', marginTop: '0.5rem', textAlign: 'center' }}>
                  "Monastery stairs at dusk"
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Text */}
            <div>
              <div className="section-eyebrow">
                <Feather size={14} />
                <span>The Explorer's Manifesto</span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.4rem',
                  color: 'var(--color-forest)',
                  lineHeight: 1.25,
                  marginBottom: '1.25rem',
                }}
              >
                Travel is richer when shared with reverence.
              </h2>
              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                  color: 'var(--color-charcoal)',
                  marginBottom: '1.25rem',
                }}
              >
                HiddenAtlas was created for wanderers who seek authenticity over crowded checklists.
                Every pin on our map includes real geographic coordinates, respectful access notes,
                and personal travel stories chronicled by the people who stood there.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9375rem', color: 'var(--color-forest)' }}>
                  <CheckCircle2 size={18} color="var(--color-forest)" />
                  <span><strong>Leave No Trace:</strong> Preserve delicate ecosystems and respect local communities.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9375rem', color: 'var(--color-forest)' }}>
                  <CheckCircle2 size={18} color="var(--color-forest)" />
                  <span><strong>Verified Coordinates:</strong> Accurate latitude and longitude for responsible route planning.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9375rem', color: 'var(--color-forest)' }}>
                  <CheckCircle2 size={18} color="var(--color-forest)" />
                  <span><strong>Community Scrapbook:</strong> Genuine photographs and firsthand travel moments.</span>
                </div>
              </div>

              <Link to="/add">
                <Button variant="primary" size="lg" icon={<PlusCircle size={18} />}>
                  Contribute Your Discovery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Famous Landmarks Section */}
      {trendingPlaces.length > 0 && (
        <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--color-parchment-light)', borderTop: '1px solid var(--color-border)' }}>
          <div className="container">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div className="section-eyebrow">
                  <Flame size={14} />
                  <span>Historic Monoliths & Heritage</span>
                </div>
                <h2 className="section-title">Notable Expeditions</h2>
                <p className="section-subtitle">
                  Historic citadels, coastal monuments, and iconic destinations celebrated worldwide.
                </p>
              </div>
              <Link
                to="/explore?type=famous-attraction"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 700,
                  color: 'var(--color-forest)',
                  fontSize: '0.9375rem',
                }}
              >
                <span>View all landmarks</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}
            >
              {trendingPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Styles */}
      <style>{`
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-forest-light);
        }
      `}</style>
    </div>
  );
};
