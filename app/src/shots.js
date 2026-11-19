// Fixed scenes for screenshots: ?shot=editor shows the editor with sample photos
// loaded; ?shot=cover shows the exported cover alone, edge to edge.
// Query knobs: layout, grade, size, title, subtitle, assign (photo index per panel,
// e.g. assign=1,0,1,0). window.__shotReady is set once the scene has painted.
export async function runShotScene(shot, query, api) {
  const { state } = api;
  const pick = (name, fallback) => query.get(name) || fallback;

  state.layout = pick('layout', 'hero');
  state.grade = pick('grade', 'sunset');
  state.size = pick('size', 'square');
  state.title = pick('title', pick('caption', 'SUNSET HEIST'));
  state.subtitle = pick('subtitle', 'one last ride down the coast');
  state.showBadge = query.get('badge') !== 'off';

  await api.loadSamples();

  const assign = query.get('assign');
  if (assign) {
    const picks = assign.split(',').map((n) => Number(n));
    state.panels.forEach((panel, i) => {
      if (Number.isInteger(picks[i]) && picks[i] >= 0 && picks[i] < state.photos.length) {
        panel.photo = picks[i];
      }
    });
  }
  const zoom = Number(query.get('zoom'));
  if (Number.isFinite(zoom) && zoom > 0) {
    state.panels.forEach((panel) => { panel.zoom = zoom; });
  }

  // Keep the editor's buttons in sync with the scene, then paint.
  api.renderTray();
  api.renderPanelButtons();
  api.syncPanelControls();
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch { /* system fonts still paint */ }
  }
  api.redraw();
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  window.__shotReady = true;
}
