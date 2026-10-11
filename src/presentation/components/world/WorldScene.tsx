import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Place, PlaceCategory } from '../../../domain/entities/Place';
import { LatLng, geoToWorld } from '../../../shared/utils/geo';
import type { LocationMode } from '../../../shared/hooks/useGeoLocation';

// ─── Category → visual config ────────────────────────────────────────────────

interface CategoryConfig {
  color: string;
  emissive: string;
  label: string;
  heightScale: number;
  glowColor: string;
}

const CATEGORY_CONFIG: Record<PlaceCategory, CategoryConfig> = {
  nature: { color: '#2D6A4F', emissive: '#1B4332', label: 'Nature', heightScale: 1.0, glowColor: '#52B788' },
  beaches: { color: '#0284C7', emissive: '#075985', label: 'Beach', heightScale: 0.6, glowColor: '#38BDF8' },
  mountains: { color: '#6B7280', emissive: '#374151', label: 'Mountain', heightScale: 1.6, glowColor: '#9CA3AF' },
  history: { color: '#92400E', emissive: '#78350F', label: 'Heritage', heightScale: 1.2, glowColor: '#F59E0B' },
  food: { color: '#C86D51', emissive: '#9A3412', label: 'Local Food', heightScale: 0.8, glowColor: '#FB923C' },
  culture: { color: '#B45309', emissive: '#92400E', label: 'Culture', heightScale: 1.1, glowColor: '#FBBF24' },
  'hidden-gems': { color: '#1B4332', emissive: '#052E16', label: 'Hidden Gem', heightScale: 1.0, glowColor: '#34D399' },
  attractions: { color: '#DC2626', emissive: '#991B1B', label: 'Attraction', heightScale: 1.3, glowColor: '#F87171' },
};

// ─── "You Are Here" Marker ───────────────────────────────────────────────────

interface UserMarkerProps {
  position: [number, number, number];
  mode: LocationMode;
}

const UserMarker: React.FC<UserMarkerProps> = ({ position, mode }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const t = Date.now() * 0.001;
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + Math.abs(Math.sin(t * 1.5)) * 0.18;
      ringRef.current.scale.setScalar(1 + Math.abs(Math.sin(t * 0.7)) * 0.12);
    }
    if (beaconRef.current) {
      beaconRef.current.position.y = 0.22 + Math.sin(t * 1.8) * 0.07;
    }
  });

  const markerColor = mode === 'device' ? '#38BDF8' : '#F59E0B';
  const glowColor = mode === 'device' ? '#0EA5E9' : '#D97706';

  return (
    <group position={position}>
      {/* Pulsing ground ring */}
      <mesh ref={ringRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.55, 32]} />
        <meshBasicMaterial color={markerColor} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner solid disc */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color={markerColor} transparent opacity={0.35} />
      </mesh>

      {/* Vertical beacon shaft */}
      <mesh ref={beaconRef} position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.045, 0.09, 0.44, 8]} />
        <meshStandardMaterial color={markerColor} emissive={glowColor} emissiveIntensity={0.65} metalness={0.3} roughness={0.3} />
      </mesh>

      {/* Top sphere */}
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color={markerColor} emissive={glowColor} emissiveIntensity={0.9} metalness={0.5} roughness={0.2} />
      </mesh>

      {/* "You are here" label */}
      <Text
        position={[0, 1.12, 0]}
        fontSize={0.24}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#00000099"
        maxWidth={3.5}
        textAlign="center"
      >
        {mode === 'device' ? '📍 You are here (GPS)' : '📍 You are here (Kozhikode Beach Demo)'}
      </Text>
    </group>
  );
};

// ─── Individual 3D Place Object ───────────────────────────────────────────────

interface PlaceObjectProps {
  place: Place;
  position: [number, number, number];
  isSelected: boolean;
  onSelect: (place: Place) => void;
}

