import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Bookmark,
  PlusCircle,
  Edit3,
  Check,
  Award,
  LogOut,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSavedPlaces } from '../context/SavedPlacesContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';
import { Button } from '../components/common/Button';

/**
 * Explorer profile — shows the signed-in user's real account data
 * fetched from the backend and allows editing name & bio.
 */
export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { savedCount } = useSavedPlaces();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name ?? '');
  const [bioInput, setBioInput] = useState(user?.bio ?? '');
  const [isSaving, setIsSaving] = useState(false);

  // No session (e.g. token expired mid-render) — bounce to sign-in
  if (!user) {
    return null;
  }

  const startEditing = () => {
    setNameInput(user.name);
    setBioInput(user.bio);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!nameInput.trim()) {
      showToast('Name Required', 'Your explorer name cannot be empty.', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile({ name: nameInput.trim(), bio: bioInput.trim() });
      setIsEditing(false);
      showToast('Profile Updated', 'Your explorer profile was saved.', 'success');
    } catch (err) {
      showToast(
        'Update Failed',
        err instanceof Error ? err.message : 'Could not save your profile.',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Signed Out', 'You have been signed out of HiddenAtlas.', 'info');
    navigate('/');
  };

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <Breadcrumbs items={[{ label: 'Explorer Profile' }]} />

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
                backgroundColor: 'var(--bg-surface-subtle)',
              }}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontSize: '2rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                <MapPin size={14} />
                <span>{user.email}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {!isEditing ? (
                <Button variant="secondary" size="sm" icon={<Edit3 size={15} />} onClick={startEditing}>
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Check size={15} />}
                  onClick={() => void handleSave()}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving…' : 'Save'}
                </Button>
              )}
              <Button variant="outline" size="sm" icon={<LogOut size={15} />} onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>

          {/* Explorer Stats Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem',
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
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <ShieldCheck size={22} />
                <span>Verified</span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                JWT Authenticated Account
              </div>
            </div>
          </div>

          {/* Bio Section with Inline Editing */}
          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <label
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Explorer Bio & Philosophy
              </label>
              {!isEditing && (
                <button
                  onClick={startEditing}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8125rem',
                    color: 'var(--color-primary-light)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Edit3 size={14} />
                  <span>Edit Bio</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Explorer name"
                  aria-label="Explorer name"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                  }}
                />
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  aria-label="Explorer bio"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    resize: 'vertical',
                  }}
                />
              </div>
            ) : (
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                }}
              >
                {user.bio ? `"${user.bio}"` : 'No bio yet — click "Edit Profile" to tell fellow explorers about your adventures.'}
              </p>
            )}
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
