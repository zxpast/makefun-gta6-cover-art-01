// Vice Coast Cover Studio — wires the editor: photos, panels, caption, grades,
// sizes and export. The cover itself is drawn by ./cover.js. A `?shot=` query
// hands control to ./shots.js for fixed screenshot scenes instead.
import { COVER_SIZES, COVER_LAYOUTS, COVER_GRADES, drawCover, exportCoverCanvas, panelCount, panelRects } from './cover.js';
import { runShotScene } from './shots.js';

const preview = document.getElementById('preview');
const tray = document.getElementById('tray');
const statusLine = document.getElementById('status');
const emptyNote = document.getElementById('emptyNote');
const sizeLabel = document.getElementById('sizeLabel');

const SAMPLE_PHOTOS = [
  { name: 'boulevard', url: 'samples/boulevard.jpg' },
  { name: 'pier', url: 'samples/pier.jpg' },
];

export const studioState = {
  layout: 'hero',
  grade: 'sunset',
  size: 'square',
  title: 'SUNSET HEIST',
  subtitle: 'one last ride down the coast',
  showBadge: true,
  photos: [],
  photoNames: [],
  panels: [
    { photo: -1, zoom: 1, dx: 0, dy: 0 },
    { photo: -1, zoom: 1, dx: 0, dy: 0 },
    { photo: -1, zoom: 1, dx: 0, dy: 0 },
    { photo: -1, zoom: 1, dx: 0, dy: 0 },
  ],
  selected: 0,
  activePhoto: -1,
};

let shotMode = false;

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('could not load ' + url));
    img.src = url;
  });
}

function say(message) {
  statusLine.textContent = message;
}

function hasAnyPhoto() {
  return studioState.photos.some((img) => img !== null);
}

function redraw() {
  const size = COVER_SIZES[studioState.size];
  if (preview.width !== size.w || preview.height !== size.h) {
    preview.width = size.w;
    preview.height = size.h;
  }
  drawCover(preview, { ...studioState, selected: shotMode ? -1 : studioState.selected });
  sizeLabel.textContent = size.label;
  emptyNote.classList.toggle('hidden', hasAnyPhoto() || shotMode);
}

function renderTray() {
  tray.innerHTML = '';
  if (studioState.photos.length === 0) {
    const span = document.createElement('span');
    span.className = 'empty';
    span.textContent = 'No photos yet.';
    tray.appendChild(span);
    return;
  }
  studioState.photos.forEach((img, i) => {
    const thumb = document.createElement('img');
    thumb.src = img.src;
    thumb.alt = studioState.photoNames[i] || ('Photo ' + (i + 1));
    thumb.title = thumb.alt + ' — click to use, then click a panel';
    if (i === studioState.activePhoto) thumb.classList.add('on');
    thumb.addEventListener('click', () => {
      studioState.activePhoto = i;
      renderTray();
      say(thumb.alt + ' selected — click a panel to place it.');
    });
    tray.appendChild(thumb);
  });
}

function renderPanelButtons() {
  const holder = document.getElementById('panelBtns');
  holder.innerHTML = '';
  const count = panelCount(studioState.layout);
  for (let i = 0; i < count; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice' + (studioState.selected === i ? ' on' : '');
    const panel = studioState.panels[i];
    const who = panel.photo >= 0 ? (studioState.photoNames[panel.photo] || ('Photo ' + (panel.photo + 1))) : 'empty';
    btn.textContent = 'Panel ' + (i + 1) + ' · ' + who;
    btn.addEventListener('click', () => {
      studioState.selected = i;
      syncPanelControls();
      renderPanelButtons();
      redraw();
    });
    holder.appendChild(btn);
  }
}

function syncPanelControls() {
  const panel = studioState.panels[studioState.selected];
  const zoom = document.getElementById('zoomInput');
  const dx = document.getElementById('dxInput');
  const dy = document.getElementById('dyInput');
  zoom.value = String(panel.zoom);
  dx.value = String(panel.dx);
  dy.value = String(panel.dy);
  document.getElementById('zoomVal').textContent = panel.zoom.toFixed(2) + '×';
  document.getElementById('dxVal').textContent = panel.dx.toFixed(2);
  document.getElementById('dyVal').textContent = panel.dy.toFixed(2);
}

