// @ts-nocheck — ported 1:1 from kk-motion.js (canvas-heavy, untyped by design).
// Kora Kaagaz motion helpers — adapted from the GenC v2 motion kit.
const REDUCE = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(.2,.7,.2,1)';
// next/font hashes family names, so canvas text resolves them from the CSS variables.
const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const GLYPH_FONT = () => `${cssVar('--font-manrope') || 'Manrope'},${cssVar('--font-noto-deva') || "'Noto Sans Devanagari'"},sans-serif`;

// Animated cobalt dot-matrix field. layout 'sheet' draws the studio's "blank canvas" corner brackets in light; 'full' is an ambient field.
// arcApex (optional): returns the y (px, within the host) where the horizon arc's crest should sit on small screens.
function mountField(canvas, { layout = 'sheet', intensity = 1, bg = '#071A43', shape = 'auto', arcApex = null as null | (() => number | null) } = {}) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  const host = canvas.parentElement;
  const LV = 22;
  const stops = [[7, 26, 67], [7, 56, 197], [6, 75, 255], [200, 212, 255]];
  const pal = Array.from({ length: LV + 1 }, (_, i) => {
    const s = (i / LV) * 3, k = Math.min(2, Math.floor(s)), f = s - k, a = stops[k], b = stops[k + 1];
    return `rgb(${(a[0] + (b[0] - a[0]) * f) | 0},${(a[1] + (b[1] - a[1]) * f) | 0},${(a[2] + (b[2] - a[2]) * f) | 0})`;
  });
  let apexY = null, apexAt = -1e9;
  let w = 0, h = 0, step = 8, raf = 0, last = 0, visible = true, t0 = performance.now(), dpr = 1, sprites = [];
  let px = -9999, py = -9999, tp = 0, tpc = 0;
  const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
  const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const bc = document.createElement('canvas'), bx = bc.getContext('2d');
  // Pre-rendered round dot sprites per brightness level; upper levels carry a soft halo.
  function buildSprites() {
    sprites = pal.map((col, L) => {
      const S = Math.max(4, Math.ceil(step * 3 * dpr)), c = document.createElement('canvas'); c.width = c.height = S;
      const g = c.getContext('2d'), k = L / LV, r = step * dpr * (0.12 + 0.36 * k);
      if (k > 0.45) { const gr = g.createRadialGradient(S / 2, S / 2, r * 0.6, S / 2, S / 2, S / 2); const a = ((k - 0.45) / 0.55) * 0.42; gr.addColorStop(0, col.replace('rgb', 'rgba').replace(')', `,${a})`)); gr.addColorStop(1, col.replace('rgb', 'rgba').replace(')', ',0)')); g.fillStyle = gr; g.fillRect(0, 0, S, S); }
      g.fillStyle = col; g.beginPath(); g.arc(S / 2, S / 2, r, 0, 6.2832); g.fill();
      if (k > 0.8) { g.fillStyle = 'rgba(255,255,255,' + ((k - 0.8) * 2.2).toFixed(2) + ')'; g.beginPath(); g.arc(S / 2, S / 2, r * 0.45, 0, 6.2832); g.fill(); }
      return c;
    });
  }
  function bloom(a = 0.5) {
    bx.clearRect(0, 0, bc.width, bc.height);
    bx.drawImage(canvas, 0, 0, bc.width, bc.height);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bc, 0, 0, w, h); ctx.restore();
  }
  function size() {
    const r = host.getBoundingClientRect();
    w = Math.ceil(r.width); h = Math.ceil(r.height);
    step = w < 600 ? 7 : w < 1100 ? 9 : 10;
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bc.width = Math.max(1, Math.ceil(w / 7)); bc.height = Math.max(1, Math.ceil(h / 7));
    buildSprites();
  }
  // Adaptive quality: if frames get expensive, drop resolution so the page never stalls.
  let slowFrames = 0, quality = 1;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!visible || now - last < 24) return;
    last = now;
    const s0 = performance.now(); draw(now / 1000); const cost = performance.now() - s0;
    if (cost > 22 && ++slowFrames > 6 && dpr > 1) { dpr = 1; slowFrames = 0; canvas.width = w; canvas.height = h; ctx.setTransform(1, 0, 0, 1, 0, 0); buildSprites(); }
    else if (cost > 30 && ++slowFrames > 4) { slowFrames = 0; if (quality > 0.4) quality -= 0.2; else { step += 2; buildSprites(); } }
  }
  function draw(t) {
    shape = canvas.dataset.shape || shape;
    if (layout === 'sheet' && ALT[shape]) { tpc += (tp - tpc) * 0.08; ALT[shape](t); return; }
    tpc += (tp - tpc) * 0.08;
    const intro = REDUCE() ? 1 : sm(0, 1.8, (performance.now() - t0) / 1000);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    const buckets = Array.from({ length: LV + 1 }, () => []);
    const mobile = w < 760;
    // Small screens: crest the arc at the page-supplied anchor (re-measured every half second, since fonts/layout can shift).
    if (mobile && arcApex && performance.now() - apexAt > 500) { apexAt = performance.now(); apexY = arcApex(); }
    const anchored = mobile && arcApex && apexY != null;
    const arcR = anchored ? w * 0.75 : Math.max(w * (mobile ? 0.75 : 0.55), h * 0.62);
    const arcY = anchored ? apexY + arcR : h * (mobile ? 1.02 : 1.18);
    const R2 = 2 * (mobile ? 90 : 150) ** 2;
    const cx = w * 0.5, cy = h * 0.5;
    const breathe = 1 + 0.012 * Math.sin(t * 0.6);
    const hw = w * (mobile ? 0.44 : 0.38) * breathe * (0.86 + 0.14 * intro), hh = h * (mobile ? 0.36 : 0.34) * breathe * (0.86 + 0.14 * intro);
    const E = Math.min(w, h) * (mobile ? 0.03 : 0.022);
    const useHorizonFrame = layout !== 'sheet' || shape === 'horizon' || (shape === 'auto' && mobile);
    // Horizon arc keeps its original GenC rendering: square dots, original grid, no glow or text-zone dimming.
    const st = useHorizonFrame ? (w < 600 ? 6 : w < 1100 ? 8 : 9) : step;
    for (let y = 0; y < h; y += st) {
      const v = y / h;
      for (let x = 0; x < w; x += st) {
        const u = x / w;
        let base;
        const useHorizon = shape === 'horizon' || (shape === 'auto' && mobile);
        if (layout === 'sheet' && useHorizon) {
          // GenC-style glowing horizon arc on small screens.
          const hx = w * 0.5, hy = arcY, R = arcR;
          const d = Math.hypot(x - hx, y - hy), e = (d - R) / (R * 0.16);
          base = (Math.exp(-e * e) * 1.1 + (d < R ? 0.18 * sm(R * 0.4, R, d) : 0) + 0.25 * Math.exp(-(((d - R) / (R * 0.5)) ** 2))) * (0.4 + 0.6 * intro);
        } else if (layout === 'sheet') {
          const ax = Math.abs(x - cx) - hw, ay = Math.abs(y - cy) - hh;
          const sd = Math.hypot(Math.max(ax, 0), Math.max(ay, 0)) + Math.min(Math.max(ax, ay), 0);
          const cf = Math.max(sm(hh * 0.45, hh * 0.72, Math.abs(y - cy)), sm(hw * 0.62, hw * 0.86, Math.abs(x - cx)));
          base = Math.exp(-((sd / E) ** 2)) * (0.05 + 1.25 * cf) * intro
            + (sd > 0 ? 0.26 * Math.exp(-((sd / (Math.min(w, h) * 0.3)) ** 2)) * cf + 0.1 : 0.03)
            + 0.22 * sm(0.6, 1, v) * (sd > 0 ? 1 : 0);
        } else {
          base = 0.3 + 0.5 * sm(0, 1, 1 - Math.abs(v - 0.6) * 1.5);
        }
        const n = 0.6 + 0.4 * Math.sin(u * 7 + t * 0.35 + Math.sin(v * 5 - t * 0.25) * 1.8) * Math.cos(v * 3 + t * 0.2 + u * 2);
        let i = base * n * intensity;
        // keep the copy zone calm so the headline and paragraph read cleanly
        if (layout === 'sheet' && !useHorizonFrame) i *= 0.4 + 0.6 * sm(0.2, 0.72, Math.hypot((u - 0.5) * 1.35, (v - 0.5) * 1.9));
        let ox = 0, oy = 0;
        if (tpc > 0.01) {
          const dx = x - px, dy = y - py, d2 = dx * dx + dy * dy, f = Math.exp(-d2 / R2);
          i += tpc * 0.7 * f;
          if (!useHorizonFrame) { const d = Math.sqrt(d2) || 1, push = tpc * f * step * 1.8; ox = dx / d * push; oy = dy / d * push; }
        }
        const hs = hash(x, y);
        if (hs > 0.997) i = Math.max(i, 0.42 + 0.4 * Math.sin(t * 1.6 + hs * 90));
        const L = Math.min(LV, Math.round(i * LV));
        if (L > 1) buckets[L].push(x + ox, y + oy);
      }
    }
    if (useHorizonFrame) {
      for (let L = 2; L <= LV; L++) {
        const b = buckets[L]; if (!b.length) continue;
        ctx.fillStyle = pal[L];
        const s = st * (0.22 + 0.55 * (L / LV)), so = (st - s) / 2;
        for (let k = 0; k < b.length; k += 2) ctx.fillRect(b[k] + so, b[k + 1] + so, s, s);
      }
      return;
    }
    const S = step * 3, o = step / 2 - S / 2;
    for (let L = 2; L <= LV; L++) {
      const b = buckets[L]; if (!b.length) continue;
      if (L < 11) { // small dots: plain round-ish squares are indistinguishable and far cheaper
        ctx.fillStyle = pal[L]; const s = step * (0.24 + 0.72 * (L / LV)), so = (step - s) / 2;
        for (let k = 0; k < b.length; k += 2) ctx.fillRect(b[k] + so, b[k + 1] + so, s, s);
        continue;
      }
      const sp = sprites[L];
      for (let k = 0; k < b.length; k += 2) ctx.drawImage(sp, b[k] + o, b[k + 1] + o, S, S);
    }
    if (layout === 'sheet') bloom(0.34);
  }
  // ---- Alternate hero fields ----
  let ink = null, lpx = -9999, lpy = -9999;
  let ripples = [], lastSp = 0, lastSx = -9999, lastSy = -9999, nextAmb = 0;
  const portrait = new Image(); portrait.src = '/assets/hero-portrait.png';
  const spc = document.createElement('canvas'), spx = spc.getContext('2d'), mkc = document.createElement('canvas'), mkx = mkc.getContext('2d');
  let trail = [];
  const off = document.createElement('canvas'), octx = off.getContext('2d');
  const nz = (x, y, t) => Math.sin(x * 1.7 + t * 0.5 + Math.sin(y * 2.3 - t * 0.3) * 1.4) * Math.cos(y * 1.3 - t * 0.4 + Math.cos(x * 1.1 + t * 0.2));
  const ALT = {
    // Luminous cobalt ink that blooms from the cursor and drifts like ink on wet paper.
    ink(t) {
      const C = w < 600 ? 6 : 8, gw = Math.ceil(w / C), gh = Math.ceil(h / C);
      if (!ink || ink.gw !== gw || ink.gh !== gh) { ink = { gw, gh, a: new Float32Array(gw * gh), b: new Float32Array(gw * gh), img: octx.createImageData(gw, gh) }; off.width = gw; off.height = gh; }
      const { a, b, img } = ink;
      const dep = (cx, cy, r, s) => { const gx = cx / C, gy = cy / C, rr = r / C; for (let y = Math.max(1, (gy - rr) | 0); y < Math.min(gh - 1, gy + rr); y++) for (let x = Math.max(1, (gx - rr) | 0); x < Math.min(gw - 1, gx + rr); x++) { const d = ((x - gx) ** 2 + (y - gy) ** 2) / (rr * rr); if (d < 1) a[y * gw + x] += s * (1 - d); } };
      for (let k = 0; k < 3; k++) dep(w * (0.5 + 0.34 * Math.sin(t * 0.21 + k * 2.1)), h * (0.55 + 0.32 * Math.cos(t * 0.17 + k * 1.7)), Math.min(w, h) * 0.07, 0.05);
      if (tpc > 0.05 && px > -999) { const sp = Math.min(1, Math.hypot(px - lpx, py - lpy) / 40); dep(px, py, Math.min(w, h) * (0.05 + 0.05 * sp), 0.22 + 0.5 * sp); }
      lpx = px; lpy = py;
      for (let y = 1; y < gh - 1; y++) for (let x = 1; x < gw - 1; x++) {
        const u = x / gw * 3, v = y / gh * 3;
        const vx = Math.cos(nz(u, v, t) * 3) * 0.9, vy = Math.sin(nz(u + 4, v, t) * 3) * 0.9 - 0.25;
        const sx = Math.min(gw - 2, Math.max(1, Math.round(x - vx))), sy = Math.min(gh - 2, Math.max(1, Math.round(y - vy)));
        const i = sy * gw + sx;
        b[y * gw + x] = (a[i] * 0.6 + (a[i - 1] + a[i + 1] + a[i - gw] + a[i + gw]) * 0.1) * 0.982;
      }
      ink.a = b; ink.b = a;
      const d = img.data;
      for (let i = 0; i < gw * gh; i++) {
        const L = Math.min(LV, Math.round(Math.min(1, b[i]) * LV)), c = PALRGB[L];
        d[i * 4] = c[0]; d[i * 4 + 1] = c[1]; d[i * 4 + 2] = c[2]; d[i * 4 + 3] = 255;
      }
      octx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.filter = `blur(${C * 1.6}px)`;
      ctx.drawImage(off, -C * 2, -C * 2, w + C * 4, h + C * 4);
      ctx.filter = 'none';
    },
    // Bilingual glyph field: Latin + Devanagari letters that scramble and brighten under the cursor.
    glyphs(t) {
      const G = w < 600 ? 15 : 19, set = 'KORAKAAGZकोरागज़विचारखुलासंसारIDEASFORM';
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      ctx.font = `500 ${Math.round(G * 0.72)}px ${GLYPH_FONT()}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const R2 = 2 * (w < 600 ? 80 : 130) ** 2, buckets = Array.from({ length: LV + 1 }, () => []);
      for (let y = G / 2; y < h; y += G) for (let x = G / 2; x < w; x += G) {
        const u = x / w, v = y / h, hs = hash(x, y);
        const cd = Math.min(1, Math.hypot((u - 0.5) * 1.6, (v - 0.52) * 2.2));
        let i = (0.5 + 0.5 * nz(u * 3, v * 3, t * 0.8)) * (0.25 + 0.55 * sm(0.2, 1, v)) * (0.25 + 0.75 * sm(0.25, 0.95, cd));
        let near = 0;
        if (tpc > 0.01) { near = tpc * Math.exp(-((x - px) ** 2 + (y - py) ** 2) / R2); i += near * 0.9; }
        if (hs > 0.993) i = Math.max(i, 0.5 + 0.4 * Math.sin(t * 1.4 + hs * 80));
        const L = Math.min(LV, Math.round(i * LV)); if (L < 3) continue;
        const ci = (hs * set.length + (near > 0.15 ? (t * 14) | 0 : (t * 0.4 + hs * 3) | 0)) % set.length | 0;
        buckets[L].push(x, y, ci);
      }
      for (let L = 3; L <= LV; L++) { const bk = buckets[L]; if (!bk.length) continue; ctx.fillStyle = pal[L]; for (let k = 0; k < bk.length; k += 3) ctx.fillText(set[bk[k + 2]], bk[k], bk[k + 1]); }
    },
    // Dot grid that ripples like water; move to stir it, click or tap to drop a stone.
    ripple(t) {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      if (t > nextAmb) { ripples.push({ x: w * (0.15 + 0.7 * Math.random()), y: h * (0.2 + 0.7 * Math.random()), t0: t, a: 0.7 }); nextAmb = t + 2.2 + Math.random() * 1.4; }
      ripples = ripples.filter(r => t - r.t0 < 3.6);
      const S = w < 600 ? 12 : 15, buckets = Array.from({ length: LV + 1 }, () => []);
      for (let y = S / 2; y < h; y += S) for (let x = S / 2; x < w; x += S) {
        const v = y / h, u = x / w;
        let dx = 0, dy = 0, en = 0;
        for (let k = 0; k < ripples.length; k++) {
          const r = ripples[k], age = t - r.t0, ex = x - r.x, ey = y - r.y, d = Math.hypot(ex, ey) || 1, band = d - age * 280;
          if (band > 160 || band < -160) continue;
          const f = r.a * Math.sin(band * 0.055) * Math.exp(-(band * band) / 3600) * Math.exp(-age * 0.9);
          dx += ex / d * f; dy += ey / d * f; en += Math.abs(f);
        }
        const cd = Math.min(1, Math.hypot((u - 0.5) * 1.5, (v - 0.5) * 2));
        const i = (0.1 + 0.2 * sm(0.3, 1, cd) + 0.12 * sm(0.5, 1, v)) * (0.85 + 0.15 * nz(u * 2, v * 2, t * 0.5)) + en * 0.75;
        const L = Math.min(LV, Math.round(i * LV)); if (L < 2) continue;
        buckets[L].push(x + dx * 10, y + dy * 10);
      }
      for (let L = 2; L <= LV; L++) { const b = buckets[L]; if (!b.length) continue; ctx.fillStyle = pal[L]; const s = S * (0.14 + 0.36 * (L / LV)); for (let k = 0; k < b.length; k += 2) { ctx.beginPath(); ctx.arc(b[k], b[k + 1], s / 2, 0, 6.283); ctx.fill(); } }
    },
    // The portrait hides in the dark; a soft cobalt torch (cursor, or a slow idle drift) reveals it.
    spotlight(t) {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      if (!portrait.complete || !portrait.naturalWidth) return;
      if (spc.width !== w || spc.height !== h) { spc.width = mkc.width = w; spc.height = mkc.height = h; }
      const iw = portrait.naturalWidth, ih = portrait.naturalHeight, sc = Math.max(w / iw, h / ih), dw = iw * sc, dh = ih * sc;
      const ox = (w - dw) * (w < 760 ? 0.62 : 0.9), oy = (h - dh) * 0.3;
      ctx.globalAlpha = 0.14; ctx.drawImage(portrait, ox, oy, dw, dh); ctx.globalAlpha = 1;
      const idle = tpc < 0.3;
      const tx = idle ? w * (0.62 + 0.22 * Math.sin(t * 0.33)) : px, ty = idle ? h * (0.42 + 0.2 * Math.sin(t * 0.47 + 1)) : py;
      trail.push({ x: tx, y: ty, t }); trail = trail.filter(p => t - p.t < 1.1);
      mkx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * (w < 760 ? 0.34 : 0.28);
      for (const p of trail) {
        const a = 1 - (t - p.t) / 1.1, r = R * (0.55 + 0.45 * a);
        const g = mkx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, `rgba(0,0,0,${0.22 * a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
        mkx.fillStyle = g; mkx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      }
      spx.globalCompositeOperation = 'source-over'; spx.clearRect(0, 0, w, h);
      spx.drawImage(portrait, ox, oy, dw, dh);
      spx.globalCompositeOperation = 'destination-in'; spx.drawImage(mkc, 0, 0);
      ctx.drawImage(spc, 0, 0);
      const g2 = ctx.createRadialGradient(tx, ty, 0, tx, ty, R * 1.3);
      g2.addColorStop(0, 'rgba(6,75,255,.16)'); g2.addColorStop(1, 'rgba(6,75,255,0)');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);
    },
    // 3D dot terrain flowing toward the viewer beneath a glowing horizon; the cursor lifts a swell.
    terrain(t) {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      const mobile = w < 760, H0 = h * (mobile ? 0.66 : 0.62), f = Math.max(h, w * 0.6);
      const hg = ctx.createLinearGradient(0, H0 - h * 0.22, 0, H0 + h * 0.06);
      hg.addColorStop(0, 'rgba(6,75,255,0)'); hg.addColorStop(0.8, 'rgba(6,75,255,.28)'); hg.addColorStop(1, 'rgba(6,75,255,0)');
      ctx.fillStyle = hg; ctx.fillRect(0, H0 - h * 0.22, w, h * 0.28);
      for (let k = 0; k < 70; k++) { const sx = hash(k, 1.3) * w, sy = hash(k, 7.1) * H0 * 0.9, a = 0.25 + 0.35 * Math.sin(t * (0.6 + hash(k, 3) * 1.4) + k); if (a > 0.05) { ctx.globalAlpha = a; ctx.drawImage(sprites[14], sx - step * 0.6, sy - step * 0.6, step * 1.2, step * 1.2); } }
      ctx.globalAlpha = 1;
      const cols = Math.round((mobile ? 40 : 76) * (0.5 + 0.5 * quality)), rows = Math.round((mobile ? 30 : 46) * (0.5 + 0.5 * quality)), Wd = 3.2, zN = 0.55, zF = 9, span = zF - zN, dz = span / rows, flow = (t * 0.32) % dz;
      const R2 = (mobile ? 110 : 170) ** 2, S = step * 3;
      for (let r = rows; r >= 0; r--) {
        const z = zN + r * dz - flow; if (z <= 0.2) continue;
        const zi = z + t * 0.32;
        const fade = Math.pow(1 - (z - zN) / span, 1.1) * sm(0.3, 0.9, z);
        for (let c = 0; c <= cols; c++) {
          const X = -Wd + (c / cols) * Wd * 2;
          let Y = 0.32 * nz(X * 0.55, zi * 0.42, t * 0.35) + 0.14 * Math.sin(X * 1.4 + zi * 0.8 + t * 0.6);
          let sx = w / 2 + (X / z) * f * 0.5, sy = H0 + ((1.1 - Y) / z) * f * 0.2;
          if (tpc > 0.01) { const d2 = (sx - px) ** 2 + (sy - py) ** 2, lift = tpc * 0.9 * Math.exp(-d2 / R2); if (lift > 0.005) { Y += lift; sy = H0 + ((1.1 - Y) / z) * f * 0.2; } }
          if (sx < -20 || sx > w + 20 || sy > h + 20) continue;
          const i = Math.min(1, (0.3 + 0.7 * sm(-0.35, 0.55, Y)) * fade * 1.15);
          const L = Math.min(LV, Math.round(i * LV)); if (L < 2) continue;
          const sc = Math.min(1.8, 0.35 + 0.7 / z);
          ctx.drawImage(sprites[L], sx - S * sc / 2, sy - S * sc / 2, S * sc, S * sc);
        }
      }
      bloom(0.6);
    },
    // Silk light: layered luminous ribbons, like light moving across folded paper. Very different from the dot fields.
    silk(t) {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      const mobile = w < 760, R2 = (mobile ? 120 : 200) ** 2, stepX = mobile ? 16 : 20;
      const ribbons = [
        { y: 0.66, amp: 0.2, th: 0.2, col: '6,75,255', a: 0.3, n: mobile ? 22 : 38, ph: 0, sl: -0.18 },
        { y: 0.8, amp: 0.14, th: 0.12, col: '138,168,255', a: 0.2, n: mobile ? 16 : 28, ph: 2.1, sl: 0.12 },
        { y: 0.34, amp: 0.12, th: 0.08, col: '244,241,235', a: 0.1, n: mobile ? 12 : 20, ph: 4.2, sl: -0.08 }
      ];
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 1.1;
      for (const rb of ribbons) {
        const g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, `rgba(${rb.col},1)`); g.addColorStop(0.5, `rgba(${rb.col},.4)`); g.addColorStop(1, `rgba(${rb.col},1)`);
        ctx.strokeStyle = g;
        const n = Math.max(8, Math.round(rb.n * quality));
        for (let j = 0; j <= n; j++) {
          const q = j / n, edge = Math.sin(Math.PI * q);
          ctx.globalAlpha = Math.min(1, rb.a * (0.25 + 0.75 * edge) * (rb.n / n) * 0.8);
          ctx.beginPath();
          for (let x = -40; x <= w + 40; x += stepX) {
            const u = x / w;
            let y = h * (rb.y + rb.sl * (u - 0.5) + rb.amp * Math.sin(u * 2.4 + t * 0.22 + rb.ph + q * 0.9) * Math.cos(u * 1.2 - t * 0.15 + q * 1.4) + (q - 0.5) * rb.th * (0.6 + 0.4 * Math.sin(u * 3 + t * 0.3 + rb.ph)) + 0.025 * Math.sin(u * 7 + t * 0.5 + q * 2));
            if (tpc > 0.01) { const dy = y - py, f = Math.exp(-((x - px) ** 2 + dy * dy) / R2); y += Math.sign(dy || 1) * f * tpc * (mobile ? 40 : 70); }
            x === -40 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
      ctx.restore();
      bloom(0.7);
    },
    // Ruled paper lines that ripple and part around the cursor.
    lines(t) {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      const gap = w < 600 ? 13 : 16, stepX = 8, R = w < 600 ? 90 : 150;
      ctx.lineWidth = 1;
      for (let y0 = gap; y0 < h + gap; y0 += gap) {
        const v = y0 / h;
        const lvl = Math.min(LV, Math.round((0.18 + 0.7 * sm(0.15, 1, v)) * LV * (0.75 + 0.25 * Math.sin(y0 * 0.05 + t * 0.6))));
        ctx.strokeStyle = pal[Math.max(3, lvl)];
        ctx.beginPath();
        for (let x = 0; x <= w + stepX; x += stepX) {
          const u = x / w;
          let y = y0 + nz(u * 2.4, v * 2.4, t * 0.6) * gap * 0.9 * (0.3 + v);
          if (tpc > 0.01) { const dx = x - px, dy = y0 - py, f = Math.exp(-(dx * dx + dy * dy) / (R * R)); y += Math.sign(dy || 1) * f * gap * 2.6 * tpc; }
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  };
  const PALRGB = pal.map(s => s.match(/\d+/g).map(Number));
  const move = e => {
    const r = host.getBoundingClientRect(); const p = e.touches ? e.touches[0] : e; px = p.clientX - r.left; py = p.clientY - r.top; tp = 1;
    const now = performance.now() / 1000;
    if (shape === 'ripple' && Math.hypot(px - lastSx, py - lastSy) > 70 && now - lastSp > 0.1) { ripples.push({ x: px, y: py, t0: now, a: 0.4 }); lastSx = px; lastSy = py; lastSp = now; }
  };
  const down = e => { if (shape !== 'ripple') return; const r = host.getBoundingClientRect(); ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t0: performance.now() / 1000, a: 1.3 }); };
  const leave = () => { tp = 0; };
  size();
  const ro = new ResizeObserver(() => { size(); if (REDUCE()) draw(4); });
  ro.observe(host);
  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 });
  io.observe(host);
  if (REDUCE()) draw(4);
  else {
    host.addEventListener('pointermove', move);
    host.addEventListener('touchmove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    host.addEventListener('touchend', leave);
    host.addEventListener('pointerdown', down);
    raf = requestAnimationFrame(frame);
  }
  return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); host.removeEventListener('pointerdown', down); host.removeEventListener('pointermove', move); host.removeEventListener('touchmove', move); host.removeEventListener('pointerleave', leave); host.removeEventListener('touchend', leave); };
}

