import React from 'react';
import { Modal } from './Modal';
import { Globe, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface FutureWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FutureWorldModal: React.FC<FutureWorldModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="3D Geographic World — Planned Phase 2" maxWidth="620px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Banner */}
        <div
          style={{
            backgroundColor: '#16281F',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            color: '#FFFFFF',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(45, 106, 79, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#D8F3DC',
            }}
          >
            <Globe size={28} />
          </div>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.4rem' }}>
            Spatial Geographic Exploration
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#B0C2B8', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto' }}>
            The next phase of HiddenAtlas will project community-discovered coordinates onto a shared, real-world 3D digital sphere.
          </p>
        </div>

        {/* Clean Architecture Readiness points */}
        <div>
          <h5
            style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-primary)',
              marginBottom: '0.75rem',
            }}
          >
            How our Clean Architecture prepares for Phase 2:
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                backgroundColor: 'var(--bg-app)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.85rem',
              }}
            >
              <CheckCircle size={18} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Domain Entity Independence:</strong> Destination coordinates are stored as normalized latitude & longitude value objects, completely detached from rendering libraries.
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                backgroundColor: 'var(--bg-app)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.85rem',
              }}
            >
              <CheckCircle size={18} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Plug-and-Play Presentation:</strong> Adding a future 3D canvas route will require zero changes to existing use cases (`GetPlaces`, `SearchPlaces`).
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                backgroundColor: 'var(--bg-app)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.85rem',
              }}
            >
              <CheckCircle size={18} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Validated Community Inputs:</strong> Every place submitted through our form verifies latitude (-90 to 90) and longitude (-180 to 180) to ensure accurate future 3D map placing.
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          <Button variant="secondary" onClick={onClose}>
            Got it
          </Button>
          <Link to="/explore" onClick={onClose}>
            <Button variant="primary" icon={<ArrowRight size={15} />}>
              Explore 2D Atlas
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};
