'use client';

import { useEffect, useRef, useState } from 'react';
import { ShaderCanvas } from './ShaderCanvas';
import { REACTIVE_FRAGMENT_SRC } from '@/lib/shaders';

type Props = {
  audioEl: HTMLAudioElement | null;
  playing: boolean;
};

/**
 * Audio-reactive shader field for the Sound page. Web Audio's AnalyserNode
 * only ever spins up after the user presses play on the real <audio>
 * element (a user gesture), never on page load.
 */
export function ReactiveField({ audioEl, playing }: Props) {
  const levelRef = useRef(0);
  const [unavailable, setUnavailable] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audioEl || !playing || sourceRef.current) return;

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;

    const source = ctx.createMediaElementSource(audioEl);
    source.connect(analyser);
    analyser.connect(ctx.destination);

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    sourceRef.current = source;

    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf = 0;
    function tick() {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i] ?? 0;
      levelRef.current = sum / data.length / 255;
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => cancelAnimationFrame(raf);
  }, [audioEl, playing]);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  if (unavailable) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-crimson-700/40 via-ink-900 to-ink-950"
      />
    );
  }

  return (
    <ShaderCanvas
      fragmentSrc={REACTIVE_FRAGMENT_SRC}
      levelRef={levelRef}
      className="absolute inset-0 h-full w-full"
      onUnavailable={() => setUnavailable(true)}
    />
  );
}
