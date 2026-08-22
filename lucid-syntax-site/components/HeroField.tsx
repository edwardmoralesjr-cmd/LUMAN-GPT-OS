'use client';

import { useEffect, useState } from 'react';
import { ShaderCanvas } from './ShaderCanvas';
import { HERO_FRAGMENT_SRC } from '@/lib/shaders';

const MOBILE_QUERY = '(max-width: 767px)';

/**
 * Full hero background: layered fractal-noise haze with a slow crimson
 * bloom, warped gently by the mouse. Falls back to a static gradient
 * "poster" when WebGL2 isn't available, or on mobile viewports where a
 * full shader field isn't worth the battery/GPU cost — never blocks the
 * hero text either way.
 */
export function HeroField() {
  const [unavailable, setUnavailable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  if (unavailable || isMobile) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-ink-950 bg-crimson-bloom"
      />
    );
  }

  return (
    <ShaderCanvas
      fragmentSrc={HERO_FRAGMENT_SRC}
      mouseReactive
      className="absolute inset-0 h-full w-full"
      onUnavailable={() => setUnavailable(true)}
    />
  );
}
