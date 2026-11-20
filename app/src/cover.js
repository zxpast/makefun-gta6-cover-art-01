// Vice Coast Cover Studio — cover renderer (round 6).
// Draws a multi-panel GTA-style poster cover on a 2D canvas: distinct
// face per panel (never a repeat inside one cover), a grade composited
// ON the photo pixels, a chrome striped title overlapping the panels in
// the middle of the cover, a pop-out hero that breaks its frame, caption
// chips + role tags per panel, and poster furniture (press quote, seal,
// VOL tag, thin footer with barcode). No flat title band anywhere: the
// only flat strip is the ~7% footer.

export const COVER_SIZES = [
  { id: 'square', label: 'Square 1080 x 1080', w: 1080, h: 1080 },
  { id: 'portrait', label: 'Portrait 1080 x 1350', w: 1080, h: 1350 },
  { id: 'wide', label: 'Wide 1920 x 1080', w: 1920, h: 1080 },
];

export const COVER_LAYOUTS = [
  { id: 'six-panels', label: 'Six panels' },
  { id: 'hero-mosaic', label: 'Hero mosaic' },
  { id: 'four-grid', label: 'Four grid' },
  { id: 'tilted-snaps', label: 'Tilted snaps' },
  { id: 'diagonal-trio', label: 'Diagonal trio' },
  { id: 'seven-mosaic', label: 'Seven mosaic' },
];

export const COVER_GRADES = [
  { id: 'sunset', label: 'Sunset' },
  { id: 'neon-nights', label: 'Neon nights' },
  { id: 'vice-pink', label: 'Vice pink' },
  { id: 'golden-hour', label: 'Golden hour' },
  { id: 'tropic-teal', label: 'Tropic teal' },
  { id: 'heatwave', label: 'Heatwave' },
];

// The cast. Six original characters, two of them the kit photos.
// fx/fy = face centre in photo fractions (verified in-session).
// time = what the photo itself is: golden hour, night neon, or daylight.
export const SAMPLE_PHOTOS = [
  { id: 'boss', file: 'boss.jpg', role: 'THE BOSS', fx: 0.50, fy: 0.36, time: 'golden', place: 'OCEAN DRIVE' },
  { id: 'insider', file: 'insider.jpg', role: 'THE INSIDER', fx: 0.52, fy: 0.33, time: 'night', place: 'NEON AVENUE' },
  { id: 'fixer', file: 'fixer.jpg', role: 'THE FIXER', fx: 0.50, fy: 0.37, time: 'golden', place: 'COASTAL HWY' },
  { id: 'courier', file: 'courier.jpg', role: 'THE COURIER', fx: 0.52, fy: 0.37, time: 'night', place: 'VICE BAY' },
  { id: 'boulevard', file: 'boulevard.jpg', role: 'THE DRIVER', fx: 0.48, fy: 0.17, time: 'golden', place: 'BOULEVARD' },
  { id: 'pier', file: 'pier.jpg', role: 'THE ANGLER', fx: 0.34, fy: 0.22, time: 'day', place: 'PIER 26' },
];

export const PHOTO_BY_ID = Object.fromEntries(SAMPLE_PHOTOS.map((p) => [p.id, p]));

// Grade washes. Every grade is composited over the photo pixels, never
// only over a band. `darken` is the night strength (neon crushes daylight
// into night); `wash` is [r,g,b,alpha] pairs painted as gradients.
const GRADES = {
  'sunset': { darken: 0.05, washes: [[255, 120, 40, 0.20], [255, 60, 120, 0.22]], vignette: 0.26, glow: '#ff7a2a' },
  'neon-nights': { darken: 0.42, washes: [[255, 0, 140, 0.20], [0, 220, 255, 0.18]], vignette: 0.34, glow: '#ff2d95' },
  'vice-pink': { darken: 0.08, washes: [[255, 80, 160, 0.24], [120, 40, 180, 0.16]], vignette: 0.24, glow: '#ff5da2' },
  'golden-hour': { darken: 0.02, washes: [[255, 170, 60, 0.22], [255, 110, 30, 0.16]], vignette: 0.22, glow: '#ffb347' },
  'tropic-teal': { darken: 0.06, washes: [[0, 180, 160, 0.20], [255, 200, 90, 0.14]], vignette: 0.22, glow: '#2dd4bf' },
  'heatwave': { darken: 0.04, washes: [[255, 90, 20, 0.26], [255, 40, 80, 0.18]], vignette: 0.28, glow: '#ff5722' },
};

