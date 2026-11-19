// Fixed scenes for screenshots.
//   ?shot=cover&preset=sunset-heat   the cover alone, full viewport
//   ?shot=cover&preset=neon-nights   the portrait cover alone
//   ?shot=cover&preset=golden-coast  the tilted-snaps cover alone
//   ?shot=editor&preset=sunset-heat  the editor with the cover in its live preview
// `title` / `subtitle` / `grade` override the preset's defaults.
// window.__shotReady is set once the scene is painted.
import { COVER_LAYOUTS } from './cover.js';

export async function runShot(shot, query, load) {
  const preset = query.get('preset') ?? 'sunset-heat';
  const layout = COVER_LAYOUTS[preset] ?? COVER_LAYOUTS['sunset-heat'];
  if (shot === 'cover') document.body.classList.add('shot-cover');
  if (shot === 'editor') document.body.classList.add('shot-editor');
  await load(
    preset,
    query.get('title') ?? layout.title,
    query.get('subtitle') ?? layout.subtitle,
    query.get('grade') ?? 'sunset',
  );
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  window.__shotReady = true;
}
