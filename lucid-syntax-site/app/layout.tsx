import type { Metadata } from 'next';
import { Fraunces, Archivo, JetBrains_Mono } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DecayOverlay } from '@/components/DecayOverlay';
import { JsonLd } from '@/components/JsonLd';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import { CustomCursor } from '@/components/CustomCursor';
import { SITE, SOCIAL_LINKS, STREAMING_LINKS } from '@/content/site';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['opsz', 'SOFT', 'WONK'],
  weight: 'variable',
  style: ['normal', 'italic'],
  display: 'swap',
});

const body = Archivo({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `${SITE.name} — %s`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ['Lucid Syntax', 'Lucid Syntax band', 'cinematic metalcore', 'alt-metal', 'Edward Morales Jr', 'Paint song', 'Visionary album'],
  authors: [{ name: SITE.founder }],
  creator: SITE.founder,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const musicGroupJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: SITE.name,
    url: SITE.url,
    genre: SITE.genre,
    description: SITE.description,
    foundingLocation: undefined,
    member: {
      '@type': 'Person',
      name: SITE.founder,
    },
    sameAs: [...STREAMING_LINKS, ...SOCIAL_LINKS].map((l) => l.url),
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={musicGroupJsonLd} />
        <CustomCursor />
        <SmoothScrollProvider>
          <Header />
          <main id="main" className="pt-[var(--header-h)]">
            {children}
          </main>
          <Footer />
        </SmoothScrollProvider>
        <DecayOverlay />
      </body>
    </html>
  );
}
