import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Bookmark, PlusCircle, Edit3, Check, Award, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSavedPlaces } from '../context/SavedPlacesContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';
import { Button } from '../components/common/Button';

export const SignInPage: React.FC = () => {
  const { user, loginAsDemoUser, updateBio } = useAuth();
  const { savedCount } = useSavedPlaces();
  const { showToast } = useToast();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(user.bio);

  const handleSaveBio = () => {
    updateBio(bioInput);
    setIsEditingBio(false);
    showToast('Profile Updated', 'Explorer bio saved to browser storage.', 'success');
  };

  const handleSwitchPersona = (name: string, email: string) => {
    loginAsDemoUser(name, email);
    showToast('Persona Switched', `Now logged in as prototype traveler: ${name}`, 'info');
  };

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <Breadcrumbs items={[{ label: 'Explorer Profile Prototype' }]} />

        {/* Prototype Warning Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            color: '#92400E',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            marginBottom: '2.5rem',
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Frontend Prototype Mode</strong>
            <div>
              This is a lightweight client-side profile simulator. Real authentication and backend databases are intentionally excluded in this development phase per requirements. No passwords or credentials are stored.
            </div>
          </div>
        </div>

        {/* Main Explorer Profile Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2.5rem',
          }}
        >
          {/* Top Banner / Avatar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.75rem',
              marginBottom: '2rem',
              paddingBottom: '2rem',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid var(--color-primary-light)',
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0,
              }}
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-primary-light)',
                  backgroundColor: 'var(--color-primary-subtle)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '0.5rem',
                }}
              >
                <Award size={12} />
                <span>{user.role}</span>
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.85rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: '0.25rem',
                }}
              >
                {user.name}
              </h1>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {user.email}
              </div>
            </div>
          </div>

          {/* Explorer Stats Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {user.contributionsCount}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Community Submissions
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {savedCount}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Saved Bookmarks
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Verified Scout Accuracy
              </div>
            </div>
          </div>

          {/* Bio Section with Inline Editing */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Explorer Bio & Philosophy
              </label>
              {!isEditingBio ? (
                <button
                  onClick={() => setIsEditingBio(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8125rem',
                    color: 'var(--color-primary-light)',
                    fontWeight: 600,
                  }}
                >
                  <Edit3 size={14} />
                  <span>Edit Bio</span>
                </button>
              ) : (
                <button
                  onClick={handleSaveBio}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8125rem',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                  }}
                >
                  <Check size={14} />
                  <span>Save</span>
                </button>
              )}
            </div>

            {isEditingBio ? (
              <textarea
                rows={3}
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-border)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                }}
              />
            ) : (
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{user.bio}"
              </p>
            )}
          </div>

          {/* Switch Demo Persona */}
          <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.75rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
              Switch Demo Traveler Persona:
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleSwitchPersona('Elena Rostova', 'elena.rostova@explorer.org')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${user.name === 'Elena Rostova' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: user.name === 'Elena Rostova' ? 'var(--color-primary-subtle)' : 'var(--bg-app)',
                  color: user.name === 'Elena Rostova' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Elena Rostova (Alpine Guide)
              </button>

              <button
                onClick={() => handleSwitchPersona('Mateo Silva', 'mateo.silva@wanderlust.net')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${user.name === 'Mateo Silva' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: user.name === 'Mateo Silva' ? 'var(--color-primary-subtle)' : 'var(--bg-app)',
                  color: user.name === 'Mateo Silva' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Mateo Silva (Coastal Scout)
              </button>

              <button
                onClick={() => handleSwitchPersona('Amina Kassam', 'amina.k@atlasvoyager.io')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${user.name === 'Amina Kassam' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: user.name === 'Amina Kassam' ? 'var(--color-primary-subtle)' : 'var(--bg-app)',
                  color: user.name === 'Amina Kassam' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Amina Kassam (Heritage Chronicler)
              </button>
            </div>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/saved">
            <Button variant="outline" icon={<Bookmark size={16} />}>
              View My Saved Places
            </Button>
          </Link>
          <Link to="/add">
            <Button variant="primary" icon={<PlusCircle size={16} />}>
              Submit a New Place
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="secondary" icon={<Compass size={16} />}>
              Explore All Atlas Gems
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
