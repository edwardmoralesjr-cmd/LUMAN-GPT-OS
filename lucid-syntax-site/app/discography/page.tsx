import { CoverArt } from '@/components/CoverArt';
import { TrackList } from '@/components/TrackList';
import { ALBUMS, SITE } from '@/content/site';
import { JsonLd } from '@/components/JsonLd';
import { formatDate } from '@/lib/utils';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Discography',
  description: `The complete ${SITE.name} catalog — every album, from Words That Breathe to the forthcoming Visionary.`,
  path: '/discography',
});

export default function DiscographyPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: ALBUMS.map((a, i) => ({
            '@type': 'MusicAlbum',
            position: i + 1,
            name: a.title,
            byArtist: { '@type': 'MusicGroup', name: SITE.name },
            datePublished: a.releaseDate,
          })),
        }}
      />

      <header className="border-b border-bone-100/10 px-gutter py-20">
        <h1 className="font-display text-display-2 text-bone-50">Discography</h1>
        <p className="mt-4 max-w-xl font-body text-bone-300">
          Five records tracing one confession — from the private language of {ALBUMS[0]?.title} to the album
          still being written.
        </p>
      </header>

      <div className="px-gutter py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-24">
          {ALBUMS.map((album) => (
            <article
              key={album.slug}
              id={album.slug}
              aria-labelledby={`${album.slug}-heading`}
              className="grid gap-10 border-t border-bone-100/10 pt-12 md:grid-cols-[minmax(0,280px)_1fr]"
            >
              <CoverArt palette={album.cover.palette} title={album.title} />
              <div>
                <p className="font-mono text-xs uppercase tracking-widest2 text-crimson-300">
                  {album.status === 'released' && `Released ${album.year}`}
                  {album.status === 'upcoming' && album.releaseDate && `Arrives ${formatDate(album.releaseDate)}`}
                  {album.status === 'forthcoming' && 'Forthcoming'}
                </p>
                <h2 id={`${album.slug}-heading`} className="mt-2 font-display text-display-3 text-bone-50">
                  {album.title}
                </h2>
                {album.theme && <p className="mt-4 max-w-2xl font-body text-bone-200">{album.theme}</p>}
                {album.note && <p className="mt-3 max-w-2xl font-body text-xs italic text-bone-500">{album.note}</p>}
                <div className="mt-8 max-w-lg">
                  <TrackList tracks={album.tracks} albumTitle={album.title} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
