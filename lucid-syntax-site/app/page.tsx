import Link from 'next/link';
import type { Metadata } from 'next';
import { CoverArt } from '@/components/CoverArt';
import { HeroFieldLoader } from '@/components/HeroFieldLoader';
import { PlatformLinks } from '@/components/PlatformLinks';
import { TrackList } from '@/components/TrackList';
import { GlitchText } from '@/components/GlitchText';
import { Magnetic } from '@/components/Magnetic';
import { ALBUMS, LATEST_SINGLE, RECENT_SINGLES, SITE } from '@/content/site';
import { formatDate } from '@/lib/utils';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: { absolute: `${SITE.name} — ${SITE.tagline}` },
  description: SITE.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const visionary = ALBUMS.find((a) => a.slug === 'visionary')!;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'MusicRecording',
          name: LATEST_SINGLE.title,
          byArtist: { '@type': 'MusicGroup', name: SITE.name },
          datePublished: LATEST_SINGLE.releaseDate,
          inAlbum: { '@type': 'MusicAlbum', name: LATEST_SINGLE.album },
        }}
      />

      {/* 1. Hero */}
      <section
        id="hero"
        aria-label="Intro"
        className="relative flex min-h-[calc(100dvh-var(--header-h))] flex-col justify-end overflow-hidden border-b border-bone-100/10 px-gutter pb-16 pt-24"
      >
        <div className="absolute inset-0 -z-10">
          <HeroFieldLoader />
        </div>
        <p className="mb-4 font-mono text-xs uppercase tracking-widest2 text-crimson-300">
          {SITE.genre}
        </p>
        <GlitchText as="h1" className="max-w-5xl font-display text-display-1 font-normal text-bone-50">
          {SITE.name}
        </GlitchText>
        <p className="mt-6 max-w-xl font-body text-lg text-bone-200">{SITE.positioning}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Magnetic>
            <Link
              href="/sound"
              className="block border border-bone-50 bg-bone-50 px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest text-ink-950 transition-colors duration-300 ease-decay hover:bg-crimson-500 hover:text-bone-50"
            >
              Listen
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/video"
              className="block border border-bone-100/40 px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest text-bone-50 transition-colors duration-300 ease-decay hover:border-bone-50"
            >
              Watch
            </Link>
          </Magnetic>
        </div>
      </section>

      {/* 2. Latest release */}
      <section aria-labelledby="latest-release-heading" className="border-b border-bone-100/10 px-gutter py-24">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <CoverArt palette={LATEST_SINGLE.cover.palette} title={LATEST_SINGLE.title} priority />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-widest2 text-crimson-300">
              Latest single — {formatDate(LATEST_SINGLE.releaseDate)}
            </p>
            <GlitchText as="h2" id="latest-release-heading" className="mt-3 font-display text-display-2 text-bone-50">
              {LATEST_SINGLE.title}
            </GlitchText>
            <p className="mt-6 max-w-md font-body text-base text-bone-200">{LATEST_SINGLE.description}</p>
            <p className="mt-2 font-body text-sm text-bone-500">From the forthcoming album {LATEST_SINGLE.album}</p>

            <div className="mt-8">
              <PlatformLinks links={LATEST_SINGLE.links} variant="inline" />
            </div>

            <div className="mt-10">
              <h3 className="mb-3 font-mono text-xs uppercase tracking-widest2 text-bone-500">Also out now</h3>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 font-body text-sm text-bone-300">
                {RECENT_SINGLES.map((s) => (
                  <li key={s.title}>
                    {s.title} <span className="text-bone-500">— {formatDate(s.releaseDate)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Discography teaser */}
      <section aria-labelledby="discog-teaser-heading" className="border-b border-bone-100/10 px-gutter py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <GlitchText as="h2" id="discog-teaser-heading" className="font-display text-display-3 text-bone-50">
              The Catalog
            </GlitchText>
            <Link href="/discography" className="font-body text-sm uppercase tracking-widest text-crimson-300 hover:text-crimson-200">
              Full discography →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
            {ALBUMS.map((album) => (
              <Link key={album.slug} href="/discography" className="group block">
                <CoverArt palette={album.cover.palette} title={album.title} />
                <p className="mt-3 font-body text-sm text-bone-200 group-hover:text-bone-50">{album.title}</p>
                <p className="font-mono text-xs text-bone-500">{album.year}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Visionary tracklist preview */}
      <section aria-labelledby="visionary-heading" className="border-b border-bone-100/10 px-gutter py-24">
        <div className="mx-auto max-w-3xl">
          <GlitchText as="h2" id="visionary-heading" className="font-display text-display-3 text-bone-50">
            {`Visionary — ${visionary.year}`}
          </GlitchText>
          <p className="mt-4 font-body text-bone-300">{visionary.theme}</p>
          <div className="mt-8">
            <TrackList tracks={visionary.tracks} albumTitle={visionary.title} />
          </div>
        </div>
      </section>

      {/* Connect CTA */}
      <section aria-labelledby="connect-cta-heading" className="px-gutter py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6">
          <GlitchText as="h2" id="connect-cta-heading" className="font-display text-display-3 text-bone-50">
            Follow the signal.
          </GlitchText>
          <p className="max-w-md font-body text-bone-300">
            New releases, tour dates, and mythos drops go straight to the list first.
          </p>
          <Magnetic>
            <Link
              href="/connect"
              className="block border border-bone-50 px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest text-bone-50 transition-colors duration-300 ease-decay hover:bg-bone-50 hover:text-ink-950"
            >
              Join the list
            </Link>
          </Magnetic>
        </div>
      </section>
    </>
  );
}
