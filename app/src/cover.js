// Vice Coast Cover Studio — cover renderer.
//
// A GTA-style poster is a mosaic of photo panels, a chrome title that cuts
// ACROSS the panels (never a flat band of its own), a script subtitle, and a
// thin footer strip. Nothing flat taller than ~7% of the cover may appear:
// the title overlaps the panels, the subtitle overlaps them too, and the
// footer is only a credits strip. Every preset below is checked by
// validateCast / checkTimeCoherence / measureFlatFraction so a bad preset
// cannot silently ship.

export const EXPORT_MAX_LONG = 1280;
export const EXPORT_MIN_SHORT = 480;

// The six-face cast. `time` is the light the source photo was shot in;
// `focus` is the face centre as a fraction of the image, used by the
// face smart-crop. Roles stay attached to the same face on every cover.
export const CAST = [
  { id: 'boulevard', file: 'boulevard.jpg', role: 'THE BOSS', sex: 'F', time: 'sunset', focus: [0.55, 0.26] },
  { id: 'vice', file: 'vice.jpg', role: 'THE CREW', sex: 'F', time: 'sunset', focus: [0.52, 0.42] },
  { id: 'fixer', file: 'fixer.jpg', role: 'THE FIXER', sex: 'M', time: 'sunset', focus: [0.5, 0.36] },
  { id: 'pier', file: 'pier.jpg', role: 'THE CREW', sex: 'M', time: 'day', focus: [0.45, 0.3] },
  { id: 'insider', file: 'insider.jpg', role: 'THE INSIDER', sex: 'M', time: 'midnight', focus: [0.56, 0.36] },
  { id: 'courier', file: 'courier.jpg', role: 'THE COURIER', sex: 'F', time: 'midnight', focus: [0.55, 0.36] },
];

export const CAST_BY_ID = Object.fromEntries(CAST.map((c) => [c.id, c]));

// Six grades. `darken` is painted over the photo pixels, so a daylight
// photo under neon-nights really reads as night: the time-coherence check
// measures the GRADED panel, never the raw source.
export const GRADES = {
  'sunset-heat': { label: 'Sunset Heat', time: 'sunset', darken: 0.0, tintA: 'rgba(255,140,40,0.20)', tintB: 'rgba(255,40,120,0.22)', glow: '#ff7a3c', sat: 1.25 },
  'neon-nights': { label: 'Neon Nights', time: 'midnight', darken: 0.42, tintA: 'rgba(255,0,180,0.30)', tintB: 'rgba(0,220,255,0.30)', glow: '#ff2fb3', sat: 1.15 },
  'golden-coast': { label: 'Golden Coast', time: 'sunset', darken: 0.0, tintA: 'rgba(255,190,80,0.18)', tintB: 'rgba(255,120,40,0.14)', glow: '#ffc44d', sat: 1.2 },
  'tropic-teal': { label: 'Tropic Teal', time: 'day', darken: 0.05, tintA: 'rgba(0,200,180,0.22)', tintB: 'rgba(0,120,200,0.18)', glow: '#19e3c2', sat: 1.3 },
  heatwave: { label: 'Heatwave', time: 'sunset', darken: 0.0, tintA: 'rgba(255,80,20,0.26)', tintB: 'rgba(255,200,60,0.20)', glow: '#ff5a1f', sat: 1.35 },
  'vice-violet': { label: 'Vice Violet', time: 'midnight', darken: 0.35, tintA: 'rgba(160,40,255,0.28)', tintB: 'rgba(255,40,160,0.24)', glow: '#b04dff', sat: 1.2 },
};

