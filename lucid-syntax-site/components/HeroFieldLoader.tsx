'use client';

import dynamic from 'next/dynamic';

const HeroField = dynamic(() => import('./HeroField').then((m) => m.HeroField), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="absolute inset-0 bg-ink-950 bg-crimson-bloom" />,
});

export function HeroFieldLoader() {
  return <HeroField />;
}