const PlaceObject3D: React.FC<PlaceObjectProps> = ({ place, position, isSelected, onSelect }) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRingRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const cfg = CATEGORY_CONFIG[place.category] ?? CATEGORY_CONFIG.nature;
  const h = cfg.heightScale;

  useFrame(() => {
    if (!groupRef.current) return;
    const t = Date.now() * 0.001;
    groupRef.current.position.y = Math.sin(t * 0.8 + position[0] * 0.3) * (isSelected ? 0.12 : 0.05);
    if (isSelected && glowRingRef.current) {
      const mat = glowRingRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.18 + Math.sin(t * 2.5) * 0.09;
    }
  });

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onSelect(place);
    },
    [onSelect, place]
  );

  const scale = isSelected ? 1.22 : hovered ? 1.1 : 1.0;

  // ── Keyword detection helpers ──────────────────────────────────────────────

  const nameLower = place.name.toLowerCase();
  const descLower = place.description.toLowerCase();
  const tagsJoined = place.tags.join(' ').toLowerCase();
  const combined = `${nameLower} ${descLower} ${tagsJoined}`;

  const isWaterfall = ['waterfall', 'falls', 'cascade'].some((w) => combined.includes(w));
  const isPond =
    ['pond', 'lake', 'kund', 'reservoir', 'wetland', 'marsh', 'lotus'].some((w) => combined.includes(w));
  const isBird = ['bird', 'sanctuary', 'estuary', 'migratory'].some((w) => combined.includes(w));
  const isPark = ['park', 'garden', 'bio-park', 'promenade', 'square'].some((w) => combined.includes(w));
  const isField = ['field', 'paddy', 'meadow', 'farmland', 'grassland', 'countryside', 'village'].some((w) => combined.includes(w));

  // ── Scene renderers ────────────────────────────────────────────────────────

  const renderShape = () => {

    // ── 1. Pond / Lake / Wetland ─────────────────────────────────────────────
    if (isPond) {
      return (
        <>
          {/* Optional surrounding field if description suggests field or countryside */}
          {isField && (
            <group position={[0, 0.01, 0]}>
              <mesh receiveShadow>
                <cylinderGeometry args={[2.0, 2.15, 0.04, 22]} />
                <meshStandardMaterial color="#6B8E23" roughness={0.96} />
              </mesh>
              {/* Field rows / agricultural bunds */}
              {[-1.2, -0.7, 0.7, 1.2].map((z, idx) => (
                <mesh key={idx} receiveShadow position={[0, 0.025, z]}>
                  <boxGeometry args={[2.8, 0.03, 0.12]} />
                  <meshStandardMaterial color="#556B2F" roughness={0.92} />
                </mesh>
              ))}
            </group>
          )}

          {/* Grassy / earthy bank perimeter */}
          <mesh receiveShadow position={[0, 0.03, 0]}>
            <cylinderGeometry args={[1.38, 1.5, 0.08, 22]} />
            <meshStandardMaterial color="#3A7D44" roughness={0.94} />
          </mesh>

          {/* Blue water body */}
          <mesh receiveShadow position={[0, 0.07, 0]}>
            <cylinderGeometry args={[1.05, 1.18, 0.09, 22]} />
            <meshStandardMaterial
              color="#1E90FF"
              transparent
              opacity={0.85}
              roughness={0.06}
              metalness={0.35}
              emissive="#004080"
              emissiveIntensity={0.15}
            />
          </mesh>

          {/* Earthen footpath leading to the pond bank */}
          <mesh receiveShadow position={[0.72, 0.045, 0.72]} rotation={[-Math.PI / 2, 0, 0.65]}>
            <planeGeometry args={[0.35, 1.0]} />
            <meshStandardMaterial color="#C2B280" roughness={0.96} />
          </mesh>

          {/* Lily pads */}
          <mesh position={[0.32, 0.12, 0.18]} rotation={[-Math.PI / 2, 0, 0.4]}>
            <circleGeometry args={[0.15, 8]} />
            <meshStandardMaterial color="#2E8B57" roughness={0.7} />
          </mesh>
          <mesh position={[-0.28, 0.12, -0.22]} rotation={[-Math.PI / 2, 0, 1.2]}>
            <circleGeometry args={[0.12, 8]} />
            <meshStandardMaterial color="#228B22" roughness={0.7} />
          </mesh>

          {/* Natural river stones & rocks along the bank */}
          {([
            [-0.85, 0.09, 0.45, 0.14],
            [0.72, 0.08, 0.62, 0.12],
            [-0.45, 0.08, -0.85, 0.16],
            [0.92, 0.08, -0.32, 0.11],
          ] as [number, number, number, number][]).map(([rx, ry, rz, rad], idx) => (
            <mesh key={idx} castShadow position={[rx, ry, rz]}>
              <dodecahedronGeometry args={[rad]} />
              <meshStandardMaterial color="#64748B" roughness={0.92} />
            </mesh>
          ))}

          {/* Trees at bank */}
          <group position={[-0.92, 0.08, -0.58]}>
            <mesh castShadow position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.045, 0.06, 0.65, 6]} />
              <meshStandardMaterial color="#6B4423" roughness={0.95} />
            </mesh>
            <mesh castShadow position={[0, 0.82, 0]}>
              <sphereGeometry args={[0.38, 8, 8]} />
              <meshStandardMaterial color="#2E7D42" roughness={0.85} />
            </mesh>
          </group>

          <group position={[0.95, 0.08, -0.48]}>
            <mesh castShadow position={[0, 0.26, 0]}>
              <cylinderGeometry args={[0.038, 0.05, 0.48, 6]} />
              <meshStandardMaterial color="#5C3A1E" roughness={0.95} />
            </mesh>
            <mesh castShadow position={[0, 0.65, 0]}>
              <sphereGeometry args={[0.3, 8, 8]} />
              <meshStandardMaterial color="#3A8A48" roughness={0.85} />
            </mesh>
          </group>

          {/* Reeds / tall grass clumps */}
          {([[-0.55, 0.55], [0.58, -0.42], [-0.25, -0.85]] as [number, number][]).map(([px, pz], i) => (
            <mesh key={i} castShadow position={[px, 0.18, pz]}>
              <cylinderGeometry args={[0.03, 0.045, 0.42, 4]} />
              <meshStandardMaterial color="#4CAF50" roughness={0.85} />
            </mesh>
          ))}
        </>
      );
    }

    // ── 2. Park / Garden / Bio Park ──────────────────────────────────────────
    if (isPark) {
      return (
        <>
          {/* Manicured green lawn */}
          <mesh receiveShadow position={[0, 0.04, 0]}>
            <cylinderGeometry args={[1.35, 1.48, 0.08, 20]} />
            <meshStandardMaterial color="#388E3C" roughness={0.88} />
          </mesh>
          {/* Circular paved walking path */}
          <mesh receiveShadow position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.72, 0.95, 24]} />
            <meshStandardMaterial color="#D7CCC8" roughness={0.92} side={THREE.DoubleSide} />
          </mesh>
          {/* Park benches */}
          {[-0.55, 0.55].map((bx, i) => (
            <group key={i} position={[bx, 0.08, 0.35]} rotation={[0, i === 0 ? 0.3 : -0.3, 0]}>
              <mesh castShadow position={[0, 0.1, 0]}>
                <boxGeometry args={[0.38, 0.04, 0.14]} />
                <meshStandardMaterial color="#8D6E63" roughness={0.8} />
              </mesh>
              <mesh castShadow position={[0, 0.18, -0.06]}>
                <boxGeometry args={[0.38, 0.14, 0.03]} />
                <meshStandardMaterial color="#5D4037" roughness={0.8} />
              </mesh>
            </group>
          ))}
          {/* Ornamental park trees */}
          {([[-0.6, 0.08, -0.4], [0.65, 0.08, -0.35]] as [number, number, number][]).map((tp, i) => (
            <group key={i} position={tp}>
              <mesh castShadow position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.04, 0.055, 0.55, 6]} />
                <meshStandardMaterial color="#5D4037" roughness={0.95} />
              </mesh>
              <mesh castShadow position={[0, 0.72, 0]}>
                <sphereGeometry args={[0.32, 8, 8]} />
                <meshStandardMaterial color="#43A047" roughness={0.85} />
              </mesh>
            </group>
          ))}
          {/* Flower shrub accents */}
          {([[-0.2, 0.1, 0.5], [0.2, 0.1, -0.5]] as [number, number, number][]).map((sp, i) => (
            <mesh key={i} castShadow position={sp}>
              <sphereGeometry args={[0.16, 6, 6]} />
              <meshStandardMaterial color="#E91E63" roughness={0.9} />
            </mesh>
          ))}
        </>
      );
    }

    // ── 2. Waterfall ─────────────────────────────────────────────────────────
    if (isWaterfall) {
      return (
        <>
          {/* Rocky cliff elevation */}
          <mesh castShadow receiveShadow position={[-0.2, h * 0.55, -0.2]}>
            <boxGeometry args={[0.9, h * 1.1, 0.7]} />
            <meshStandardMaterial color="#475569" roughness={0.92} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.3, h * 0.35, -0.3]}>
            <boxGeometry args={[0.6, h * 0.7, 0.6]} />
            <meshStandardMaterial color="#334155" roughness={0.95} />
          </mesh>
          {/* Falling blue water stream */}
          <mesh position={[-0.05, h * 0.52, 0.18]} rotation={[0.18, 0, 0]}>
            <boxGeometry args={[0.32, h * 0.95, 0.05]} />
            <meshStandardMaterial
              color="#38BDF8"
              transparent
              opacity={0.88}
              roughness={0.08}
              metalness={0.25}
              emissive="#0284C7"
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Plunge pool at base */}
          <mesh receiveShadow position={[0.05, 0.08, 0.38]}>
            <cylinderGeometry args={[0.55, 0.62, 0.1, 14]} />
            <meshStandardMaterial color="#0EA5E9" transparent opacity={0.85} roughness={0.05} metalness={0.4} />
          </mesh>
          {/* River stones */}
          <mesh castShadow position={[-0.42, 0.12, 0.45]}>
            <sphereGeometry args={[0.13, 6, 6]} />
            <meshStandardMaterial color="#64748B" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0.48, 0.1, 0.32]}>
            <sphereGeometry args={[0.11, 6, 6]} />
            <meshStandardMaterial color="#475569" roughness={0.9} />
          </mesh>
          {/* Lush greenery around waterfall */}
          <group position={[0.55, 0.08, 0.1]}>
            <mesh castShadow position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.035, 0.05, 0.55, 5]} />
              <meshStandardMaterial color="#5C3A1E" roughness={0.95} />
            </mesh>
            <mesh castShadow position={[0, 0.65, 0]}>
              <coneGeometry args={[0.3, 0.6, 7]} />
              <meshStandardMaterial color="#1E5C31" roughness={0.85} />
            </mesh>
          </group>
        </>
      );
    }

    // ── 3. Bird Sanctuary / Estuary ──────────────────────────────────────────
    if (isBird) {
      return (
        <>
          {/* Water body */}
          <mesh receiveShadow position={[0.15, 0.06, 0.15]}>
            <cylinderGeometry args={[0.75, 0.88, 0.08, 16]} />
            <meshStandardMaterial color="#29ABE2" transparent opacity={0.78} roughness={0.08} metalness={0.3} />
          </mesh>
          {/* Sandy island */}
          <mesh receiveShadow position={[-0.28, 0.04, -0.2]}>
            <cylinderGeometry args={[0.45, 0.52, 0.06, 10]} />
            <meshStandardMaterial color="#D4B483" roughness={0.95} />
          </mesh>
          {/* Mangrove-style trees */}
          {([[-0.35, 0.05, -0.3], [0.55, 0.05, -0.35]] as [number, number, number][]).map((pos, i) => (
            <group key={i} position={pos}>
              <mesh castShadow position={[0, 0.35, 0]}>
                <cylinderGeometry args={[0.035, 0.05, 0.6, 6]} />
                <meshStandardMaterial color="#5C3D1E" roughness={0.95} />
              </mesh>
              <mesh castShadow position={[0, 0.72, 0]}>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshStandardMaterial color="#2D6A4F" roughness={0.85} />
              </mesh>
            </group>
          ))}
          {/* Bird silhouette */}
          <mesh position={[0.1, 0.65, 0.15]} rotation={[0, 0.5, 0.15]}>
            <coneGeometry args={[0.06, 0.22, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
          </mesh>
        </>
      );
    }

    switch (place.category) {
      // ── Mountain / Viewpoint ───────────────────────────────────────────────
      case 'mountains':
        return (
          <>
            <mesh castShadow position={[0, h * 0.55, -0.1]}>
              <coneGeometry args={[0.95, h * 1.5, 6]} />
              <meshStandardMaterial color="#78716C" roughness={0.9} />
            </mesh>
            <mesh castShadow position={[0, h * 1.15, -0.1]}>
              <coneGeometry args={[0.48, h * 0.65, 6]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.7} />
            </mesh>
            <mesh receiveShadow position={[0, 0.12, 0]}>
              <cylinderGeometry args={[1.1, 1.3, 0.22, 8]} />
              <meshStandardMaterial color="#57534E" roughness={0.95} />
            </mesh>
            <mesh castShadow position={[0.62, h * 0.52, 0.25]}>
              <boxGeometry args={[0.55, 0.08, 0.55]} />
              <meshStandardMaterial color="#854D0E" roughness={0.8} />
            </mesh>
            <mesh castShadow position={[0.62, h * 0.26, 0.25]}>
              <cylinderGeometry args={[0.04, 0.04, h * 0.52, 6]} />
              <meshStandardMaterial color="#713F12" roughness={0.9} />
            </mesh>
          </>
        );

      // ── Beach ──────────────────────────────────────────────────────────────
      case 'beaches':
        return (
          <>
            {/* Sand shore */}
            <mesh receiveShadow position={[0, 0.06, 0]}>
              <cylinderGeometry args={[1.25, 1.4, 0.12, 16]} />
              <meshStandardMaterial color="#E0BA7E" roughness={0.95} />
            </mesh>
            {/* Ocean water disc */}
            <mesh receiveShadow position={[0.45, 0.12, 0.35]}>
              <cylinderGeometry args={[0.75, 0.82, 0.06, 14]} />
              <meshStandardMaterial
                color="#0EA5E9"
                transparent
                opacity={0.82}
                roughness={0.08}
                metalness={0.25}
              />
            </mesh>
            {/* Beach Parasol pole */}
            <mesh castShadow position={[-0.45, 0.45, -0.25]}>
              <cylinderGeometry args={[0.025, 0.025, 0.8, 6]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
            </mesh>
            {/* Beach Parasol canopy */}
            <mesh castShadow position={[-0.45, 0.85, -0.25]}>
              <coneGeometry args={[0.42, 0.22, 10]} />
              <meshStandardMaterial color="#EF4444" roughness={0.6} />
            </mesh>
            {/* Coastal rock */}
            <mesh castShadow position={[-0.1, 0.14, 0.65]}>
              <dodecahedronGeometry args={[0.15]} />
              <meshStandardMaterial color="#78716C" roughness={0.9} />
            </mesh>
            {/* Palm-like tree */}
            <group position={[0.6, 0.06, -0.55]}>
              <mesh castShadow position={[0, 0.4, 0]} rotation={[0.1, 0, 0.15]}>
                <cylinderGeometry args={[0.04, 0.06, 0.75, 6]} />
                <meshStandardMaterial color="#8B6914" roughness={0.9} />
              </mesh>
              <mesh castShadow position={[0.05, 0.85, 0]}>
                <sphereGeometry args={[0.28, 8, 6]} />
                <meshStandardMaterial color="#2E7D32" roughness={0.8} />
              </mesh>
            </group>
          </>
        );

      // ── Historical Site / Temple ───────────────────────────────────────────
      case 'history':
        return (
          <>
            {/* Stone plinth */}
            <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
              <boxGeometry args={[1.35, 0.18, 1.35]} />
              <meshStandardMaterial color="#D6D3D1" roughness={0.85} />
            </mesh>
            {/* Inner sanctuary chamber */}
            <mesh castShadow receiveShadow position={[0, h * 0.45, 0]}>
              <boxGeometry args={[0.75, h * 0.75, 0.75]} />
              <meshStandardMaterial color="#D4A96A" roughness={0.85} />
            </mesh>
            {/* Classical pillars */}
            {([-0.42, 0.42] as number[]).flatMap((px) =>
              ([-0.42, 0.42] as number[]).map((pz, j) => (
                <mesh key={`${px}-${pz}-${j}`} castShadow position={[px, h * 0.42, pz]}>
                  <cylinderGeometry args={[0.06, 0.07, h * 0.82, 8]} />
                  <meshStandardMaterial color="#E7E5E4" roughness={0.7} />
                </mesh>
              ))
            )}
            {/* Roof cornice */}
            <mesh castShadow position={[0, h * 0.88, 0]}>
              <boxGeometry args={[1.2, 0.14, 1.2]} />
              <meshStandardMaterial color="#B8860B" roughness={0.75} />
            </mesh>
            {/* Pagoda crown */}
            <mesh castShadow position={[0, h * 1.02, 0]}>
              <coneGeometry args={[0.75, 0.38, 4]} />
              <meshStandardMaterial color="#92400E" roughness={0.7} />
            </mesh>
            {/* Golden finial */}
            <mesh position={[0, h * 1.25, 0]}>
              <cylinderGeometry args={[0.02, 0.04, 0.22, 6]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
            </mesh>
          </>
        );

      // ── Village / Food / Culture ───────────────────────────────────────────
      case 'food':
      case 'culture':
        return (
          <>
            {([
              { pos: [0, 0, 0] as [number, number, number], ht: 0.65, w: 0.52, rc: '#B45309' },
              { pos: [0.55, 0, 0.15] as [number, number, number], ht: 0.5, w: 0.44, rc: '#C86D51' },
              { pos: [-0.48, 0, 0.28] as [number, number, number], ht: 0.55, w: 0.4, rc: '#92400E' },
              { pos: [0.08, 0, 0.62] as [number, number, number], ht: 0.42, w: 0.36, rc: '#D97706' },
            ] as const).map((b, i) => (
              <group key={i} position={b.pos}>
                <mesh castShadow receiveShadow position={[0, (b.ht / 2) * h, 0]}>
                  <boxGeometry args={[b.w, b.ht * h, b.w]} />
                  <meshStandardMaterial color="#E8DEC8" roughness={0.88} />
                </mesh>
                <mesh castShadow position={[0, b.ht * h + 0.16, 0]}>
                  <coneGeometry args={[b.w * 0.72, 0.32, 4]} />
                  <meshStandardMaterial color={b.rc} roughness={0.7} />
                </mesh>
                <mesh castShadow position={[b.w * 0.22, b.ht * h + 0.24, 0]}>
                  <boxGeometry args={[0.07, 0.18, 0.07]} />
                  <meshStandardMaterial color="#78716C" roughness={0.9} />
                </mesh>
              </group>
            ))}
          </>
        );

      // ── Nature / Hidden Gem: rolling knoll, rocks, grouped trees ──────────
      case 'nature':
      case 'hidden-gems':
        return (
          <>
            <mesh receiveShadow position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.95, 1.15, 0.3, 12]} />
              <meshStandardMaterial color="#2E6B38" roughness={0.9} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.35, 0.3, 0.25]}>
              <dodecahedronGeometry args={[0.32]} />
              <meshStandardMaterial color="#475569" roughness={0.95} />
            </mesh>
            <group position={[0.22, 0.28, -0.15]}>
              <mesh castShadow position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.045, 0.06, 0.5, 6]} />
                <meshStandardMaterial color="#6B4423" roughness={0.95} />
              </mesh>
              <mesh castShadow position={[0, 0.65, 0]}>
                <coneGeometry args={[0.35, 0.7, 7]} />
                <meshStandardMaterial color="#1E5C31" roughness={0.85} />
              </mesh>
              <mesh castShadow position={[0, 1.05, 0]}>
                <coneGeometry args={[0.24, 0.55, 7]} />
                <meshStandardMaterial color="#2E7D42" roughness={0.85} />
              </mesh>
            </group>
            <group position={[-0.2, 0.28, -0.25]}>
              <mesh castShadow position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.04, 0.05, 0.4, 6]} />
                <meshStandardMaterial color="#6B4423" roughness={0.95} />
              </mesh>
              <mesh castShadow position={[0, 0.55, 0]}>
                <sphereGeometry args={[0.32, 8, 8]} />
                <meshStandardMaterial color="#348C45" roughness={0.85} />
              </mesh>
            </group>
          </>
        );

      // ── Attractions / Generic monument ────────────────────────────────────
      case 'attractions':
      default:
        return (
          <>
            <mesh castShadow receiveShadow position={[0, h * 0.65, 0]}>
              <cylinderGeometry args={[0.22, 0.38, h * 1.35, 8]} />
              <meshStandardMaterial color="#78716C" roughness={0.85} />
            </mesh>
            <mesh castShadow position={[0, h * 1.4, 0]}>
              <sphereGeometry args={[0.28, 12, 12]} />
              <meshStandardMaterial
                color={cfg.color}
                roughness={0.4}
                metalness={0.7}
                emissive={cfg.emissive}
                emissiveIntensity={0.5}
              />
            </mesh>
            <mesh receiveShadow position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.75, 0.88, 0.16, 8]} />
              <meshStandardMaterial color="#57534E" roughness={0.9} />
            </mesh>
          </>
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={handleClick}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      {/* Glow ring */}
      {(isSelected || hovered) && (
        <mesh
          ref={isSelected ? glowRingRef : undefined}
          position={[0, 0.04, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[1.3, 1.75, 32]} />
          <meshBasicMaterial color={cfg.glowColor} transparent opacity={isSelected ? 0.22 : 0.12} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Ground platform */}
      <mesh receiveShadow position={[0, 0.04, 0]}>
        <cylinderGeometry args={[1.0, 1.12, 0.08, 16]} />
        <meshStandardMaterial
          color={cfg.color}
          roughness={0.85}
          emissive={isSelected ? cfg.emissive : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {renderShape()}

      {/* Name label */}
      <Text
        position={[0, h * 1.65 + 0.85, 0]}
        fontSize={0.28}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.035}
        outlineColor="#00000099"
        maxWidth={3.2}
        textAlign="center"
      >
        {place.name.length > 22 ? place.name.substring(0, 20) + '…' : place.name}
      </Text>

      <Text
        position={[0, h * 1.65 + 0.48, 0]}
        fontSize={0.185}
        color={cfg.glowColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.025}
        outlineColor="#00000099"
      >
        {cfg.label.toUpperCase()}
      </Text>
    </group>
  );
};

