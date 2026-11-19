// Vice Coast cover engine: draws the multi-panel poster onto any 2D canvas.
// Everything is procedural and original — sunset sky, palm and skyline silhouettes,
// white-bordered photo panels, gradient-map grades, Anton title lettering with a
// Pacifico subtitle, grain and vignette. No Rockstar art, logo or font is used.
export const COVER_SIZES = {
  square: { w: 1080, h: 1080, label: '1080 × 1080' },
  portrait: { w: 1080, h: 1350, label: '1080 × 1350' },
  wide: { w: 1920, h: 1080, label: '1920 × 1080' },
};

export const COVER_LAYOUTS = ['hero', 'grid', 'strip', 'tilt'];
export const COVER_GRADES = ['sunset', 'neon', 'vice', 'gold'];

const GRADE_SKY = {
  sunset: ['#2a1052', '#7a1e6e', '#e83e6b', '#ff7a3c', '#ffc46b'],
  neon: ['#0b1030', '#3b1a6e', '#c2187f', '#ff2e88', '#00e5ff'],
  vice: ['#1c0b38', '#5b1a7a', '#a83a8c', '#ff5e8a', '#ffb3c8'],
  gold: ['#33164e', '#7a2d4d', '#c65a2e', '#ff8a2a', '#ffd76a'],
};

const GRADE_TINT = {
  sunset: { top: 'rgba(255,46,136,0.16)', bottom: 'rgba(255,140,50,0.22)' },
  neon: { top: 'rgba(255,46,136,0.28)', bottom: 'rgba(0,229,255,0.28)' },
  vice: { top: 'rgba(185,103,255,0.20)', bottom: 'rgba(255,94,138,0.22)' },
  gold: { top: 'rgba(255,200,90,0.14)', bottom: 'rgba(255,122,26,0.26)' },
};

const GRADE_ACCENT = { sunset: '#00e5ff', neon: '#ffd76a', vice: '#00e5ff', gold: '#ff2e88' };

