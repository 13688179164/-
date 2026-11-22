/**
 * 程序化 CanvasTexture 库
 * 所有贴图均在运行时生成，无外部资源依赖。
 */
import * as THREE from 'three';
import { makeNoise2D, mulberry32, clamp } from './utils.js';

const SERIF = '"Noto Serif CJK SC","Songti SC",Georgia,serif';
const SANS = '"Noto Sans CJK SC","PingFang SC",system-ui,sans-serif';
const CJK_SERIF = '"Noto Serif CJK SC","Songti SC","STSong",serif';

function canvasTexture(w, h, draw, { colorSpace = THREE.SRGBColorSpace, repeat = null, filter = THREE.LinearFilter } = {}) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = colorSpace;
  tex.anisotropy = 8;
  tex.minFilter = filter;
  tex.magFilter = THREE.LinearFilter;
  if (repeat) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  return tex;
}

/* ------------------------------------------------------------------ */
/* 深空背景                                                            */
/* ------------------------------------------------------------------ */

export function makeSpaceTexture() {
  const noise = makeNoise2D(71);
  return canvasTexture(2048, 1024, (ctx, w, h) => {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#010308');
    bg.addColorStop(0.32, '#071021');
    bg.addColorStop(0.52, '#0a1426');
    bg.addColorStop(0.72, '#060d1a');
    bg.addColorStop(1, '#010206');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // 星云团块
    const rnd = mulberry32(9021);
    ctx.globalCompositeOperation = 'lighter';
    const blobs = [
      { x: 0.24, y: 0.38, r: 0.3, c: '76,96,190', a: 0.10 },
      { x: 0.52, y: 0.31, r: 0.24, c: '110,74,166', a: 0.075 },
      { x: 0.78, y: 0.48, r: 0.28, c: '42,104,150', a: 0.085 },
      { x: 0.63, y: 0.68, r: 0.2, c: '90,72,150', a: 0.05 },
      { x: 0.14, y: 0.62, r: 0.18, c: '40,90,140', a: 0.05 },
    ];
    for (const b of blobs) {
      const g = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.r * w);
      g.addColorStop(0, `rgba(${b.c},${b.a})`);
      g.addColorStop(0.55, `rgba(${b.c},${b.a * 0.35})`);
      g.addColorStop(1, `rgba(${b.c},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    // 柔和极光带
    for (let i = 0; i < 3; i++) {
      const y0 = h * (0.28 + i * 0.1);
      const g = ctx.createLinearGradient(0, y0 - 140, 0, y0 + 140);
      g.addColorStop(0, 'rgba(80,120,210,0)');
      g.addColorStop(0.5, `rgba(${60 + i * 18},${110 + i * 12},${190 - i * 18},${0.03 + i * 0.012})`);
      g.addColorStop(1, 'rgba(80,120,210,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, y0);
      for (let x = 0; x <= w; x += 40) {
        ctx.lineTo(x, y0 + Math.sin(x * 0.004 + i * 2.1) * 60 + noise(x * 0.003, i * 9) * 70);
      }
      ctx.lineTo(w, y0 + 160);
      ctx.lineTo(0, y0 + 160);
      ctx.closePath();
      ctx.fill();
    }

    // 星星
    for (let i = 0; i < 1050; i++) {
      const x = rnd() * w;
      const y = rnd() * h;
      const size = rnd() < 0.94 ? rnd() * 1.15 + 0.3 : rnd() * 2.1 + 1.2;
      const a = rnd() * 0.6 + 0.1;
      const tint = rnd();
      ctx.fillStyle = tint > 0.86
        ? `rgba(244,220,175,${a})`
        : tint > 0.66
          ? `rgba(170,205,255,${a})`
          : `rgba(224,236,255,${a * 0.85})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      if (size > 1.6) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, size * 7);
        g.addColorStop(0, `rgba(220,235,255,${a * 0.25})`);
        g.addColorStop(1, 'rgba(220,235,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - size * 7, y - size * 7, size * 14, size * 14);
      }
    }

    // 极细颗粒
    const grain = ctx.getImageData(0, 0, w, h);
    for (let i = 0; i < grain.data.length; i += 4) {
      const n = (rnd() - 0.5) * 9;
      grain.data[i] = clamp(grain.data[i] + n, 0, 255);
      grain.data[i + 1] = clamp(grain.data[i + 1] + n, 0, 255);
      grain.data[i + 2] = clamp(grain.data[i + 2] + n, 0, 255);
    }
    ctx.putImageData(grain, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
  }, { colorSpace: THREE.SRGBColorSpace });
}

