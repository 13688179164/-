import * as THREE from 'three';

/* ============================================================
   Procedural texture atelier — every surface is drawn at runtime
   ============================================================ */

export const GOLD = '#d8b878';
export const GOLD_HI = '#f4e3ba';
export const GOLD_DEEP = '#a9854a';

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function canvasTexture(w, h, draw, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  draw(ctx, w, h);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = options.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  texture.anisotropy = options.anisotropy || 8;
  if (options.repeat) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(options.repeat[0], options.repeat[1]);
  }
  if (options.filter) {
    texture.magFilter = options.filter;
    texture.minFilter = options.filter;
  }
  texture.needsUpdate = true;
  return texture;
}

function spacedText(ctx, text, x, y, spacing) {
  let cursor = x;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + spacing;
  }
  return cursor;
}

function goldGradient(ctx, y0, y1) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, '#f7e7bd');
  g.addColorStop(0.42, '#e0c387');
  g.addColorStop(0.72, '#bb9558');
  g.addColorStop(1, '#e8d3a2');
  return g;
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

/* ---------------- main signage ---------------- */
export function makeSignTexture() {
  return canvasTexture(1536, 320, (ctx, w, h) => {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#101319');
    bg.addColorStop(0.5, '#07090d');
    bg.addColorStop(1, '#0c0f14');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const sweep = ctx.createLinearGradient(0, 0, w, h);
    sweep.addColorStop(0, 'rgba(255,255,255,0)');
    sweep.addColorStop(0.42, 'rgba(190,215,230,0.035)');
    sweep.addColorStop(0.55, 'rgba(255,255,255,0)');
    ctx.fillStyle = sweep; ctx.fillRect(0, 0, w, h);
    ctx.restore();

    ctx.strokeStyle = 'rgba(216,184,120,0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, w - 32, h - 32);
    ctx.strokeStyle = 'rgba(216,184,120,0.16)';
    ctx.lineWidth = 1;
    ctx.strokeRect(27, 27, w - 54, h - 54);

    // monogram roundel
    const cx = 132, cy = 160, r = 82;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(216,184,120,0.75)'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r - 9, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(216,184,120,0.2)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r - 20, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(216,184,120,0.07)'; ctx.fill();
    ctx.fillStyle = goldGradient(ctx, cy - 40, cy + 40);
    ctx.font = '600 54px "Iowan Old Style", "Palatino Linotype", Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('GW', cx, cy + 3);

    ctx.textAlign = 'left';
    ctx.fillStyle = goldGradient(ctx, 70, 160);
    ctx.font = '500 78px "Iowan Old Style", "Palatino Linotype", Georgia, serif';
    spacedText(ctx, 'GOODWORK', 258, 138, 5);

    ctx.fillStyle = goldGradient(ctx, 95, 185);
    ctx.font = '700 92px "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif';
    spacedText(ctx, '古德車房', 930, 150, 8);

    ctx.strokeStyle = 'rgba(216,184,120,0.35)';
    ctx.beginPath(); ctx.moveTo(262, 196); ctx.lineTo(1488, 196); ctx.stroke();

    ctx.fillStyle = 'rgba(216,184,120,0.72)';
    ctx.font = '400 25px "Inter", "PingFang SC", sans-serif';
    spacedText(ctx, 'AUTO ATELIER  ·  維修  保養  鈑金  改裝', 266, 246, 4);

    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.font = '400 19px "SF Mono", Menlo, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('EST. 2016', 1480, 246);
  }, { anisotropy: 16 });
}

