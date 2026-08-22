import { GlitchText } from '@/components/GlitchText';
import { MYTHOS, SITE } from '@/content/site';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Mythos',
  description:
    'The story, sound, and visual mythology of Lucid Syntax — cinematic metalcore built by Edward Morales Jr. from confession, breakdown, and sacred-corrupted imagery.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <article className="px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <header>
          <p className="font-mono text-xs uppercase tracking-widest2 text-crimson-300">Mythos</p>
          <GlitchText as="h1" className="mt-3 font-display text-display-2 text-bone-50">
            {MYTHOS.heading}
          </GlitchText>
          <p className="mt-6 font-body text-lg text-bone-200">{MYTHOS.intro}</p>
        </header>

        <div className="mt-16 flex flex-col gap-14">
          {MYTHOS.sections.map((section) => (
            <section key={section.heading} aria-labelledby={section.heading.replace(/\s+/g, '-').toLowerCase()}>
              <h2
                id={section.heading.replace(/\s+/g, '-').toLowerCase()}
                className="font-display text-display-4 text-bone-50"
              >
                {section.heading}
              </h2>
              <p className="mt-4 font-body leading-relaxed text-bone-200">{section.body}</p>
            </section>
          ))}
        </div>

        <footer className="mt-20 border-t border-bone-100/10 pt-8">
          <p className="font-body text-sm text-bone-500">
            Written and directed by {SITE.founder}. {SITE.name} is {SITE.genre.toLowerCase()} — read the
            full{' '}
            <a href="/discography" className="text-bone-300 underline decoration-crimson-500 underline-offset-4 hover:text-bone-50">
              discography
            </a>{' '}
            or{' '}
            <a href="/connect" className="text-bone-300 underline decoration-crimson-500 underline-offset-4 hover:text-bone-50">
              get in touch
            </a>
            .
          </p>
        </footer>
      </div>
    </article>
  );
}
