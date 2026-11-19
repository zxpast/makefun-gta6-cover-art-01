// Fixed scenes for screenshots: ?shot=editor shows the page with a preset
// loaded; ?shot=cover shows the cover alone. `preset` picks the cover
// (sunset-heat, neon-nights, golden-coast). The scene is drawn twice —
// once immediately, once after the Anton / Pacifico webfonts arrive, so
// the canvas lettering uses the real fonts — and window.__shotReady is
// set once painted.
export async function runShot(shot, query, load) {
  const presetId = query.get('preset') ?? 'sunset-heat';
  if (shot === 'cover') document.body.classList.add('shot-cover');
  await load(presetId);
  try {
    await document.fonts.ready;
    await document.fonts.load('150px Anton');
    await document.fonts.load('34px Pacifico');
    await load(presetId);
  } catch {
    // Fonts are vendored; if they fail, the first draw still stands.
  }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    window.__shotReady = true;
  }));
}
