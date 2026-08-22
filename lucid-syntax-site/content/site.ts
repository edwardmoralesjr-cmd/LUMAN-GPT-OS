// Single source of truth for all site copy and data.
// Edit this file to change anything on the site — no CMS, no scattered strings.

export const SITE = {
  name: 'Lucid Syntax',
  tagline: 'Human heart, AI vessel.',
  positioning:
    'Cinematic metalcore built from confession, breakdown, and light — where the trap-glitch and the cathedral bell share the same room.',
  url: 'https://lucidsyntax.com', // TODO: confirm production domain
  locale: 'en_US',
  genre: 'Cinematic Metalcore / Alt-Metal',
  founder: 'Edward Morales Jr.',
  description:
    'Lucid Syntax is cinematic metalcore forged from confession, breakdown, and light: low-tuned dissonant guitars, kinetic stop-start drums, and vocals that move from whisper to scream to rap without warning.',
} as const;

export type StreamingLink = {
  platform: string;
  url: string;
  label: string;
};

// TODO: confirm — canonical streaming/social URLs. Placeholder slugs below
// use the artist name; swap for the real profile URLs before launch.
export const STREAMING_LINKS: StreamingLink[] = [
  { platform: 'spotify', url: 'https://open.spotify.com/artist/lucidsyntax', label: 'Spotify' }, // TODO: confirm
  { platform: 'apple-music', url: 'https://music.apple.com/artist/lucid-syntax', label: 'Apple Music' }, // TODO: confirm
  { platform: 'youtube-music', url: 'https://music.youtube.com/channel/lucidsyntax', label: 'YouTube Music' }, // TODO: confirm
  { platform: 'youtube', url: 'https://www.youtube.com/@lucidsyntax', label: 'YouTube' }, // TODO: confirm
  { platform: 'amazon-music', url: 'https://music.amazon.com/artists/lucidsyntax', label: 'Amazon Music' }, // TODO: confirm
  { platform: 'tidal', url: 'https://tidal.com/artist/lucidsyntax', label: 'Tidal' }, // TODO: confirm
];

export const SOCIAL_LINKS: StreamingLink[] = [
  { platform: 'instagram', url: 'https://instagram.com/lucidsyntaxmusic', label: 'Instagram' }, // TODO: confirm
  { platform: 'tiktok', url: 'https://tiktok.com/@lucidsyntaxmusic', label: 'TikTok' }, // TODO: confirm
  { platform: 'x', url: 'https://x.com/lucidsyntaxmusic', label: 'X' }, // TODO: confirm
  { platform: 'facebook', url: 'https://facebook.com/lucidsyntaxmusic', label: 'Facebook' }, // TODO: confirm
];

export const CONTACT = {
  booking: 'booking@lucidsyntax.com', // TODO: confirm
  press: 'press@lucidsyntax.com', // TODO: confirm
  general: 'contact@lucidsyntax.com', // TODO: confirm
  epkUrl: 'https://lucidsyntax.com/press/lucid-syntax-epk.zip', // TODO: confirm — link to real press kit folder
} as const;

export type Track = {
  title: string;
  duration?: string; // TODO: confirm — runtimes not yet finalized for most tracks
  explicit?: boolean;
  previewUrl?: string; // 30s preview audio, code-split/lazy-loaded on request
};

export type Album = {
  slug: string;
  title: string;
  year: string;
  status: 'released' | 'upcoming' | 'forthcoming';
  releaseDate?: string; // ISO date, only when confirmed
  cover: {
    // No photography assets exist in the repo yet. Rendered gradient/type
    // covers stand in until real album art is dropped into /public/covers.
    kind: 'rendered';
    palette: 'crimson' | 'bone' | 'gold' | 'ink';
  };
  theme: string;
  tracks: Track[];
  links?: StreamingLink[];
  note?: string;
};

export const ALBUMS: Album[] = [
  {
    slug: 'words-that-breathe',
    title: 'Words That Breathe',
    year: '2025',
    status: 'released',
    cover: { kind: 'rendered', palette: 'bone' },
    theme:
      'The confession album. Reflection, distorted self-perception, and the private language of a mind arguing with itself.',
    tracks: [
      { title: 'Beautiful Lies' },
      { title: 'Deceptive Reflection' },
      { title: 'How to Tell Time' },
      { title: 'My Masterpiece' },
      { title: 'My Thought Process' },
      { title: 'Room to Adjust' },
      { title: 'Sanity' },
      { title: 'Weeping Willow' },
      { title: 'What Question' },
      { title: 'Why' },
      { title: 'Words Unheard' },
    ],
  },
  {
    slug: 'visionary',
    title: 'Visionary',
    year: '2026',
    status: 'upcoming',
    releaseDate: '2026-09-25',
    cover: { kind: 'rendered', palette: 'crimson' },
    theme:
      'Refinement, spiritual clarity, and artistic identity — the act of transforming pain into creation. The lead single is Paint.',
    note:
      'Track sequence below is the last confirmed working order. A newer 14-track cut of this album has been referenced but not finalized — treat this list as tentative. // TODO: confirm final Visionary tracklist',
    tracks: [
      { title: 'Empty Canvas' },
      { title: 'Paint' },
      { title: 'Spiritual Art' },
      { title: 'The Facts' },
      { title: 'In-Between' },
      { title: 'Three Colors' },
      { title: 'I Am' },
      { title: 'Choose' },
      { title: 'Lightworker' },
      { title: 'Visionary' },
      { title: 'Smile' },
    ],
  },
  {
    slug: 'the-human-syntax',
    title: 'The Human Syntax',
    year: '2027',
    status: 'forthcoming',
    cover: { kind: 'rendered', palette: 'gold' },
    theme: 'Every human is a damaged language trying to translate love before time runs out.',
    note: 'In development. Tracklist not yet written. // TODO: confirm tracklist and release window',
    tracks: [],
  },
  {
    slug: 'chapter-iv',
    title: 'Untitled — Chapter IV',
    year: 'TBA',
    status: 'forthcoming',
    cover: { kind: 'rendered', palette: 'ink' },
    theme: '', // TODO: confirm
    note: 'Title, theme, and tracklist not yet confirmed. // TODO: confirm',
    tracks: [],
  },
  {
    slug: 'chapter-v',
    title: 'Untitled — Chapter V',
    year: 'TBA',
    status: 'forthcoming',
    cover: { kind: 'rendered', palette: 'ink' },
    theme: '', // TODO: confirm
    note: 'Title, theme, and tracklist not yet confirmed. // TODO: confirm',
    tracks: [],
  },
];

