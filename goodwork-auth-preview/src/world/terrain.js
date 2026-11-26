/**
 * 岛屿地形数学：高度、河流、湖泊、瀑布、建筑用地
 * 所有摆放与导航均引用这里的统一数据，保证模型贴合地面。
 */
import * as THREE from 'three';
import { makeNoise2D, smoothstep, lerp, clamp } from '../core/utils.js';
import { WORLD } from '../core/config.js';

const noise = makeNoise2D(1947);

export const ISLAND = {
  rx: WORLD.island.rx,
  rz: WORLD.island.rz,
  baseY: WORLD.island.baseY,
  cliffBottom: WORLD.island.cliffBottom,
};

export const WATER_Y = 0.36;
export const PLAZA_Y = 0.845;

export const PLAZA = {
  cx: 0.05,
  cz: 2.15,
  hx: 5.2,
  hz: 5.15,
};

export const ROAD = {
  cx: 0.05,
  cz: 6.55,
  rx: 4.7,
  rz: 1.3,
  width: 0.95,
  y: PLAZA_Y + 0.035,
};

export const LAKE = {
  x: 7.0,
  z: 3.0,
  r: 1.55,
  outletX: 10.0,
  waterfallTop: WATER_Y,
  waterfallBottom: -5.05,
};

export const BUILDINGS = {
  garage: { x: -0.1, z: 0.55, w: 8.6, d: 6.35, rot: 0 },
  finance: { x: 7.05, z: -2.75, w: 3.55, d: 3.2, rot: -0.08 },
  warehouse: { x: -7.15, z: -1.55, w: 4.1, d: 3.25, rot: 0.1 },
  dorm: { x: -7.25, z: 3.75, w: 3.6, d: 3.15, rot: -0.06 },
};

/** 不规则岛屿边界半径倍率 */
export function boundaryScale(theta) {
  return 1 + Math.sin(theta * 3 + 1.15) * 0.043
    + Math.sin(theta * 7 - 0.6) * 0.026
    + Math.sin(theta * 11 + 2.1) * 0.017
    + noise(Math.cos(theta) * 2.4 + 3, Math.sin(theta) * 2.4 - 1) * 0.02;
}

export function boundaryPoint(theta, inset = 0) {
  const s = boundaryScale(theta) - inset;
  return {
    x: Math.cos(theta) * ISLAND.rx * s,
    z: Math.sin(theta) * ISLAND.rz * s,
  };
}

/** 世界坐标是否在岛屿内（margin 为正时收缩） */
export function isOnIsland(x, z, margin = 0) {
  const s = boundaryScale(Math.atan2(z / ISLAND.rz, x / ISLAND.rx));
  const rx = ISLAND.rx * s - margin;
  const rz = ISLAND.rz * s - margin;
  return (x * x) / (rx * rx) + (z * z) / (rz * rz) <= 1;
}

/* ---------------- 河流 ---------------- */

const riverControl = [
  [-3.75, -4.55],
  [-2.15, -4.95],
  [0.25, -4.55],
  [2.2, -3.9],
  [3.7, -2.9],
  [4.9, -1.8],
  [5.6, -0.55],
  [6.05, 0.65],
  [6.35, 1.65],
].map(([x, z]) => new THREE.Vector3(x, 0, z));

export const riverCurve = new THREE.CatmullRomCurve3(riverControl, false, 'catmullrom', 0.45);
export const riverPoints = riverCurve.getPoints(56);

export function distanceToRiver(x, z) {
  let best = Infinity;
  for (let i = 0; i < riverPoints.length - 1; i++) {
    const a = riverPoints[i], b = riverPoints[i + 1];
    const abx = b.x - a.x, abz = b.z - a.z;
    const apx = x - a.x, apz = z - a.z;
    const t = clamp((apx * abx + apz * abz) / (abx * abx + abz * abz), 0, 1);
    const dx = apx - abx * t, dz = apz - abz * t;
    const d = dx * dx + dz * dz;
    if (d < best) best = d;
  }
  return Math.sqrt(best);
}

export function distanceToLake(x, z) {
  const p = outletDistance(x, z);
  return Math.min(
    Math.hypot(x - LAKE.x, z - LAKE.z) - LAKE.r,
    p
  );
}

function outletDistance(x, z) {
  // 湖 → 瀑布的短出水口，视作条形水体
  const ax = LAKE.x + LAKE.r * 0.6, az = LAKE.z;
  const bx = LAKE.outletX, bz = LAKE.z;
  const abx = bx - ax, abz = 0;
  const t = clamp((x - ax) / abx, 0, 1);
  const dx = x - (ax + abx * t), dz = z - az;
  return Math.hypot(dx, dz) - 0.46;
}