/* ------------------------------------------------------------------ */
/* 地面 / 草地 / 铺装                                                   */
/* ------------------------------------------------------------------ */

export function makeGrassTexture() {
  const noise = makeNoise2D(13);
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#cfd8c2';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const v = noise(x * 0.035, y * 0.035) * 0.6 + noise(x * 0.14, y * 0.14) * 0.4;
        const g = 198 + v * 44;
        ctx.fillStyle = `rgb(${g * 0.9},${g},${g * 0.82})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    const rnd = mulberry32(48);
    ctx.strokeStyle = 'rgba(88,108,70,.18)';
    for (let i = 0; i < 800; i++) {
      const x = rnd() * w, y = rnd() * h;
      ctx.lineWidth = 0.6 + rnd() * 0.6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rnd() - 0.5) * 2.5, y - 1.5 - rnd() * 3);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,.045)';
    for (let i = 0; i < 120; i++) {
      ctx.beginPath();
      ctx.arc(rnd() * w, rnd() * h, rnd() * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, { repeat: [5, 4] });
}

export function makeAsphaltTexture() {
  const noise = makeNoise2D(37);
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#2b3037';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const v = noise(x * 0.06, y * 0.06) * 0.5 + noise(x * 0.24, y * 0.24) * 0.5;
        const g = 39 + v * 20;
        ctx.fillStyle = `rgb(${g},${g + 1},${g + 3})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    const rnd = mulberry32(17);
    for (let i = 0; i < 900; i++) {
      const a = rnd() * 0.13;
      ctx.fillStyle = rnd() > 0.5 ? `rgba(210,220,232,${a})` : `rgba(0,0,0,${a})`;
      ctx.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2);
    }
    ctx.strokeStyle = 'rgba(12,14,18,.35)';
    for (let i = 0; i < 4; i++) {
      ctx.lineWidth = 0.7;
      let x = rnd() * w, y = 0;
      ctx.beginPath(); ctx.moveTo(x, y);
      while (y < h) { x += (rnd() - 0.5) * 16; y += 20 + rnd() * 26; ctx.lineTo(x, y); }
      ctx.stroke();
    }
  }, { repeat: [4, 2] });
}

export function makeStoneTexture() {
  const noise = makeNoise2D(55);
  return canvasTexture(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#5a5a57';
    ctx.fillRect(0, 0, w, h);
    const rnd = mulberry32(101);
    const tiles = 8;
    const ts = w / tiles;
    for (let iy = 0; iy < tiles; iy++) {
      for (let ix = 0; ix < tiles; ix++) {
        const v = 0.82 + noise(ix * 0.7, iy * 0.7) * 0.18 + rnd() * 0.06;
        ctx.fillStyle = `rgb(${88 * v},${86 * v},${82 * v})`;
        ctx.fillRect(ix * ts + 1.5, iy * ts + 1.5, ts - 3, ts - 3);
        for (let k = 0; k < 20; k++) {
          ctx.fillStyle = `rgba(255,255,255,${rnd() * 0.028})`;
          ctx.fillRect(ix * ts + rnd() * ts, iy * ts + rnd() * ts, 2, 2);
        }
      }
    }
    ctx.strokeStyle = 'rgba(24,25,26,.55)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= tiles; i++) {
      ctx.beginPath(); ctx.moveTo(i * ts, 0); ctx.lineTo(i * ts, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * ts); ctx.lineTo(w, i * ts); ctx.stroke();
    }
    // 中心嵌铜圆环
    ctx.strokeStyle = 'rgba(196,163,102,.38)';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(w / 2, h / 2, w * 0.42, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(w / 2, h / 2, w * 0.395, 0, Math.PI * 2); ctx.stroke();
  });
}