// Scroll progress bar, reveals (data-reveal / data-reveal="snap"), image wipes (data-wipe), tilt, word scrub (data-scrub-root > [data-w]).
function mountMotion(root = document) {
  const offs = [];
  const bar = root.querySelector('[data-progress]');
  const ring = root.querySelector('[data-progress-ring]');
  const scrubs = [...root.querySelectorAll('[data-scrub-root]')];
  const onS = () => {
    if (bar || ring) { const m = document.documentElement.scrollHeight - innerHeight, p = m > 0 ? scrollY / m : 0; if (bar) bar.style.transform = `scaleX(${p})`; if (ring) ring.style.strokeDashoffset = (1 - p).toFixed(4); }
    if (REDUCE()) return;
    scrubs.forEach(sr => {
      const r = sr.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
      const ws = sr.querySelectorAll('[data-w]'), n = ws.length;
      ws.forEach((el, i) => { const a = Math.max(0, Math.min(1, p * n * 1.15 - i)); el.style.opacity = (0.16 + 0.84 * a).toFixed(3); });
    });
  };
  addEventListener('scroll', onS, { passive: true }); onS();
  offs.push(() => removeEventListener('scroll', onS));
  if (REDUCE()) return () => offs.forEach(f => f());
  root.querySelectorAll('[data-spin]').forEach(el => { const a = el.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 22000, iterations: Infinity }); offs.push(() => a.cancel()); });

  const reveal = [...root.querySelectorAll('[data-reveal]')].filter(el => el.getBoundingClientRect().top > innerHeight * 0.95);
  reveal.forEach(el => {
    const snap = el.getAttribute('data-reveal') === 'snap';
    el.style.opacity = 0;
    el.style.transform = snap ? 'scale(1.06)' : 'translateY(32px)';
    if (snap) el.style.filter = 'blur(10px)';
    el.style.transition = `opacity .9s ${EASE}, transform ${snap ? '1.2s' : '1s'} ${EASE}, filter 1s ${EASE}`;
  });
  const wipes = [...root.querySelectorAll('[data-wipe]')].filter(el => el.getBoundingClientRect().top > innerHeight * 0.95);
  wipes.forEach(el => { el.style.clipPath = 'inset(100% 0 0 0)'; el.style.transition = `clip-path 1.4s cubic-bezier(.7,0,.2,1)`; const im = el.querySelector('img'); if (im) { im.style.transform = 'scale(1.18)'; im.style.transition = `transform 1.8s ${EASE}`; } });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    if (el.hasAttribute('data-reveal')) { el.style.opacity = 1; el.style.transform = 'none'; el.style.filter = 'none'; }
    if (el.__mask) { const m = el.__mask; m.style.clipPath = 'inset(-20% -5% -20% -5%)'; m.style.translate = '0 0'; setTimeout(() => { m.style.clipPath = 'none'; }, 1300); }
    if (el.__letters) [...el.children].forEach((c, i) => { c.animate([{ opacity: 0, transform: 'translateY(60%) rotate(4deg)' }, { opacity: 1, transform: 'none' }], { duration: 1100, delay: i * 55, easing: EASE, fill: 'backwards' }); c.style.opacity = 1; });
    if (el.__wipe) { const wp = el.__wipe; wp.style.clipPath = 'inset(0 0 0 0)'; const im = wp.querySelector('img'); if (im) im.style.transform = 'scale(1)'; }
    io.unobserve(el);
  }), { threshold: 0.15 });
  reveal.forEach(el => io.observe(el));
  // Headline mask: text wipes up from a hidden baseline.
  [...root.querySelectorAll('[data-mask]')].filter(el => el.getBoundingClientRect().top > innerHeight * 0.95).forEach(el => {
    el.style.clipPath = 'inset(0 0 100% 0)'; el.style.translate = '0 0.35em';
    el.style.transition = `clip-path 1.2s cubic-bezier(.7,0,.2,1), translate 1.2s ${EASE}`;
    const host = el.parentElement || el; host.__mask = el; io.observe(host);
  });
  // Letter-by-letter rise (footer wordmark).
  [...root.querySelectorAll('[data-letters]')].filter(el => el.getBoundingClientRect().top > innerHeight * 0.95).forEach(el => {
    [...el.children].forEach(c => { c.style.opacity = 0; });
    el.__letters = true; io.observe(el);
  });
  // clip-path makes the target's visible area 0, so observe the unclipped parent instead.
  wipes.forEach(el => { const host = el.parentElement || el; host.__wipe = el; io.observe(host); });
  offs.push(() => io.disconnect());

  root.querySelectorAll('[data-tilt]').forEach(el => {
    const mv = e => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transition = 'transform .25s ease-out';
      el.style.transform = `perspective(1400px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
    };
    const lv = () => { el.style.transition = `transform .8s ${EASE}`; el.style.transform = 'none'; };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerleave', lv);
    offs.push(() => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerleave', lv); });
  });
  return () => offs.forEach(f => f());
}

// Staggered word rise for hero headlines: [data-rise] + [data-fade] inside root.
function riseIn(root, offset = 0) {
  if (!root || REDUCE()) return;
  root.querySelectorAll('[data-rise]').forEach((el, i) => {
    el.animate([{ transform: 'translateY(110%) rotate(3deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 1100, delay: offset + 200 + i * 90, easing: EASE, fill: 'backwards' });
  });
  root.querySelectorAll('[data-fade]').forEach((el, i) => {
    el.animate([{ transform: 'translateY(14px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 800, delay: offset + 700 + i * 110, easing: EASE, fill: 'backwards' });
  });
}

const FINE = () => matchMedia('(pointer: fine)').matches;

// Short "blank sheet" curtain on first load. Built in JS so it can never block content if scripts fail.
// The curtain plays once per page load (React StrictMode mounts effects twice in dev).
let introOffset = null;
function intro() {
  if (REDUCE()) return 0;
  if (introOffset !== null) return introOffset;
  introOffset = 1050;
  const c = document.createElement('div');
  c.setAttribute('aria-hidden', 'true');
  c.style.cssText = 'position:fixed;inset:0;z-index:10000;background:#F4F1EB;display:flex;align-items:center;justify-content:center;pointer-events:none';
  c.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:16px;color:#171717"><span style="font-family:var(--font-tiro),serif;font-size:clamp(44px,6vw,76px);line-height:1.1">कोरा कागज़</span><span style="display:block;width:0;height:1px;background:#064BFF"></span><span style="font:600 10.5px var(--font-manrope),sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#4A4945">A blank sheet</span></div>`;
  document.body.appendChild(c);
  const inner = c.firstChild, line = inner.children[1];
  inner.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: EASE, fill: 'both' });
  line.animate([{ width: '0px' }, { width: '120px' }], { duration: 700, delay: 150, easing: EASE, fill: 'both' });
  const a = c.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { duration: 950, delay: 850, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' });
  a.onfinish = () => c.remove();
  return 1050;
}

