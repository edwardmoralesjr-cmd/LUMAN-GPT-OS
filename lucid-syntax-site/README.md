# Lucid Syntax — site

Next.js 15 (App Router) + TypeScript + Tailwind. Static-generated, no CMS —
every piece of copy and data lives in `content/site.ts`.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production build
```

## Editing content

Everything — album titles, tracklists, streaming/social links, contact
emails, the Mythos essay, show dates — lives in `content/site.ts`. Nothing
else needs to change to update copy. Lines marked `// TODO: confirm` are
placeholders that need real data before launch (see below).

## What still needs real data before launch

The repo this was built from has confirmed facts for two albums (*Words
That Breathe*, *Visionary*) and one future one (*The Human Syntax*, no
tracklist yet). It did not contain: real streaming/social profile URLs,
booking/press emails, a hosted EPK file, YouTube video IDs, show dates, or
album artwork. All of those are stubbed in `content/site.ts` and flagged
`// TODO: confirm` — grep the file for `TODO` to find every one. Two
discography slots (`chapter-iv`, `chapter-v`) are empty placeholders so the
catalog structure supports five albums once the remaining titles exist;
delete them if they end up not being needed.

There is no photography or finished album art in the source material, so
album covers render as typographic gradient slabs (`components/CoverArt.tsx`)
rather than fabricated images. Swap in real art by replacing that
component's usage with `next/image` once files exist in `/public/covers`.

## Performance tradeoffs made, and how to cut further

The brief's own priority order — be findable, then convert, then look
bigger — argues against heavy client JS, so the build leans static:

- **No three.js / React Three Fiber.** The hero shader field and the
  Sound-page audio-reactive field (`components/ShaderCanvas.tsx`,
  `lib/shaders.ts`) are hand-rolled raw WebGL2 fragment shaders instead —
  a few KB of code versus three.js's 150KB+ minified runtime. Same visual
  brief (layered fractal noise, crimson bloom, mouse warp, audio-driven
  distortion), much less weight. If a future revision genuinely needs
  R3F's scene graph (real 3D geometry, not a fullscreen shader), swap
  `ShaderCanvas` for an R3F `Canvas` — the fragment shader strings in
  `lib/shaders.ts` carry over almost unchanged.
- **Everything heavy is code-split and gesture-gated.** The hero shader,
  the audio-reactive field, and every YouTube embed load via `next/dynamic`
  with `ssr: false` or a click-to-load facade — none of it is in the
  homepage's initial JS. `AudioContext` only initializes after the user
  presses play (`components/ReactiveField.tsx`), matching the browser's
  own autoplay-gesture requirement.
- **The hero shader drops to a static gradient on mobile viewports**
  (`components/HeroField.tsx`, `<768px`) and whenever WebGL2 is
  unavailable — never a loading blocker for the hero text.
- **`prefers-reduced-motion: reduce` is honored everywhere**: Lenis smooth
  scroll doesn't initialize, the shader renders one frame and stops, the
  glitch-text reveal (`components/GlitchText.tsx`) renders as plain text
  with no animation, and global CSS collapses all transition/animation
  durations to near-zero.
- **Cut entirely: scroll-jacked discography rail.** The brief offers a
  horizontal scroll-jacked rail or pinned sequence as the discography's
  signature interaction, but flags scroll-jacking as one of the more
  expensive, SEO-hostile choices in its own tradeoff note. Given the
  stated #1 priority is search findability, discography ships as a plain
  stacked article list at every breakpoint instead — fully static,
  crawlable, and identical to what "graceful fallback below 1024px" would
  have produced anyway. Reintroducing a pinned/rail version on top of this
  markup is a scoped follow-up, not a rebuild.
- **Cut to a best-effort layer: native View Transitions.** Primary nav
  links (`components/TransitionLink.tsx`) use `document.startViewTransition`
  where the browser supports it; every other link relies on the
  Framer Motion crossfade in `app/template.tsx`, which runs everywhere
  regardless of browser support. A full router-level integration (every
  link, not just primary nav) is a further step if it matters.
- **Email capture backend is a stub.** `app/api/subscribe/route.ts`
  validates and returns success but doesn't persist or send anything —
  wire it to a real ESP (Mailchimp/ConvertKit/Beehiiv/etc.) before launch.

Last verified production build: `/` first-load JS ≈147KB, every other
route ≈103–104KB (Next.js's reported gzip figures) — all pages statically
prerendered, all comfortably under the 250KB budget with room for real
album art and audio files still to be added.
