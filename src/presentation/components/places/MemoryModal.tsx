import React from 'react';
import { X, Calendar, Tag, Compass } from 'lucide-react';
import { Memory } from '../../../domain/entities/Memory';

interface MemoryModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
  placeName?: string;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  memory,
  isOpen,
  onClose,
  placeName,
}) => {
  if (!isOpen || !memory) return null;

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
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          padding: '24px 24px 32px 24px',
          border: '1px solid var(--color-border)',
        }}
        className="tape-top-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
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
            zIndex: 10,
          }}
          aria-label="Close story"
        >
          <X size={18} />
        </button>

        {/* Large Polaroid Photograph Frame */}
        <div
          style={{
            backgroundColor: '#FAFAF8',
            padding: '10px 10px 14px 10px',
            border: '1px solid #E2DCce',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              width: '100%',
              height: 'clamp(260px, 40vh, 380px)',
              overflow: 'hidden',
              backgroundColor: '#ECE7DB',
            }}
          >
            <img
              src={memory.photoUrl}
              alt={memory.caption}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <div
            style={{
              fontFamily: 'var(--font-handwritten)',
              fontSize: '1.55rem',
              color: 'var(--color-forest-dark)',
              marginTop: '0.85rem',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            "{memory.caption}"
          </div>
        </div>

        {/* Traveler Meta Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px dashed var(--color-border)',
            paddingBottom: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={memory.travelerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={memory.travelerName}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--color-sand)',
              }}
            />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-forest)', fontSize: '1rem' }}>
                {memory.travelerName}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-charcoal-muted)' }}>
                Field Contributor
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem', color: 'var(--color-charcoal-light)' }}>
            {memory.visitDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} color="var(--color-earth)" />
                <span>Visited {memory.visitDate}</span>
              </div>
            )}
            {placeName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Compass size={14} color="var(--color-forest)" />
                <span>{placeName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Story Body */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              color: 'var(--color-forest)',
              marginBottom: '0.65rem',
            }}
          >
            Personal Travel Log
          </h4>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'var(--color-charcoal)',
              whiteSpace: 'pre-line',
            }}
          >
            {memory.story}
          </p>
        </div>

        {/* Tags */}
        {memory.tags && memory.tags.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Tag size={14} color="var(--color-earth)" />
            {memory.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--color-parchment-warm)',
                  color: 'var(--color-earth-dark)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
