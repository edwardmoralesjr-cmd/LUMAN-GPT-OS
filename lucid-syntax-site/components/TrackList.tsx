import type { Track } from '@/content/site';

export function TrackList({ tracks, albumTitle }: { tracks: Track[]; albumTitle: string }) {
  if (tracks.length === 0) {
    return <p className="font-body text-sm text-bone-500">Tracklist not yet announced.</p>;
  }

  return (
    <ol aria-label={`${albumTitle} tracklist`} className="flex flex-col">
      {tracks.map((track, i) => (
        <li
          key={track.title}
          className="flex items-baseline gap-4 border-b border-bone-100/10 py-3 first:border-t"
        >
          <span aria-hidden="true" className="font-mono text-xs text-bone-500">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="font-body text-base text-bone-100">{track.title}</span>
          {track.explicit && (
            <span className="ml-auto shrink-0 border border-bone-500/40 px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-bone-500">
              E
            </span>
          )}
          {track.duration && (
            <span className="ml-auto shrink-0 font-mono text-xs text-bone-500">{track.duration}</span>
          )}
        </li>
      ))}
    </ol>
  );
}