export function makeVerticalSignTexture() {
  return canvasTexture(256, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#07090d'; ctx.fillRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(w / 2, 380, 10, w / 2, 420, 340);
    glow.addColorStop(0, 'rgba(216,184,120,0.13)');
    glow.addColorStop(1, 'rgba(216,184,120,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(216,184,120,0.6)'; ctx.lineWidth = 2;
    ctx.strokeRect(14, 14, w - 28, h - 28);
    ctx.strokeStyle = 'rgba(216,184,120,0.18)'; ctx.lineWidth = 1;
    ctx.strokeRect(24, 24, w - 48, h - 48);

    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = goldGradient(ctx, 70, 760);
    ctx.font = '700 118px "Noto Serif CJK SC", "Songti SC", serif';
    const chars = ['古', '德', '車', '房'];
    chars.forEach((c, i) => ctx.fillText(c, w / 2, 190 + i * 158));

    ctx.fillStyle = 'rgba(216,184,120,0.7)';
    ctx.font = '400 16px "SF Mono", Menlo, monospace';
    ctx.fillText('G O O D W O R K', w / 2, 872);
    ctx.fillStyle = 'rgba(216,184,120,0.38)';
    ctx.font = '400 11px "Inter", sans-serif';
    ctx.fillText('AUTO ATELIER · 2016', w / 2, 906);

    ctx.fillStyle = 'rgba(216,184,120,0.55)';
    ctx.beginPath(); ctx.moveTo(w / 2, 940); ctx.lineTo(w / 2 + 5, 948); ctx.lineTo(w / 2, 956); ctx.lineTo(w / 2 - 5, 948); ctx.closePath(); ctx.fill();
  }, { anisotropy: 16 });
}

export function makeBladeTexture() {
  return canvasTexture(512, 384, (ctx, w, h) => {
    ctx.fillStyle = '#080a0e'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(216,184,120,0.6)'; ctx.lineWidth = 3;
    ctx.strokeRect(13, 13, w - 26, h - 26);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = goldGradient(ctx, 50, 160);
    ctx.font = '600 30px "Iowan Old Style", Georgia, serif';
    ctx.fillText('GOODWORK', w / 2, 82);
    ctx.fillStyle = goldGradient(ctx, 130, 260);
    ctx.font = '700 74px "Noto Serif CJK SC", "Songti SC", serif';
    ctx.fillText('古德車房', w / 2, 176);
    ctx.fillStyle = 'rgba(216,184,120,0.55)';
    ctx.font = '400 19px "Inter", sans-serif';
    ctx.fillText('維修 · 保養 · 鈑金 · 改裝', w / 2, 248);
    ctx.strokeStyle = 'rgba(216,184,120,0.25)';
    ctx.beginPath(); ctx.moveTo(90, 286); ctx.lineTo(w - 90, 286); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.font = '400 13px "SF Mono", Menlo, monospace';
    ctx.fillText('SINCE 2016 / NIGHT SHIFT', w / 2, 318);

    // arrow pointer
    ctx.fillStyle = 'rgba(216,184,120,0.65)';
    ctx.beginPath(); ctx.moveTo(w / 2 - 16, 344); ctx.lineTo(w / 2 + 16, 344); ctx.lineTo(w / 2, 360); ctx.closePath(); ctx.fill();
  }, { anisotropy: 16 });
}

export function makeRoofSignTexture() {
  return canvasTexture(1024, 192, (ctx, w, h) => {
    ctx.fillStyle = '#07090d'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(216,184,120,0.4)'; ctx.lineWidth = 2; ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = goldGradient(ctx, 50, 135);
    ctx.font = '500 66px "Iowan Old Style", Georgia, serif';
    ctx.fillText('GOODWORK', w / 2, 84);
    ctx.fillStyle = 'rgba(216,184,120,0.6)';
    ctx.font = '400 18px "Inter", "PingFang SC", sans-serif';
    ctx.fillText('古 德 車 房  ·  A U T O   A T E L I E R', w / 2, 140);
  }, { anisotropy: 8 });
}

export function makeFacilitySign(text, sub, width = 1024, height = 224) {
  return canvasTexture(width, height, (ctx, w, h) => {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#0d1015'); bg.addColorStop(1, '#06080b');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(216,184,120,0.55)'; ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, w - 24, h - 24);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = goldGradient(ctx, 40, h - 50);
    ctx.font = '700 82px "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(text, w / 2, h / 2 - 18);
    ctx.fillStyle = 'rgba(216,184,120,0.62)';
    ctx.font = '400 19px "SF Mono", Menlo, monospace';
    spacedText(ctx, sub, w / 2 - sub.length * 6.6, h - 44, 5);
  }, { anisotropy: 8 });
}

