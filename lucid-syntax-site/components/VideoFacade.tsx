'use client';

import { useState } from 'react';
import type { VideoEntry } from '@/content/site';

/**
 * Lightweight thumbnail-only facade. The YouTube iframe (and its ~500KB+
 * of JS) only loads after a click — never on page load, never on scroll.
 */
export function VideoFacade({ video }: { video: VideoEntry }) {
  const [loaded, setLoaded] = useState(false);
  const thumbUrl = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;

  if (loaded) {
    return (
      <div className="relative aspect-video w-full overflow-hidden border border-bone-100/10 bg-ink-900">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
          title={video.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label={`Play ${video.title}`}
      className="group relative aspect-video w-full overflow-hidden border border-bone-100/10 bg-ink-900 text-left"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbUrl}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="h-full w-full object-cover opacity-70 transition-opacity duration-300 ease-decay group-hover:opacity-90"
      />
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent p-5">
        <span className="font-body text-sm text-bone-50">{video.title}</span>
      </div>
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-bone-50/60 bg-ink-950/50 transition-transform duration-300 ease-decay group-hover:scale-110">
          <span className="ml-1 h-0 w-0 border-y-8 border-l-[14px] border-y-transparent border-l-bone-50" />
        </span>
      </span>
    </button>
  );
}