// ─── Terrain ──────────────────────────────────────────────────────────────────

const Terrain: React.FC = () => {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(120, 120, 52, 52);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      const hill =
        Math.sin(x * 0.12) * Math.cos(y * 0.10) * 0.9
        + Math.sin(x * 0.06 + y * 0.08) * 1.4
        + Math.cos(x * 0.09 - y * 0.05) * 0.7;
      const flat = Math.max(0, 1 - dist / 30);
      pos.setZ(i, hill * (1 - flat * 0.85) - 0.3);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.3, 0]}>
      <meshStandardMaterial color="#3D7A4A" roughness={0.92} metalness={0.02} />
    </mesh>
  );
};

// ─── Sky dome ─────────────────────────────────────────────────────────────────

const Sky: React.FC = () => (
  <>
    <mesh>
      <sphereGeometry args={[85, 32, 32]} />
      <meshBasicMaterial color="#A8D8F0" side={THREE.BackSide} />
    </mesh>
    <mesh position={[0, -10, 0]}>
      <cylinderGeometry args={[84, 84, 20, 32, 1, true]} />
      <meshBasicMaterial color="#C5E8F0" side={THREE.BackSide} transparent opacity={0.55} />
    </mesh>
  </>
);

// ─── Camera focus lerp controller ─────────────────────────────────────────────

