import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { useMemories } from '../../context/MemoryContext';
import { useToast } from '../../context/ToastContext';

interface ShareMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeId: string;
  placeName: string;
}

export const ShareMemoryModal: React.FC<ShareMemoryModalProps> = ({
  isOpen,
  onClose,
  placeId,
  placeName,
}) => {
  const { addMemory } = useMemories();
  const { showToast } = useToast();

  const [travelerName, setTravelerName] = useState('');
  const [caption, setCaption] = useState('');
  const [story, setStory] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const samplePhotoPresets = [
    { label: 'Alpine Peak', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Canyon Rapids', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80' },
    { label: 'Misty Trail', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80' },
    { label: 'Ancient Stones', url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!travelerName.trim()) newErrors.travelerName = 'Traveler name is required';
    if (!caption.trim()) newErrors.caption = 'A handwritten caption is required';
    if (!story.trim() || story.trim().length < 10) newErrors.story = 'Please share a story of at least 10 characters';
    if (!photoUrl.trim() || !photoUrl.startsWith('http')) newErrors.photoUrl = 'A valid image URL is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
        .filter((t) => t.length > 0);

      await addMemory({
        placeId,
        travelerName,
        caption,
        story,
        photoUrl,
        visitDate: visitDate || undefined,
        tags,
      });

      setIsSuccess(true);
      showToast('Memory Chronicled', 'Your travel photograph and story have been pinned to the scrapbook!', 'success');
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Reset form
        setTravelerName('');
        setCaption('');
        setStory('');
        setPhotoUrl('');
        setVisitDate('');
        setTagsInput('');
      }, 1800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to chronicle memory';
      showToast('Error', message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(41, 43, 37, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '4px',
          maxWidth: '640px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          padding: '24px 28px 32px 28px',
          border: '1px solid var(--color-border)',
        }}
        className="tape-top-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--color-parchment-warm)',
            border: '1px solid var(--color-border)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-charcoal)',
            cursor: 'pointer',
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <CheckCircle2 size={56} color="var(--color-forest)" style={{ margin: '0 auto 1.25rem' }} />
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.8rem',
                color: 'var(--color-forest)',
                marginBottom: '0.5rem',
              }}
            >
              Memory Pinned to Journal!
            </h3>
            <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '1rem' }}>
              Thank you for chronicling your story at <strong>{placeName}</strong> for fellow explorers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-earth)',
                  marginBottom: '0.3rem',
                }}
              >
                <Sparkles size={14} />
                <span>Field Scrapbook Entry</span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.75rem',
                  color: 'var(--color-forest)',
                  lineHeight: 1.2,
                }}
              >
                Share Your Memory of {placeName}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-charcoal-muted)', marginTop: '0.35rem' }}>
                Add your photograph and field notes to the community travel scrapbook.
              </p>
            </div>

            {/* Photo URL & Presets */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-forest)',
                  marginBottom: '0.4rem',
                }}
              >
                Photograph URL <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${errors.photoUrl ? 'var(--color-error)' : 'var(--color-border)'}`,
                    backgroundColor: 'var(--color-parchment-light)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
              {errors.photoUrl && (
                <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                  {errors.photoUrl}
                </div>
              )}

              {/* Sample Photo Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-light)' }}>Quick photos:</span>
                {samplePhotoPresets.map((preset) => (
                  <button
                    type="button"
                    key={preset.label}
                    onClick={() => setPhotoUrl(preset.url)}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-parchment-warm)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-earth)',
                      cursor: 'pointer',
                    }}
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>

              {/* Live Preview */}
              {photoUrl && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    height: '140px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#ECE7DB',
                  }}
                >
                  <img
                    src={photoUrl}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Handwritten Caption */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-forest)',
                  marginBottom: '0.4rem',
                }}
              >
                Handwritten Caption / Note <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g., Sunrise over the turquoise rapids"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${errors.caption ? 'var(--color-error)' : 'var(--color-border)'}`,
                  backgroundColor: 'var(--color-parchment-light)',
                  fontFamily: 'var(--font-handwritten)',
                  fontSize: '1.2rem',
                }}
              />
              {errors.caption && (
                <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                  {errors.caption}
                </div>
              )}
            </div>

            {/* Traveler Name & Visit Date Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-forest)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Your Name / Pseudonym <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    placeholder="e.g., Alex Rivers"
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${errors.travelerName ? 'var(--color-error)' : 'var(--color-border)'}`,
                      backgroundColor: 'var(--color-parchment-light)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
                {errors.travelerName && (
                  <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                    {errors.travelerName}
                  </div>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-forest)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Visit Date (Optional)
                </label>
                <input
                  type="text"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  placeholder="e.g., Autumn 2024"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-parchment-light)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>

            {/* Story Textarea */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-forest)',
                  marginBottom: '0.4rem',
                }}
              >
                Personal Travel Story <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <textarea
                rows={3}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Describe what you saw, tips for the trail, weather, or feelings when arriving..."
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${errors.story ? 'var(--color-error)' : 'var(--color-border)'}`,
                  backgroundColor: 'var(--color-parchment-light)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  resize: 'vertical',
                }}
              />
              {errors.story && (
                <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                  {errors.story}
                </div>
              )}
            </div>

            {/* Tags */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-forest)',
                  marginBottom: '0.4rem',
                }}
              >
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. sunset, hidden-trail, solitude"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-parchment-light)',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Chronicling...' : 'Pin to Scrapbook'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
