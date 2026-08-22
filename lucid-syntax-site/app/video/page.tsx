import { VideoFacade } from '@/components/VideoFacade';
import { SITE, VIDEOS } from '@/content/site';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Video',
  description: `Lyric videos and visualizers from ${SITE.name}.`,
  path: '/video',
});

export default function VideoPage() {
  return (
    <>
      <header className="border-b border-bone-100/10 px-gutter py-20">
        <h1 className="font-display text-display-2 text-bone-50">Video</h1>
        <p className="mt-4 max-w-xl font-body text-bone-300">
          Lyric videos and visualizers built from the same stained-glass-and-static visual language.
        </p>
      </header>

      <section aria-label="Video library" className="px-gutter py-16">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2">
          {VIDEOS.map((video) => (
            <VideoFacade key={video.youtubeId} video={video} />
          ))}
        </div>
      </section>
    </>
  );
}
