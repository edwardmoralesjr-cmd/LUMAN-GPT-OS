import type { StreamingLink } from '@/content/site';
import { cx } from '@/lib/utils';

export function PlatformLinks({
  links,
  variant = 'list',
  className,
}: {
  links: StreamingLink[];
  variant?: 'list' | 'inline';
  className?: string;
}) {
  return (
    <ul
      className={cx(
        variant === 'list' ? 'flex flex-col gap-2' : 'flex flex-wrap gap-x-6 gap-y-2',
        className,
      )}
    >
      {links.map((link) => (
        <li key={link.platform}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer me"
            className="group inline-flex items-center gap-3 border-b border-transparent py-1 font-body text-sm uppercase tracking-widest2 text-bone-200 transition-colors duration-300 ease-decay hover:border-crimson-400 hover:text-bone-50"
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-crimson-400 transition-transform duration-300 ease-decay group-hover:scale-150"
            />
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
