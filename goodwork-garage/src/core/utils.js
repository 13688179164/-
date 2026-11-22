/**
 * 通用数学 / 缓动 / 事件 / 补间工具
 */

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, v) => (v - a) / (b - a);
export const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
export const damp = (current, target, lambda, dt) => lerp(current, target, 1 - Math.exp(-lambda * dt));

export const Ease = {
  linear: (t) => t,
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutQuint: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
  outQuint: (t) => 1 - Math.pow(1 - t, 5),
  outBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  outExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};

/** 带种子的确定性随机，保证每次生成的岛屿一致 */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 值噪声 + 分形，用于地形与材质纹理 */
export function makeNoise2D(seed = 7) {
  const rnd = mulberry32(seed);
  const perm = new Uint8Array(512);
  const grad = new Float32Array(256);
  for (let i = 0; i < 256; i++) { perm[i] = i; grad[i] = rnd() * 2 - 1; }
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = perm[i]; perm[i] = perm[j]; perm[j] = t;
  }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

  const valueAt = (xi, yi) => grad[perm[(perm[xi & 255] + (yi & 255)) & 255]];

  function noise(x, y) {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const fx = x - x0, fy = y - y0;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const a = valueAt(x0, y0), b = valueAt(x0 + 1, y0);
    const c = valueAt(x0, y0 + 1), d = valueAt(x0 + 1, y0 + 1);
    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }

  noise.fbm = (x, y, octaves = 4, lac = 2.03, gain = 0.5) => {
    let amp = 1, freq = 1, sum = 0, norm = 0;
    for (let i = 0; i < octaves; i++) {
      sum += noise(x * freq, y * freq) * amp;
      norm += amp;
      amp *= gain; freq *= lac;
    }
    return sum / norm;
  };
  return noise;
}

/** 轻量事件总线 */
export function createEmitter() {
  const map = new Map();
  return {
    on(evt, fn) {
      if (!map.has(evt)) map.set(evt, new Set());
      map.get(evt).add(fn);
      return () => map.get(evt)?.delete(fn);
    },
    emit(evt, payload) {
      map.get(evt)?.forEach((fn) => fn(payload));
    },
  };
}

export const bus = createEmitter();

/** 简易补间管理器，用于三阶段运镜等 */
export class Tweens {
  constructor() { this.list = []; }
  add({ duration = 1, delay = 0, ease = Ease.inOutCubic, onUpdate, onComplete }) {
    const t = { duration, delay, ease, onUpdate, onComplete, t: -delay, dead: false };
    this.list.push(t);
    return {
      cancel: () => { t.dead = true; },
    };
  }
  update(dt) {
    for (const t of this.list) {
      if (t.dead) continue;
      t.t += dt;
      if (t.t < 0) continue;
      const k = clamp(t.t / t.duration, 0, 1);
      t.onUpdate?.(t.ease(k), k);
      if (k >= 1) { t.dead = true; t.onComplete?.(); }
    }
    this.list = this.list.filter((t) => !t.dead);
  }
  get busy() { return this.list.length > 0; }
  clear() { this.list.length = 0; }
}

/** 把 hex 颜色转为可插值的通道对象 */
export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

export function rgbToCss({ r, g, b }, alpha = 1) {
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${alpha})`;
}

export function lerpColor(a, b, t) {
  const ca = typeof a === 'string' ? hexToRgb(a) : a;
  const cb = typeof b === 'string' ? hexToRgb(b) : b;
  return {
    r: lerp(ca.r, cb.r, t),
    g: lerp(ca.g, cb.g, t),
    b: lerp(ca.b, cb.b, t),
  };
}

/** 世界坐标投影到屏幕 */
export function toScreen(vec3, camera, width, height, out = { x: 0, y: 0, visible: false }) {
  const v = vec3.clone().project(camera);
  out.x = (v.x * 0.5 + 0.5) * width;
  out.y = (-v.y * 0.5 + 0.5) * height;
  out.visible = v.z > -1 && v.z < 1 && out.x > -80 && out.x < width + 80 && out.y > -80 && out.y < height + 80;
  out.depth = v.z;
  return out;
}

export const formatMoney = (n) =>
  n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatDate = (d = new Date()) => {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export const uid = (prefix = 'GW') => {
  const t = Date.now().toString(36).slice(-5).toUpperCase();
  const r = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${t}${r}`;
};