// One panel: which face, how to crop it, what its chip says.
// hour is the caption hour (24h). Night captions (>=22 or <=3) are only
// ever paired with night photos or the crushing neon grade.
function panel(photo, mode, caption, hour, story) {
  return { photo, mode, caption, hour, story };
}

export const PRESETS = {
  'sunset-heat': {
    label: 'Sunset Heat', layout: 'six-panels', grade: 'sunset',
    title: 'SUNSET HEAT', subtitle: 'one coast · no rules',
    quote: 'A FEVER DREAM IN NEON', source: 'THE COAST HERALD', vol: 'VOL. 05',
    tagline: 'EVERY SUNSET HAS A PRICE',
    heroPop: true,
    panels: [
      panel('boss', 'wide', 'OCEAN DRIVE', 18, 'THE DEAL IS DONE'),
      panel('insider', 'face', 'NEON AVENUE', 19, 'SHE KNOWS EVERYTHING'),
      panel('fixer', 'face', 'COASTAL HWY', 18, 'THE FIX IS IN'),
      panel('courier', 'face', 'VICE BAY', 19, 'LAST DELIVERY'),
      panel('boulevard', 'face', 'BOULEVARD', 17, 'TOP DOWN, NO BRAKES'),
      panel('pier', 'face', 'PIER 26', 17, 'GOLDEN HOUR CAST'),
    ],
  },
  'neon-nights': {
    label: 'Neon Nights', layout: 'hero-mosaic', grade: 'neon-nights',
    title: 'NEON NIGHTS', subtitle: 'the city never sleeps',
    quote: 'A SUN-DRENCHED KNOCKOUT', source: 'COASTLINE WEEKLY', vol: 'VOL. 06',
    tagline: 'ONE COAST · NO RULES · COMING SOON',
    heroPop: true,
    panels: [
      panel('insider', 'wide', 'NEON AVENUE', 23, 'LAST CALL'),
      panel('boss', 'wide', 'OCEAN DRIVE', 1, 'THE HOUSE ALWAYS WINS'),
      panel('fixer', 'face', 'COASTAL HWY', 22, 'NO HEADLIGHTS'),
      panel('courier', 'face', 'VICE BAY', 0, 'MIDNIGHT RUN'),
      panel('boulevard', 'face', 'BOULEVARD', 23, 'RED LIGHT, GREEN LIGHT'),
    ],
  },
  'golden-coast': {
    label: 'Golden Coast', layout: 'tilted-snaps', grade: 'golden-hour',
    title: 'GOLDEN COAST', subtitle: 'every summer has a story',
    quote: 'FIVE STARS OF PURE HEAT', source: 'VICE DAILY', vol: 'VOL. 07',
    tagline: 'SHOT ON LOCATION — PIER 26 · OCEAN DRIVE',
    heroPop: true,
    panels: [
      panel('boss', 'wide', 'OCEAN DRIVE', 18, 'THE DEAL IS DONE'),
      panel('fixer', 'face', 'COASTAL HWY', 17, 'THE FIX IS IN'),
      panel('boulevard', 'face', 'BOULEVARD', 17, 'TOP DOWN, NO BRAKES'),
      panel('pier', 'face', 'PIER 26', 17, 'GOLDEN HOUR CAST'),
      panel('courier', 'face', 'VICE BAY', 18, 'LAST DELIVERY'),
    ],
  },
};

// --- cast validation: the hard rule. Every cover: >=5 different faces,
// zero duplicate faces. Returns {faces, unique, duplicates}.
export function validateCast(presetId) {
  const preset = PRESETS[presetId];
  const faces = preset.panels.map((p) => p.photo);
  const unique = new Set(faces).size;
  const duplicates = faces.filter((f, i) => faces.indexOf(f) !== i);
  return { faces, unique, duplicates, ok: unique >= 5 && duplicates.length === 0 };
}