export function isWater(x, z) {
  return distanceToRiver(x, z) < 0.52 || distanceToLake(x, z) < 0.15;
}

/* ---------------- 高度场 ---------------- */

function plazaMask(x, z) {
  const dx = Math.max(Math.abs(x - PLAZA.cx) - PLAZA.hx, 0);
  const dz = Math.max(Math.abs(z - PLAZA.cz) - PLAZA.hz, 0);
  const d = Math.hypot(dx, dz);
  return 1 - smoothstep(0, 2.3, d);
}

function mound(x, z, cx, cz, radius, height) {
  const d2 = (x - cx) ** 2 + (z - cz) ** 2;
  return height * Math.exp(-d2 / (radius * radius * 2.4));
}

/** 地表高度（含河流/湖泊下切与广场整平） */
export function heightAt(x, z) {
  let h = ISLAND.baseY;
  h += noise.fbm(x * 0.17 + 3.2, z * 0.17 - 1.4, 3) * 0.30;
  h += noise(x * 0.56, z * 0.56) * 0.10;
  h += noise(x * 1.35 + 8, z * 1.35 - 5) * 0.035;

  // 雪山基座
  h += mound(x, z, -5.0, -4.6, 3.6, 1.8);
  h += mound(x, z, -2.8, -3.8, 2.3, 0.55);
  // 森林缓丘
  h += mound(x, z, 4.3, -4.9, 2.6, 0.36);
  h += mound(x, z, -7.8, 2.9, 2.3, 0.18);
  h += mound(x, z, 6.2, -1.2, 2.0, 0.22);

  // 建筑前广场整平
  const plaza = plazaMask(x, z);
  h = lerp(h, PLAZA_Y, plaza * 0.97);

  // 河流河床
  const dr = distanceToRiver(x, z);
  const bankK = 1 - smoothstep(0.35, 1.85, dr);
  const bed = WATER_Y - 0.24 + noise(x * 2.7, z * 2.7) * 0.025;
  h = lerp(h, Math.min(h, bed), bankK);

  // 湖泊与出水口
  const dl = distanceToLake(x, z);
  const lakeK = 1 - smoothstep(0.0, 1.3, dl);
  const lakeBed = WATER_Y - 0.42 + noise(x * 1.9 + 3, z * 1.9) * 0.05;
  h = lerp(h, Math.min(h, lakeBed), lakeK);

  // 岛屿边缘轻微收坡
  const rim = (x * x) / (ISLAND.rx * ISLAND.rx) + (z * z) / (ISLAND.rz * ISLAND.rz);
  if (rim > 0.88) {
    h -= smoothstep(0.88, 1.02, rim) * 0.30;
  }
  return h;
}

export function slopeAt(x, z) {
  const e = 0.22;
  const hx = heightAt(x + e, z) - heightAt(x - e, z);
  const hz = heightAt(x, z + e) - heightAt(x, z - e);
  return Math.hypot(hx, hz) / (2 * e);
}

/* ---------------- 用地 / 障碍 ---------------- */

export const BUILDING_RECTS = [
  { id: 'garage', ...BUILDINGS.garage },
  { id: 'finance', ...BUILDINGS.finance },
  { id: 'warehouse', ...BUILDINGS.warehouse },
  { id: 'dorm', ...BUILDINGS.dorm },
];

export function insideBuildingRect(x, z, pad = 0) {
  for (const b of BUILDING_RECTS) {
    if (Math.abs(x - b.x) < b.w / 2 + pad && Math.abs(z - b.z) < b.d / 2 + pad) return b.id;
  }
  return null;
}

/** NPC 网格障碍：建筑、水域、山体、道路中央隔离带 */
export function isBlockedForWalk(x, z) {
  if (!isOnIsland(x, z, 0.55)) return true;
  if (insideBuildingRect(x, z, 0.42)) return true;
  if (distanceToRiver(x, z) < 0.72) return true;
  if (distanceToLake(x, z) < 0.35) return true;
  if (Math.hypot(x + 5.0, z + 4.6) < 3.2) return true; // 雪山
  if (Math.hypot(x - 0.05, z - 6.55) < 0.9) return true; // 环岛内花坛
  return false;
}

/** 地面物件默认高度 */
export function groundY(x, z) {
  return heightAt(x, z);
}

export { noise as terrainNoise };

export const SNOW_MOUNTAIN = {
  x: -5.0,
  z: -4.6,
  height: 7.2,
  baseRadius: 3.6,
};

export const CAMERA_FOCUS_TARGET = new THREE.Vector3(0, 2.1, 0.9);
