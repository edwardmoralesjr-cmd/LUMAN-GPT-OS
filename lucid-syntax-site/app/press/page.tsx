import { CONTACT, SITE } from '@/content/site';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Press Kit',
  description: `Download the ${SITE.name} electronic press kit — bio, photos, logos, and album art.`,
  path: '/press',
});

export default function PressPage() {
  return (
    <section className="px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-display-2 text-bone-50">Press Kit</h1>
        <p className="mt-6 max-w-xl font-body text-bone-300">
          Bio, high-resolution logos, approved photography, and album art for {SITE.name}, in one downloadable
          folder.
        </p>

        <div className="mt-10 border border-bone-100/10 bg-ink-900 p-8">
          <p className="font-mono text-xs uppercase tracking-widest2 text-crimson-300">Electronic Press Kit</p>
          <p className="mt-2 font-body text-bone-200">
            {SITE.name} — {SITE.genre}
          </p>
          <a
            href={CONTACT.epkUrl}
            className="mt-6 inline-block border border-bone-50 px-6 py-3 font-body text-sm font-semibold uppercase tracking-widest text-bone-50 transition-colors duration-300 ease-decay hover:bg-bone-50 hover:text-ink-950"
          >
            Download EPK
          </a>
          <p className="mt-3 font-body text-xs text-bone-500">
            {/* TODO: confirm — replace with the real hosted EPK archive link once assembled. */}
            Link placeholder — swap in the real hosted archive before launch.
          </p>
        </div>

        <p className="mt-8 font-body text-sm text-bone-500">
          Press inquiries:{' '}
          <a href={`mailto:${CONTACT.press}`} className="text-bone-300 underline decoration-crimson-500 underline-offset-4 hover:text-bone-50">
            {CONTACT.press}
          </a>
        </p>
      </div>
    </section>
  );
}
