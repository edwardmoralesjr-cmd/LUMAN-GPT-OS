/**
 * Site-wide grain / scan-line / vignette layers. Pure CSS, no JS, so it
 * costs nothing on the JS budget and never blocks first paint.
 */
export function DecayOverlay() {
  return (
    <div aria-hidden="true">
      <div className="decay-layer decay-vignette" />
      <div className="decay-layer decay-scanlines" />
      <div className="decay-layer decay-grain" />
    </div>
  );
}
