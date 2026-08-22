'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => void;
};

/**
 * Drop-in replacement for next/link that uses the native View Transitions
 * API when the browser supports it. Everywhere else — including browsers
 * without support — falls through to a normal client-side navigation,
 * which app/template.tsx crossfades on its own.
 */
export function TransitionLink({ href, onClick, ...props }: ComponentProps<typeof Link>) {
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    const doc = document as DocumentWithViewTransition;
    if (!doc.startViewTransition) return; // let the normal <Link> nav happen
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    e.preventDefault();
    doc.startViewTransition(() => {
      router.push(typeof href === 'string' ? href : href.toString());
    });
  }

  return <Link href={href} onClick={handleClick} {...props} />;
}
