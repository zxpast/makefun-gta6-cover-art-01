// Fixed scenes for screenshots: ?shot=editor shows the page with the sample
// photos; ?shot=cover shows the cover alone. window.__shotReady is set once
// the cover is painted with the real fonts.
export async function runShot(shot, query, api) {
  const preset = query.get('preset') ?? 'sunset-heat';
  await api.applyPreset(preset);
  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
    api.clampCoverCanvas();
  }
  api.draw();
  await document.fonts.ready;
  await Promise.all([
    document.fonts.load('150px Anton'),
    document.fonts.load('34px Pacifico'),
  ]);
  api.draw();
  await new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
  window.__shotReady = true;
}
