import { LATEST_SINGLE, SITE } from '@/content/site';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Sound',
  description: `Hear ${SITE.name} — an audio-reactive preview of "${LATEST_SINGLE.title}."`,
  path: '/sound',
});

export default function SoundPage() {
  return (
    <>
      <header className="border-b border-bone-100/10 px-gutter py-20">
        <h1 className="font-display text-display-2 text-bone-50">Sound</h1>
        <p className="mt-4 max-w-xl font-body text-bone-300">
          Press play. The field below moves with the track — every stop-start hit and sub-bass drop bends the
          haze in real time.
        </p>
      </header>

      <section aria-label={`${LATEST_SINGLE.title} audio preview`} className="px-gutter py-16">
        <div className="mx-auto max-w-4xl">
          <AudioVisualizer
            title={LATEST_SINGLE.title}
            src={LATEST_SINGLE.previewUrl}
          />
          <p className="mt-4 font-body text-xs text-bone-500">
            30-second preview of &ldquo;{LATEST_SINGLE.title}.&rdquo; Full track on every streaming platform.
          </p>
        </div>
      </section>
    </>
  );
}
