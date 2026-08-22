'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const ReactiveField = dynamic(() => import('./ReactiveField').then((m) => m.ReactiveField), {
  ssr: false,
  loading: () => null,
});

/**
 * Wraps a real, always-accessible <audio> element. The GLSL/Web-Audio
 * reactive field is layered behind it as a progressive enhancement — it
 * only initializes after the user presses play (a user gesture is required
 * for AudioContext anyway), and never blocks the control itself.
 */
export function AudioVisualizer({ title, src }: { title: string; src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative overflow-hidden border border-bone-100/10 bg-ink-900">
      <div className="relative aspect-video w-full">
        <ReactiveField audioEl={audioRef.current} playing={playing} />
      </div>
      <div className="border-t border-bone-100/10 bg-ink-950/80 p-6">
        <p className="mb-3 font-body text-sm text-bone-200">Now previewing — {title}</p>
        <audio
          ref={audioRef}
          controls
          preload="none"
          src={src}
          aria-label={`${title} 30 second preview`}
          className="w-full accent-crimson-500"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        >
          Your browser does not support the audio element. Download or stream {title} from any platform linked on
          this site.
        </audio>
      </div>
    </div>
  );
}
