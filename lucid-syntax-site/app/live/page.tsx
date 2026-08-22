import { CONTACT, SHOWS, SITE } from '@/content/site';
import { formatDateShort } from '@/lib/utils';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Live',
  description: `Upcoming ${SITE.name} live dates.`,
  path: '/live',
});

export default function LivePage() {
  return (
    <>
      <header className="border-b border-bone-100/10 px-gutter py-20">
        <h1 className="font-display text-display-2 text-bone-50">Live</h1>
      </header>

      <section aria-label="Show dates" className="px-gutter py-16">
        <div className="mx-auto max-w-3xl">
          {SHOWS.length === 0 ? (
            <div className="border border-dashed border-bone-100/20 px-8 py-16 text-center">
              <p className="font-display text-display-4 text-bone-200">No dates announced — yet.</p>
              <p className="mx-auto mt-4 max-w-sm font-body text-sm text-bone-500">
                The cathedral tour is still being built. Join the list and you&rsquo;ll hear about dates before
                anyone else.
              </p>
              <a
                href="/connect"
                className="mt-8 inline-block border border-bone-50 px-6 py-3 font-body text-xs font-semibold uppercase tracking-widest text-bone-50 transition-colors duration-300 ease-decay hover:bg-bone-50 hover:text-ink-950"
              >
                Get notified
              </a>
            </div>
          ) : (
            <ol className="flex flex-col">
              {SHOWS.map((show) => (
                <li
                  key={`${show.date}-${show.venue}`}
                  className="flex flex-wrap items-center justify-between gap-4 border-b border-bone-100/10 py-6 first:border-t"
                >
                  <div>
                    <p className="font-mono text-xs text-crimson-300">{formatDateShort(show.date)}</p>
                    <p className="mt-1 font-body text-lg text-bone-50">{show.city}</p>
                    <p className="font-body text-sm text-bone-400">{show.venue}</p>
                  </div>
                  {show.ticketUrl && (
                    <a
                      href={show.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-bone-100/40 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-widest text-bone-50 hover:border-bone-50"
                    >
                      Tickets
                    </a>
                  )}
                </li>
              ))}
            </ol>
          )}
          <p className="mt-12 font-body text-sm text-bone-500">
            Booking inquiries:{' '}
            <a href={`mailto:${CONTACT.booking}`} className="text-bone-300 underline decoration-crimson-500 underline-offset-4 hover:text-bone-50">
              {CONTACT.booking}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