export function makeDarkWoodTexture() {
  const noise = makeNoise2D(77);
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#2b211b';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) {
      const v = noise(y * 0.02, 3.2) * 0.5 + noise(y * 0.12, 8.1) * 0.5;
      ctx.fillStyle = `rgba(${58 + v * 22},${44 + v * 16},${32 + v * 13},1)`;
      ctx.fillRect(0, y, w, 2);
    }
    const rnd = mulberry32(9);
    for (let i = 0; i < 10; i++) {
      const x = (i / 10) * w + rnd() * 8;
      ctx.fillStyle = 'rgba(12,9,7,.55)';
      ctx.fillRect(x, 0, 2.5, h);
    }
  }, { repeat: [2, 1] });
}

/* ------------------------------------------------------------------ */
/* 招牌 / 标识                                                         */
/* ------------------------------------------------------------------ */

function goldGradient(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, '#f8e7bd');
  g.addColorStop(0.32, '#d9b97d');
  g.addColorStop(0.55, '#fff1c9');
  g.addColorStop(0.78, '#bd9354');
  g.addColorStop(1, '#f3dda7');
  return g;
}

function spacedText(ctx, text, x, y, spacing) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
  return cx;
}

export function makeMainSignTexture() {
  return canvasTexture(2048, 320, (ctx, w, h) => {
    ctx.fillStyle = '#0a0d12';
    ctx.fillRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(216,180,119,.11)');
    grad.addColorStop(0.5, 'rgba(216,180,119,.02)');
    grad.addColorStop(1, 'rgba(0,0,0,.25)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(216,180,119,.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.strokeStyle = 'rgba(216,180,119,.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(23, 23, w - 46, h - 46);

    // 左侧 G 徽记
    ctx.save();
    ctx.translate(118, h / 2);
    ctx.strokeStyle = goldGradient(ctx, -60, -60, 60, 60);
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, 0, 62, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 0, 51, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = goldGradient(ctx, 0, -40, 0, 40);
    ctx.font = `500 74px ${SERIF}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('G', 0, 3);
    ctx.restore();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = goldGradient(ctx, 240, 80, 1600, 240);
    ctx.font = `500 132px ${SERIF}`;
    spacedText(ctx, 'GOODWORK', 254, h / 2 - 28, 13);

    ctx.fillStyle = 'rgba(236,222,195,.95)';
    ctx.font = `500 62px ${CJK_SERIF}`;
    spacedText(ctx, '古德車房', 260, h / 2 + 82, 24);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(216,180,119,.75)';
    ctx.font = `400 24px ${SANS}`;
    ctx.fillText('AUTOMOTIVE ATELIER', w - 74, h / 2 - 30);
    ctx.fillStyle = 'rgba(180,195,214,.42)';
    ctx.font = `400 17px ${SANS}`;
    ctx.fillText('微 缩 生 态 · 财 务 工 作 台', w - 74, h / 2 + 10);
    ctx.fillStyle = goldGradient(ctx, w - 300, 0, w, 0);
    ctx.font = `400 19px ${SERIF}`;
    ctx.fillText('NO. 07', w - 74, h / 2 + 52);
  });
}

export function makeVerticalSignTexture() {
  return canvasTexture(420, 1400, (ctx, w, h) => {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#f6e9c9');
    bg.addColorStop(0.45, '#efdfb7');
    bg.addColorStop(1, '#dcc395');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(88,68,36,.55)';
    ctx.lineWidth = 5;
    ctx.strokeRect(16, 16, w - 32, h - 32);
    ctx.strokeStyle = 'rgba(120,92,45,.28)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#45361d';
    ctx.font = `600 44px ${SERIF}`;
    spacedText(ctx, 'G O O D W O R K', 30, 112, 0);

    ctx.font = `500 146px ${CJK_SERIF}`;
    const chars = ['古', '德', '車', '房'];
    chars.forEach((ch, i) => {
      ctx.fillStyle = i === 1 ? '#8d6a2c' : '#3a2c15';
      ctx.fillText(ch, w / 2, 290 + i * 200);
    });

    ctx.font = `400 22px ${SANS}`;
    ctx.fillStyle = 'rgba(58,44,21,.6)';
    spacedText(ctx, 'AUTOMOTIVE', 94, 1185, 0);
    spacedText(ctx, 'FINANCE  OS', 96, 1225, 0);

    ctx.strokeStyle = 'rgba(70,53,27,.35)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(w / 2, 1120); ctx.lineTo(w / 2, 1150); ctx.stroke();
    ctx.beginPath(); ctx.arc(w / 2, 1250, 42, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#3a2c15';
    ctx.font = `500 42px ${SERIF}`;
    ctx.fillText('G', w / 2, 1252);

    // 灯箱前侧竖条
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.fillRect(0, 0, 18, h);
    ctx.fillStyle = 'rgba(88,68,36,.15)';
    ctx.fillRect(w - 14, 0, 14, h);
  });
}

export function makeBladeSignTexture() {
  return canvasTexture(1024, 560, (ctx, w, h) => {
    ctx.fillStyle = '#0b0f15';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(216,180,119,.55)';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, w - 24, h - 24);
    ctx.strokeStyle = 'rgba(216,180,119,.18)';
    ctx.lineWidth = 1;
    ctx.strokeRect(28, 28, w - 56, h - 56);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = goldGradient(ctx, 70, 80, 950, 300);
    ctx.font = `500 118px ${SERIF}`;
    spacedText(ctx, 'GOODWORK', 66, 175, 8);

    ctx.fillStyle = 'rgba(236,222,195,.92)';
    ctx.font = `500 62px ${CJK_SERIF}`;
    spacedText(ctx, '古德車房', 70, 300, 20);

    ctx.fillStyle = 'rgba(180,195,214,.55)';
    ctx.font = `400 24px ${SANS}`;
    ctx.fillText('MICRO WORLD / FINANCE ATELIER', 70, 400);

    // 右箭头
    ctx.strokeStyle = goldGradient(ctx, 800, 300, 980, 420);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(810, 355); ctx.lineTo(930, 355);
    ctx.moveTo(890, 320); ctx.lineTo(930, 355); ctx.lineTo(890, 390);
    ctx.stroke();
  });
}

export function makeBuildingSignTexture(titleCn, titleEn, kicker = 'GOODWORK') {
  return canvasTexture(1024, 360, (ctx, w, h) => {
    ctx.fillStyle = '#0a0d12';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(216,180,119,.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, w - 16, h - 16);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(216,180,119,.66)';
    ctx.font = `400 23px ${SANS}`;
    spacedText(ctx, kicker, w / 2 - (kicker.length * 13.5), 72, 13);
    ctx.fillStyle = goldGradient(ctx, 100, 120, 900, 260);
    ctx.font = `500 86px ${CJK_SERIF}`;
    spacedText(ctx, titleCn, w / 2 - (titleCn.length * 43), 188, 44);
    ctx.fillStyle = 'rgba(220,230,244,.5)';
    ctx.font = `400 25px ${SERIF}`;
    spacedText(ctx, titleEn, w / 2 - (titleEn.length * 9.5), 288, 9);
  });
}

export function makeStreetPlaqueTexture() {
  return canvasTexture(1024, 260, (ctx, w, h) => {
    ctx.fillStyle = '#e8dcc2';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(62,48,22,.5)';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, w - 24, h - 24);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#3d2f18';
    ctx.font = `500 84px ${SERIF}`;
    spacedText(ctx, 'GOODWORK', w / 2 - 215, 100, 10);
    ctx.font = `500 50px ${CJK_SERIF}`;
    spacedText(ctx, '古德車房 · 微缩生态 No.07', w / 2 - 292, 190, 8);
  });
}

export function makeTicketSignTexture() {
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#101720';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(216,180,119,.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'rgba(216,180,119,.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(196, 92, 120, 150, 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(214, 140); ctx.lineTo(298, 140);
    ctx.moveTo(214, 172); ctx.lineTo(280, 172);
    ctx.moveTo(214, 204); ctx.lineTo(298, 204);
    ctx.stroke();
    ctx.fillStyle = '#f1e4c8';
    ctx.font = `600 48px ${CJK_SERIF}`;
    ctx.fillText('票据箱', w / 2, 322);
    ctx.fillStyle = 'rgba(216,180,119,.7)';
    ctx.font = `400 24px ${SANS}`;
    ctx.fillText('TICKET  COLLECTOR', w / 2, 380);
    ctx.fillStyle = 'rgba(160,180,205,.4)';
    ctx.font = `400 17px ${SANS}`;
    ctx.fillText('GW · FINANCE OS', w / 2, 430);
  });
}

export function makeTerminalScreenTexture() {
  return canvasTexture(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#071019';
    ctx.fillRect(0, 0, w, h);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(56,110,140,.24)');
    g.addColorStop(1, 'rgba(6,20,30,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(216,180,119,.18)';
    ctx.lineWidth = 1;
    for (let y = 80; y < h; y += 64) {
      ctx.beginPath(); ctx.moveTo(56, y); ctx.lineTo(w - 56, y); ctx.stroke();
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(216,180,119,.85)';
    ctx.font = `400 26px ${SANS}`;
    ctx.fillText('GOODWORK · FINANCE OS', 62, 60);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(143,199,163,.85)';
    ctx.fillText('● ONLINE', w - 62, 60);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#e9f0f9';
    ctx.font = `500 66px ${CJK_SERIF}`;
    ctx.fillText('审批终端', 62, 178);
    ctx.fillStyle = 'rgba(160,180,205,.52)';
    ctx.font = `400 21px ${SANS}`;
    ctx.fillText('APPROVAL TERMINAL / NODE 07', 64, 232);

    ctx.strokeStyle = 'rgba(143,199,163,.7)';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(200, 460, 105, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(145, 462); ctx.lineTo(188, 510); ctx.lineTo(262, 408);
    ctx.stroke();
    ctx.fillStyle = 'rgba(143,199,163,.9)';
    ctx.font = `500 28px ${SANS}`;
    ctx.fillText('READY TO APPROVE', 350, 440);
    ctx.fillStyle = 'rgba(143,199,163,.45)';
    ctx.font = `400 20px ${SANS}`;
    ctx.fillText('等待待审批单据接入', 350, 484);

    ctx.fillStyle = 'rgba(160,180,205,.14)';
    ctx.fillRect(62, 640, w - 124, 148);
    ctx.fillStyle = 'rgba(216,180,119,.6)';
    ctx.font = `400 20px ${SANS}`;
    ctx.fillText('TODAY  /  2026.11.22', 84, 676);
    ctx.fillStyle = '#dfe8f2';
    ctx.font = `500 34px ${SANS}`;
    ctx.fillText('额度校验 · 票据完整性 · 部门预算', 84, 732);

    ctx.fillStyle = 'rgba(120,170,150,.14)';
    ctx.fillRect(62, 830, w - 124, 92);
    ctx.fillStyle = 'rgba(143,199,163,.75)';
    ctx.font = `400 22px ${SANS}`;
    ctx.fillText('SYS / ALL CHECKS PASSED', 84, 878);
  });
}

export function makeInteriorScreenTexture() {
  return canvasTexture(1024, 640, (ctx, w, h) => {
    ctx.fillStyle = '#071019';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(216,180,119,.16)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(216,180,119,.68)';
    ctx.font = `400 24px ${SANS}`;
    ctx.fillText('GOODWORK FINANCE OS', 40, 50);
    ctx.fillStyle = '#eef3fa';
    ctx.font = `500 58px ${CJK_SERIF}`;
    ctx.fillText('今日经营看板', 40, 140);
    ctx.fillStyle = 'rgba(150,175,205,.5)';
    ctx.font = `400 18px ${SANS}`;
    ctx.fillText('LIVE WORKBENCH / 微缩生态节点', 42, 188);

    const bars = [0.42, 0.6, 0.52, 0.75, 0.64, 0.92, 0.8];
    bars.forEach((v, i) => {
      const x = 60 + i * 92;
      const bh = v * 230;
      const g = ctx.createLinearGradient(0, 500 - bh, 0, 500);
      g.addColorStop(0, 'rgba(216,180,119,.72)');
      g.addColorStop(1, 'rgba(216,180,119,.08)');
      ctx.fillStyle = g;
      ctx.fillRect(x, 500 - bh, 38, bh);
    });
    ctx.fillStyle = 'rgba(143,199,163,.75)';
    ctx.font = `400 20px ${SANS}`;
    ctx.fillText('REIMBURSEMENT FLOW  ↑ 18.4%', 60, 560);
    ctx.strokeStyle = 'rgba(143,199,163,.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const x = 700 + i * 36;
      const y = 380 - Math.sin(i * 1.2) * 40 - i * 9;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
}

/* ------------------------------------------------------------------ */
/* 车位牌 / 车身 / 地面铜章                                            */
/* ------------------------------------------------------------------ */

export function makeParkingSignTexture() {
  return canvasTexture(512, 640, (ctx, w, h) => {
    ctx.fillStyle = '#101a2a';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(216,180,119,.65)';
    ctx.lineWidth = 5;
    ctx.strokeRect(12, 12, w - 24, h - 24);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(216,180,119,.8)';
    ctx.font = `400 22px ${SANS}`;
    spacedText(ctx, 'GOODWORK PARKING', w / 2 - 145, 66, 8);
    ctx.fillStyle = goldGradient(ctx, 100, 120, 400, 400);
    ctx.font = `600 286px ${SERIF}`;
    ctx.fillText('P', w / 2, 318);
    ctx.strokeStyle = 'rgba(216,180,119,.5)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(70, 470); ctx.lineTo(w - 70, 470); ctx.stroke();
    ctx.fillStyle = '#e8eef8';
    ctx.font = `500 42px ${CJK_SERIF}`;
    ctx.fillText('访客车位', w / 2, 522);
    ctx.fillStyle = 'rgba(160,180,205,.65)';
    ctx.font = `400 19px ${SANS}`;
    ctx.fillText('VISITOR  PARKING  ·  NO. 07', w / 2, 570);
    ctx.strokeStyle = goldGradient(ctx, 200, 600, 310, 630);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(180, 608); ctx.lineTo(320, 608);
    ctx.moveTo(294, 590); ctx.lineTo(320, 608); ctx.lineTo(294, 626);
    ctx.stroke();
  });
}

export function makeVanSideTexture() {
  return canvasTexture(1024, 512, (ctx, w, h) => {
    ctx.fillStyle = '#ddd2bc';
    ctx.fillRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(255,255,255,.3)');
    grad.addColorStop(1, 'rgba(80,70,52,.18)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#182131';
    ctx.fillRect(0, h * 0.57, w, h * 0.17);
    ctx.fillStyle = goldGradient(ctx, 60, 80, 620, 260);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `500 96px ${SERIF}`;
    spacedText(ctx, 'GOODWORK', 66, 165, 8);
    ctx.fillStyle = '#2b261c';
    ctx.font = `600 74px ${CJK_SERIF}`;
    spacedText(ctx, '古德車房', 70, 268, 16);
    ctx.fillStyle = 'rgba(40,42,48,.65)';
    ctx.font = `400 24px ${SANS}`;
    spacedText(ctx, 'FINANCE  ·  LOGISTICS  ·  MICRO WORLD 07', 70, 336, 3);
    ctx.fillStyle = 'rgba(216,180,119,.85)';
    ctx.fillRect(70, 380, 420, 3);
    // 右侧徽记
    ctx.strokeStyle = 'rgba(160,120,55,.7)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(852, 256, 92, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(852, 256, 78, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(60,46,20,.75)';
    ctx.textAlign = 'center';
    ctx.font = `500 88px ${SERIF}`;
    ctx.fillText('G', 852, 262);
    ctx.fillStyle = 'rgba(60,46,20,.55)';
    ctx.font = `400 17px ${SANS}`;
    ctx.fillText('EST. 2018', 852, 360);
  });
}

export function makeMedallionTexture() {
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w / 2);
    g.addColorStop(0, 'rgba(28,35,44,.0)');
    g.addColorStop(0.62, 'rgba(216,180,119,.055)');
    g.addColorStop(0.9, 'rgba(216,180,119,.16)');
    g.addColorStop(1, 'rgba(216,180,119,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(216,180,119,.55)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, w * 0.43, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, w * 0.39, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(232,209,163,.86)';
    ctx.font = `500 138px ${SERIF}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('G', cx, cy - 10);
    ctx.fillStyle = 'rgba(216,180,119,.62)';
    ctx.font = `400 18px ${SANS}`;
    spacedText(ctx, 'GOODWORK  ·  NO. 07', cx - 128, cy + 105, 4);
  });
}

/* ------------------------------------------------------------------ */
/* 远景行星                                                            */
/* ------------------------------------------------------------------ */

export function makePlanetTexture() {
  const noise = makeNoise2D(404);
  return canvasTexture(1024, 512, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0b1220');
    g.addColorStop(0.28, '#17243a');
    g.addColorStop(0.52, '#243650');
    g.addColorStop(0.72, '#151f31');
    g.addColorStop(1, '#060a12');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 3) {
      const v = noise(y * 0.05, 2.4) * 0.5 + noise(y * 0.18, 5.1) * 0.5;
      const alpha = 0.055 + v * 0.05;
      ctx.fillStyle = v > 0.1 ? `rgba(116,148,190,${alpha})` : `rgba(50,70,110,${alpha * 0.9})`;
      ctx.fillRect(0, y, w, 2.5);
    }
    // 涡旋风暴
    ctx.save();
    ctx.translate(w * 0.62, h * 0.58);
    ctx.scale(1, 0.42);
    for (let i = 6; i > 0; i--) {
      ctx.strokeStyle = `rgba(176,196,226,${0.03 + i * 0.012})`;
      ctx.lineWidth = 3 + i * 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, i * 14, 0.2, Math.PI * 1.55);
      ctx.stroke();
    }
    ctx.restore();
    // 暗面
    const shadow = ctx.createRadialGradient(w * 0.28, h * 0.44, 0, w * 0.3, h * 0.5, w * 0.65);
    shadow.addColorStop(0, 'rgba(255,255,255,0)');
    shadow.addColorStop(0.56, 'rgba(2,4,8,.15)');
    shadow.addColorStop(1, 'rgba(0,0,0,.9)');
    ctx.fillStyle = shadow;
    ctx.fillRect(0, 0, w, h);
  });
}