/* ---------------- surfaces ---------------- */
export function makeAsphaltTexture() {
  return canvasTexture(2048, 512, (ctx, w, h) => {
    const rnd = mulberry32(7719);
    ctx.fillStyle = '#0a0c11'; ctx.fillRect(0, 0, w, h);

    const base = ctx.createLinearGradient(0, 0, 0, h);
    base.addColorStop(0, 'rgba(40,48,58,0.18)');
    base.addColorStop(0.5, 'rgba(12,16,23,0.05)');
    base.addColorStop(1, 'rgba(34,40,50,0.16)');
    ctx.fillStyle = base; ctx.fillRect(0, 0, w, h);

    // asphalt aggregate
    for (let i = 0; i < 26000; i++) {
      const x = rnd() * w, y = rnd() * h;
      const a = 0.015 + rnd() * 0.05;
      ctx.fillStyle = rnd() > 0.55 ? `rgba(190,205,220,${a})` : `rgba(0,0,0,${a})`;
      ctx.fillRect(x, y, 1 + rnd() * 2, 1 + rnd() * 2);
    }
    // wet sheen bands
    for (let i = 0; i < 14; i++) {
      const y = rnd() * h;
      const g = ctx.createLinearGradient(0, y - 26, 0, y + 26);
      g.addColorStop(0, 'rgba(120,150,170,0)');
      g.addColorStop(0.5, `rgba(120,150,170,${0.018 + rnd() * 0.026})`);
      g.addColorStop(1, 'rgba(120,150,170,0)');
      ctx.fillStyle = g; ctx.fillRect(0, y - 26, w, 52);
    }
    // puddles
    for (let i = 0; i < 9; i++) {
      const x = rnd() * w, y = rnd() * h, rx = 50 + rnd() * 150, ry = 10 + rnd() * 26;
      const pg = ctx.createRadialGradient(x, y, 0, x, y, rx);
      pg.addColorStop(0, 'rgba(5,8,13,0.72)');
      pg.addColorStop(0.72, 'rgba(8,12,18,0.38)');
      pg.addColorStop(1, 'rgba(8,12,18,0)');
      ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y);
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(x, y, rx, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    // lane dashes
    ctx.strokeStyle = 'rgba(228,233,238,0.6)';
    ctx.lineWidth = 3;
    [Math.round(h * 0.26), Math.round(h * 0.76)].forEach((ly) => {
      ctx.setLineDash([38, 46]);
      ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(w, ly); ctx.stroke();
    });
    ctx.setLineDash([]);
    // center double line
    [Math.round(h * 0.505), Math.round(h * 0.525)].forEach((ly) => {
      ctx.strokeStyle = 'rgba(235,212,158,0.55)'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(w, ly); ctx.stroke();
    });
    // edge lines
    [Math.round(h * 0.045), Math.round(h * 0.945)].forEach((ly) => {
      ctx.strokeStyle = 'rgba(220,226,232,0.48)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(w, ly); ctx.stroke();
    });

    // crosswalk (world x 9 → 16)
    const x0 = ((9 + 43) / 90) * w, x1 = ((16 + 43) / 90) * w;
    ctx.fillStyle = 'rgba(228,232,236,0.62)';
    for (let x = x0; x < x1; x += 26) {
      ctx.fillRect(x, h * 0.06, 15, h * 0.88);
    }
    // crosswalk wear
    ctx.fillStyle = 'rgba(10,12,17,0.22)';
    for (let i = 0; i < 90; i++) ctx.fillRect(x0 + rnd() * (x1 - x0), h * 0.06 + rnd() * h * 0.86, 16, 2 + rnd() * 5);

    // "30" circle marking
    const cx = ((0 + 43) / 90) * w, cy = h * 0.62;
    ctx.strokeStyle = 'rgba(228,232,236,0.55)'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(cx, cy, 76, 28, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(228,232,236,0.55)';
    ctx.font = '600 58px "Inter", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.save(); ctx.translate(cx, cy + 3); ctx.scale(1, 0.38); ctx.fillText('30', 0, 0); ctx.restore();

    // directional arrows
    const drawArrow = (ax, ay, flip) => {
      ctx.save(); ctx.translate(ax, ay); if (flip) ctx.rotate(Math.PI);
      ctx.fillStyle = 'rgba(228,232,236,0.42)';
      ctx.beginPath();
      ctx.moveTo(0, -42); ctx.lineTo(24, -6); ctx.lineTo(8, -6); ctx.lineTo(8, 38);
      ctx.lineTo(-8, 38); ctx.lineTo(-8, -6); ctx.lineTo(-24, -6); ctx.closePath();
      ctx.fill(); ctx.restore();
    };
    drawArrow(((20 + 43) / 90) * w, h * 0.32, false);
    drawArrow(((-24 + 43) / 90) * w, h * 0.78, true);

    // manhole
    [((30 + 43) / 90) * w, ((6 + 43) / 90) * w].forEach((mx) => {
      ctx.fillStyle = 'rgba(3,5,8,0.8)';
      ctx.beginPath(); ctx.ellipse(mx, h * 0.47, 26, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(160,165,170,0.12)'; ctx.lineWidth = 1.5; ctx.stroke();
    });

    // cracks
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1;
    for (let i = 0; i < 22; i++) {
      let x = rnd() * w, y = rnd() * h;
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let j = 0; j < 4; j++) { x += (rnd() - 0.5) * 40; y += (rnd() - 0.5) * 20; ctx.lineTo(x, y); }
      ctx.stroke();
    }
  }, { anisotropy: 16 });
}

export function makeSidewalkTexture() {
  return canvasTexture(512, 512, (ctx, w, h) => {
    const rnd = mulberry32(3381);
    ctx.fillStyle = '#1a1d23'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 12000; i++) {
      ctx.fillStyle = `rgba(${rnd() > 0.5 ? '200,205,212' : '0,0,0'},${0.012 + rnd() * 0.03})`;
      ctx.fillRect(rnd() * w, rnd() * h, 1.5, 1.5);
    }
    ctx.strokeStyle = 'rgba(5,7,10,0.65)'; ctx.lineWidth = 3;
    const step = w / 4;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(i * step, 0); ctx.lineTo(i * step, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * step); ctx.lineTo(w, i * step); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(i * step + 2, 0); ctx.lineTo(i * step + 2, h); ctx.stroke();
    }
    for (let i = 0; i < 7; i++) {
      const x = rnd() * w, y = rnd() * h, r = 18 + rnd() * 70;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(4,6,10,0.32)'); g.addColorStop(1, 'rgba(4,6,10,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
  }, { repeat: [16, 1], anisotropy: 8 });
}

export function makeConcreteTexture() {
  return canvasTexture(512, 512, (ctx, w, h) => {
    const rnd = mulberry32(5521);
    ctx.fillStyle = '#242832'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 16000; i++) {
      ctx.fillStyle = rnd() > 0.5 ? `rgba(255,255,255,${0.008 + rnd() * 0.025})` : `rgba(0,0,0,${0.01 + rnd() * 0.035})`;
      ctx.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2);
    }
    for (let i = 0; i < 7; i++) {
      const x = rnd() * w, y = rnd() * h, r = 30 + rnd() * 80;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(8,10,14,0.2)'); g.addColorStop(1, 'rgba(8,10,14,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.16)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, h * 0.52); ctx.lineTo(w, h * 0.52); ctx.stroke();
  }, { repeat: [2, 2], anisotropy: 8 });
}