// --- layout geometry: panel rects as fractions of the cover, plus an
// optional rotation (tilted snaps) and a hero flag.
export function layoutRects(layoutId, count, w, h) {
  const g = 0.008; // gap as a fraction of the smaller side
  const gap = Math.round(Math.min(w, h) * g);
  const R = (x, y, rw, rh, rot = 0) => ({
    x: Math.round(x * w) + gap, y: Math.round(y * h) + gap,
    w: Math.round(rw * w) - gap * 2, h: Math.round(rh * h) - gap * 2, rot,
  });
  switch (layoutId) {
    // 3x2 equal grid: every panel's aspect stays face-friendly (0.6-1.5)
    // in wide, square and portrait alike, so no face is ever sliced thin.
    case 'six-panels': return [
      R(0, 0, 0.34, 0.465), R(0.34, 0, 0.33, 0.465), R(0.67, 0, 0.33, 0.465),
      R(0, 0.465, 0.34, 0.465), R(0.34, 0.465, 0.33, 0.465), R(0.67, 0.465, 0.33, 0.465),
    ].slice(0, count);
    case 'hero-mosaic': {
      // Five panels tiling the whole area: big hero top-left, two stacked
      // right, two across the bottom. The right panels stop at 0.50 so
      // their chips clear the title; the hero's chips ride up (see
      // drawPanel) for the same reason. No dead corners.
      if (count <= 5) return [
        R(0, 0, 0.60, 0.56), R(0.60, 0, 0.40, 0.25), R(0.60, 0.25, 0.40, 0.25),
        R(0, 0.56, 0.50, 0.37), R(0.50, 0.56, 0.50, 0.37),
      ];
      return [
        R(0, 0, 0.34, 0.465), R(0.34, 0, 0.33, 0.465), R(0.67, 0, 0.33, 0.465),
        R(0, 0.465, 0.34, 0.465), R(0.34, 0.465, 0.33, 0.465), R(0.67, 0.465, 0.33, 0.465),
      ].slice(0, count);
    }
    case 'four-grid': return [
      R(0, 0, 0.5, 0.465), R(0.5, 0, 0.5, 0.465),
      R(0, 0.465, 0.5, 0.465), R(0.5, 0.465, 0.5, 0.465),
    ].slice(0, count);
    // Two tilted snaps on top, three across the bottom. The top row stops
    // at 0.48 so its chips clear the title; the bottom row starts at 0.56
    // so the title only ever grazes hair, never faces.
    case 'tilted-snaps': return [
      R(0.02, 0.02, 0.48, 0.48, -2), R(0.50, 0.02, 0.48, 0.48, 2),
      R(0.02, 0.56, 0.32, 0.37, 1.5), R(0.34, 0.56, 0.32, 0.37, -1.5),
      R(0.66, 0.56, 0.32, 0.37, 2),
    ].slice(0, count);
    case 'diagonal-trio': return [
      R(0, 0, 0.62, 0.93), R(0.34, 0, 0.62, 0.93), R(0.62, 0, 0.38, 0.93),
    ].slice(0, count);
    case 'seven-mosaic': return [
      R(0, 0, 0.34, 0.46), R(0.34, 0, 0.33, 0.46), R(0.67, 0, 0.33, 0.46),
      R(0, 0.46, 0.25, 0.47), R(0.25, 0.46, 0.25, 0.47),
      R(0.50, 0.46, 0.25, 0.47), R(0.75, 0.46, 0.25, 0.47),
    ].slice(0, count);
    default: return [R(0, 0, 1, 0.93)].slice(0, count);
  }
}

// Seeded PRNG so grain + barcode are identical on every render.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fitText(ctx, text, maxWidth, startSize, fontFamily) {
  let size = startSize;
  ctx.font = `${size}px ${fontFamily}`;
  while (ctx.measureText(text).width > maxWidth && size > 10) {
    size -= 2;
    ctx.font = `${size}px ${fontFamily}`;
  }
  return size;
}

