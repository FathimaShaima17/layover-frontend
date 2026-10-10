import React, { useState } from 'react';
import { Modal } from './Modal';
import { Copy, Check, MessageCircle, Send, Mail, MapPin } from 'lucide-react';
import { Button } from './Button';
import { Place } from '../../../domain/entities/Place';
import { formatCoordinates } from '../../../domain/value-objects/Coordinates';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, place }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const shareText = `Check out this discovery on HiddenAtlas: ${place.name} in ${place.location}!`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Discovery" maxWidth="500px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Preview snippet */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--color-border)',
          }}
        >
          {place.images && place.images[0] && (
            <img
              src={place.images[0]}
              alt={place.name}
              style={{
                width: '64px',
                height: '52px',
                borderRadius: 'var(--radius-sm)',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4
              style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {place.name}
            </h4>
            <div
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <MapPin size={12} color="var(--color-secondary)" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {place.location}
              </span>
            </div>
            {place.coordinates && (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {formatCoordinates(place.coordinates)}
              </div>
            )}
          </div>
        </div>

        {/* Copy Link Input */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: '0.35rem',
            }}
          >
            Direct Link
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              readOnly
              value={shareUrl}
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--bg-app)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
              }}
            />
            <Button
              variant={copied ? 'primary' : 'outline'}
              size="sm"
              icon={copied ? <Check size={14} /> : <Copy size={14} />}
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Quick Social Buttons */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            Share Via
          </label>
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', flex: 1 }}
            >
              <button
                type="button"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                }}
              >
                <MessageCircle size={15} />
                <span>WhatsApp</span>
              </button>
            </a>

            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', flex: 1 }}
            >
              <button
                type="button"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#0088CC',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                }}
              >
                <Send size={15} />
                <span>Telegram</span>
              </button>
            </a>

            <a
              href={`mailto:?subject=${encodeURIComponent(`HiddenAtlas Discovery: ${place.name}`)}&body=${encodeURIComponent(`${shareText}\n\nExplore it here: ${shareUrl}`)}`}
              style={{ textDecoration: 'none', flex: 1 }}
            >
              <button
                type="button"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                }}
              >
                <Mail size={15} />
                <span>Email</span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
