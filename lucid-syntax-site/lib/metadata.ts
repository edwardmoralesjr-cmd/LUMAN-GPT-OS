import type { Metadata } from 'next';
import { SITE } from '@/content/site';

/**
 * Every route builds its metadata through here so title, canonical, and
 * OG/Twitter cards always stay in sync — sharing a link to any page shows
 * that page's own text, not the homepage's.
 */
export function buildMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${SITE.name} — ${title}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      title: fullTitle,
      description,
    },
  };
}