// Custom cursors. style: 'ring' | 'dot' | 'brackets' | 'glow'. Mouse only; touch keeps native behaviour.
function cursor(style = 'ring') {
  if (!FINE() || REDUCE()) return () => {};
  const E = 'cubic-bezier(.2,.7,.2,1)';
  const els = [], mk = (css, html = '') => { const d = document.createElement('div'); d.setAttribute('aria-hidden', 'true'); d.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:9999;' + css; d.innerHTML = html; document.body.appendChild(d); els.push(d); return d; };
  let x = -200, y = -200, rx = -200, ry = -200, raf = 0, mode = '', target = null, label = '', shown = false;
  const hideNative = style === 'dot' || style === 'brackets';
  let st = null;
  if (hideNative) { st = document.createElement('style'); st.textContent = 'html.kk-nc,html.kk-nc *{cursor:none!important}html.kk-nc input,html.kk-nc textarea{cursor:text!important}html.kk-nc select{cursor:pointer!important}'; document.head.appendChild(st); document.documentElement.classList.add('kk-nc'); }
  const find = e => e.target.closest ? e.target.closest('[data-cursor],a,button,select,input,textarea,[role=region]') : null;
  let ring, dot, lab, glow, corners, frame;

  if (style === 'ring') {
    ring = mk(`width:36px;height:36px;margin:-18px 0 0 -18px;border:1px solid #FAF8F3;border-radius:50%;mix-blend-mode:difference;display:flex;align-items:center;justify-content:center;opacity:0;transition:width .4s ${E},height .4s ${E},margin .4s ${E},background .3s,border-color .3s,opacity .3s`, `<span style="font:600 10px var(--font-manrope),sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#FAF8F3;opacity:0;transition:opacity .25s;white-space:nowrap"></span>`);
    lab = ring.firstChild;
    dot = mk('width:5px;height:5px;margin:-2.5px 0 0 -2.5px;background:#FAF8F3;border-radius:50%;mix-blend-mode:difference;opacity:0;transition:opacity .3s');
  }
  if (style === 'dot') {
    dot = mk(`width:10px;height:10px;margin:-5px 0 0 -5px;background:#FAF8F3;border-radius:50%;mix-blend-mode:difference;display:flex;align-items:center;justify-content:center;opacity:0;transition:width .45s ${E},height .45s ${E},margin .45s ${E},background .3s,opacity .3s`, `<span style="font:600 10px var(--font-manrope),sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#FAF8F3;opacity:0;transition:opacity .25s;white-space:nowrap"></span>`);
    lab = dot.firstChild;
  }
  if (style === 'brackets') {
    const c = 'position:absolute;width:9px;height:9px;border-color:#FAF8F3;border-style:solid;border-width:0';
    frame = mk('width:28px;height:28px;mix-blend-mode:difference;opacity:0;transition:opacity .3s', `<span style="${c};top:0;left:0;border-top-width:1.5px;border-left-width:1.5px"></span><span style="${c};top:0;right:0;border-top-width:1.5px;border-right-width:1.5px"></span><span style="${c};bottom:0;left:0;border-bottom-width:1.5px;border-left-width:1.5px"></span><span style="${c};bottom:0;right:0;border-bottom-width:1.5px;border-right-width:1.5px"></span><span style="position:absolute;left:50%;top:50%;width:3px;height:3px;margin:-1.5px 0 0 -1.5px;background:#FAF8F3;border-radius:50%;transition:opacity .3s"></span><span style="position:absolute;left:0;top:calc(100% + 8px);font:600 9.5px var(--font-manrope),sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#FAF8F3;white-space:nowrap;opacity:0;transition:opacity .25s"></span>`);
    dot = frame.children[4]; lab = frame.children[5];
  }
  if (style === 'glow') {
    glow = mk('width:520px;height:520px;margin:-260px 0 0 -260px;border-radius:50%;background:radial-gradient(circle,rgba(6,75,255,.22) 0%,rgba(6,75,255,.08) 35%,rgba(6,75,255,0) 70%);mix-blend-mode:screen;opacity:0;transition:opacity .6s,transform .1s linear');
    dot = mk(`width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:#8AA8FF;box-shadow:0 0 12px 2px rgba(138,168,255,.7);opacity:0;transition:width .45s ${E},height .45s ${E},margin .45s ${E},background .3s,box-shadow .3s,opacity .3s`);
  }

  // brackets frame geometry (lerped)
  let fx = -200, fy = -200, fw = 28, fh = 28;
  const setMode = (t, e) => {
    const lbl = t && t.getAttribute('data-cursor');
    const m = lbl ? 'label:' + lbl : t ? 'link' : '';
    target = t; if (m === mode) return; mode = m; label = lbl || '';
    if (style === 'ring') {
      const sz = lbl ? 84 : t ? 58 : 36;
      ring.style.width = ring.style.height = sz + 'px'; ring.style.margin = `${-sz / 2}px 0 0 ${-sz / 2}px`;
      ring.style.background = lbl ? '#064BFF' : 'transparent'; ring.style.borderColor = lbl ? '#064BFF' : '#FAF8F3'; ring.style.mixBlendMode = lbl ? 'normal' : 'difference';
      lab.textContent = label; lab.style.opacity = lbl ? 1 : 0; dot.style.opacity = t ? 0 : 1;
    }
    if (style === 'dot') {
      const sz = lbl ? 76 : t ? 40 : 10;
      dot.style.width = dot.style.height = sz + 'px'; dot.style.margin = `${-sz / 2}px 0 0 ${-sz / 2}px`;
      dot.style.background = lbl ? '#064BFF' : t ? 'rgba(250,248,243,.9)' : '#FAF8F3'; dot.style.mixBlendMode = lbl ? 'normal' : 'difference';
      lab.textContent = label; lab.style.opacity = lbl ? 1 : 0;
    }
    if (style === 'brackets') { lab.textContent = label; lab.style.opacity = lbl ? 1 : 0; dot.style.opacity = t ? 0 : 1; }
    if (style === 'glow') {
      const sz = t ? 30 : 6;
      dot.style.width = dot.style.height = sz + 'px'; dot.style.margin = `${-sz / 2}px 0 0 ${-sz / 2}px`;
      dot.style.background = t ? 'rgba(138,168,255,.18)' : '#8AA8FF'; dot.style.boxShadow = t ? 'inset 0 0 0 1px #8AA8FF, 0 0 18px 2px rgba(138,168,255,.5)' : '0 0 12px 2px rgba(138,168,255,.7)';
    }
  };
  const mv = e => {
    x = e.clientX; y = e.clientY;
    if (!shown) { shown = true; rx = x; ry = y; fx = x - 14; fy = y - 14; els.forEach(el => { el.style.opacity = 1; }); }
    setMode(find(e), e);
  };
  const out = () => { shown = false; els.forEach(el => { el.style.opacity = 0; }); };
  const loop = () => {
    const k = style === 'ring' ? 0.18 : style === 'glow' ? 0.09 : 0.28;
    rx += (x - rx) * k; ry += (y - ry) * k;
    if (style === 'ring') { ring.style.transform = `translate(${rx}px,${ry}px)`; dot.style.transform = `translate(${x}px,${y}px)`; }
    if (style === 'dot') dot.style.transform = `translate(${rx}px,${ry}px)`;
    if (style === 'glow') { glow.style.transform = `translate(${rx}px,${ry}px)`; dot.style.transform = `translate(${x}px,${y}px)`; }
    if (style === 'brackets') {
      let tx = x - 14, ty = y - 14, tw = 28, th = 28;
      if (target && mode === 'link' && target.getBoundingClientRect) {
        const r = target.getBoundingClientRect();
        if (r.width < 520 && r.height < 200) { const p = 7; tx = r.left - p; ty = r.top - p; tw = r.width + p * 2; th = r.height + p * 2; }
      } else if (mode.startsWith('label')) { tx = x - 26; ty = y - 26; tw = 52; th = 52; }
      fx += (tx - fx) * 0.22; fy += (ty - fy) * 0.22; fw += (tw - fw) * 0.22; fh += (th - fh) * 0.22;
      frame.style.transform = `translate(${fx.toFixed(1)}px,${fy.toFixed(1)}px)`; frame.style.width = fw.toFixed(1) + 'px'; frame.style.height = fh.toFixed(1) + 'px';
    }
    raf = requestAnimationFrame(loop);
  };
  const dn = () => { const el = style === 'ring' ? ring : style === 'brackets' ? frame : dot; el.animate([{ scale: 1 }, { scale: 0.82 }, { scale: 1 }], { duration: 380, easing: E }); };
  addEventListener('pointermove', mv, { passive: true }); addEventListener('pointerdown', dn); document.addEventListener('pointerleave', out);
  raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', mv); removeEventListener('pointerdown', dn); document.removeEventListener('pointerleave', out); els.forEach(el => el.remove()); if (st) { st.remove(); document.documentElement.classList.remove('kk-nc'); } };
}

// Buttons drift toward the pointer and spring back.
function magnetic(root = document) {
  if (!FINE() || REDUCE()) return () => {};
  const offs = [];
  root.querySelectorAll('[data-magnetic]').forEach(el => {
    const mv = e => { const r = el.getBoundingClientRect(); el.style.transition = 'translate .2s ease-out'; el.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.4).toFixed(1)}px`; };
    const lv = () => { el.style.transition = 'translate .8s cubic-bezier(.2,1.6,.3,1)'; el.style.translate = '0 0'; };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerleave', lv);
    offs.push(() => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerleave', lv); });
  });
  return () => offs.forEach(f => f());
}

// Hero headline letters lift and lean away from the pointer.
function letters(root) {
  if (!root || !FINE() || REDUCE()) return () => {};
  const chars = [];
  root.querySelectorAll('[data-rise]').forEach(wd => {
    const txt = wd.textContent; wd.textContent = '';
    [...txt].forEach(ch => { const s = document.createElement('span'); s.textContent = ch; s.style.cssText = 'display:inline-block;transition:transform .6s cubic-bezier(.2,.7,.2,1),color .4s'; wd.appendChild(s); chars.push(s); });
  });
  const mv = e => {
    chars.forEach(s => {
      const r = s.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy), f = Math.max(0, 1 - d / 170);
      s.style.transform = f > 0 ? `translateY(${(-f * 16).toFixed(1)}px) rotate(${((cx - e.clientX) / 170 * f * 8).toFixed(1)}deg)` : '';
      s.style.color = f > 0.45 ? '#8AA8FF' : '';
    });
  };
  const lv = () => chars.forEach(s => { s.style.transform = ''; s.style.color = ''; });
  const host = root.closest('section') || root;
  host.addEventListener('pointermove', mv); host.addEventListener('pointerleave', lv);
  return () => { host.removeEventListener('pointermove', mv); host.removeEventListener('pointerleave', lv); };
}

// Scroll-linked: hero content recedes ([data-hero-out]); [data-parallax=speed] drifts via the translate property.
function scrollFx(root = document) {
  if (REDUCE()) return () => {};
  const out = root.querySelector('[data-hero-out]'), hero = out && out.closest('section');
  const px = [...root.querySelectorAll('[data-parallax]')];
  let raf = 0;
  const run = () => {
    raf = 0;
    if (out && hero) {
      const p = Math.max(0, Math.min(1, scrollY / hero.offsetHeight));
      out.style.transform = p > 0 ? `translateY(${(-p * 110).toFixed(1)}px) scale(${(1 - p * 0.07).toFixed(3)})` : '';
      out.style.opacity = (1 - p * 1.25).toFixed(3);
      out.style.filter = p > 0.02 ? `blur(${(p * 8).toFixed(1)}px)` : '';
    }
    px.forEach(el => { const r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return; const s = parseFloat(el.getAttribute('data-parallax')) || 0.1; el.style.translate = `0 ${((r.top + r.height / 2 - innerHeight / 2) * s).toFixed(1)}px`; });
  };
  const onS = () => { if (!raf) raf = requestAnimationFrame(run); };
  addEventListener('scroll', onS, { passive: true }); run();
  return () => removeEventListener('scroll', onS);
}

// Marquee that speeds up, reverses and skews with scroll velocity.
function marqueeV(el, base = 60) {
  if (!el || REDUCE()) return () => {};
  let half = el.scrollWidth / 2, x = 0, v = 0, lastY = scrollY, dir = 1, last = performance.now(), raf = 0, slow = 1;
  const loop = now => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const dv = scrollY - lastY; lastY = scrollY; v += (dv - v) * 0.12;
    if (Math.abs(dv) > 1) dir = dv > 0 ? 1 : -1;
    x -= (base + Math.min(1600, Math.abs(v) * 32)) * dir * slow * dt;
    if (x <= -half) x += half; if (x > 0) x -= half;
    el.style.transform = `translateX(${x.toFixed(1)}px) skewX(${Math.max(-10, Math.min(10, -v * 0.3)).toFixed(2)}deg)`;
    raf = requestAnimationFrame(loop);
  };
  const p = () => { slow = 0.2; }, r = () => { slow = 1; };
  const rs = () => { half = el.scrollWidth / 2; };
  el.addEventListener('pointerenter', p); el.addEventListener('pointerleave', r); addEventListener('resize', rs);
  raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); removeEventListener('resize', rs); };
}

// Floating image preview that trails the pointer over [data-preview] rows.
function previews(root = document) {
  if (!FINE() || REDUCE()) return () => {};
  const rows = [...root.querySelectorAll('[data-preview]')]; if (!rows.length) return () => {};
  const box = document.createElement('div'), img = document.createElement('img');
  box.setAttribute('aria-hidden', 'true');
  box.style.cssText = 'position:fixed;left:0;top:0;width:220px;height:280px;margin:-140px 0 0 40px;pointer-events:none;z-index:45;overflow:hidden;background:#071A43;opacity:0;scale:.7;transition:opacity .35s, scale .5s cubic-bezier(.2,.7,.2,1)';
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;scale:1.25;transition:scale .8s cubic-bezier(.2,.7,.2,1)';
  box.appendChild(img); document.body.appendChild(box);
  let x = 0, y = 0, bx = 0, by = 0, raf = 0, on = false;
  const mv = e => { x = e.clientX; y = e.clientY; };
  const loop = () => { const vx = x - bx; bx += vx * 0.14; by += (y - by) * 0.14; box.style.transform = `translate(${bx}px,${by}px) rotate(${Math.max(-12, Math.min(12, vx * 0.08)).toFixed(2)}deg)`; raf = requestAnimationFrame(loop); };
  const offs = rows.map(row => {
    const en = e => { img.src = row.getAttribute('data-preview'); if (!on) { bx = e.clientX; by = e.clientY; } on = true; box.style.opacity = 1; box.style.scale = 1; img.style.scale = 1; };
    const lv = () => { on = false; box.style.opacity = 0; box.style.scale = .7; img.style.scale = 1.25; };
    row.addEventListener('pointerenter', en); row.addEventListener('pointerleave', lv);
    return () => { row.removeEventListener('pointerenter', en); row.removeEventListener('pointerleave', lv); };
  });
  addEventListener('pointermove', mv, { passive: true }); raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', mv); offs.forEach(f => f()); box.remove(); };
}

function marquee(el, speed = 40) {
  if (!el || REDUCE()) return () => {};
  const w = el.scrollWidth / 2;
  const a = el.animate([{ transform: 'translateX(0)' }, { transform: `translateX(-${w}px)` }], { duration: (w / speed) * 1000, iterations: Infinity });
  const p = () => a.pause(), r = () => a.play();
  el.addEventListener('pointerenter', p); el.addEventListener('pointerleave', r);
  return () => a.cancel();
}

function dragScroll(el) {
  if (!el) return () => {};
  let down = false, sx = 0, sl = 0;
  const d = e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = el.scrollLeft; el.style.scrollSnapType = 'none'; el.style.cursor = 'grabbing'; };
  const m = e => { if (!down) return; el.scrollLeft = sl - (e.clientX - sx); };
  const u = () => { if (!down) return; down = false; el.style.scrollSnapType = 'x mandatory'; el.style.cursor = 'grab'; };
  el.addEventListener('pointerdown', d); addEventListener('pointermove', m); addEventListener('pointerup', u);
  el.style.cursor = 'grab';
  return () => { el.removeEventListener('pointerdown', d); removeEventListener('pointermove', m); removeEventListener('pointerup', u); };
}


export { mountField, mountMotion, riseIn, marquee, marqueeV, dragScroll, intro, cursor, magnetic, letters, scrollFx, previews };
