// Fixed scenes for screenshots: ?shot=cover shows the wide hero cover alone,
// ?shot=editor shows the editor with the new cover in its live preview,
// ?shot=portrait the Neon Nights strip, ?shot=square the Golden Coast tilt.
// `preset` picks the cover preset, `title` overrides its words.
// window.__shotReady is set once the cover has painted with real fonts.
// The cover canvas itself is the exported art: screenshots show the app's
// own drawing at the gate's largest size, never an edited composite.
export async function runShot(shot, query, api) {
  const preset = query.get('preset') || (
    shot === 'portrait' ? 'neonNights'
    : shot === 'square' ? 'goldenCoast'
    : 'sunsetHeist'
  );
  if (shot === 'cover' || shot === 'portrait' || shot === 'square') {
    document.body.classList.add('shot-cover');
  }
  api.applyPreset(preset);
  const title = query.get('title');
  if (title) {
    const titleInput = document.getElementById('titleInput');
    titleInput.value = title;
  }
  const subtitle = query.get('subtitle');
  if (subtitle) {
    const subtitleInput = document.getElementById('subtitleInput');
    subtitleInput.value = subtitle;
  }
  api.redrawPreview();
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  window.__shotReady = true;
}
