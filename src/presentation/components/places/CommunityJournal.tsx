import React, { useState, useEffect } from 'react';
import { Camera, Plus, BookOpen, Calendar, Sparkles } from 'lucide-react';
import { Memory } from '../../../domain/entities/Memory';
import { useMemories } from '../../context/MemoryContext';
import { Button } from '../common/Button';
import { MemoryModal } from './MemoryModal';
import { ShareMemoryModal } from './ShareMemoryModal';

interface CommunityJournalProps {
  placeId: string;
  placeName: string;
}

export const CommunityJournal: React.FC<CommunityJournalProps> = ({
  placeId,
  placeName,
}) => {
  const { getMemoriesByPlaceId } = useMemories();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      const data = await getMemoriesByPlaceId(placeId);
      if (isMounted) {
        setMemories(data);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [placeId, getMemoriesByPlaceId]);

  // Rotations for authentic scrapbook aesthetic
  const rotations = ['rotate(-1.2deg)', 'rotate(1.4deg)', 'rotate(-0.8deg)', 'rotate(1.1deg)', 'rotate(-1.5deg)', 'rotate(0.9deg)'];
  const tapes = ['tape-top-center', 'tape-top-left', 'tape-top-right'];

  return (
    <section
      style={{
        marginTop: '4.5rem',
        paddingTop: '3.5rem',
        paddingBottom: '3rem',
        borderTop: '1px solid var(--color-border)',
        position: 'relative',
      }}
    >
      {/* Header & CTA */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <div className="section-eyebrow">
            <Sparkles size={14} />
            <span>Community Travel Scrapbook</span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.25rem',
              fontWeight: 600,
              color: 'var(--color-forest)',
              lineHeight: 1.2,
              letterSpacing: '-0.015em',
            }}
          >
            Seen Through Your Eyes
          </h2>
          <p
            style={{
              fontSize: '1.025rem',
              color: 'var(--color-charcoal-muted)',
              marginTop: '0.45rem',
              maxWidth: '600px',
            }}
          >
            Real travel moments, field photographs, and personal notes chronicled by fellow explorers who stood here.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsShareModalOpen(true)}
        >
          Share Your Memory
        </Button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: '340px',
                backgroundColor: 'var(--color-parchment-warm)',
                borderRadius: '4px',
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      ) : memories.length === 0 ? (
        /* Empty State */
        <div
          style={{
            backgroundColor: 'var(--color-parchment-light)',
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <Camera size={44} color="var(--color-sage)" style={{ margin: '0 auto 1rem' }} />
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              color: 'var(--color-forest)',
              marginBottom: '0.5rem',
            }}
          >
            Be the First to Pin a Memory
          </h3>
          <p
            style={{
              color: 'var(--color-charcoal-muted)',
              fontSize: '0.9375rem',
              maxWidth: '460px',
              margin: '0 auto 1.5rem',
            }}
          >
            Have you walked the paths of {placeName}? Share your photograph and travel note with the community.
          </p>
          <Button
            variant="secondary"
            icon={<Plus size={16} />}
            onClick={() => setIsShareModalOpen(true)}
          >
            Add Your Travel Story
          </Button>
        </div>
      ) : (
        /* Multi-column Scrapbook Gallery */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
          className="scrapbook-gallery-grid"
        >
          {memories.map((mem, idx) => {
            const rot = rotations[idx % rotations.length];
            const tapeClass = tapes[idx % tapes.length];

            return (
              <div
                key={mem.id}
                className={`polaroid-card ${tapeClass}`}
                style={{
                  transform: rot,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={() => setSelectedMemory(mem)}
              >
                {/* Photo */}
                <div
                  style={{
                    width: '100%',
                    height: '240px',
                    overflow: 'hidden',
                    backgroundColor: '#EDE8DE',
                    marginBottom: '0.85rem',
                    position: 'relative',
                  }}
                >
                  <img
                    src={mem.photoUrl}
                    alt={mem.caption}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform var(--transition-smooth)',
                    }}
                    loading="lazy"
                  />
                </div>

                {/* Handwritten Caption */}
                <div
                  style={{
                    fontFamily: 'var(--font-handwritten)',
                    fontSize: '1.35rem',
                    color: 'var(--color-forest-dark)',
                    lineHeight: 1.25,
                    marginBottom: '0.65rem',
                  }}
                >
                  "{mem.caption}"
                </div>

                {/* Story Excerpt */}
                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.55,
                    color: 'var(--color-charcoal-muted)',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    flexGrow: 1,
                  }}
                >
                  {mem.story}
                </p>

                {/* Traveler Bar & Read Story action */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--color-border-subtle)',
                    paddingTop: '0.75rem',
                    marginTop: 'auto',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                      src={mem.travelerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={mem.travelerName}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                    <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>
                      {mem.travelerName}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMemory(mem);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontWeight: 700,
                      color: 'var(--color-forest)',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                    }}
                  >
                    <span>Read Story</span>
                    <BookOpen size={13} />
                  </button>
                </div>

                {/* Visit Date Badge if present */}
                {mem.visitDate && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      color: 'var(--color-charcoal-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Calendar size={12} color="var(--color-earth)" />
                    <span>{mem.visitDate}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <MemoryModal
        isOpen={!!selectedMemory}
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        placeName={placeName}
      />

      <ShareMemoryModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          // Refresh memories for this place
          getMemoriesByPlaceId(placeId).then(setMemories);
        }}
        placeId={placeId}
        placeName={placeName}
      />
    </section>
  );
};
