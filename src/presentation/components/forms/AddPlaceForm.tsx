import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Image as ImageIcon,
  Tag,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  X,
  Upload,
} from 'lucide-react';
import { SubmitPlaceFormDto } from '../../../application/dto/PlaceDto';
import { CATEGORIES } from '../../../shared/constants/categories';
import { usePlaces } from '../../context/PlacesContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';

export const AddPlaceForm: React.FC = () => {
  const navigate = useNavigate();
  const { submitPlace } = usePlaces();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<SubmitPlaceFormDto>({
    name: '',
    description: '',
    story: '',
    category: 'nature',
    type: 'hidden-gem',
    location: '',
    town: '',
    district: '',
    nearbyLandmark: '',
    latitude: '',
    longitude: '',
    imageUrls: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
    bestTimeToVisit: '',
    estimatedDuration: '',
    routeDescription: '',
    accessibility: '',
    tags: ['secret-spot', 'unspoiled'],
  });

  const [newTagInput, setNewTagInput] = useState('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Field change handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'latitude' || name === 'longitude') {
      const numVal = value === '' ? '' : Number(value);
      setFormData((prev) => ({ ...prev, [name]: numVal }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear field-specific error on change
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Tag management
  const handleAddTag = () => {
    const trimmed = newTagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!trimmed) return;
    if (!formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // Image handling
  const handleAddImageUrl = () => {
    if (!photoUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, photoUrlInput.trim()],
    }));
    setPhotoUrlInput('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Invalid File', 'Please select a valid image file (PNG, JPG, WEBP).', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('File Too Large', 'Please select an image smaller than 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({
            ...prev,
            imageUrls: [reader.result as string, ...prev.imageUrls.filter((u) => !u.startsWith('blob:'))],
          }));
          showToast('Image Loaded', 'Local photograph attached and preview ready for submission.', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseDemoLocation = () => {
    setFormData((prev) => ({
      ...prev,
      latitude: 11.2588,
      longitude: 75.7675,
      location: prev.location || 'Kozhikode Beach, Kerala, India',
    }));
    showToast('Demo Location Set', 'Set coordinates to Kozhikode Beach (11.2588, 75.7675).', 'info');
  };

  const handleUseNearbyPondLocation = () => {
    setFormData((prev) => ({
      ...prev,
      latitude: 11.2650,
      longitude: 75.7720,
      location: prev.location || 'Near Kozhikode Beach, Kerala, India',
    }));
    showToast('Nearby Coordinates Set', 'Coordinates set ~800m from Kozhikode Beach.', 'info');
  };

  const handleUseTinkerLocation = () => {
    setFormData((prev) => ({
      ...prev,
      name: prev.name || 'Tinker space',
      description: prev.description || 'A vibrant community makerspace near the beach where creators gather to build projects.',
      category: 'culture',
      type: 'hidden-gem',
      latitude: 11.2610,
      longitude: 75.7720,
      location: 'Near Kozhikode Beach, Calicut, Kerala',
    }));
    showToast('TinkerSpace Location Set', 'Coordinates set near Kozhikode Beach (11.2610, 75.7720).', 'info');
  };

  const handleUseDeviceLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation Unavailable', 'Your browser does not support geolocation.', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4)),
        }));
        showToast('Device Location Detected', `Coordinates updated to ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}.`, 'success');
      },
      (err) => {
        showToast('Location Access Denied', 'Using simulated Kozhikode demo location instead. ' + err.message, 'warning');
      },
      { timeout: 8000 }
    );
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // Client validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errors.name = 'Please provide a place name of at least 3 characters.';
    }

    if (!formData.description.trim() || formData.description.trim().length < 15) {
      errors.description = 'Please provide a descriptive summary of at least 15 characters.';
    }

    if (!formData.location.trim()) {
      errors.location = 'General location or region is required.';
    }

    if (!formData.category) {
      errors.category = 'Please choose a category.';
    }

    if (formData.latitude !== '' && formData.latitude !== undefined) {
      const lat = Number(formData.latitude);
      if (Number.isNaN(lat) || lat < -90 || lat > 90) {
        errors.latitude = 'Latitude must be between -90.0 and 90.0';
      }
    }

    if (formData.longitude !== '' && formData.longitude !== undefined) {
      const lng = Number(formData.longitude);
      if (Number.isNaN(lng) || lng < -180 || lng > 180) {
        errors.longitude = 'Longitude must be between -180.0 and 180.0';
      }
    }

    const hasLat = formData.latitude !== '' && formData.latitude !== undefined;
    const hasLng = formData.longitude !== '' && formData.longitude !== undefined;
    if ((hasLat && !hasLng) || (!hasLat && hasLng)) {
      errors.coordinates = 'Please provide both latitude and longitude, or leave both empty.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Validation Error', 'Please check highlighted fields before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await submitPlace(formData);
      setSubmittedSuccess({ id: created.id, name: created.name });
      showToast(
        'Submission Received',
        `"${created.name}" is now saved to your session atlas with Pending Review status.`,
        'success'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setFormErrors({ submit: msg });
      showToast('Submission Failed', msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div
        className="form-polaroid tape-top-center"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '3px',
          border: '1px solid rgba(221, 212, 192, 0.75)',
          padding: '3.5rem 2rem 2.5rem',
          textAlign: 'center',
          maxWidth: '640px',
          margin: '2.5rem auto',
          boxShadow: '0 16px 48px rgba(45, 42, 35, 0.14), 0 3px 10px rgba(45, 42, 35, 0.06)',
          position: 'relative',
        }}
      >
        <div style={{ fontFamily: 'var(--font-handwritten)', fontSize: '1.6rem', color: 'var(--color-forest)', marginBottom: '1rem' }}>
          "Discovery Logged in the Shared Atlas"
        </div>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <CheckCircle2 size={40} />
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            color: 'var(--color-primary)',
            marginBottom: '0.75rem',
          }}
        >
          Discovery Submitted!
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}
        >
          <strong>{submittedSuccess.name}</strong> has been added to the HiddenAtlas session repository.
          It is currently marked with a <strong>Pending Review</strong> status according to community verification guidelines.
        </p>

        <div
          style={{
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            marginBottom: '2rem',
            textAlign: 'left',
          }}
        >
          ℹ️ <strong>Note on Storage:</strong> Your submission is stored in frontend state and mock repository for the active session. As specified in project requirements, data is not sent to a live external database.
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            onClick={() => navigate('/world', { state: { selectedPlaceId: submittedSuccess.id } })}
          >
            Enter 3D World
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/place/${submittedSuccess.id}`)}
          >
            View Details
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSubmittedSuccess(null);
              setFormData({
                name: '',
                description: '',
                story: '',
                category: 'nature',
                type: 'hidden-gem',
                location: '',
                town: '',
                district: '',
                nearbyLandmark: '',
                latitude: '',
                longitude: '',
                imageUrls: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
                bestTimeToVisit: '',
                estimatedDuration: '',
                routeDescription: '',
                accessibility: '',
                tags: ['community-discovery'],
              });
            }}
          >
            Submit Another Place
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/explore')}
          >
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="form-polaroid tape-top-center"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '3px',
        border: '1px solid rgba(221, 212, 192, 0.75)',
        padding: '3rem 2.5rem 2.5rem',
        boxShadow: '0 16px 48px rgba(45, 42, 35, 0.12), 0 3px 10px rgba(45, 42, 35, 0.06)',
        maxWidth: '820px',
        margin: '1rem auto 0',
        position: 'relative',
      }}
    >
      {/* Handwritten Expedition Caption Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          fontFamily: 'var(--font-handwritten)',
          fontSize: '1.65rem',
          fontWeight: 600,
          color: 'var(--color-forest)',
          lineHeight: 1.25,
        }}>
          "Record your uncharted discovery for fellow explorers"
        </div>
      </div>
      {/* Form Notice Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-primary-subtle)',
          color: 'var(--color-primary)',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          marginBottom: '2rem',
        }}
      >
        <Sparkles size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Share a Destination with the Community</strong>
          <div>
            Every submission helps explorers find authentic places. New submissions are marked as <em>Pending Review</em> and will appear immediately in your session feed.
          </div>
        </div>
      </div>

      {formErrors.submit && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{formErrors.submit}</span>
        </div>
      )}

      {/* Section 1: Basic Information */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            color: 'var(--color-primary)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>1. Basic Information</span>
        </h3>

        {/* Place Name */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="place-name"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.4rem',
            }}
          >
            Place Name <span style={{ color: '#B91C1C' }}>*</span>
          </label>
          <input
            id="place-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Whispering Pines Hidden Cove"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${formErrors.name ? '#B91C1C' : 'var(--color-border)'}`,
              fontSize: '0.9375rem',
            }}
          />
          {formErrors.name && (
            <span style={{ fontSize: '0.75rem', color: '#B91C1C', marginTop: '0.25rem', display: 'block' }}>
              {formErrors.name}
            </span>
          )}
        </div>

        {/* Destination Type & Category in 2 Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          {/* Destination Type */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem',
              }}
            >
              Classification <span style={{ color: '#B91C1C' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <label
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${formData.type === 'hidden-gem' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: formData.type === 'hidden-gem' ? 'var(--color-primary-subtle)' : 'var(--bg-app)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                <input
                  type="radio"
                  name="type"
                  value="hidden-gem"
                  checked={formData.type === 'hidden-gem'}
                  onChange={handleInputChange}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span>✨ Hidden Gem</span>
              </label>

              <label
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${formData.type === 'famous-attraction' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: formData.type === 'famous-attraction' ? 'var(--color-primary-subtle)' : 'var(--bg-app)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                <input
                  type="radio"
                  name="type"
                  value="famous-attraction"
                  checked={formData.type === 'famous-attraction'}
                  onChange={handleInputChange}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span>⭐ Landmark</span>
              </label>
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="place-category"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem',
              }}
            >
              Primary Category <span style={{ color: '#B91C1C' }}>*</span>
            </label>
            <select
              id="place-category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--bg-app)',
                fontSize: '0.9375rem',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Short Description */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="place-desc"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.4rem',
            }}
          >
            Short Summary <span style={{ color: '#B91C1C' }}>*</span>
          </label>
          <textarea
            id="place-desc"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="A compelling 2-3 sentence overview that captures the ambiance and nature of this destination..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${formErrors.description ? '#B91C1C' : 'var(--color-border)'}`,
              fontSize: '0.9375rem',
              lineHeight: 1.5,
              resize: 'vertical',
            }}
          />
          {formErrors.description && (
            <span style={{ fontSize: '0.75rem', color: '#B91C1C', marginTop: '0.25rem', display: 'block' }}>
              {formErrors.description}
            </span>
          )}
        </div>

        {/* Local Story / Lore */}
        <div>
          <label
            htmlFor="place-story"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.4rem',
            }}
          >
            Local Lore & Historical Story (Optional)
          </label>
          <textarea
            id="place-story"
            name="story"
            rows={4}
            value={formData.story}
            onChange={handleInputChange}
            placeholder="Share the story behind this place: folklore, who discovered it, local traditions, or why it remains special..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              fontSize: '0.9375rem',
              lineHeight: 1.5,
              resize: 'vertical',
            }}
          />
        </div>
      </div>

      {/* Section 2: Location & Geographic Coordinates */}
      <div style={{ marginBottom: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            color: 'var(--color-primary)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <MapPin size={20} />
          <span>2. Location & Geographic Coordinates</span>
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          {/* General Location */}
          <div>
            <label
              htmlFor="place-loc"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.4rem',
              }}
            >
              Region / Country <span style={{ color: '#B91C1C' }}>*</span>
            </label>
            <input
              id="place-loc"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. Soca Valley, Slovenia"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${formErrors.location ? '#B91C1C' : 'var(--color-border)'}`,
                fontSize: '0.9375rem',
              }}
            />
            {formErrors.location && (
              <span style={{ fontSize: '0.75rem', color: '#B91C1C', marginTop: '0.25rem', display: 'block' }}>
                {formErrors.location}
              </span>
            )}
          </div>

          {/* Town / Village */}
          <div>
            <label
              htmlFor="place-town"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.4rem',
              }}
            >
              Town or Village
            </label>
            <input
              id="place-town"
              type="text"
              name="town"
              value={formData.town}
              onChange={handleInputChange}
              placeholder="e.g. Bovec"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                fontSize: '0.9375rem',
              }}
            />
          </div>

          {/* Nearby Landmark */}
          <div>
            <label
              htmlFor="place-landmark"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.4rem',
              }}
            >
              Nearby Landmark
            </label>
            <input
              id="place-landmark"
              type="text"
              name="nearbyLandmark"
              value={formData.nearbyLandmark}
              onChange={handleInputChange}
              placeholder="e.g. Old Water Mill Bridge"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                fontSize: '0.9375rem',
              }}
            />
          </div>
        </div>

        {/* Real GPS Coordinates Inputs with Verification */}
        <div
          style={{
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              marginBottom: '0.25rem',
            }}
          >
            Verified GPS Coordinates (Decimal Degrees)
          </div>
          <div
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-muted)',
              marginBottom: '1rem',
            }}
          >
            Used for Google Maps directions and future 3D world positioning. Must be real coordinates (-90 to 90 lat, -180 to 180 lng).
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div>
              <label
                htmlFor="place-lat"
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.35rem',
                }}
              >
                Latitude (-90.00 to 90.00)
              </label>
              <input
                id="place-lat"
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="e.g. 11.2588 (Kozhikode Beach)"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1.5px solid ${formErrors.latitude || formErrors.coordinates ? '#B91C1C' : 'var(--color-border)'}`,
                  fontSize: '0.875rem',
                }}
              />
              {formErrors.latitude && (
                <span style={{ fontSize: '0.75rem', color: '#B91C1C', marginTop: '0.25rem', display: 'block' }}>
                  {formErrors.latitude}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="place-lng"
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.35rem',
                }}
              >
                Longitude (-180.00 to 180.00)
              </label>
              <input
                id="place-lng"
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="e.g. 75.7675 (Kozhikode Beach)"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1.5px solid ${formErrors.longitude || formErrors.coordinates ? '#B91C1C' : 'var(--color-border)'}`,
                  fontSize: '0.875rem',
                }}
              />
              {formErrors.longitude && (
                <span style={{ fontSize: '0.75rem', color: '#B91C1C', marginTop: '0.25rem', display: 'block' }}>
                  {formErrors.longitude}
                </span>
              )}
            </div>
          </div>

          {/* Quick Location Helpers */}
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Quick Fill:
            </span>
            <button
              type="button"
              onClick={handleUseDemoLocation}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(45, 106, 79, 0.1)',
                border: '1px solid rgba(45, 106, 79, 0.3)',
                color: 'var(--color-forest)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-nesiota)',
              }}
            >
              📍 Kozhikode Beach (11.2588, 75.7675)
            </button>
            <button
              type="button"
              onClick={handleUseNearbyPondLocation}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(30, 144, 255, 0.1)',
                border: '1px solid rgba(30, 144, 255, 0.3)',
                color: '#0284C7',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-nesiota)',
              }}
            >
              💧 Nearby Pond (~800m north-east)
            </button>
            <button
              type="button"
              onClick={handleUseTinkerLocation}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                border: '1px solid rgba(217, 119, 6, 0.3)',
                color: '#D97706',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-nesiota)',
              }}
            >
              🏠 TinkerSpace / My Stay (11.2610, 75.7720)
            </button>
            <button
              type="button"
              onClick={handleUseDeviceLocation}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(107, 70, 193, 0.1)',
                border: '1px solid rgba(107, 70, 193, 0.3)',
                color: '#6B46C1',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-nesiota)',
              }}
            >
              📱 Use My Device Location
            </button>
          </div>

          {formErrors.coordinates && (
            <span style={{ fontSize: '0.75rem', color: '#B91C1C', marginTop: '0.5rem', display: 'block' }}>
              {formErrors.coordinates}
            </span>
          )}
        </div>
      </div>

      {/* Section 3: Photography & Media */}
      <div style={{ marginBottom: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            color: 'var(--color-primary)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <ImageIcon size={20} />
          <span>3. Photography & Media</span>
        </h3>

        {/* Local File Upload + Preview */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.4rem',
            }}
          >
            Upload Photo from Computer (Local Preview)
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-app)',
                border: '1.5px dashed var(--color-border)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
              }}
            >
              <Upload size={16} />
              <span>Choose Image File</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              Supports JPG, PNG, WEBP. Preview rendered instantly.
            </span>
          </div>
        </div>

        {/* Or Photo URL input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="photo-url-input"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.4rem',
            }}
          >
            Or Add Image URL (Unsplash, etc.)
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="photo-url-input"
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={photoUrlInput}
              onChange={(e) => setPhotoUrlInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                fontSize: '0.875rem',
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Plus size={14} />}
              onClick={handleAddImageUrl}
            >
              Add URL
            </Button>
          </div>
        </div>

        {/* Image Preview Grid */}
        <div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
            Current Photos ({formData.imageUrls.length}):
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {formData.imageUrls.map((url, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  width: '100px',
                  height: '75px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                }}
              >
                <img
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Remove photo"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Practical Visitor Information */}
      <div style={{ marginBottom: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            color: 'var(--color-primary)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Clock size={20} />
          <span>4. Visitor Experience & Access Guidelines</span>
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <label
              htmlFor="best-time"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.4rem',
              }}
            >
              Best Time to Visit
            </label>
            <input
              id="best-time"
              type="text"
              name="bestTimeToVisit"
              value={formData.bestTimeToVisit}
              onChange={handleInputChange}
              placeholder="e.g. May to September, early morning"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                fontSize: '0.9375rem',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="estimated-duration"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.4rem',
              }}
            >
              Estimated Visit Duration
            </label>
            <input
              id="estimated-duration"
              type="text"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleInputChange}
              placeholder="e.g. 2 - 3 hours"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                fontSize: '0.9375rem',
              }}
            />
          </div>
        </div>

        {/* Route / Access Instructions */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="route-desc"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.4rem',
            }}
          >
            Route & Trail Instructions
          </label>
          <textarea
            id="route-desc"
            name="routeDescription"
            rows={2}
            value={formData.routeDescription}
            onChange={handleInputChange}
            placeholder="Turn-by-turn guidance, where to park, trail markers to watch for..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              fontSize: '0.9375rem',
              lineHeight: 1.5,
              resize: 'vertical',
            }}
          />
        </div>

        {/* Accessibility & Terrain */}
        <div>
          <label
            htmlFor="accessibility-info"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.4rem',
            }}
          >
            Accessibility & Terrain Notes
          </label>
          <input
            id="accessibility-info"
            type="text"
            name="accessibility"
            value={formData.accessibility}
            onChange={handleInputChange}
            placeholder="e.g. Rocky unpaved path with uneven steps, not wheelchair accessible"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              fontSize: '0.9375rem',
            }}
          />
        </div>
      </div>

      {/* Section 5: Tags */}
      <div style={{ marginBottom: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            color: 'var(--color-primary)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Tag size={20} />
          <span>5. Community Tags</span>
        </h3>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Add tag (e.g. waterfall, sunrise)..."
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            style={{
              flex: 1,
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              fontSize: '0.875rem',
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddTag}
          >
            Add
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {formData.tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: 600,
              }}
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  padding: '1px',
                }}
                aria-label={`Remove tag ${tag}`}
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/explore')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          icon={<Sparkles size={16} />}
        >
          Submit for Community Review
        </Button>
      </div>
    </form>
  );
};