// Six layouts. Each returns panels in cover pixels: { photo, x, y, w, h,
// rot (deg), hero (bool), graphic (bool — an emblem panel, not a face) }.
// The footer strip (bottom 7%) is never part of any panel.
export const LAYOUTS = {
  'hero-mosaic': { label: 'Hero mosaic', panels(W, H) {
    const Hc = H * 0.93;
    if (W >= H) {
      return [
        { photo: 0, x: 0, y: 0, w: W * 0.56, h: Hc, hero: true },
        { photo: 1, x: W * 0.56, y: 0, w: W * 0.22, h: Hc * 0.5 },
        { photo: 2, x: W * 0.78, y: 0, w: W * 0.22, h: Hc * 0.5 },
        { photo: 3, x: W * 0.56, y: Hc * 0.5, w: W * 0.22, h: Hc * 0.5 },
        { photo: 4, x: W * 0.78, y: Hc * 0.5, w: W * 0.22, h: Hc * 0.5 },
      ];
    }
    return [
      { photo: 0, x: 0, y: 0, w: W, h: Hc * 0.52, hero: true },
      { photo: 1, x: 0, y: Hc * 0.52, w: W * 0.5, h: Hc * 0.24 },
      { photo: 2, x: W * 0.5, y: Hc * 0.52, w: W * 0.5, h: Hc * 0.24 },
      { photo: 3, x: 0, y: Hc * 0.76, w: W * 0.5, h: Hc * 0.24 },
      { photo: 4, x: W * 0.5, y: Hc * 0.76, w: W * 0.5, h: Hc * 0.24 },
    ];
  } },
  'tilted-snaps': { label: 'Tilted snaps', panels(W, H) {
    // Two rows with the title band between them: the top row ends just
    // inside the title's top edge and the bottom row starts just inside
    // its bottom edge, so the title overlaps both rows while every face
    // (top-row faces near the panel top, bottom-row faces near the panel
    // top too) stays clear of the lettering.
    const Hc = H * 0.93;
    const pw = W * 0.34; const ph = Hc * 0.48;
    return [
      { photo: 0, x: W * 0.02, y: Hc * 0.02, w: pw, h: ph, rot: -7, hero: true },
      { photo: 1, x: W * 0.33, y: Hc * 0.0, w: pw, h: ph, rot: 5 },
      { photo: 2, x: W * 0.64, y: Hc * 0.02, w: pw, h: ph, rot: -4 },
      { photo: 3, x: W * 0.16, y: Hc * 0.52, w: pw, h: ph, rot: 6 },
      { photo: 4, x: W * 0.5, y: Hc * 0.52, w: pw, h: ph, rot: -3 },
    ];
  } },
  'diagonal-trio': { label: 'Diagonal trio', panels(W, H) {
    const Hc = H * 0.93;
    return [
      { photo: 0, x: 0, y: 0, w: W * 0.35, h: Hc, rot: -5, hero: true },
      { photo: 1, x: W * 0.325, y: 0, w: W * 0.35, h: Hc, rot: 5 },
      { photo: 2, x: W * 0.65, y: 0, w: W * 0.35, h: Hc, rot: -5 },
      { photo: 3, x: W * 0.04, y: Hc * 0.04, w: W * 0.2, h: Hc * 0.24, rot: -6 },
      { photo: 4, x: W * 0.76, y: Hc * 0.72, w: W * 0.2, h: Hc * 0.24, rot: 5 },
    ];
  } },
  'seven-mosaic': { label: 'Seven mosaic', panels(W, H) {
    const Hc = H * 0.93;
    if (W >= H) {
      return [
        { photo: 0, x: 0, y: 0, w: W * 0.25, h: Hc * 0.52, hero: true },
        { photo: 1, x: W * 0.25, y: 0, w: W * 0.25, h: Hc * 0.52 },
        { photo: 2, x: W * 0.5, y: 0, w: W * 0.25, h: Hc * 0.52 },
        { photo: 3, x: W * 0.75, y: 0, w: W * 0.25, h: Hc * 0.52 },
        { photo: 4, x: 0, y: Hc * 0.52, w: W * 0.333, h: Hc * 0.48 },
        { photo: 5, x: W * 0.333, y: Hc * 0.52, w: W * 0.333, h: Hc * 0.48 },
        { graphic: true, x: W * 0.666, y: Hc * 0.52, w: W * 0.334, h: Hc * 0.48 },
      ];
    }
    return [
      { photo: 0, x: 0, y: 0, w: W * 0.5, h: Hc * 0.26, hero: true },
      { photo: 1, x: W * 0.5, y: 0, w: W * 0.5, h: Hc * 0.26 },
      { photo: 2, x: 0, y: Hc * 0.26, w: W * 0.5, h: Hc * 0.26 },
      { photo: 3, x: W * 0.5, y: Hc * 0.26, w: W * 0.5, h: Hc * 0.26 },
      { photo: 4, x: 0, y: Hc * 0.52, w: W * 0.5, h: Hc * 0.24 },
      { photo: 5, x: W * 0.5, y: Hc * 0.52, w: W * 0.5, h: Hc * 0.24 },
      { graphic: true, x: 0, y: Hc * 0.76, w: W, h: Hc * 0.24 },
    ];
  } },
  'grid-six': { label: 'Grid six', panels(W, H) {
    const Hc = H * 0.93;
    if (W >= H) {
      return [0, 1, 2, 3, 4, 5].map((p, i) => ({
        photo: p, x: (i % 3) * W / 3, y: Math.floor(i / 3) * Hc / 2, w: W / 3, h: Hc / 2, hero: p === 0,
      }));
    }
    return [0, 1, 2, 3, 4, 5].map((p, i) => ({
      photo: p, x: (i % 2) * W / 2, y: Math.floor(i / 2) * Hc / 3, w: W / 2, h: Hc / 3, hero: p === 0,
    }));
  } },
  'strip-five': { label: 'Strip five', panels(W, H) {
    const Hc = H * 0.93;
    if (W >= H) {
      return [0, 1, 2, 3, 4].map((p, i) => ({
        photo: p, x: i * W / 5, y: 0, w: W / 5, h: Hc, hero: p === 2,
      }));
    }
    return [0, 1, 2, 3, 4].map((p, i) => ({
      photo: p, x: 0, y: i * Hc / 5, w: W, h: Hc / 5, hero: p === 2,
    }));
  } },
};

