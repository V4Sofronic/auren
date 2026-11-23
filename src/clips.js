// `n` = the clip's file number (public/clips/clip-0N.mp4). Clip 04 (Suspension) is removed.
// Re-order or edit titles/captions freely; the site plays them top to bottom.
export const CLIPS = [
  { n: 1, title: 'The Entrance',          caption: 'Istanbul. Midnight. Time begins to slow.' },
  { n: 2, title: 'The Watch Reveal',      caption: 'Precision worn, never announced.' },
  { n: 3, title: 'The Removal',           caption: 'Some things are meant to be set free.' },
  { n: 5, title: 'The Titanium Passage',  caption: 'Forged in grade 5 titanium.' },
  { n: 6, title: 'The Presentation Case', caption: 'Every detail arrives as it was made.' },
  { n: 8, title: 'The Engineering',       caption: 'Engineered beyond time.' },
]
export const clipSrc = (c) => `/clips/clip-${String(c.n).padStart(2, '0')}.mp4`