export function makeBrickTexture() {
  return canvasTexture(512, 512, (ctx, w, h) => {
    const rnd = mulberry32(9102);
    ctx.fillStyle = '#191b21'; ctx.fillRect(0, 0, w, h);
    const bw = 64, bh = 26;
    for (let row = 0; row < h / bh; row++) {
      for (let col = -1; col < w / bw; col++) {
        const x = col * bw + (row % 2 ? bw / 2 : 0);
        const y = row * bh;
        const v = 24 + rnd() * 14;
        ctx.fillStyle = `rgb(${v + 8},${v + 4},${v + 2})`;
        ctx.fillRect(x + 1, y + 1, bw - 2, bh - 2);
        ctx.fillStyle = `rgba(255,255,255,${0.008 + rnd() * 0.02})`;
        ctx.fillRect(x + 3, y + 2, bw - 6, 1);
      }
    }
  }, { repeat: [3, 3], anisotropy: 8 });
}

export function makeCorrugatedTexture() {
  return canvasTexture(256, 512, (ctx, w, h) => {
    ctx.fillStyle = '#1a1e26'; ctx.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 16) {
      const g = ctx.createLinearGradient(x, 0, x + 16, 0);
      g.addColorStop(0, 'rgba(255,255,255,0.02)');
      g.addColorStop(0.35, 'rgba(255,255,255,0.075)');
      g.addColorStop(0.55, 'rgba(0,0,0,0.22)');
      g.addColorStop(1, 'rgba(0,0,0,0.4)');
      ctx.fillStyle = g; ctx.fillRect(x, 0, 16, h);
    }
    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.016})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }
  }, { repeat: [5, 1], anisotropy: 8 });
}