/** Small deterministic PRNG (mulberry32) so the grain is identical on every render. */
export function seededRandom(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let grainTile = null;
function getGrainTile() {
  if (grainTile) return grainTile;
  const rand = seededRandom(20261119);
  const tile = document.createElement('canvas');
  tile.width = 160; tile.height = 160;
  const tctx = tile.getContext('2d');
  const img = tctx.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 118 + Math.floor(rand() * 40);
    img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  tctx.putImageData(img, 0, 0);
  grainTile = tile;
  return tile;
}

/** Panel rectangles for a layout, inside the photo zone (0..zoneH). Tilt adds a rotation. */
export function panelRects(layout, w, zoneH) {
  const m = Math.max(10, w * 0.012);
  const g = Math.max(8, w * 0.012);
  const innerW = w - m * 2;
  const innerH = zoneH - m;
  if (layout === 'grid') {
    const cw = (innerW - g) / 2;
    const ch = (innerH - g) / 2;
    return [
      { x: m, y: m, w: cw, h: ch, rot: 0 },
      { x: m + cw + g, y: m, w: cw, h: ch, rot: 0 },
      { x: m, y: m + ch + g, w: cw, h: ch, rot: 0 },
      { x: m + cw + g, y: m + ch + g, w: cw, h: ch, rot: 0 },
    ];
  }
  if (layout === 'strip') {
    const bigW = innerW * 0.62;
    const colX = m + bigW + g;
    const colW = innerW - bigW - g;
    const ch = (innerH - g * 2) / 3;
    return [
      { x: m, y: m, w: bigW, h: innerH, rot: 0 },
      { x: colX, y: m, w: colW, h: ch, rot: 0 },
      { x: colX, y: m + ch + g, w: colW, h: ch, rot: 0 },
      { x: colX, y: m + (ch + g) * 2, w: colW, h: ch, rot: 0 },
    ];
  }
  if (layout === 'tilt') {
    const pw = innerW * 0.47;
    const ph = innerH * 0.62;
    return [
      { x: m + innerW * 0.02, y: m + innerH * 0.05, w: pw, h: ph, rot: -0.1 },
      { x: m + innerW * 0.51, y: m + innerH * 0.02, w: pw, h: ph, rot: 0.07 },
      { x: m + innerW * 0.26, y: m + innerH * 0.36, w: pw, h: ph, rot: -0.03 },
    ];
  }
  // hero: one tall hero panel, three small panels under it.
  const heroH = innerH * 0.6;
  const rowY = m + heroH + g;
  const rowH = innerH - heroH - g;
  const cw = (innerW - g * 2) / 3;
  return [
    { x: m, y: m, w: innerW, h: heroH, rot: 0 },
    { x: m, y: rowY, w: cw, h: rowH, rot: 0 },
    { x: m + cw + g, y: rowY, w: cw, h: rowH, rot: 0 },
    { x: m + (cw + g) * 2, y: rowY, w: cw, h: rowH, rot: 0 },
  ];
}

export function panelCount(layout) {
  return layout === 'tilt' ? 3 : 4;
}

function paintSunsetSky(ctx, w, h, grade) {
  const stops = GRADE_SKY[grade] || GRADE_SKY.sunset;
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  stops.forEach((color, i) => sky.addColorStop(i / (stops.length - 1), color));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  // Low sun with a warm halo, sitting behind the title band: a retro striped disc.
  const sunX = w * 0.8;
  const sunY = h * 0.84;
  const sunR = Math.min(w, h) * 0.1;
  const halo = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 3.2);
  halo.addColorStop(0, 'rgba(255,190,90,0.55)');
  halo.addColorStop(1, 'rgba(255,190,90,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();
  // Retro stripes cut across the sun's lower half, in the sky's own orange.
  ctx.save();
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = (GRADE_SKY[grade] || GRADE_SKY.sunset)[3];
  const stripeTops = [0.08, 0.34, 0.6];
  const stripeHeights = [0.07, 0.11, 0.15];
  stripeTops.forEach((top, i) => {
    ctx.fillRect(sunX - sunR, sunY + sunR * top, sunR * 2, sunR * stripeHeights[i]);
  });
  ctx.restore();
  // Horizon glow bands.
  const band = ctx.createLinearGradient(0, h * 0.62, 0, h * 0.78);
  band.addColorStop(0, 'rgba(255,120,80,0)');
  band.addColorStop(1, 'rgba(255,120,80,0.35)');
  ctx.fillStyle = band;
  ctx.fillRect(0, h * 0.62, w, h * 0.16);
}

function paintSkyline(ctx, w, h, bandTop) {
  // Silhouette blocks kept to the left and right edges so the title stays clear.
  const rand = seededRandom(77);
  ctx.fillStyle = 'rgba(24,8,40,0.6)';
  for (const zone of [[0, w * 0.16], [w * 0.84, w]]) {
    let x = zone[0];
    while (x < zone[1]) {
      const bw = w * (0.03 + rand() * 0.045);
      const bh = h * (0.015 + rand() * 0.035);
      ctx.fillRect(x, bandTop - bh, Math.min(bw, zone[1] - x), bh + 2);
      x += bw + w * 0.012;
    }
  }
  // A few lit windows in the skyline.
  ctx.fillStyle = 'rgba(255,214,106,0.85)';
  const lit = seededRandom(913);
  for (let i = 0; i < 14; i++) {
    const edge = lit() < 0.5 ? lit() * w * 0.16 : w * (0.84 + lit() * 0.16);
    const wy = bandTop - lit() * h * 0.04;
    ctx.fillRect(edge, wy, Math.max(2, w * 0.004), Math.max(2, w * 0.004));
  }
}

function paintPalm(ctx, x, y, s, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  // Trunk, leaning slightly.
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(14, -70, 34, -128);
  ctx.stroke();
  // Fronds arching out of the crown and drooping at the tips.
  ctx.lineWidth = 8;
  const crownX = 34;
  const crownY = -128;
  const fronds = [
    [-112, -2], [-98, -52], [-62, -88], [-14, -98], [34, -90], [78, -62], [106, -18], [84, 28],
  ];
  for (const [dx, dy] of fronds) {
    ctx.beginPath();
    ctx.moveTo(crownX, crownY);
    ctx.quadraticCurveTo(crownX + dx * 0.5, crownY - 62, crownX + dx, crownY + dy);
    ctx.stroke();
  }
  // Coconuts.
  ctx.beginPath(); ctx.arc(crownX - 6, crownY + 8, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(crownX + 6, crownY + 9, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawPhotoInto(ctx, img, rect, panel) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const base = Math.max(rect.w / iw, rect.h / ih) * panel.zoom;
  const dw = iw * base;
  const dh = ih * base;
  // Cover-fit, anchored toward the top of the photo (faces sit in the upper
  // half) instead of dead centre, so wide panels keep heads in frame.
  const overX = Math.max(0, dw - rect.w);
  const overY = Math.max(0, dh - rect.h);
  const left = rect.x - overX * 0.5 + panel.dx * rect.w;
  const top = rect.y - overY * 0.32 + panel.dy * rect.h;
  ctx.drawImage(img, left, top, dw, dh);
}

function applyGradeWash(ctx, rect, grade) {
  const tint = GRADE_TINT[grade] || GRADE_TINT.sunset;
  const wash = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
  wash.addColorStop(0, tint.top);
  wash.addColorStop(1, tint.bottom);
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = wash;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = 'rgba(255,170,80,0.18)';
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.globalCompositeOperation = 'source-over';
}

function paintEmptyPanel(ctx, rect, grade) {
  const tint = GRADE_TINT[grade] || GRADE_TINT.sunset;
  ctx.fillStyle = '#241631';
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.fillStyle = tint.bottom;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = `700 ${Math.max(16, rect.w * 0.055)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ADD PHOTO', rect.x + rect.w / 2, rect.y + rect.h / 2);
  ctx.textBaseline = 'alphabetic';
}

function paintPanelFrame(ctx, rect, w, tilt) {
  const border = Math.max(4, w * 0.008);
  ctx.lineWidth = border;
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  // Soft inner shadow so the photo sits inside the frame.
  ctx.lineWidth = Math.max(2, w * 0.004);
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.strokeRect(rect.x + border / 2, rect.y + border / 2, rect.w - border, rect.h - border);
  if (tilt) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(rect.x - border, rect.y + rect.h, rect.w + border * 2, border * 2.4);
  }
}

function paintTitleBlock(ctx, w, h, bandTop, state) {
  const bandH = h - bandTop;
  // Scrim so the lettering reads over any sky.
  const scrim = ctx.createLinearGradient(0, bandTop, 0, h);
  scrim.addColorStop(0, 'rgba(20,6,36,0)');
  scrim.addColorStop(0.35, 'rgba(20,6,36,0.42)');
  scrim.addColorStop(1, 'rgba(20,6,36,0.66)');
  ctx.fillStyle = scrim;
  ctx.fillRect(0, bandTop, w, bandH);
  paintSkyline(ctx, w, h, bandTop + bandH * 0.22);
  paintPalm(ctx, w * 0.03, h - bandH * 0.04, Math.min(w, h) * 0.0011, 'rgba(16,5,28,0.92)');
  paintPalm(ctx, w * 0.97, h - bandH * 0.04, Math.min(w, h) * 0.0009, 'rgba(16,5,28,0.92)');

  const cx = w / 2;
  // Stacked, non-overlapping rows: stars, then title, then subtitle, then tag.
  let cursorY = bandTop + bandH * 0.09;
  if (state.showBadge) {
    ctx.fillStyle = '#ffd76a';
    ctx.font = `${Math.max(14, bandH * 0.1)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('★ ★ ★ ★ ★', cx, cursorY);
    cursorY += bandH * 0.1;
  }
  // Title: Anton capitals, slight forward slant, gradient fill, dark outline.
  const title = (state.title || 'SUNSET HEIST').trim().toUpperCase();
  let size = bandH * 0.42;
  ctx.textAlign = 'center';
  const setTitleFont = (s) => { ctx.font = `${s}px Anton, "Arial Black", sans-serif`; };
  setTitleFont(size);
  while (ctx.measureText(title).width > w * 0.92 && size > 16) {
    size -= 2;
    setTitleFont(size);
  }
  const titleBaseline = cursorY + size * 0.72;
  ctx.save();
  ctx.translate(cx, 0);
  ctx.transform(1, 0, -0.045, 1, 0, 0);
  ctx.translate(-cx, 0);
  const fill = ctx.createLinearGradient(0, titleBaseline - size, 0, titleBaseline + size * 0.2);
  fill.addColorStop(0, '#ffffff');
  fill.addColorStop(1, '#ffe9a8');
  ctx.lineWidth = Math.max(3, size * 0.07);
  ctx.strokeStyle = '#160826';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(255,46,136,0.55)';
  ctx.shadowBlur = size * 0.16;
  ctx.strokeText(title, cx, titleBaseline);
  ctx.fillStyle = fill;
  ctx.fillText(title, cx, titleBaseline);
  ctx.restore();
  cursorY = titleBaseline + size * 0.42;
  // Subtitle: Pacifico script in the grade accent colour.
  const subtitle = (state.subtitle || '').trim();
  if (subtitle) {
    ctx.font = `${Math.max(15, bandH * 0.16)}px Pacifico, cursive`;
    ctx.fillStyle = GRADE_ACCENT[state.grade] || GRADE_ACCENT.sunset;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 8;
    ctx.fillText(subtitle, cx, cursorY);
    ctx.shadowBlur = 0;
  }
  if (state.showBadge) {
    ctx.font = `700 ${Math.max(11, bandH * 0.075)}px system-ui, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillText('V I C E   C O A S T', cx, h - bandH * 0.07);
  }
}

function paintGrainAndVignette(ctx, w, h) {
  const tile = getGrainTile();
  const pattern = ctx.createPattern(tile, 'repeat');
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
  const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.max(w, h) * 0.75);
  vig.addColorStop(0, 'rgba(8,3,16,0)');
  vig.addColorStop(1, 'rgba(8,3,16,0.3)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}

/**
 * Draws the whole cover for `state` onto `canvas` at the canvas's own size.
 * state: { layout, grade, title, subtitle, showBadge, photos, panels, selected }
 * photos: array of HTMLImageElement | null. panels: [{ photo, zoom, dx, dy }].
 */
export function drawCover(canvas, state) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const bandH = h * (state.size === 'wide' ? 0.32 : 0.26);
  const bandTop = h - bandH;
  const zoneH = bandTop;

  paintSunsetSky(ctx, w, h, state.grade);
  const rects = panelRects(state.layout, w, zoneH);
  const count = panelCount(state.layout);
  for (let i = 0; i < count; i++) {
    const rect = rects[i];
    const panel = state.panels[i] || { photo: -1, zoom: 1, dx: 0, dy: 0 };
    const img = panel.photo >= 0 ? state.photos[panel.photo] : null;
    ctx.save();
    if (rect.rot) {
      ctx.translate(rect.x + rect.w / 2, rect.y + rect.h / 2);
      ctx.rotate(rect.rot);
      ctx.translate(-(rect.x + rect.w / 2), -(rect.y + rect.h / 2));
    }
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.clip();
    if (img) {
      drawPhotoInto(ctx, img, rect, panel);
      applyGradeWash(ctx, rect, state.grade);
    } else {
      paintEmptyPanel(ctx, rect, state.grade);
    }
    ctx.restore();
    ctx.save();
    if (rect.rot) {
      ctx.translate(rect.x + rect.w / 2, rect.y + rect.h / 2);
      ctx.rotate(rect.rot);
      ctx.translate(-(rect.x + rect.w / 2), -(rect.y + rect.h / 2));
    }
    paintPanelFrame(ctx, rect, w, state.layout === 'tilt');
    ctx.restore();
    if (state.selected === i) {
      ctx.save();
      if (rect.rot) {
        ctx.translate(rect.x + rect.w / 2, rect.y + rect.h / 2);
        ctx.rotate(rect.rot);
        ctx.translate(-(rect.x + rect.w / 2), -(rect.y + rect.h / 2));
      }
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = Math.max(3, w * 0.005);
      ctx.setLineDash([Math.max(10, w * 0.02), Math.max(8, w * 0.012)]);
      ctx.strokeRect(rect.x - 4, rect.y - 4, rect.w + 8, rect.h + 8);
      ctx.restore();
    }
  }
  paintTitleBlock(ctx, w, h, bandTop, state);
  paintGrainAndVignette(ctx, w, h);
}

/** Renders `state` at an export size and returns the fresh canvas. */
export function exportCoverCanvas(state, sizeKey) {
  const size = COVER_SIZES[sizeKey] || COVER_SIZES.square;
  const canvas = document.createElement('canvas');
  canvas.width = size.w;
  canvas.height = size.h;
  drawCover(canvas, { ...state, size: sizeKey, selected: -1 });
  return canvas;
}
