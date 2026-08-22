import Link from 'next/link';
import { TransitionLink } from './TransitionLink';
import { NAV, SITE } from '@/content/site';

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[var(--header-h)] items-center justify-between border-b border-bone-100/10 bg-ink-950/80 px-gutter backdrop-blur-md">
      <Link
        href="/"
        className="font-display text-lg font-medium uppercase tracking-widest2 text-bone-50 transition-colors hover:text-crimson-300"
      >
        {SITE.name}
      </Link>
      <nav aria-label="Primary">
        <ul className="hidden items-center gap-8 md:flex">
          {NAV.slice(1).map((item) => (
            <li key={item.href}>
              <TransitionLink
                href={item.href}
                className="font-body text-xs uppercase tracking-widest2 text-bone-300 transition-colors duration-300 ease-decay hover:text-crimson-300"
              >
                {item.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <MobileNav />
      </nav>
    </header>
  );
}

function MobileNav() {
  return (
    <details className="relative md:hidden">
      <summary
        aria-label="Open menu"
        className="flex cursor-pointer list-none flex-col gap-1.5 p-2 [&::-webkit-details-marker]:hidden"
      >
        <span className="block h-px w-6 bg-bone-100" aria-hidden="true" />
        <span className="block h-px w-6 bg-bone-100" aria-hidden="true" />
      </summary>
      <ul className="absolute right-0 top-12 flex w-56 flex-col gap-1 border border-bone-100/10 bg-ink-900 p-4 shadow-xl">
        {NAV.slice(1).map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block py-2 font-body text-sm uppercase tracking-widest text-bone-200 hover:text-crimson-300"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