export function makeSnowTexture() {
  return canvasTexture(512, 512, (ctx, w, h) => {
    const rnd = mulberry32(4421);
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) {
      const x = rnd() * w, y = rnd() * h, r = 8 + rnd() * 42;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(232,240,248,0.95)');
      g.addColorStop(0.65, 'rgba(224,234,245,0.55)');
      g.addColorStop(1, 'rgba(224,234,245,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'destination-in';
    const edge = ctx.createLinearGradient(0, 0, w, h);
    edge.addColorStop(0, 'rgba(0,0,0,0)');
    edge.addColorStop(0.2, 'rgba(0,0,0,0.9)');
    edge.addColorStop(0.8, 'rgba(0,0,0,0.9)');
    edge.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = edge; ctx.fillRect(0, 0, w, h);
  }, { anisotropy: 8 });
}

export function makeGlowTexture() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.18, 'rgba(255,255,255,0.6)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.15)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  });
}

export function makeStreakTexture() {
  return canvasTexture(128, 512, (ctx, w, h) => {
    const vertical = ctx.createLinearGradient(0, 0, 0, h);
    vertical.addColorStop(0, 'rgba(255,255,255,0)');
    vertical.addColorStop(0.18, 'rgba(255,255,255,0.55)');
    vertical.addColorStop(0.5, 'rgba(255,255,255,1)');
    vertical.addColorStop(0.86, 'rgba(255,255,255,0.4)');
    vertical.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = vertical; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'destination-in';
    const horizontal = ctx.createLinearGradient(0, 0, w, 0);
    horizontal.addColorStop(0, 'rgba(0,0,0,0)');
    horizontal.addColorStop(0.35, 'rgba(0,0,0,0.8)');
    horizontal.addColorStop(0.5, 'rgba(0,0,0,1)');
    horizontal.addColorStop(0.65, 'rgba(0,0,0,0.8)');
    horizontal.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = horizontal; ctx.fillRect(0, 0, w, h);
  });
}

export function makeScreenTexture(variant = 'approval') {
  return canvasTexture(512, 320, (ctx, w, h) => {
    ctx.fillStyle = '#071119'; ctx.fillRect(0, 0, w, h);
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, 'rgba(60,210,190,0.14)');
    g.addColorStop(1, 'rgba(10,40,60,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(216,184,120,0.85)';
    ctx.fillRect(24, 26, 3, 28);
    ctx.fillStyle = 'rgba(230,238,242,0.9)';
    ctx.font = '600 16px "Inter", "PingFang SC", sans-serif';
    ctx.fillText(variant === 'approval' ? 'GOODWORK / APPROVAL' : 'LIFT 01 / SAFE', 40, 46);
    ctx.fillStyle = 'rgba(120,220,205,0.7)';
    ctx.font = '400 10px "SF Mono", Menlo, monospace';
    ctx.fillText('SCENE LINK · ONLINE', 40, 66);

    ctx.strokeStyle = 'rgba(120,220,205,0.25)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(24, 90 + i * 32); ctx.lineTo(w - 24, 90 + i * 32); ctx.stroke(); }

    ctx.strokeStyle = 'rgba(120,225,205,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const pts = [30, 150, 82, 132, 134, 142, 186, 108, 238, 120, 290, 88, 342, 96, 394, 72, 446, 84, 488, 62];
    for (let i = 0; i < pts.length; i += 2) {
      if (i === 0) ctx.moveTo(pts[0], 230 - (pts[1] - 60));
      else ctx.lineTo(pts[i], 230 - (pts[i + 1] - 60));
    }
    ctx.stroke();
    ctx.lineTo(488, 246); ctx.lineTo(30, 246); ctx.closePath();
    ctx.fillStyle = 'rgba(120,225,205,0.08)'; ctx.fill();

    ctx.fillStyle = 'rgba(216,184,120,0.9)';
    ctx.font = '600 26px "Iowan Old Style", Georgia, serif';
    ctx.fillText(variant === 'approval' ? '12,800.00' : '98.2%', 24, 286);
    ctx.fillStyle = 'rgba(180,195,200,0.5)';
    ctx.font = '400 9px "SF Mono", Menlo, monospace';
    ctx.fillText(variant === 'approval' ? 'CNY / PENDING REVIEW' : 'HYDRAULIC PRESSURE', 24, 302);
  }, { anisotropy: 8 });
}

