// Sunset Heat Cover Studio — the editor page.
// Four steps: 1 Photos, 2 Layout & Grade, 3 Caption, 4 Selected Panel.
// The live preview redraws on every change; Export PNG saves the cover in
// the three common post sizes. A `?shot=` query sets up a fixed scene for
// a screenshot instead (see ./shots.js).
import { drawCover, presetState, COVER_SIZES, COVER_LAYOUTS, COVER_GRADES, COVER_PRESETS } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const statusEl = document.getElementById('status');
const titleInput = document.getElementById('title');
const subtitleInput = document.getElementById('subtitle');
const sizeSelect = document.getElementById('size');
const layoutRow = document.getElementById('layouts');
const gradeRow = document.getElementById('grades');
const panelRow = document.getElementById('panels');
const chipPlace = document.getElementById('chip-place');
const chipTime = document.getElementById('chip-time');
const chipStory = document.getElementById('chip-story');
const zoomInput = document.getElementById('zoom');
const panXInput = document.getElementById('panx');
const panYInput = document.getElementById('pany');

let state = null;
let selected = 0;

function redraw() {
  if (!state) return;
  const size = COVER_SIZES.find((s) => s.id === sizeSelect.value) ?? COVER_SIZES[0];
  canvas.width = size.w;
  canvas.height = size.h;
  drawCover(canvas, state);
}

function setStatus(text) {
  statusEl.textContent = text;
}

function refreshPanelList() {
  panelRow.innerHTML = '';
  state.panels.forEach((panel, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip-btn' + (i === selected ? ' on' : '');
    b.textContent = `Panel ${i + 1} · ${panel.place}`;
    b.addEventListener('click', () => {
      selected = i;
      syncPanelFields();
      refreshPanelList();
      redraw();
    });
    panelRow.appendChild(b);
  });
}

function syncPanelFields() {
  const panel = state.panels[selected];
  if (!panel) return;
  chipPlace.value = panel.place;
  chipTime.value = panel.time;
  chipStory.value = panel.story;
  zoomInput.value = panel.zoom ?? 1;
  panXInput.value = panel.panX ?? 0;
  panYInput.value = panel.panY ?? 0;
}

function buildOptionRows() {
  COVER_LAYOUTS.forEach((layout) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip-btn';
    b.textContent = layout.label;
    b.dataset.layout = layout.id;
    b.addEventListener('click', () => {
      state.layout = layout.id;
      const preset = Object.values(COVER_PRESETS).find((p) => p.layout === layout.id);
      if (preset) {
        state.panels = preset.panels.map((p) => ({ ...p, zoom: 1, panX: 0, panY: 0 }));
        state.grade = preset.grade;
        state.title = preset.title;
        state.subtitle = preset.subtitle;
        titleInput.value = state.title;
        subtitleInput.value = state.subtitle;
        syncGradeRow();
      }
      selected = 0;
      syncPanelFields();
      refreshPanelList();
      syncLayoutRow();
      redraw();
    });
    layoutRow.appendChild(b);
  });
  COVER_GRADES.forEach((grade) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip-btn';
    b.textContent = grade.label;
    b.dataset.grade = grade.id;
    b.addEventListener('click', () => {
      state.grade = grade.id;
      syncGradeRow();
      redraw();
    });
    gradeRow.appendChild(b);
  });
}

function syncLayoutRow() {
  layoutRow.querySelectorAll('button').forEach((b) => {
    b.classList.toggle('on', b.dataset.layout === state.layout);
  });
}

function syncGradeRow() {
  gradeRow.querySelectorAll('button').forEach((b) => {
    b.classList.toggle('on', b.dataset.grade === state.grade);
  });
}

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`cannot load ${url}`));
    img.src = url;
  });
}

async function loadSamples() {
  return Promise.all([
    loadImage('samples/boulevard.jpg'),
    loadImage('samples/pier.jpg'),
  ]);
}

function applyPreset(presetId) {
  state = presetState(presetId, state.photos);
  titleInput.value = state.title;
  subtitleInput.value = state.subtitle;
  selected = 0;
  syncPanelFields();
  refreshPanelList();
  syncLayoutRow();
  syncGradeRow();
  redraw();
}

document.getElementById('photo').addEventListener('change', async (e) => {
  const files = [...e.target.files].slice(0, 4);
  if (!files.length) return;
  const loaded = [];
  for (const file of files) {
    loaded.push(await loadImage(URL.createObjectURL(file)));
  }
  // Your photos replace the samples, panel by panel, in order.
  loaded.forEach((img, i) => { state.photos[i] = img; });
  setStatus(`${loaded.length} photo${loaded.length > 1 ? 's' : ''} loaded — spread across the panels.`);
  redraw();
});

document.getElementById('fill-all').addEventListener('click', () => {
  // Fill every panel with the first photo, each with its own crop.
  state.panels.forEach((panel) => { panel.photo = 0; });
  setStatus('All panels now use photo 1 — pick a panel to give it another photo.');
  redraw();
});

document.getElementById('spread').addEventListener('click', () => {
  state.panels.forEach((panel, i) => { panel.photo = i % state.photos.length; });
  setStatus('Photos spread across the panels.');
  redraw();
});

document.getElementById('surprise').addEventListener('click', () => {
  const ids = Object.keys(COVER_PRESETS);
  const pick = ids[Math.floor(Math.random() * ids.length)];
  applyPreset(pick);
  setStatus(`Surprise me: ${COVER_PRESETS[pick].title}.`);
});

titleInput.addEventListener('input', () => { state.title = titleInput.value; redraw(); });
subtitleInput.addEventListener('input', () => { state.subtitle = subtitleInput.value; redraw(); });
sizeSelect.addEventListener('change', redraw);
chipPlace.addEventListener('input', () => { state.panels[selected].place = chipPlace.value.toUpperCase(); refreshPanelList(); redraw(); });
chipTime.addEventListener('input', () => { state.panels[selected].time = chipTime.value.toUpperCase(); redraw(); });
chipStory.addEventListener('input', () => { state.panels[selected].story = chipStory.value.toUpperCase(); redraw(); });
zoomInput.addEventListener('input', () => { state.panels[selected].zoom = Number(zoomInput.value); redraw(); });
panXInput.addEventListener('input', () => { state.panels[selected].panX = Number(panXInput.value); redraw(); });
panYInput.addEventListener('input', () => { state.panels[selected].panY = Number(panYInput.value); redraw(); });

document.getElementById('export').addEventListener('click', () => {
  const size = COVER_SIZES.find((s) => s.id === sizeSelect.value) ?? COVER_SIZES[0];
  canvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sunset-heat-${size.w}x${size.h}.png`;
    a.click();
    setStatus(`Saved sunset-heat-${size.w}x${size.h}.png`);
  }, 'image/png');
});

buildOptionRows();

const query = new URLSearchParams(location.search);
const shot = query.get('shot');
if (shot) {
  runShot(shot, query, async (presetId) => {
    state = { photos: await loadSamples() };
    applyPreset(presetId);
    if (shot === 'cover') {
      // A cover shot fills its window: the canvas takes the viewport's own
      // size, so a portrait shot is a true portrait poster, not a square
      // cover letterboxed in a tall window.
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawCover(canvas, state);
    }
    if (shot === 'editor') document.body.classList.add('shot-editor');
    setStatus(`Preset ${presetId} — edit the caption, then export.`);
  });
} else {
  loadSamples().then((photos) => {
    state = { photos };
    applyPreset('sunset-heat');
    setStatus('Two sample photos loaded. Add your own photos to replace them.');
  });
}
