// Sunset Heat Cover Studio — editor wiring.
// Loads the sample photos, applies presets, keeps the live preview in sync
// with the four editor steps, exports PNGs, and serves fixed ?shot= scenes.
import { COVER_SIZES, COVER_LAYOUTS, COVER_GRADES, PRESETS, coverFromPreset, drawCover } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const status = document.getElementById('status');
const titleInput = document.getElementById('title');
const subtitleInput = document.getElementById('subtitle');
const titleSizeInput = document.getElementById('title-size');
const titleSizeOut = document.getElementById('title-size-out');
const panelSelect = document.getElementById('panel-select');
const placeInput = document.getElementById('panel-place');
const timeInput = document.getElementById('panel-time');
const storyInput = document.getElementById('panel-story');
const zoomInput = document.getElementById('panel-zoom');
const zoomOut = document.getElementById('zoom-out');
const panXInput = document.getElementById('panel-panx');
const panYInput = document.getElementById('panel-pany');

let cover = coverFromPreset('sunset-heat');
let photos = [];
let selected = 0;
let shotMode = '';

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function setStatus(text) {
  status.textContent = text;
}

function syncPanelControls() {
  const p = cover.panels[selected];
  if (!p) return;
  panelSelect.value = String(selected);
  placeInput.value = p.place;
  timeInput.value = p.time;
  storyInput.value = p.story;
  zoomInput.value = String(p.zoom);
  zoomOut.textContent = `${p.zoom.toFixed(2)}×`;
  panXInput.value = String(p.panX);
  panYInput.value = String(p.panY);
}

function rebuildPanelSelect() {
  panelSelect.innerHTML = '';
  cover.panels.forEach((p, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `Panel ${i + 1} — ${p.place} ${p.time}`;
    panelSelect.appendChild(opt);
  });
  if (selected >= cover.panels.length) selected = 0;
  syncPanelControls();
}

function markActive(container, value) {
  container.querySelectorAll('button').forEach((b) => {
    b.classList.toggle('active', b.dataset.value === value);
  });
}

function buildButtonRow(container, entries, current, onPick) {
  container.innerHTML = '';
  for (const [value, label] of entries) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.value = value;
    b.textContent = label;
    b.addEventListener('click', () => {
      onPick(value);
      markActive(container, value);
      draw();
    });
    container.appendChild(b);
  }
  markActive(container, current);
}

function buildControls() {
  buildButtonRow(
    document.getElementById('layouts'),
    Object.entries(COVER_LAYOUTS).map(([k, v]) => [k, v.label]),
    cover.layout,
    (v) => setLayout(v),
  );
  buildButtonRow(
    document.getElementById('grades'),
    Object.entries(COVER_GRADES).map(([k, v]) => [k, v.label]),
    cover.grade,
    (v) => { cover.grade = v; },
  );
  buildButtonRow(
    document.getElementById('presets'),
    Object.entries(PRESETS).map(([k, v]) => [k, v.label]),
    cover.preset,
    (v) => { applyPresetSync(v); },
  );
  buildButtonRow(
    document.getElementById('sizes'),
    Object.entries(COVER_SIZES).map(([k, v]) => [k, `${v.w} × ${v.h}`]),
    cover.size,
    (v) => { cover.size = v; sizeCanvas(); },
  );
  rebuildPanelSelect();
}

function setLayout(name) {
  const rects = COVER_LAYOUTS[name].rects;
  const preset = PRESETS[cover.preset];
  cover.layout = name;
  // Keep the preset's panels where they fit; extend or trim to the layout.
  const panels = [];
  for (let i = 0; i < rects.length; i++) {
    panels.push({ ...(cover.panels[i] ?? preset.panels[i % preset.panels.length]) });
  }
  cover.panels = panels;
  if (selected >= panels.length) selected = 0;
  rebuildPanelSelect();
}

function sizeCanvas() {
  const s = COVER_SIZES[cover.size];
  canvas.width = s.w;
  canvas.height = s.h;
  canvas.style.width = '';
  canvas.style.height = '';
}

function draw() {
  // The title-size slider scales the chrome title inside its band.
  const scaled = { ...cover, titleScale: Number(titleSizeInput.value) / 100 };
  drawCover(canvas, photos, scaled);
}

async function applyPreset(name) {
  cover = coverFromPreset(name);
  selected = 0;
  titleInput.value = cover.title;
  subtitleInput.value = cover.subtitle;
  titleSizeInput.value = '100';
  titleSizeOut.textContent = '100%';
  if (!shotMode) sizeCanvas();
  buildControls();
}