export function makeWindowsTexture(kind = 'dorm', seed = 7) {
  const thick = kind === 'dorm';
  return canvasTexture(thick ? 512 : 1024, thick ? 1024 : 512, (ctx, w, h) => {
    const rnd = mulberry32(seed);
    ctx.clearRect(0, 0, w, h);
    const cols = kind === 'dorm' ? 4 : 3;
    const rows = kind === 'dorm' ? 6 : 1;
    const gapX = w / (cols + 0.6);
    const gapY = h / (rows + 0.55);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = gapX * (c + 0.3);
        const y = gapY * (r + 0.26);
        const ww = gapX * 0.72;
        const wh = kind === 'dorm' ? gapY * 0.55 : h * 0.7;
        const lit = rnd();
        let fill;
        if (lit > 0.42) {
          fill = rnd() > 0.35 ? 'rgba(255,198,122,0.9)' : 'rgba(255,225,178,0.85)';
        } else if (lit > 0.24) {
          fill = 'rgba(96,200,210,0.42)';
        } else {
          fill = 'rgba(28,38,50,0.9)';
        }
        const g = ctx.createLinearGradient(x, y, x, y + wh);
        g.addColorStop(0, fill);
        g.addColorStop(1, 'rgba(20,28,38,0.65)');
        ctx.fillStyle = g; ctx.fillRect(x, y, ww, wh);

        // interior silhouette bands
        ctx.fillStyle = 'rgba(5,8,12,0.45)';
        ctx.fillRect(x + ww * 0.12, y + wh * 0.58, ww * 0.76, wh * 0.06);
        if (rnd() > 0.55) {
          ctx.fillStyle = 'rgba(5,8,12,0.35)';
          ctx.fillRect(x + ww * 0.18, y + wh * 0.2, 3, wh * 0.5);
        }
        // frame
        ctx.strokeStyle = 'rgba(9,12,17,0.9)'; ctx.lineWidth = 4;
        ctx.strokeRect(x, y, ww, wh);
        ctx.beginPath(); ctx.moveTo(x + ww / 2, y); ctx.lineTo(x + ww / 2, y + wh); ctx.stroke();
        // reflection
        const rg = ctx.createLinearGradient(x, y, x + ww, y + wh);
        rg.addColorStop(0, 'rgba(180,220,235,0.1)');
        rg.addColorStop(0.5, 'rgba(180,220,235,0)');
        ctx.fillStyle = rg; ctx.fillRect(x, y, ww, wh);
      }
    }
  }, { anisotropy: 8 });
}

export function makeLabelTexture(code, title, sub) {
  return canvasTexture(640, 160, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(6,8,12,0.82)';
    roundRect(ctx, 2, 18, w - 4, h - 36, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(216,184,120,0.36)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = 'rgba(216,184,120,0.9)';
    ctx.fillRect(2, 18, 4, h - 36);

    ctx.fillStyle = 'rgba(216,184,120,0.85)';
    ctx.font = '500 20px "SF Mono", Menlo, monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(code, 22, 52);
    ctx.strokeStyle = 'rgba(216,184,120,0.2)'; ctx.beginPath(); ctx.moveTo(20, 68); ctx.lineTo(w - 20, 68); ctx.stroke();

    ctx.fillStyle = 'rgba(240,236,226,0.95)';
    ctx.font = '600 38px "Noto Sans CJK SC", "PingFang SC", sans-serif';
    ctx.fillText(title, 22, 100);
    ctx.fillStyle = 'rgba(216,184,120,0.55)';
    ctx.font = '400 17px "SF Mono", Menlo, monospace';
    spacedText(ctx, sub, 22, 134, 2.4);
  }, { anisotropy: 8 });
}