interface CameraFocusProps {
  target: THREE.Vector3 | null;
  onDone: () => void;
}

const CameraFocus: React.FC<CameraFocusProps> = ({ target, onDone }) => {
  const { camera } = useThree();
  const doneRef = useRef(false);

  useEffect(() => { doneRef.current = false; }, [target]);

  useFrame(() => {
    if (!target) return;
    const dest = target.clone().add(new THREE.Vector3(8, 10, 8));
    camera.position.lerp(dest, 0.045);
    if (camera.position.distanceTo(dest) < 0.6 && !doneRef.current) {
      doneRef.current = true;
      onDone();
    }
  });

  return null;
};

// ─── Main WorldScene export ───────────────────────────────────────────────────

interface WorldSceneProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place | null) => void;
  activeLocation: LatLng;
  locationMode: LocationMode;
}

export const WorldScene: React.FC<WorldSceneProps> = ({
  places,
  selectedPlace,
  onPlaceSelect,
  activeLocation,
  locationMode,
}) => {
  const approvedPlaces = useMemo(() => places.filter((p) => p.status === 'approved'), [places]);

  // Build stable position map so positions don't change on re-render
  const placePositions = useMemo(() => {
    return approvedPlaces.map((p) => {
      let position: [number, number, number];
      if (p.coordinates?.latitude != null && p.coordinates?.longitude != null) {
        position = geoToWorld(p.coordinates, activeLocation);
      } else {
        // Fallback: place at a random but stable offset based on id hash
        const hash = Array.from(p.id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
        const angle = (hash % 360) * (Math.PI / 180);
        const r = 8 + (hash % 8);
        position = [Math.cos(angle) * r, 0, Math.sin(angle) * r];
      }
      return { place: p, position };
    });
  }, [approvedPlaces, activeLocation]);

  const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (selectedPlace) {
      const entry = placePositions.find((pp) => pp.place.id === selectedPlace.id);
      if (entry) {
        setCameraTarget(new THREE.Vector3(entry.position[0], 0, entry.position[2]));
      }
    }
  }, [selectedPlace, placePositions]);

  const handleDeselect = useCallback(() => onPlaceSelect(null), [onPlaceSelect]);

  // User marker is always at origin (centre of the world)
  const userMarkerPosition: [number, number, number] = [0, 0, 0];

  return (
    <Canvas
      shadows
      camera={{ position: [0, 22, 38], fov: 52, near: 0.1, far: 220 }}
      style={{ width: '100%', height: '100%', display: 'block' }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ scene }) => { scene.fog = new THREE.FogExp2('#C5E8F0', 0.011); }}
      onClick={handleDeselect}
    >
      {/* Lighting */}
      <ambientLight intensity={0.55} color="#FFF8E7" />
      <directionalLight
        position={[22, 42, 16]}
        intensity={1.4}
        color="#FFF5D6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={130}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={65}
        shadow-camera-bottom={-65}
      />
      <hemisphereLight color="#D8F3DC" groundColor="#6B4423" intensity={0.42} />

      <Sky />
      <Terrain />

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={85}
        maxPolarAngle={Math.PI / 2 - 0.05}
        dampingFactor={0.06}
        enableDamping
      />

      <CameraFocus target={cameraTarget} onDone={() => setCameraTarget(null)} />

      {/* User location marker at world centre */}
      <UserMarker position={userMarkerPosition} mode={locationMode} />

      {placePositions.map(({ place, position }) => (
        <PlaceObject3D
          key={place.id}
          place={place}
          position={position}
          isSelected={selectedPlace?.id === place.id}
          onSelect={onPlaceSelect}
        />
      ))}
    </Canvas>
  );
};