// Cover-fit source rect around the face centre (or the whole photo for
// 'wide'), never cutting a face in half: the crop box is centred on the
// face and clamped inside the photo, and it never shrinks below 38% of
// the photo in either dimension — a thinner slice would cut foreheads
// and chins. If even the full photo is too narrow for the panel's
// aspect at that size, the panel falls back to contain-fit (letterboxed)
// instead of slicing the face.
function sourceRect(photo, mode, panelAspect) {
  const pw = photo.naturalWidth, ph = photo.naturalHeight;
  const meta = PHOTO_BY_ID[photo.dataset?.photoId ?? ''] || null;
  const fx = meta ? meta.fx : 0.5, fy = meta ? meta.fy : 0.4;
  const photoAspect = pw / ph;
  let sw, sh;
  if (photoAspect > panelAspect) { sh = ph; sw = ph * panelAspect; }
  else { sw = pw; sh = pw / panelAspect; }
  if (mode === 'face') { sw *= 0.62; sh *= 0.62; }
  if (mode === 'detail') { sw *= 0.5; sh *= 0.5; }
  // Grow the box (keeping the panel aspect) until both dimensions clear
  // the 38% floor; the face stays whole instead of being sliced thin.
  while ((sh < ph * 0.38 || sw < pw * 0.38) && sw < pw && sh < ph) {
    sw *= 1.06; sh *= 1.06;
  }
  if (sw > pw || sh > ph) return { contain: true, sx: 0, sy: 0, sw: pw, sh: ph };
  const cx = Math.min(Math.max(fx * pw, sw / 2), pw - sw / 2);
  const cy = Math.min(Math.max(fy * ph, sh / 2), ph - sh / 2);
  return { contain: false, sx: cx - sw / 2, sy: cy - sh / 2, sw, sh };
}