// The three presets. Every one uses 5 DIFFERENT faces (validated by
// validateCast) and a caption time the graded panels must match.
export const PRESETS = {
  'sunset-heat': {
    label: 'Sunset Heat', layout: 'hero-mosaic', grade: 'sunset-heat',
    photos: ['boulevard', 'vice', 'fixer', 'pier', 'insider'],
    title: 'VICE COAST', subtitle: 'Golden hour. No way out.',
    tagline: 'Five faces. One last score.', time: 'sunset',
  },
  'neon-nights': {
    label: 'Neon Nights', layout: 'hero-mosaic', grade: 'neon-nights',
    photos: ['insider', 'courier', 'boulevard', 'vice', 'fixer'],
    title: 'NEON NIGHTS', subtitle: 'The city never sleeps. Neither do we.',
    tagline: 'Midnight in Vice Coast.', time: 'midnight',
  },
  'golden-coast': {
    label: 'Golden Coast', layout: 'tilted-snaps', grade: 'golden-coast',
    photos: ['vice', 'boulevard', 'fixer', 'pier', 'courier'],
    title: 'VICE COAST', subtitle: 'Salt air. Fast money.',
    tagline: 'Golden Coast — coming soon.', time: 'sunset',
  },
};

export const EXPORT_SIZES = [
  { id: 'wide', label: 'Wide 1280 x 720', w: 1280, h: 720 },
  { id: 'portrait', label: 'Portrait 1024 x 1280', w: 1024, h: 1280 },
  { id: 'square', label: 'Square 1080 x 1080', w: 1080, h: 1080 },
];