function applyPresetSync(name) {
  cover = coverFromPreset(name);
  selected = 0;
  titleInput.value = cover.title;
  subtitleInput.value = cover.subtitle;
  titleSizeInput.value = '100';
  titleSizeOut.textContent = '100%';
  sizeCanvas();
  buildControls();
  setStatus(`Preset ${PRESETS[name].label} loaded.`);
}

// The ?shot=cover path: clamp the canvas backing store so its long side is
// at most 1280 px (the gate's cap), and pin the element to exactly that
// size so an element screenshot captures the clamped size, not the viewport.
function clampCoverCanvas() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.min(1, 1280 / Math.max(vw, vh));
  canvas.width = Math.round(vw * scale);
  canvas.height = Math.round(vh * scale);
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
}

const api = {
  applyPreset,
  draw,
  clampCoverCanvas,
};

async function loadSamples() {
  const [boulevard, pier] = await Promise.all([
    loadImage('samples/boulevard.jpg'),
    loadImage('samples/pier.jpg'),
  ]);
  photos = [boulevard, pier];
}

document.getElementById('photos').addEventListener('change', async (e) => {
  const files = [...e.target.files].slice(0, 4);
  for (const file of files) {
    const img = await loadImage(URL.createObjectURL(file));
    photos.push(img);
    if (photos.length > 4) photos.shift();
  }
  setStatus(`${photos.length} photo${photos.length === 1 ? '' : 's'} loaded.`);
  draw();
});

document.getElementById('fill-all').addEventListener('click', () => {
  cover.panels.forEach((p) => { p.photo = 0; });
  setStatus('All panels use photo 1.');
  draw();
});

document.getElementById('spread').addEventListener('click', () => {
  cover.panels.forEach((p, i) => { p.photo = photos.length ? i % photos.length : 0; });
  setStatus('Photos spread across the panels.');
  draw();
});

document.getElementById('surprise').addEventListener('click', () => {
  const layouts = Object.keys(COVER_LAYOUTS);
  const grades = Object.keys(COVER_GRADES);
  const layout = layouts[Math.floor(Math.random() * layouts.length)];
  cover.grade = grades[Math.floor(Math.random() * grades.length)];
  setLayout(layout);
  cover.panels.forEach((p) => {
    p.photo = photos.length ? Math.floor(Math.random() * photos.length) : 0;
  });
  buildControls();
  setStatus('Surprise me: new layout, grade and photo spread.');
  draw();
});

titleInput.addEventListener('input', () => { cover.title = titleInput.value; draw(); });
subtitleInput.addEventListener('input', () => { cover.subtitle = subtitleInput.value; draw(); });
titleSizeInput.addEventListener('input', () => {
  titleSizeOut.textContent = `${titleSizeInput.value}%`;
  draw();
});

panelSelect.addEventListener('change', () => {
  selected = Number(panelSelect.value);
  syncPanelControls();
});
placeInput.addEventListener('input', () => { cover.panels[selected].place = placeInput.value; draw(); });
timeInput.addEventListener('input', () => { cover.panels[selected].time = timeInput.value; draw(); });
storyInput.addEventListener('input', () => { cover.panels[selected].story = storyInput.value; draw(); });
zoomInput.addEventListener('input', () => {
  cover.panels[selected].zoom = Number(zoomInput.value);
  zoomOut.textContent = `${cover.panels[selected].zoom.toFixed(2)}×`;
  draw();
});
panXInput.addEventListener('input', () => { cover.panels[selected].panX = Number(panXInput.value); draw(); });
panYInput.addEventListener('input', () => { cover.panels[selected].panY = Number(panYInput.value); draw(); });

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const fx = (e.clientX - rect.left) / rect.width;
  const fy = (e.clientY - rect.top) / rect.height;
  const rects = COVER_LAYOUTS[cover.layout].rects;
  for (let i = 0; i < rects.length; i++) {
    const [rx, ry, rw, rh] = rects[i];
    if (fx >= rx && fx <= rx + rw && fy >= ry && fy <= ry + rh) {
      selected = i;
      syncPanelControls();
      setStatus(`Panel ${i + 1} selected — ${cover.panels[i].place} ${cover.panels[i].time}.`);
      return;
    }
  }
});

document.getElementById('export').addEventListener('click', () => {
  const slug = (cover.title.trim() || 'cover').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const name = `${slug}-${canvas.width}x${canvas.height}.png`;
  canvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setStatus(`Saved ${name}.`);
  }, 'image/png');
});

const params = new URLSearchParams(location.search);
shotMode = params.get('shot') ?? '';
if (shotMode) {
  await loadSamples();
  await runShot(shotMode, params, api);
} else {
  await loadSamples();
  buildControls();
  sizeCanvas();
  draw();
  setStatus('Ready — pick a preset or build your own cover.');
}
