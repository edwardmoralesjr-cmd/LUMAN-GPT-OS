import { EmailCapture } from '@/components/EmailCapture';
import { PlatformLinks } from '@/components/PlatformLinks';
import { CONTACT, SITE, SOCIAL_LINKS, STREAMING_LINKS } from '@/content/site';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Connect',
  description: `Follow ${SITE.name}: streaming links, socials, and booking/press contact.`,
  path: '/connect',
});

export default function ConnectPage() {
  return (
    <>
      <header className="border-b border-bone-100/10 px-gutter py-20">
        <h1 className="font-display text-display-2 text-bone-50">Connect</h1>
        <p className="mt-4 max-w-xl font-body text-bone-300">
          Every real channel, in one place. No algorithm required.
        </p>
      </header>

      <section aria-labelledby="join-heading" className="border-b border-bone-100/10 px-gutter py-16">
        <div className="mx-auto max-w-3xl">
          <h2 id="join-heading" className="font-display text-display-4 text-bone-50">
            Join the list
          </h2>
          <p className="mt-3 max-w-md font-body text-bone-300">
            New releases, tour dates, and mythos drops — first, and only when it matters.
          </p>
          <div className="mt-8">
            <EmailCapture />
          </div>
        </div>
      </section>

      <section aria-labelledby="listen-heading" className="border-b border-bone-100/10 px-gutter py-16">
        <div className="mx-auto grid max-w-3xl gap-10 sm:grid-cols-2">
          <div>
            <h2 id="listen-heading" className="mb-4 font-display text-display-4 text-bone-50">
              Listen
            </h2>
            <PlatformLinks links={STREAMING_LINKS} />
          </div>
          <div>
            <h2 className="mb-4 font-display text-display-4 text-bone-50">Follow</h2>
            <PlatformLinks links={SOCIAL_LINKS} />
          </div>
        </div>
      </section>

      <section aria-labelledby="contact-heading" className="px-gutter py-16">
        <div className="mx-auto max-w-3xl">
          <h2 id="contact-heading" className="mb-4 font-display text-display-4 text-bone-50">
            Booking &amp; Press
          </h2>
          <dl className="flex flex-col gap-3 font-body text-bone-300">
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-bone-500">Booking</dt>
              <dd>
                <a href={`mailto:${CONTACT.booking}`} className="underline decoration-crimson-500 underline-offset-4 hover:text-bone-50">
                  {CONTACT.booking}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-bone-500">Press</dt>
              <dd>
                <a href={`mailto:${CONTACT.press}`} className="underline decoration-crimson-500 underline-offset-4 hover:text-bone-50">
                  {CONTACT.press}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-bone-500">General</dt>
              <dd>
                <a href={`mailto:${CONTACT.general}`} className="underline decoration-crimson-500 underline-offset-4 hover:text-bone-50">
                  {CONTACT.general}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
