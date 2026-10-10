import { Memory } from '../domain/entities/Memory';

export const INITIAL_MOCK_MEMORIES: Memory[] = [
  // Memories for place-01 (Emerald Whispers Gorge / Soča Valley)
  {
    id: 'mem-01',
    placeId: 'place-01',
    travelerName: 'Elena Rostova',
    travelerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    caption: 'Sunrise over the turquoise rapids',
    story: 'We arrived at dawn before any other hikers. The glacial mist was rolling across the emerald pools, creating a surreal glow that felt completely untamed. Taking a dip in the 8°C water will stay with me forever.',
    photoUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
    visitDate: 'October 2024',
    tags: ['sunrise', 'glacial-water', 'solitude'],
    createdAt: '2024-10-15T08:30:00.000Z',
  },
  {
    id: 'mem-02',
    placeId: 'place-01',
    travelerName: 'Marcus Lindqvist',
    travelerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    caption: 'Crossing the suspension bridge in morning fog',
    story: 'The timber bridge swayed gently underfoot as we crossed into the deeper ravine. You could smell wild thyme and wet cedar in the crisp mountain air. Don’t forget sturdy boots — the limestone rocks get slippery.',
    photoUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    visitDate: 'September 2024',
    tags: ['footbridge', 'alpine-air', 'hiking'],
    createdAt: '2024-09-22T14:15:00.000Z',
  },
  {
    id: 'mem-03',
    placeId: 'place-01',
    travelerName: 'Chloe & Arthur',
    travelerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    caption: 'Campfire notes near the canyon trail',
    story: 'Sat by the river with a thermal flask of mountain tea and our field sketchbooks. The sheer vertical walls amplify every whisper of the rushing river. An absolute gem beyond the tourist trail.',
    photoUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    visitDate: 'July 2024',
    tags: ['field-sketch', 'river', 'wilderness'],
    createdAt: '2024-07-10T19:40:00.000Z',
  },

  // Memories for place-02 (Cala Luna Secret Cove)
  {
    id: 'mem-04',
    placeId: 'place-02',
    travelerName: 'Matteo V.',
    travelerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    caption: 'Sunbeams penetrating the sea caves',
    story: 'Hiked 3 hours through the Mediterranean scrub to reach this cathedral cavern. When the afternoon light hits the limestone arches, the whole cave illuminates in deep aquamarine.',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    visitDate: 'August 2024',
    tags: ['sea-caves', 'turquoise', 'trail-hike'],
    createdAt: '2024-08-18T16:20:00.000Z',
  },
  {
    id: 'mem-05',
    placeId: 'place-02',
    travelerName: 'Sofia Alvarez',
    travelerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    caption: 'Pebble shoreline and afternoon drift',
    story: 'No cellular reception here, which made it paradise. We floated in the crystal water while watching wild goats navigate the sheer cliffs above.',
    photoUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
    visitDate: 'June 2024',
    tags: ['offline', 'wildlife', 'cove'],
    createdAt: '2024-06-28T11:10:00.000Z',
  },

  // Memories for place-03 (Monastery of the Holy Trinity, Meteora)
  {
    id: 'mem-06',
    placeId: 'place-03',
    travelerName: 'Dimitri K.',
    travelerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    caption: '140 stone steps cut into sheer rock',
    story: 'Climbing the narrow staircase carved into the sandstone monolith with the valley below shrouded in golden haze. The silence at the monastery summit is humbling.',
    photoUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    visitDate: 'May 2024',
    tags: ['heritage', 'monastery', 'cliffs'],
    createdAt: '2024-05-14T10:05:00.000Z',
  },

  // Memories for place-04 (Lofoten Rorbu Fishermen Cabins)
  {
    id: 'mem-07',
    placeId: 'place-04',
    travelerName: 'Astrid Olsen',
    travelerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    caption: 'Midnight sun hitting the red cabins',
    story: 'The fjord water was like black glass reflecting the fiery red walls of the historic rorbuer. At 1 AM, the sky turned pink and gold without ever going dark.',
    photoUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
    visitDate: 'June 2024',
    tags: ['midnight-sun', 'arctic', 'rorbu'],
    createdAt: '2024-06-21T01:15:00.000Z',
  },

  // Memories for place-05 (Cascata del Sasso)
  {
    id: 'mem-08',
    placeId: 'place-05',
    travelerName: 'Luca Rossi',
    travelerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    caption: 'The old water mill behind the cascades',
    story: 'A hidden Renaissance mill sits right beside the Metauro river falls. Locals still swim in the deep pools below the limestone shelf in late summer.',
    photoUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
    visitDate: 'August 2024',
    tags: ['waterfall', 'history', 'swim'],
    createdAt: '2024-08-04T15:00:00.000Z',
  },

  // Memories for place-06 (Mont Saint-Michel Abbey)
  {
    id: 'mem-09',
    placeId: 'place-06',
    travelerName: 'Claire Dupont',
    travelerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    caption: 'Tides rushing into the bay at twilight',
    story: 'Watched the spring tide surge around the island like galloping horses. When night fell, the ancient abbey spire lit up against the starry Atlantic sky.',
    photoUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    visitDate: 'September 2024',
    tags: ['tides', 'gothic', 'night-sky'],
    createdAt: '2024-09-12T20:30:00.000Z',
  },
];
