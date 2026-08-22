import { cx } from '@/lib/utils';

const PALETTES: Record<string, string> = {
  crimson: 'from-crimson-700 via-ink-900 to-ink-950',
  bone: 'from-bone-500/40 via-ink-900 to-ink-950',
  gold: 'from-gold-600/50 via-ink-900 to-ink-950',
  ink: 'from-ink-700 via-ink-900 to-ink-950',
};

type Props = {
  palette: 'crimson' | 'bone' | 'gold' | 'ink';
  title: string;
  className?: string;
  priority?: boolean;
};

/**
 * No photography assets exist for the catalog yet, so covers render as
 * typographic gradient slabs in the site palette. Swap for real artwork by
 * replacing this component's usage with next/image once files land in
 * /public/covers.
 */
export function CoverArt({ palette, title, className }: Props) {
  return (
    <div
      role="img"
      aria-label={`${title} cover art`}
      className={cx(
        'relative flex aspect-square w-full items-end overflow-hidden border border-bone-100/10 bg-gradient-to-br p-6',
        PALETTES[palette],
        className,
      )}
    >
      <div className="decay-scanlines absolute inset-0 opacity-[0.06]" aria-hidden="true" />
      <span className="font-display text-display-4 leading-[0.95] tracking-tightest text-bone-100/90">
        {title}
      </span>
    </div>
  );
}