/* ------------------------------------------------------------------ */
/* 软粒子 / 雾                                                         */
/* ------------------------------------------------------------------ */

export function makeGlowTexture() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.22, 'rgba(255,255,255,.72)');
    g.addColorStop(0.55, 'rgba(255,255,255,.16)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

export function makeMistTexture() {
  const noise = makeNoise2D(99);
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const rnd = mulberry32(31);
    for (let i = 0; i < 110; i++) {
      const x = w / 2 + (rnd() - 0.5) * w * 0.7;
      const y = h / 2 + (rnd() - 0.5) * h * 0.55;
      const r = 24 + rnd() * 90;
      const a = 0.018 + rnd() * 0.05;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(232,244,255,${a})`);
      g.addColorStop(1, 'rgba(232,244,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    const vg = ctx.createRadialGradient(w / 2, h / 2, w * 0.12, w / 2, h / 2, w * 0.5);
    vg.addColorStop(0, 'rgba(255,255,255,.18)');
    vg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
    // 打散边缘
    ctx.globalCompositeOperation = 'destination-in';
    const mask = ctx.createRadialGradient(w / 2, h / 2, w * 0.18, w / 2, h / 2, w * 0.5);
    mask.addColorStop(0, 'rgba(255,255,255,1)');
    mask.addColorStop(0.72, 'rgba(255,255,255,.7)');
    mask.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = mask;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    void noise;
  });
}

export function makeCloudTexture() {
  const rnd = mulberry32(12);
  return canvasTexture(512, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 28; i++) {
      const x = w * 0.18 + rnd() * w * 0.64;
      const y = h * 0.52 + (rnd() - 0.5) * h * 0.24;
      const r = 28 + rnd() * 60;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,.5)');
      g.addColorStop(0.55, 'rgba(245,248,255,.2)');
      g.addColorStop(1, 'rgba(240,246,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  });
}

export function makeBokehTexture() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,.18)');
    g.addColorStop(0.62, 'rgba(255,255,255,.26)');
    g.addColorStop(0.86, 'rgba(255,255,255,.08)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,.22)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w * 0.34, 0, Math.PI * 2);
    ctx.stroke();
  });
}

/* ------------------------------------------------------------------ */
/* 车牌 / 小标识                                                       */
/* ------------------------------------------------------------------ */

export function makePlateTexture(text = 'GOODWORK 07') {
  return canvasTexture(512, 128, (ctx, w, h) => {
    ctx.fillStyle = '#12171e';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(216,180,119,.55)';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, w - 12, h - 12);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e9d8b3';
    ctx.font = `500 45px ${SERIF}`;
    spacedText(ctx, text, w / 2 - text.length * 14, h / 2, 4);
  });
}