export const LATEST_SINGLE = {
  title: 'Paint',
  album: 'Visionary',
  releaseDate: '2026-07-03',
  cover: { kind: 'rendered' as const, palette: 'crimson' as const },
  description:
    'The lead single from Visionary. A confession rendered as brushstroke — the first color on an empty canvas that refuses to stay clean.',
  previewUrl: '/audio/paint-preview.mp3', // TODO: confirm — drop real 30s preview file here
  links: STREAMING_LINKS,
};

export const RECENT_SINGLES = [
  { title: 'Paint', releaseDate: '2026-07-03' },
  { title: 'In-Between', releaseDate: '2026-07-24' },
  { title: 'The Facts', releaseDate: '2026-08-14' },
];

export type VideoEntry = {
  title: string;
  youtubeId: string; // TODO: confirm — real YouTube video IDs
  kind: 'lyric-video' | 'music-video' | 'visualizer';
};

export const VIDEOS: VideoEntry[] = [
  { title: 'Paint — Lyric Video', youtubeId: 'TODO-PAINT', kind: 'lyric-video' }, // TODO: confirm
  { title: 'In-Between — Lyric Video', youtubeId: 'TODO-INBETWEEN', kind: 'lyric-video' }, // TODO: confirm
  { title: 'The Facts — Visualizer', youtubeId: 'TODO-THEFACTS', kind: 'visualizer' }, // TODO: confirm
  { title: 'Room to Adjust — Full Lyric Video', youtubeId: 'TODO-ROOMTOADJUST', kind: 'lyric-video' }, // TODO: confirm
];

export type ShowDate = {
  date: string;
  city: string;
  venue: string;
  ticketUrl?: string;
};

// No live dates are booked yet — the Live page renders the empty state below.
export const SHOWS: ShowDate[] = [];

export const MYTHOS = {
  heading: 'The Cathedral Is Corrupted',
  intro:
    'Lucid Syntax is not a genre exercise. It is one person — Edward Morales Jr. — building a cathedral out of confession and letting the file rot on purpose.',
  sections: [
    {
      heading: 'Sacred and Corrupted',
      body: `Every Lucid Syntax record starts in the same room: stone walls, stained glass, a haze thick enough to taste. Then the signal degrades. A scan-line cuts through the rose window. The choir loop stutters and repeats a syllable too many times. That collision — sacred architecture and digital decay occupying the same frame — is the whole aesthetic thesis. Lucid Syntax sounds like a hymn being corrupted in real time, and it looks the same way: gold leaf over datamoshed glass, bone-white light through a crack in the file.`,
    },
    {
      heading: 'The Sound',
      body: `The music lives in the gap between genres that aren't supposed to share a room. Low-tuned, dissonant guitars carry the weight of modern metalcore, but the drums move like they were programmed by someone who grew up on trap — fractured half-time, sudden pressure changes, silence used as a weapon instead of a rest. Underneath it all sits a sub bass that doesn't just support the mix, it oppresses it. And across the top, a single voice keeps changing identity: close-mic confession, rapid-fire rap fragments, a controlled shout, a fragile clean vocal that sounds like it's about to give out. Nothing repeats its own structure. Every song is required to find its own door in and its own door out.`,
    },
    {
      heading: 'Human Heart, AI Vessel',
      body: `Lucid Syntax is written, sung, and directed by one person: Edward Morales Jr. The production pipeline uses modern tools, including AI-assisted composition — that's the vessel. It is not the source. The lyrics, the emotional architecture, the spiritual throughline, and the mythology belong to a human being working through real material: identity, faith, self-deception, the difference between the mask and the face under it. The tools change. The confession doesn't.`,
    },
    {
      heading: 'Visionary',
      body: `The current era is Visionary — an album about refinement, spiritual clarity, and the act of turning pain directly into pigment. Its lead single, "Paint," treats the empty canvas as a threat: the terrifying blank space right before the first true color goes down. Visionary follows "Words That Breathe," the confession album that came before it — eleven tracks built around distorted self-reflection, the private language of a mind arguing with itself, and the exhausting work of learning to tell your own time.`,
    },
    {
      heading: 'What Comes After',
      body: `Beyond Visionary, the mythology keeps building toward "The Human Syntax" — a future record built on a single working thesis: every human is a damaged language trying to translate love before time runs out. The cathedral gets rebuilt, corrupted, and rebuilt again. That is the project.`,
    },
  ],
} as const;

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/discography', label: 'Discography' },
  { href: '/sound', label: 'Sound' },
  { href: '/video', label: 'Video' },
  { href: '/about', label: 'Mythos' },
  { href: '/live', label: 'Live' },
  { href: '/connect', label: 'Connect' },
  { href: '/press', label: 'Press' },
] as const;