function bindChoiceGroup(id, key, values) {
  const holder = document.getElementById(id);
  holder.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-' + key + ']');
    if (!btn) return;
    const value = btn.dataset[key];
    if (!values.includes(value)) return;
    studioState[key] = value;
    holder.querySelectorAll('.choice, .swatch').forEach((b) => b.classList.toggle('on', b === btn));
    if (key === 'layout') {
      studioState.selected = 0;
      renderPanelButtons();
      syncPanelControls();
    }
    redraw();
  });
}

async function addPhotoFiles(files) {
  let added = 0;
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    try {
      const img = await loadImage(URL.createObjectURL(file));
      studioState.photos.push(img);
      studioState.photoNames.push(file.name.replace(/\.[^.]+$/, ''));
      added++;
    } catch {
      // Skip unreadable files; the rest still load.
    }
  }
  if (added > 0) {
    studioState.activePhoto = studioState.photos.length - 1;
    // First photo fills every panel so the cover is instant.
    if (studioState.panels.every((p) => p.photo < 0)) {
      studioState.panels.forEach((p) => { p.photo = studioState.activePhoto; });
    }
    renderTray();
    renderPanelButtons();
    redraw();
    say(added + (added === 1 ? ' photo' : ' photos') + ' loaded — click a photo, then a panel, to place it.');
  }
}

async function loadSamplePhotos() {
  for (const sample of SAMPLE_PHOTOS) {
    if (studioState.photoNames.includes(sample.name)) continue;
    try {
      const img = await loadImage(sample.url);
      studioState.photos.push(img);
      studioState.photoNames.push(sample.name);
    } catch {
      // A missing sample never blocks the editor.
    }
  }
  if (studioState.photos.length > 0) {
    studioState.activePhoto = 0;
    studioState.panels.forEach((p, i) => { p.photo = i % studioState.photos.length; });
    renderTray();
    renderPanelButtons();
    redraw();
    say('Sample photos loaded — swap in your own any time.');
  }
}

function panelAtPoint(clientX, clientY) {
  const box = preview.getBoundingClientRect();
  const x = (clientX - box.left) * (preview.width / box.width);
  const y = (clientY - box.top) * (preview.height / box.height);
  const bandH = preview.height * (studioState.size === 'wide' ? 0.32 : 0.26);
  const rects = panelRects(studioState.layout, preview.width, preview.height - bandH);
  for (let i = rects.length - 1; i >= 0; i--) {
    const r = rects[i];
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return { index: i, x, y, rect: r };
  }
  return null;
}

function bindPreviewGestures() {
  let drag = null;
  preview.addEventListener('pointerdown', (event) => {
    const hit = panelAtPoint(event.clientX, event.clientY);
    if (!hit) return;
    preview.setPointerCapture(event.pointerId);
    if (studioState.activePhoto >= 0 && studioState.panels[hit.index].photo !== studioState.activePhoto) {
      studioState.panels[hit.index].photo = studioState.activePhoto;
      renderPanelButtons();
    }
    studioState.selected = hit.index;
    syncPanelControls();
    renderPanelButtons();
    redraw();
    drag = { x: hit.x, y: hit.y, rect: hit.rect, dx: studioState.panels[hit.index].dx, dy: studioState.panels[hit.index].dy };
  });
  preview.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const box = preview.getBoundingClientRect();
    const x = (event.clientX - box.left) * (preview.width / box.width);
    const y = (event.clientY - box.top) * (preview.height / box.height);
    const panel = studioState.panels[studioState.selected];
    panel.dx = Math.max(-0.5, Math.min(0.5, drag.dx + (x - drag.x) / drag.rect.w));
    panel.dy = Math.max(-0.5, Math.min(0.5, drag.dy + (y - drag.y) / drag.rect.h));
    syncPanelControls();
    redraw();
  });
  const endDrag = () => { drag = null; };
  preview.addEventListener('pointerup', endDrag);
  preview.addEventListener('pointercancel', endDrag);
  preview.addEventListener('wheel', (event) => {
    event.preventDefault();
    const panel = studioState.panels[studioState.selected];
    panel.zoom = Math.max(0.8, Math.min(2.6, panel.zoom * Math.exp(-event.deltaY * 0.0012)));
    syncPanelControls();
    redraw();
  }, { passive: false });
  document.addEventListener('keydown', (event) => {
    if (event.target.matches('input[type="text"]')) return;
    const panel = studioState.panels[studioState.selected];
    const step = 0.03;
    if (event.key === 'ArrowLeft') { panel.dx = Math.max(-0.5, panel.dx - step); }
    else if (event.key === 'ArrowRight') { panel.dx = Math.min(0.5, panel.dx + step); }
    else if (event.key === 'ArrowUp') { panel.dy = Math.max(-0.5, panel.dy - step); }
    else if (event.key === 'ArrowDown') { panel.dy = Math.min(0.5, panel.dy + step); }
    else return;
    event.preventDefault();
    syncPanelControls();
    redraw();
  });
}