export function makeEnvTexture() {
  return canvasTexture(1024, 512, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#04070e');
    g.addColorStop(0.38, '#0b1622');
    g.addColorStop(0.55, '#1c2a36');
    g.addColorStop(0.62, '#3a3126');
    g.addColorStop(0.68, '#1a1a1d');
    g.addColorStop(1, '#050608');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // warm city windows band
    const rnd = mulberry32(2291);
    for (let i = 0; i < 90; i++) {
      const x = rnd() * w, y = h * 0.55 + rnd() * h * 0.12;
      ctx.fillStyle = `rgba(255,${170 + rnd() * 50},${90 + rnd() * 60},${0.15 + rnd() * 0.35})`;
      ctx.fillRect(x, y, 2 + rnd() * 6, 1 + rnd() * 3);
    }
  }, { srgb: true });
}

export function makeSnowCapTexture() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(240,246,252,0.98)');
    g.addColorStop(0.68, 'rgba(228,237,246,0.9)');
    g.addColorStop(1, 'rgba(228,237,246,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  });
}

/* ---------------- lit interior backdrops ---------------- */
export function makeInteriorTexture(variant = 'upper') {
  return canvasTexture(1280, 512, (ctx, w, h) => {
    const rnd = mulberry32(variant === 'upper' ? 881 : 429);
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    if (variant === 'upper') {
      bg.addColorStop(0, '#4a3522');
      bg.addColorStop(0.5, '#2a1e14');
      bg.addColorStop(1, '#140f0b');
    } else {
      bg.addColorStop(0, '#3a2818');
      bg.addColorStop(0.55, '#22170f');
      bg.addColorStop(1, '#100b08');
    }
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    // back wall slats
    for (let x = 0; x < w; x += 26) {
      ctx.fillStyle = `rgba(255,210,150,${0.02 + rnd() * 0.02})`;
      ctx.fillRect(x, 0, 2, h);
    }
    // warm light washes
    [[180, 90], [760, 60], [1120, 120]].forEach(([x, y], i) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, 260);
      g.addColorStop(0, `rgba(255,190,115,${variant === 'upper' ? 0.25 : 0.22})`);
      g.addColorStop(1, 'rgba(255,183,105,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 260, 0, Math.PI * 2); ctx.fill();
    });

    if (variant === 'upper') {
      // shelving / archive wall
      ctx.fillStyle = '#0d0a08';
      ctx.fillRect(80, 90, 380, 330);
      ctx.strokeStyle = 'rgba(216,184,120,0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 90, 380, 330);
      for (let s = 0; s < 4; s++) {
        const y = 150 + s * 68;
        ctx.fillStyle = 'rgba(216,184,120,0.22)';
        ctx.fillRect(86, y, 368, 3);
        for (let b = 0; b < 5; b++) {
          const bw = 28 + rnd() * 34, bh = 26 + rnd() * 24;
          ctx.fillStyle = `rgba(${100 + rnd() * 80},${80 + rnd() * 60},${46 + rnd() * 40},0.7)`;
          ctx.fillRect(100 + b * 70, y - bh - 4, bw, bh);
          ctx.fillStyle = 'rgba(255,225,170,0.16)';
          ctx.fillRect(104 + b * 70, y - bh, bw - 8, 2);
        }
      }
      // dispatch board
      ctx.fillStyle = 'rgba(10,13,18,0.9)';
      ctx.fillRect(540, 96, 280, 178);
      ctx.strokeStyle = 'rgba(140,220,204,0.3)';
      ctx.strokeRect(540, 96, 280, 178);
      ctx.fillStyle = 'rgba(120,220,205,0.75)';
      ctx.font = '500 16px "SF Mono", Menlo, monospace';
      ctx.fillText('DISPATCH / 02', 558, 124);
      for (let i = 0; i < 16; i++) {
        ctx.fillStyle = `rgba(${120 + rnd() * 100},${190 + rnd() * 50},${170 + rnd() * 45},${0.25 + rnd() * 0.5})`;
        ctx.fillRect(560 + (i % 8) * 30, 148 + Math.floor(i / 8) * 30, 16, 8);
      }
      ctx.strokeStyle = 'rgba(216,184,120,0.25)';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(560 + i * 64, 210); ctx.lineTo(560 + i * 64, 250); ctx.stroke();
      }
      // desks + monitors
      ctx.fillStyle = '#0e0b08';
      ctx.fillRect(860, 300, 350, 26);
      ctx.fillRect(880, 326, 18, 86);
      ctx.fillRect(1170, 326, 18, 86);
      const screenGrad = ctx.createLinearGradient(900, 0, 1120, 0);
      screenGrad.addColorStop(0, 'rgba(105,220,205,0.85)');
      screenGrad.addColorStop(1, 'rgba(44,120,138,0.4)');
      ctx.fillStyle = screenGrad;
      ctx.fillRect(910, 218, 90, 62);
      ctx.fillRect(1020, 238, 76, 50);
      ctx.fillStyle = 'rgba(8,11,16,0.7)';
      for (let i = 0; i < 6; i++) ctx.fillRect(916, 228 + i * 8, 70 - i * 4, 2);

      // pendant lamps
      [[380, 44], [720, 34], [1080, 48]].forEach(([x, y]) => {
        ctx.strokeStyle = 'rgba(216,184,120,0.4)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = '#17120d';
        ctx.beginPath(); ctx.moveTo(x - 28, y + 26); ctx.lineTo(x + 28, y + 26); ctx.lineTo(x + 16, y); ctx.lineTo(x - 16, y); ctx.closePath(); ctx.fill();
        const g = ctx.createRadialGradient(x, y + 30, 0, x, y + 30, 90);
        g.addColorStop(0, 'rgba(255,214,155,0.5)');
        g.addColorStop(1, 'rgba(255,214,155,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y + 30, 90, 0, Math.PI * 2); ctx.fill();
      });
    } else {
      // ground-floor tool wall + bench
      ctx.fillStyle = '#0d0b09';
      ctx.fillRect(70, 120, 660, 270);
      ctx.strokeStyle = 'rgba(216,184,120,0.22)'; ctx.lineWidth = 2;
      ctx.strokeRect(70, 120, 660, 270);
      for (let i = 0; i < 20; i++) {
        const x = 96 + (i % 10) * 60;
        const y = 175 + Math.floor(i / 10) * 92;
        ctx.strokeStyle = 'rgba(170,180,190,0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (i % 3 === 0) { ctx.moveTo(x, y); ctx.lineTo(x + 8, y + 48); }
        else if (i % 3 === 1) { ctx.arc(x + 6, y + 12, 12, 0, Math.PI * 2); ctx.moveTo(x + 6, y + 24); ctx.lineTo(x + 6, y + 56); }
        else { ctx.rect(x, y, 10, 44); }
        ctx.stroke();
      }
      // workbench
      ctx.fillStyle = '#17110c';
      ctx.fillRect(70, 390, 680, 24);
      ctx.fillStyle = 'rgba(255,186,110,0.25)';
      ctx.fillRect(70, 408, 680, 3);
      // lightbar
      ctx.fillStyle = 'rgba(255,214,164,0.85)';
      ctx.fillRect(90, 100, 600, 5);
      // reception window / coffee bar
      ctx.fillStyle = 'rgba(11,13,17,0.92)';
      ctx.fillRect(820, 150, 380, 290);
      ctx.fillStyle = 'rgba(255,190,120,0.45)';
      ctx.fillRect(848, 182, 324, 2);
      ctx.fillStyle = 'rgba(120,220,205,0.6)';
      ctx.font = '500 18px "SF Mono", Menlo, monospace';
      ctx.fillText('RECEPTION / 01', 850, 220);
      for (let i = 0; i < 9; i++) {
        ctx.fillStyle = `rgba(${120 + i * 12},${180 + i * 6},${165 + i * 4},${0.12 + i * 0.04})`;
        ctx.fillRect(852, 246 + i * 20, 250 - i * 14, 4);
      }
      // coffee glow
      const cg = ctx.createRadialGradient(1080, 340, 0, 1080, 340, 120);
      cg.addColorStop(0, 'rgba(255,185,105,0.35)');
      cg.addColorStop(1, 'rgba(255,185,105,0)');
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(1080, 340, 120, 0, Math.PI * 2); ctx.fill();
    }

    // bottom floor sheen
    const sheen = ctx.createLinearGradient(0, h - 90, 0, h);
    sheen.addColorStop(0, 'rgba(255,180,100,0)');
    sheen.addColorStop(1, 'rgba(255,180,100,0.09)');
    ctx.fillStyle = sheen; ctx.fillRect(0, h - 90, w, 90);
  }, { anisotropy: 8 });
}