function applyGrade(ctx, rect, gradeId, look) {
  const g = GRADES[gradeId] || GRADES.sunset;
  const strength = (look?.grade ?? 1) * (look?.paint ?? 1);
  const { x, y, w, h } = rect;
  if (g.darken > 0) {
    ctx.fillStyle = `rgba(6, 0, 30, ${(g.darken * strength).toFixed(3)})`;
    ctx.fillRect(x, y, w, h);
  }
  g.washes.forEach(([r, gg, b, a], i) => {
    const grad = i === 0
      ? ctx.createLinearGradient(x, y, x, y + h)
      : ctx.createLinearGradient(x, y, x + w, y);
    grad.addColorStop(0, `rgba(${r},${gg},${b},${(a * strength).toFixed(3)})`);
    grad.addColorStop(1, `rgba(${r},${gg},${b},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
  });
  // Vignette: darkened corners so the panel reads as graded, not flat.
  const vg = ctx.createRadialGradient(
    x + w / 2, y + h / 2, Math.min(w, h) * 0.35,
    x + w / 2, y + h / 2, Math.max(w, h) * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, `rgba(0,0,0,${(g.vignette * strength).toFixed(3)})`);
  ctx.fillStyle = vg;
  ctx.fillRect(x, y, w, h);
  // Halftone dots over the photo pixels.
  const ht = look?.halftone ?? 0.7;
  if (ht > 0.05) {
    ctx.fillStyle = `rgba(0,0,0,${(0.10 * ht).toFixed(3)})`;
    const step = Math.max(6, Math.round(9 - ht * 3));
    for (let dy = step / 2; dy < h; dy += step) {
      for (let dx = step / 2; dx < w; dx += step) {
        ctx.beginPath();
        ctx.arc(x + dx, y + dy, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  // Grain: seeded, so two renders agree pixel for pixel.
  const gr = look?.grain ?? 0.6;
  if (gr > 0.05) {
    const rnd = mulberry32(Math.round(x * 7 + y * 13 + w));
    const n = Math.floor((w * h) / 260 * gr);
    for (let i = 0; i < n; i++) {
      const gx = x + rnd() * w, gy = y + rnd() * h;
      ctx.fillStyle = rnd() > 0.5 ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
      ctx.fillRect(gx, gy, 1.4, 1.4);
    }
  }
}

function drawChip(ctx, x, y, text, fontPx, fg = '#ffffff', bg = 'rgba(8,4,18,0.82)') {
  ctx.font = `bold ${fontPx}px system-ui, sans-serif`;
  const tw = ctx.measureText(text).width;
  const pad = fontPx * 0.55, hh = fontPx * 1.9;
  ctx.fillStyle = bg;
  roundRect(ctx, x, y, tw + pad * 2, hh, hh / 2);
  ctx.fill();
  ctx.fillStyle = fg;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + pad, y + hh / 2 + 1);
  return tw + pad * 2;
}

function hourLabel(hour) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${hour % 2 === 0 ? '00' : '30'} ${hour < 12 ? 'AM' : 'PM'}`;
}

// Draws one photo panel (photo, grade, chips, role tag). `expand` is the
// pop-out factor: the hero is drawn larger than its frame.
function drawPanel(ctx, photo, p, rect, gradeId, look, isHero, seed, chipsUp = false) {
  const { x, y, w, h, rot } = rect;
  const scale = isHero ? 1.10 : 1;
  const ew = w * scale, eh = h * scale;
  // The hero breaks its frame mostly downward and sideways, so it stays
  // on the cover instead of bleeding off the top edge.
  const ex = x - (ew - w) / 2, ey = y - (eh - h) * 0.25;
  ctx.save();
  if (rot) {
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.translate(-(x + w / 2), -(y + h / 2));
  }
  // Soft shadow + white outline glow for the pop-out hero.
  if (isHero) {
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = Math.max(10, w * 0.03);
    ctx.shadowOffsetY = Math.max(6, h * 0.02);
  }
  ctx.fillStyle = '#12081f';
  ctx.fillRect(ex, ey, ew, eh);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  const aspect = ew / eh;
  const src = sourceRect(photo, p.mode, aspect);
  const flip = !!p.flip;
  // Photo first (clipped to the frame), grade after, in unflipped space.
  ctx.save();
  ctx.beginPath();
  ctx.rect(ex, ey, ew, eh);
  ctx.clip();
  if (src.contain) {
    // Letterbox: the whole photo fits, centred, on the dark backdrop.
    const s = Math.min(ew / photo.naturalWidth, eh / photo.naturalHeight);
    const dw = photo.naturalWidth * s, dh = photo.naturalHeight * s;
    const dx = ex + (ew - dw) / 2, dy = ey + (eh - dh) / 2;
    ctx.drawImage(photo, dx, dy, dw, dh);
    ctx.restore();
    applyGrade(ctx, { x: dx, y: dy, w: dw, h: dh }, gradeId, look);
  } else if (flip) {
    ctx.translate(ex + ew, ey);
    ctx.scale(-1, 1);
    ctx.drawImage(photo, src.sx, src.sy, src.sw, src.sh, 0, 0, ew, eh);
    ctx.restore();
    applyGrade(ctx, { x: ex, y: ey, w: ew, h: eh }, gradeId, look);
  } else {
    ctx.drawImage(photo, src.sx, src.sy, src.sw, src.sh, ex, ey, ew, eh);
    ctx.restore();
    applyGrade(ctx, { x: ex, y: ey, w: ew, h: eh }, gradeId, look);
  }
  // Frame: white border; the hero gets a thicker glowing outline.
  ctx.lineWidth = isHero ? Math.max(4, w * 0.008) : 2;
  ctx.strokeStyle = isHero ? '#ffffff' : 'rgba(255,255,255,0.85)';
  if (isHero && (look?.glow ?? 0.7) > 0.05) {
    ctx.shadowColor = GRADES[gradeId]?.glow || '#ffffff';
    ctx.shadowBlur = Math.max(12, w * 0.04);
  }
  ctx.strokeRect(ex, ey, ew, eh);
  ctx.shadowBlur = 0;
  // Chips live on one bottom line so the press-quote bar can never cover
  // them. Both are fitted to the panel: the font shrinks, then the
  // micro-story is dropped before any text is allowed to clip.
  const meta = PHOTO_BY_ID[p.photo];
  const capPx0 = Math.max(12, Math.round(h * 0.042));
  const maxChipW = ew - 20;
  let chipText = `${p.caption} · ${hourLabel(p.hour)} — ${p.story}`;
  let capPx = capPx0;
  ctx.font = `bold ${capPx}px system-ui, sans-serif`;
  while (ctx.measureText(chipText).width > maxChipW - capPx * 1.2 && capPx > 9) {
    capPx -= 1;
    ctx.font = `bold ${capPx}px system-ui, sans-serif`;
  }
  if (ctx.measureText(chipText).width > maxChipW - capPx * 1.2) {
    chipText = `${p.caption} · ${hourLabel(p.hour)}`;
    while (ctx.measureText(chipText).width > maxChipW - capPx * 1.2 && capPx > 9) {
      capPx -= 1;
      ctx.font = `bold ${capPx}px system-ui, sans-serif`;
    }
  }
  const chipY = chipsUp ? ey + eh * 0.68 : ey + eh - capPx * 2.4;
  const capW = drawChip(ctx, ex + 10, chipY, chipText, capPx);
  const tagPx = Math.max(12, Math.round(h * 0.042));
  ctx.font = `bold ${tagPx}px system-ui, sans-serif`;
  const tagW = ctx.measureText(meta.role).width + tagPx * 1.1;
  if (capW + tagW + 30 < ew) {
    drawChip(ctx, ex + ew - 10 - tagW, chipY, meta.role, tagPx, '#1a0530', '#ffd94a');
  } else {
    drawChip(ctx, ex + ew - 10 - tagW, chipY - tagPx * 2.3, meta.role, tagPx, '#1a0530', '#ffd94a');
  }
  ctx.restore();
}

function drawStarburst(ctx, cx, cy, r, label) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.21);
  ctx.beginPath();
  const points = 16;
  for (let i = 0; i < points * 2; i++) {
    const ang = (i * Math.PI) / points;
    const rr = i % 2 === 0 ? r : r * 0.78;
    const px = Math.cos(ang) * rr, py = Math.sin(ang) * rr;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = '#ffc93a';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#7a2d00';
  ctx.stroke();
  ctx.fillStyle = '#3a1500';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${Math.max(9, r * 0.20)}px Anton, sans-serif`;
  ctx.fillText('ORIGINAL', 0, -r * 0.18);
  ctx.fillText('COVER ART', 0, r * 0.14);
  ctx.font = `bold ${Math.max(8, r * 0.14)}px system-ui, sans-serif`;
  ctx.fillText(label, 0, r * 0.42);
  ctx.restore();
}

function drawBarcode(ctx, x, y, w, h, seed) {
  const rnd = mulberry32(seed);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
  ctx.fillStyle = '#111111';
  let bx = x;
  while (bx < x + w - 2) {
    const bw = 1 + Math.floor(rnd() * 4);
    if (rnd() > 0.42) ctx.fillRect(bx, y, bw, h);
    bx += bw + 1 + Math.floor(rnd() * 2);
  }
}

// Chrome striped title overlapping the panels, centred at ~58% height.
// Returns the title bounding box (for the flat-space check).
function drawChromeTitle(ctx, title, subtitle, w, h, look) {
  const cy = h * 0.58;
  const maxW = w * 0.88;
  const size = fitText(ctx, title, maxW, Math.round(h * 0.135), 'Anton, sans-serif');
  // Title on its own offscreen layer: the extrusion, gradient, stripes
  // and outline composite here, so the stripes (source-atop) only ever
  // touch the letterforms — never the panels behind the title.
  const pad = Math.ceil(size * 0.45);
  const tw = Math.ceil(maxW) + pad * 2;
  const th = Math.ceil(size * 1.7) + pad * 2;
  const off = document.createElement('canvas');
  off.width = tw; off.height = th;
  const o = off.getContext('2d');
  const ox = tw / 2, oy = th / 2;
  o.textAlign = 'center';
  o.textBaseline = 'middle';
  o.font = `${size}px Anton, sans-serif`;
  // 3D extrusion: dark layers stepping down-right.
  for (let i = 4; i >= 1; i--) {
    o.fillStyle = i % 2 ? '#2a0a3a' : '#3d1150';
    o.fillText(title, ox + i * size * 0.03, oy + i * size * 0.035);
  }
  // Gradient face: yellow -> orange -> pink.
  const grad = o.createLinearGradient(0, oy - size * 0.55, 0, oy + size * 0.55);
  grad.addColorStop(0, '#ffe95a');
  grad.addColorStop(0.5, '#ff9a2a');
  grad.addColorStop(1, '#ff3d7e');
  o.shadowColor = 'rgba(0,0,0,0.6)';
  o.shadowBlur = size * 0.18;
  o.shadowOffsetY = size * 0.06;
  o.fillStyle = grad;
  o.fillText(title, ox, oy);
  o.shadowColor = 'transparent';
  o.shadowBlur = 0;
  o.shadowOffsetY = 0;
  // Horizontal stripes clipped to the letterforms (source-atop).
  o.save();
  o.globalCompositeOperation = 'source-atop';
  o.fillStyle = 'rgba(255,255,255,0.28)';
  const top = oy - size * 0.5, bottom = oy + size * 0.5;
  for (let yy = top + 3; yy < bottom; yy += Math.max(7, size * 0.11)) {
    o.fillRect(0, yy, tw, Math.max(2, size * 0.03));
  }
  o.restore();
  // Dark outline around the letters.
  o.lineWidth = Math.max(2, size * 0.045);
  o.strokeStyle = '#1a0530';
  o.strokeText(title, ox, oy);
  ctx.drawImage(off, w / 2 - tw / 2, cy - th / 2);
  // Script subtitle overlapping below the title, also over the panels.
  const subSize = fitText(ctx, subtitle, maxW * 0.8, Math.round(h * 0.055), 'Pacifico, cursive');
  ctx.font = `${subSize}px Pacifico, cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ff5da2';
  ctx.shadowColor = '#ff2d95';
  ctx.shadowBlur = Math.max(10, subSize * 0.45);
  ctx.fillText(subtitle, w / 2, cy + size * 0.58 + subSize * 0.4);
  ctx.shadowBlur = 0;
  return { x: w / 2 - maxW / 2, y: cy - size * 0.6, w: maxW, h: size * 1.2 + subSize };
}

// --- main entry -------------------------------------------------------
export function drawCover(canvas, photos, presetId, options = {}) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  const preset = PRESETS[presetId] || PRESETS['sunset-heat'];
  const look = { paint: 1, grade: 1, halftone: 0.7, grain: 0.6, glow: 0.7, ...(options.look || {}) };
  const gradeId = options.grade || preset.grade;
  const layoutId = options.layout || preset.layout;
  const title = options.title ?? preset.title;
  const subtitle = options.subtitle ?? preset.subtitle;
  const panels = options.panels || preset.panels;

  // Deep backdrop: panels tile the whole cover, so there is no flat band.
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#1c0b2e');
  bg.addColorStop(1, '#0a0514');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const rects = layoutRects(layoutId, panels.length, w, h);
  // Non-hero panels first, so the pop-out hero draws over its neighbours.
  panels.forEach((p, i) => {
    if (i === 0 && preset.heroPop) return;
    const photo = photos[p.photo];
    if (!photo) return;
    drawPanel(ctx, photo, p, rects[i], gradeId, look, false, i * 31 + 7);
  });
  if (preset.heroPop && panels.length > 0) {
    const photo = photos[panels[0].photo];
    // A tall hero's bottom chips would sit under the title (the hero is
    // drawn 10% larger, so its chips dip lower than a normal panel's):
    // ride them up to 68% of the panel instead.
    const chipsUp = (rects[0].y + rects[0].h) > h * 0.47;
    if (photo) drawPanel(ctx, photo, panels[0], rects[0], gradeId, look, true, 7, chipsUp);
  }

  // Press quote + stars across the top, over the panels.
  const qPx = Math.max(13, Math.round(h * 0.024));
  ctx.font = `bold ${qPx}px system-ui, sans-serif`;
  const quote = `★★★★★  “${preset.quote}” — ${preset.source}`;
  const qw = ctx.measureText(quote).width;
  ctx.fillStyle = 'rgba(8,4,18,0.72)';
  roundRect(ctx, w / 2 - qw / 2 - 16, h * 0.018, qw + 32, qPx * 2.1, qPx);
  ctx.fill();
  ctx.fillStyle = '#ffd94a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(quote, w / 2, h * 0.018 + qPx * 1.05);

  // VOL tag, top-right, right-aligned so it can never clip off-canvas.
  const volPx = Math.max(12, Math.round(h * 0.02));
  ctx.font = `bold ${volPx}px system-ui, sans-serif`;
  const volW = ctx.measureText(preset.vol).width + volPx * 1.1;
  drawChip(ctx, w - 10 - volW, h * 0.075, preset.vol, volPx, '#1a0530', '#ffffff');

  // The title overlaps the panels in the middle of the cover.
  drawChromeTitle(ctx, title, subtitle, w, h, look);

  // Starburst seal, bottom-left above the footer: it sits on a torso,
  // never on a face or a role tag.
  drawStarburst(ctx, Math.max(46, w * 0.06), h * 0.80, Math.max(30, w * 0.042), 'EST. 2026');

  // Thin footer only (~7%): tagline + credits + barcode + studio logo.
  const fy = h * 0.93;
  ctx.fillStyle = 'rgba(8,4,18,0.94)';
  ctx.fillRect(0, fy, w, h - fy);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const fPx = Math.max(11, Math.round(h * 0.019));
  ctx.font = `bold ${fPx}px system-ui, sans-serif`;
  ctx.fillText(preset.tagline, w * 0.02, fy + (h - fy) * 0.32);
  ctx.font = `${Math.max(9, Math.round(h * 0.013))}px system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.fillText('VICE COAST STUDIO — A LEONIDA SESSION · ORIGINAL ART, NO ROCKSTAR LOGOS', w * 0.02, fy + (h - fy) * 0.72);
  // Studio monogram.
  ctx.fillStyle = '#ff3d7e';
  ctx.beginPath();
  ctx.arc(w * 0.86, fy + (h - fy) / 2, (h - fy) * 0.32, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.max(12, Math.round(h * 0.02))}px Anton, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('VC', w * 0.86, fy + (h - fy) / 2 + 1);
  drawBarcode(ctx, w * 0.90, fy + (h - fy) * 0.22, w * 0.07, (h - fy) * 0.56, 99);
  return { preset, rects };
}

// --- measurement helpers (used by shots.js gates) ----------------------
// Fraction of the cover that is a flat band: a row of the downscaled
// cover counts as flat when >85% of its pixels share one quantized
// colour — that is what a flat title band looks like. Photo rows (sky
// gradients, skin, grain, halftone) never clear 85%. A cover is rejected
// above 0.12; the only flat strip in a good cover is the ~7% footer.
export function flatFraction(canvas) {
  const small = document.createElement('canvas');
  small.width = 160; small.height = 90;
  const sctx = small.getContext('2d');
  sctx.drawImage(canvas, 0, 0, 160, 90);
  const data = sctx.getImageData(0, 0, 160, 90).data;
  let flatRows = 0;
  for (let y = 0; y < 90; y++) {
    const counts = new Map();
    for (let x = 0; x < 160; x++) {
      const i = (y * 160 + x) * 4;
      const key = ((data[i] >> 5) << 6) | ((data[i + 1] >> 5) << 3) | (data[i + 2] >> 5);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    let top = 0;
    for (const n of counts.values()) if (n > top) top = n;
    if (top / 160 > 0.85) flatRows++;
  }
  return flatRows / 90;
}

// Mean luminance (0..1) of a rect of the rendered cover.
export function rectLuminance(canvas, rect) {
  const ctx = canvas.getContext('2d');
  const x = Math.max(0, Math.floor(rect.x)), y = Math.max(0, Math.floor(rect.y));
  const w = Math.min(canvas.width - x, Math.floor(rect.w));
  const h = Math.min(canvas.height - y, Math.floor(rect.h));
  if (w <= 0 || h <= 0) return 0;
  const data = ctx.getImageData(x, y, w, h).data;
  let sum = 0;
  const step = 4 * 7;
  let n = 0;
  for (let i = 0; i < data.length; i += step) {
    sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    n++;
  }
  return sum / n / 255;
}

// Caption-time vs photo-luminance gate: a panel captioned midnight must
// render dark. Returns a list of failures (empty = pass).
export function luminanceGate(canvas, presetId) {
  const preset = PRESETS[presetId];
  const { rects } = drawCoverLast;
  const failures = [];
  if (!rects) return failures;
  preset.panels.forEach((p, i) => {
    const lum = rectLuminance(canvas, rects[i]);
    const night = p.hour >= 22 || p.hour <= 3;
    if (night && lum > 0.62) {
      failures.push(`${p.photo} captioned ${hourLabel(p.hour)} but renders at luminance ${lum.toFixed(2)}`);
    }
    if (!night && p.hour >= 5 && p.hour <= 8 && lum < 0.08) {
      failures.push(`${p.photo} captioned ${hourLabel(p.hour)} renders nearly black (${lum.toFixed(2)})`);
    }
  });
  return failures;
}

// The last drawCover call's geometry, kept for the gates above.
export let drawCoverLast = { preset: null, rects: null };
const _drawCover = drawCover;
export function drawCoverTracked(canvas, photos, presetId, options = {}) {
  const out = _drawCover(canvas, photos, presetId, options);
  drawCoverLast = out;
  return out;
}