function bindControls() {
  document.getElementById('photoInput').addEventListener('change', (event) => {
    addPhotoFiles(Array.from(event.target.files || []));
    event.target.value = '';
  });
  document.getElementById('samplesBtn').addEventListener('click', loadSamplePhotos);
  document.getElementById('fillAllBtn').addEventListener('click', () => {
    if (studioState.activePhoto < 0) { say('Pick a photo first.'); return; }
    studioState.panels.forEach((p) => { p.photo = studioState.activePhoto; });
    renderPanelButtons();
    redraw();
    say('Every panel now shows ' + (studioState.photoNames[studioState.activePhoto] || 'that photo') + '.');
  });
  document.getElementById('spreadBtn').addEventListener('click', () => {
    if (studioState.photos.length === 0) { say('Load some photos first.'); return; }
    studioState.panels.forEach((p, i) => { p.photo = i % studioState.photos.length; });
    renderPanelButtons();
    redraw();
    say('Photos spread across the panels.');
  });
  bindChoiceGroup('layoutBtns', 'layout', COVER_LAYOUTS);
  bindChoiceGroup('gradeBtns', 'grade', COVER_GRADES);
  bindChoiceGroup('sizeBtns', 'size', Object.keys(COVER_SIZES));
  document.getElementById('titleInput').addEventListener('input', (event) => {
    studioState.title = event.target.value;
    redraw();
  });
  document.getElementById('subtitleInput').addEventListener('input', (event) => {
    studioState.subtitle = event.target.value;
    redraw();
  });
  document.getElementById('badgeCheck').addEventListener('change', (event) => {
    studioState.showBadge = event.target.checked;
    redraw();
  });
  const bindSlider = (id, key) => {
    document.getElementById(id).addEventListener('input', (event) => {
      studioState.panels[studioState.selected][key] = Number(event.target.value);
      syncPanelControls();
      redraw();
    });
  };
  bindSlider('zoomInput', 'zoom');
  bindSlider('dxInput', 'dx');
  bindSlider('dyInput', 'dy');
  document.getElementById('exportBtn').addEventListener('click', exportPng);
}

function exportPng() {
  const size = COVER_SIZES[studioState.size];
  const canvas = exportCoverCanvas(studioState, studioState.size);
  canvas.toBlob((blob) => {
    if (!blob) { say('Export failed — try again.'); return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'vice-coast-cover-' + size.w + 'x' + size.h + '.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    say('Saved vice-coast-cover-' + size.w + 'x' + size.h + '.png' + (hasAnyPhoto() ? '' : ' (add a photo for the full look)'));
  }, 'image/png');
}

renderTray();
renderPanelButtons();
syncPanelControls();
bindControls();
bindPreviewGestures();

const query = new URLSearchParams(location.search);
const shot = query.get('shot');
if (shot) {
  shotMode = true;
  document.body.classList.add('shot-' + shot);
  runShotScene(shot, query, {
    state: studioState,
    loadImage,
    loadSamples: loadSamplePhotos,
    redraw,
    renderTray,
    renderPanelButtons,
    syncPanelControls,
  });
} else if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(redraw);
  redraw();
} else {
  redraw();
}
