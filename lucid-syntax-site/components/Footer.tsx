import Link from 'next/link';
import { CONTACT, NAV, SITE, SOCIAL_LINKS, STREAMING_LINKS } from '@/content/site';
import { PlatformLinks } from './PlatformLinks';

export function Footer() {
  return (
    <footer className="border-t border-bone-100/10 bg-ink-950 px-gutter py-16">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-display-4 tracking-tightest text-bone-50">{SITE.name}</p>
          <p className="mt-3 max-w-sm font-body text-sm text-bone-300">{SITE.tagline}</p>
          <p className="mt-6 font-body text-sm text-bone-500">
            Booking:{' '}
            <a className="text-bone-300 underline decoration-crimson-500 underline-offset-4 hover:text-bone-50" href={`mailto:${CONTACT.booking}`}>
              {CONTACT.booking}
            </a>
          </p>
          <p className="font-body text-sm text-bone-500">
            Press:{' '}
            <a className="text-bone-300 underline decoration-crimson-500 underline-offset-4 hover:text-bone-50" href={`mailto:${CONTACT.press}`}>
              {CONTACT.press}
            </a>
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-4 font-body text-xs uppercase tracking-widest2 text-bone-500">Site</h2>
          <ul className="flex flex-col gap-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-body text-sm text-bone-300 hover:text-bone-50">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-body text-xs uppercase tracking-widest2 text-bone-500">Listen</h2>
          <PlatformLinks links={STREAMING_LINKS.slice(0, 4)} />
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-start justify-between gap-4 border-t border-bone-100/10 pt-8 md:flex-row md:items-center">
        <PlatformLinks links={SOCIAL_LINKS} variant="inline" />
        <p className="font-mono text-xs text-bone-500">
          &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