// Long side never exceeds 1280, short side never under 480. This clamp
// lives in the code, not just in the screenshot plan.
export function clampExportSize(w, h) {
  const scale = Math.min(1, EXPORT_MAX_LONG / Math.max(w, h));
  let cw = Math.round(w * scale); let ch = Math.round(h * scale);
  if (Math.min(cw, ch) < EXPORT_MIN_SHORT) {
    const up = EXPORT_MIN_SHORT / Math.min(cw, ch);
    cw = Math.round(cw * up); ch = Math.round(ch * up);
  }
  return { w: cw, h: ch };
}

// Hard rule: >= 5 different faces, zero duplicates in one cover.
export function validateCast(photoIds) {
  const unique = new Set(photoIds);
  return { count: photoIds.length, unique: unique.size, ok: unique.size >= 5 && unique.size === photoIds.length };
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Cover-fit source window for an image, biased toward `focus` [fx, fy]
// (face smart-crop) instead of the plain centre crop.
export function coverSourceRect(img, dw, dh, focus) {
  const iw = img.naturalWidth; const ih = img.naturalHeight;
  const scale = Math.max(dw / iw, dh / ih);
  const sw = dw / scale; const sh = dh / scale;
  const fx = focus ? focus[0] : 0.5; const fy = focus ? focus[1] : 0.5;
  const sx = Math.max(0, Math.min(iw - sw, fx * iw - sw / 2));
  const sy = Math.max(0, Math.min(ih - sh, fy * ih - sh / 2));
  return { sx, sy, sw, sh };
}

function halftonePattern(size, gap) {
  const c = document.createElement('canvas');
  c.width = gap; c.height = gap;
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.beginPath(); g.arc(gap / 2, gap / 2, size, 0, Math.PI * 2); g.fill();
  return c;
}

function drawPanel(ctx, img, panel, grade, look, faceCrop) {
  const { x, y, w, h } = panel;
  ctx.save();
  if (panel.rot) {
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate((panel.rot * Math.PI) / 180);
    ctx.translate(-w / 2, -h / 2);
  } else {
    ctx.translate(x, y);
  }
  // Pop-out hero: drawn 10% larger than its frame, breaking the top edge,
  // with a white outline glow and a soft drop shadow.
  let dw = w; let dh = h; let ox = 0; let oy = 0;
  if (panel.hero) {
    dw = w * 1.1; dh = h * 1.1; ox = -w * 0.05; oy = -h * 0.1;
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = Math.max(10, w * 0.04);
    ctx.shadowOffsetY = Math.max(6, h * 0.02);
  }
  if (panel.graphic) {
    const g = ctx.createLinearGradient(0, 0, dw, dh);
    g.addColorStop(0, '#1b0f2e'); g.addColorStop(0.55, '#7a1e6e'); g.addColorStop(1, '#ff7a3c');
    ctx.fillStyle = g; ctx.fillRect(ox, oy, dw, dh);
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = `bold ${Math.round(dh * 0.16)}px Anton, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('VICE', ox + dw / 2, oy + dh * 0.45);
    ctx.fillText('COAST', ox + dw / 2, oy + dh * 0.65);
    ctx.font = `${Math.round(dh * 0.07)}px Pacifico, cursive`;
    ctx.fillStyle = '#ffd166';
    ctx.fillText('est. Vice Coast', ox + dw / 2, oy + dh * 0.82);
  } else if (img) {
    const baseFocus = CAST_BY_ID[panel.castId]?.focus;
    // In a portrait hero mosaic the top small row sits under the title
    // band: bias its crop low so the face lands below the title instead
    // of behind it. Everywhere else the face focus is used as-is.
    const focus = !faceCrop ? null
      : (panel.focusY !== undefined && baseFocus ? [baseFocus[0], panel.focusY] : baseFocus);
    const src = coverSourceRect(img, dw, dh, focus);
    ctx.filter = `saturate(${grade.sat * (1 + look.paint * 0.4)}) contrast(${1 + look.paint * 0.25}) brightness(${1 - grade.darken * 0.4})`;
    if (panel.flip) {
      ctx.save(); ctx.translate(dw, 0); ctx.scale(-1, 1);
      ctx.drawImage(img, src.sx, src.sy, src.sw, src.sh, ox, oy, dw, dh);
      ctx.restore();
    } else {
      ctx.drawImage(img, src.sx, src.sy, src.sw, src.sh, ox, oy, dw, dh);
    }
    ctx.filter = 'none';
    // Grade ON TOP of the photo pixels: tint, night darkening, vignette.
    const tint = ctx.createLinearGradient(ox, oy, ox + dw, oy + dh);
    tint.addColorStop(0, grade.tintA); tint.addColorStop(1, grade.tintB);
    ctx.globalAlpha = 0.55 + look.grade * 0.45;
    ctx.fillStyle = tint; ctx.fillRect(ox, oy, dw, dh);
    ctx.globalAlpha = 1;
    if (grade.darken > 0) {
      ctx.fillStyle = `rgba(8,4,24,${grade.darken})`;
      ctx.fillRect(ox, oy, dw, dh);
    }
    const vg = ctx.createRadialGradient(ox + dw / 2, oy + dh / 2, Math.min(dw, dh) * 0.3, ox + dw / 2, oy + dh / 2, Math.max(dw, dh) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.38)');
    ctx.fillStyle = vg; ctx.fillRect(ox, oy, dw, dh);
    if (look.halftone > 0) {
      const pat = ctx.createPattern(halftonePattern(Math.max(1.5, dw * 0.006), Math.max(7, dw * 0.02)), 'repeat');
      ctx.globalAlpha = look.halftone * 0.35;
      ctx.fillStyle = pat; ctx.fillRect(ox, oy, dw, dh);
      ctx.globalAlpha = 1;
    }
    if (look.grain > 0) {
      const rnd = mulberry32(1234 + Math.round(w) + Math.round(h));
      ctx.fillStyle = '#fff';
      const n = Math.round(look.grain * 900);
      for (let i = 0; i < n; i++) {
        ctx.globalAlpha = rnd() * 0.16;
        ctx.fillRect(ox + rnd() * dw, oy + rnd() * dh, 1.6, 1.6);
      }
      ctx.globalAlpha = 1;
    }
  }
  // White frame on every photo panel. Role tags are drawn in a separate
  // post-pass by drawCover (after the hero pop-out), so a pop-out hero can
  // never bury a neighbour's tag.
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.strokeStyle = panel.hero ? grade.glow : 'rgba(255,255,255,0.9)';
  ctx.lineWidth = panel.hero ? Math.max(3, w * 0.006) : Math.max(2, w * 0.003);
  ctx.strokeRect(ox, oy, dw, dh);
  ctx.restore();
}

// Role tag for one panel, drawn after every panel (and the hero pop-out)
// so it is never buried. `x` is clamped into the canvas: a pop-out hero
// frame starts off-canvas, and its tag must not start there too.
export function drawPanelTag(ctx, panel) {
  if (!panel.castId) return;
  const { x, y, w, h } = panel;
  const tag = CAST_BY_ID[panel.castId].role;
  ctx.save();
  if (panel.rot) {
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate((panel.rot * Math.PI) / 180);
    ctx.translate(-w / 2, -h / 2);
  } else {
    ctx.translate(x, y);
  }
  const dw = panel.hero ? w * 1.1 : w;
  const dh = panel.hero ? h * 1.1 : h;
  const ox = panel.hero ? -w * 0.05 : 0;
  const oy = panel.hero ? -h * 0.1 : 0;
  ctx.font = `bold ${Math.max(11, Math.round(w * 0.032))}px Anton, sans-serif`;
  const tw = ctx.measureText(tag).width + Math.round(w * 0.04);
  const th = Math.max(16, Math.round(h * 0.055));
  const tx = Math.max(ox + w * 0.03, 4 - x);
  const ty = oy + dh - th - h * 0.03;
  ctx.fillStyle = 'rgba(10,6,18,0.85)';
  ctx.fillRect(tx, ty, tw, th);
  ctx.fillStyle = '#ffd166';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(tag, tx + w * 0.02, ty + th / 2);
  ctx.restore();
}

function drawChromeTitle(ctx, W, H, title, subtitle, grade) {
  // Title sits at ~55-62% of the height, drawn AFTER the panels so it
  // overlaps them. Chrome: yellow->orange->pink gradient, horizontal
  // stripes cut through the letters, dark outline, drop shadow.
  // The letters are composed on an offscreen canvas first: the stripes use
  // 'source-atop', which must be confined to the letter pixels — on the
  // main canvas it would stripe the photo panels underneath as well.
  const size = Math.min(W * 0.16, H * 0.15);
  const cx = W / 2; const baseline = H * 0.60;
  const off = document.createElement('canvas');
  off.width = W; off.height = Math.ceil(H * 0.24);
  const o = off.getContext('2d');
  o.textAlign = 'center'; o.textBaseline = 'alphabetic';
  o.font = `${size}px Anton, sans-serif`;
  let fit = size;
  while (o.measureText(title).width > W * 0.92 && fit > 12) {
    fit -= 2; o.font = `${fit}px Anton, sans-serif`;
  }
  const tw = o.measureText(title).width;
  const ob = fit * 1.05; // baseline inside the offscreen canvas
  const grad = o.createLinearGradient(cx - tw / 2, ob - fit, cx + tw / 2, ob);
  grad.addColorStop(0, '#ffe14d'); grad.addColorStop(0.45, '#ff9a2e'); grad.addColorStop(1, '#ff2e88');
  o.fillStyle = grad;
  o.fillText(title, cx, ob);
  o.globalCompositeOperation = 'source-atop';
  o.fillStyle = 'rgba(255,255,255,0.85)';
  o.fillRect(cx - tw / 2, ob - fit * 0.82, tw, fit * 0.07);
  o.fillStyle = 'rgba(20,8,30,0.55)';
  o.fillRect(cx - tw / 2, ob - fit * 0.42, tw, fit * 0.06);
  o.fillRect(cx - tw / 2, ob - fit * 0.16, tw, fit * 0.05);
  o.globalCompositeOperation = 'source-over';
  o.lineWidth = Math.max(2, fit * 0.05);
  o.strokeStyle = 'rgba(20,6,28,0.9)';
  o.strokeText(title, cx, ob);
  // Neon glow wash + drop shadow come from the main canvas when the
  // offscreen layer is stamped down over the panels.
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.65)';
  ctx.shadowBlur = fit * 0.18; ctx.shadowOffsetY = fit * 0.06;
  ctx.drawImage(off, 0, baseline - ob);
  ctx.restore();
  // Script subtitle, also overlapping the panels, just below the title.
  ctx.save();
  ctx.textAlign = 'center';
  const subSize = Math.max(16, Math.round(H * 0.038));
  ctx.font = `${subSize}px Pacifico, cursive`;
  ctx.shadowColor = grade.glow; ctx.shadowBlur = subSize * 0.7;
  ctx.fillStyle = '#ff8fd0';
  ctx.fillText(subtitle, cx, H * 0.685);
  ctx.restore();
  return { x: cx - tw / 2, y: baseline - fit, w: tw, h: fit, size: fit };
}

function drawFooter(ctx, W, H, tagline) {
  const y0 = H * 0.93;
  ctx.fillStyle = '#0d0716';
  ctx.fillRect(0, y0, W, H - y0);
  ctx.fillStyle = '#ffd166';
  ctx.font = `bold ${Math.max(11, Math.round(H * 0.016))}px Anton, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('VICE COAST STUDIOS', W * 0.03, y0 + (H - y0) * 0.62);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = `${Math.max(11, Math.round(H * 0.015))}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(tagline, W * 0.5, y0 + (H - y0) * 0.62);
  // Barcode, right.
  const bx = W * 0.88; const bw = W * 0.09; const bh = (H - y0) * 0.62;
  ctx.fillStyle = '#fff';
  const rnd = mulberry32(77);
  let px = bx;
  while (px < bx + bw) {
    const bar = 1 + rnd() * 4;
    if (rnd() > 0.45) ctx.fillRect(px, y0 + (H - y0) * 0.19, bar, bh);
    px += bar + 1.5;
  }
}

// Main entry. `images` maps cast id -> HTMLImageElement (or null).
// `opts`: { preset } or { layout, grade, photos, title, subtitle, tagline,
// look, faceCrop }. Returns the art-gate measurements for this render.
export function drawCover(canvas, images, opts) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width; const H = canvas.height;
  const preset = opts.preset ? PRESETS[opts.preset] : null;
  const layoutId = opts.layout ?? preset?.layout ?? 'hero-mosaic';
  const grade = GRADES[opts.grade ?? preset?.grade ?? 'sunset-heat'];
  const photoIds = opts.photos ?? preset?.photos ?? CAST.map((c) => c.id).slice(0, 5);
  const title = opts.title ?? preset?.title ?? 'VICE COAST';
  const subtitle = opts.subtitle ?? preset?.subtitle ?? '';
  const tagline = opts.tagline ?? preset?.tagline ?? 'Vice Coast Studios';
  const look = { paint: 0.5, grade: 0.7, halftone: 0.25, grain: 0.3, glow: 0.6, ...(opts.look ?? {}) };
  const cast = validateCast(photoIds);
  if (!cast.ok) throw new Error(`cast must be 5 different faces, got ${cast.unique} unique of ${cast.count}`);

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#12081f';
  ctx.fillRect(0, 0, W, H);

  const layout = LAYOUTS[layoutId];
  const panels = layout.panels(W, H).map((p) => {
    if (p.graphic) return { ...p, castId: null };
    const castId = photoIds[p.photo];
    const panel = { ...p, castId, flip: !!(opts.flipped && opts.flipped[castId]) };
    if (H > W && layoutId === 'hero-mosaic' && (p.photo === 1 || p.photo === 2)) panel.focusY = 0.18;
    return panel;
  });
  // Hero glow wash behind the hero panel.
  const hero = panels.find((p) => p.hero);
  if (hero && look.glow > 0) {
    const g = ctx.createRadialGradient(hero.x + hero.w / 2, hero.y + hero.h / 2, 10, hero.x + hero.w / 2, hero.y + hero.h / 2, Math.max(hero.w, hero.h) * 0.8);
    g.addColorStop(0, grade.glow + '55'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = look.glow;
    ctx.fillStyle = g; ctx.fillRect(hero.x - hero.w * 0.2, hero.y - hero.h * 0.2, hero.w * 1.4, hero.h * 1.4);
    ctx.globalAlpha = 1;
  }
  // Non-hero panels first, hero last so its 10% pop-out sits on top.
  for (const p of panels.filter((q) => !q.hero)) drawPanel(ctx, p.graphic ? null : images[p.castId], p, grade, look, opts.faceCrop !== false);
  if (hero) drawPanel(ctx, hero.graphic ? null : images[hero.castId], hero, grade, look, opts.faceCrop !== false);
  // Role tags after everything, so the pop-out hero never buries one.
  for (const p of panels) drawPanelTag(ctx, p);

  const titleBox = drawChromeTitle(ctx, W, H, title, subtitle, grade);
  drawFooter(ctx, W, H, tagline);

  const checks = measureChecks(ctx, W, H, panels, titleBox, grade.time);
  return { ...checks, uniqueFaces: cast.unique, photos: photoIds, layout: layoutId, grade: opts.grade ?? preset?.grade };
}

function panelMeanLuminance(ctx, panel) {
  const x = Math.max(0, Math.floor(panel.x + panel.w * 0.15));
  const y = Math.max(0, Math.floor(panel.y + panel.h * 0.15));
  const w = Math.max(1, Math.floor(panel.w * 0.7));
  const h = Math.max(1, Math.floor(panel.h * 0.7));
  const data = ctx.getImageData(x, y, w, h).data;
  let sum = 0; let n = 0;
  for (let i = 0; i < data.length; i += 16) {
    sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    n++;
  }
  return n ? sum / n / 255 : 0;
}

// Flat fraction: the share of the cover owned by its single largest solid
// block. The canvas is downsampled to a coarse grid, colours quantised to
// 32 levels, and the largest 4-connected region of one colour is measured.
// A smooth sky gradient spans many quantised levels, so it does not count
// as flat; a solid band (the old flat title band, or a bare footer) does.
// The thin credits footer alone is ~7% of the cover, so a healthy cover
// measures well under 12%.
export function measureFlatFraction(ctx, W, H) {
  const gw = 160; const gh = Math.max(20, Math.round(160 * H / W));
  const small = document.createElement('canvas');
  small.width = gw; small.height = gh;
  const g = small.getContext('2d');
  g.drawImage(ctx.canvas, 0, 0, gw, gh);
  const data = g.getImageData(0, 0, gw, gh).data;
  const key = new Uint32Array(gw * gh);
  for (let i = 0; i < gw * gh; i++) {
    key[i] = ((data[i * 4] >> 3) << 10) | ((data[i * 4 + 1] >> 3) << 5) | (data[i * 4 + 2] >> 3);
  }
  const seen = new Uint8Array(gw * gh);
  let largest = 0;
  const stack = [];
  for (let start = 0; start < gw * gh; start++) {
    if (seen[start]) continue;
    const colour = key[start];
    let size = 0;
    stack.push(start);
    seen[start] = 1;
    while (stack.length) {
      const cell = stack.pop();
      size++;
      const x = cell % gw; const y = (cell / gw) | 0;
      if (x > 0 && !seen[cell - 1] && key[cell - 1] === colour) { seen[cell - 1] = 1; stack.push(cell - 1); }
      if (x < gw - 1 && !seen[cell + 1] && key[cell + 1] === colour) { seen[cell + 1] = 1; stack.push(cell + 1); }
      if (y > 0 && !seen[cell - gw] && key[cell - gw] === colour) { seen[cell - gw] = 1; stack.push(cell - gw); }
      if (y < gh - 1 && !seen[cell + gw] && key[cell + gw] === colour) { seen[cell + gw] = 1; stack.push(cell + gw); }
    }
    if (size > largest) largest = size;
  }
  return largest / (gw * gh);
}

export function checkTimeCoherence(panelLuminances, time) {
  // Graded-panel rules: midnight must read dark, day must read bright,
  // sunset sits in between. A "midnight" panel with daylight luminance
  // is a FAIL.
  return panelLuminances.map((lum) => {
    if (time === 'midnight') return lum < 0.45;
    if (time === 'day') return lum > 0.4;
    return lum > 0.22 && lum < 0.78;
  });
}

function measureChecks(ctx, W, H, panels, titleBox, time) {
  const photoPanels = panels.filter((p) => !p.graphic);
  const luminances = photoPanels.map((p) => panelMeanLuminance(ctx, p));
  const coherence = checkTimeCoherence(luminances, time);
  const titleOverlaps = photoPanels.some((p) =>
    titleBox.x < p.x + p.w && titleBox.x + titleBox.w > p.x &&
    titleBox.y < p.y + p.h && titleBox.y + titleBox.h > p.y);
  return {
    flatFraction: measureFlatFraction(ctx, W, H),
    panelLuminance: luminances.map((v) => +v.toFixed(3)),
    timeCoherence: coherence,
    timeOk: coherence.every(Boolean),
    titleOverlaps,
    titleBox: { x: Math.round(titleBox.x), y: Math.round(titleBox.y), w: Math.round(titleBox.w), h: Math.round(titleBox.h) },
  };
}
