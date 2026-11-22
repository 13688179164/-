/**
 * 悬浮岛屿：地形、断崖、雪山、水体、植被、岩石、动物
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { mulberry32, makeNoise2D, clamp, smoothstep } from '../core/utils.js';
import {
  ISLAND, PLAZA_Y, WATER_Y, LAKE, ROAD, SNOW_MOUNTAIN, riverPoints,
  heightAt, boundaryPoint, boundaryScale, isOnIsland, distanceToRiver,
  distanceToLake, insideBuildingRect, riverCurve,
} from './terrain.js';
import { makeGrassTexture } from '../core/textures.js';
import { makeSnowMaterial, makeWaterMaterial, makeWaterfallMaterial } from './materials.js';

const noise = makeNoise2D(338);

/* ------------------------------------------------------------------ */
/* 小工具                                                              */
/* ------------------------------------------------------------------ */

function proxySphere(r, x, y, z, key) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(r, 12, 9),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false })
  );
  mesh.position.set(x, y, z);
  mesh.userData.interactiveKey = key;
  mesh.renderOrder = -1;
  return mesh;
}

function makeRibbonGeometry(points, width, y, uvScale = 1, closed = false) {
  const n = points.length;
  const positions = new Float32Array(n * 2 * 3);
  const uvs = new Float32Array(n * 2 * 2);
  const indices = [];
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const pPrev = points[Math.max(0, i - 1)];
    const pNext = points[Math.min(n - 1, i + 1)];
    tangent.set(pNext.x - pPrev.x, 0, pNext.z - pPrev.z).normalize();
    side.set(-tangent.z, 0, tangent.x);
    const w = width * (0.88 + noise(i * 0.35, 8.2) * 0.16) * 0.5;
    positions[i * 6] = p.x + side.x * w;
    positions[i * 6 + 1] = y;
    positions[i * 6 + 2] = p.z + side.z * w;
    positions[i * 6 + 3] = p.x - side.x * w;
    positions[i * 6 + 4] = y;
    positions[i * 6 + 5] = p.z - side.z * w;
    const u = (i / (n - 1)) * uvScale;
    uvs[i * 4] = u; uvs[i * 4 + 1] = 0;
    uvs[i * 4 + 2] = u; uvs[i * 4 + 3] = 1;
  }
  for (let i = 0; i < n - 1; i++) {
    const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
    indices.push(a, c, b, b, c, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  void closed;
  return geo;
}

function colorLerp(a, b, t) {
  return new THREE.Color(a).lerp(new THREE.Color(b), t);
}

/* ------------------------------------------------------------------ */
/* 主入口                                                              */
/* ------------------------------------------------------------------ */

export function createIsland(scene) {
  const rnd = mulberry32(20481);
  const group = new THREE.Group();
  group.name = 'floating-island';
  scene.add(group);

  const snowMaterial = makeSnowMaterial();
  const walkObstacles = [];
  const pickProxies = [];

  /* ---------------- 地形顶面 ---------------- */

  const RINGS = 60;
  const SEGS = 156;
  const topPositions = [];
  const topUvs = [];
  const topIndices = [];
  for (let r = 0; r <= RINGS; r++) {
    const t = r / RINGS;
    for (let s = 0; s <= SEGS; s++) {
      const theta = (s / SEGS) * Math.PI * 2;
      const b = boundaryScale(theta);
      const edge = 0.985;
      const x = Math.cos(theta) * ISLAND.rx * b * t * edge;
      const z = Math.sin(theta) * ISLAND.rz * b * t * edge;
      let y = heightAt(x, z);
      // 中心点避免多顶点重合的微小抖动
      if (r === 0) y += 0.01;
      topPositions.push(x, y, z);
      topUvs.push(x / 20 + 0.5, z / 16 + 0.5);
    }
  }
  const row = SEGS + 1;
  for (let r = 0; r < RINGS; r++) {
    for (let s = 0; s < SEGS; s++) {
      const a = r * row + s;
      const b = a + 1;
      const c = a + row;
      const d = c + 1;
      topIndices.push(a, b, c, b, d, c);
    }
  }
  const topGeo = new THREE.BufferGeometry();
  topGeo.setAttribute('position', new THREE.Float32BufferAttribute(topPositions, 3));
  topGeo.setAttribute('uv', new THREE.Float32BufferAttribute(topUvs, 2));
  topGeo.setIndex(topIndices);
  topGeo.computeVertexNormals();

  {
    const normals = topGeo.attributes.normal;
    const pos = topGeo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const cGrass1 = new THREE.Color('#5e8e55');
    const cGrass2 = new THREE.Color('#8bb36b');
    const cGrass3 = new THREE.Color('#4a7a47');
    const cRock = new THREE.Color('#6f6b5b');
    const cSand = new THREE.Color('#a99a72');
    const cSnow = new THREE.Color('#e7eef3');
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const n = noise.fbm(x * 0.34 + 2.1, z * 0.34 - 4.3, 3);
      const n2 = noise(x * 1.1, z * 1.1);
      tmp.copy(cGrass1).lerp(cGrass2, clamp(0.5 + n * 0.85, 0, 1));
      if (n2 > 0.18) tmp.lerp(cGrass3, 0.35);
      const slope = 1 - clamp(normals.getY(i), 0, 1);
      if (slope > 0.16) tmp.lerp(cRock, smoothstep(0.16, 0.5, slope) * 0.72);
      const dRiver = distanceToRiver(x, z);
      const dLake = distanceToLake(x, z);
      if (dRiver < 1.55) tmp.lerp(cSand, smoothstep(1.55, 0.55, dRiver) * 0.6);
      if (dLake < 1.5) tmp.lerp(cSand, smoothstep(1.5, 0.1, dLake) * 0.62);
      const mountainD = Math.hypot(x + 5.0, z + 4.6);
      if (mountainD < 3.7 && y > 1.9) {
        tmp.lerp(cRock, smoothstep(1.9, 2.9, y) * 0.72);
        if (y > 2.8) tmp.lerp(cSnow, smoothstep(2.8, 4.0, y) * 0.75);
      }
      // 广场周围草色更细腻
      colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
    }
    topGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }

  const grassTex = makeGrassTexture();
  const terrainMat = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    map: grassTex,
    bumpMap: grassTex,
    bumpScale: 0.025,
    vertexColors: true,
    roughness: 0.94,
    metalness: 0.0,
    envMapIntensity: 0.35,
  });
  const terrain = new THREE.Mesh(topGeo, terrainMat);
  terrain.receiveShadow = true;
  terrain.castShadow = true;
  terrain.name = 'island-top';
  group.add(terrain);

  // 地面雪层（与地形共享几何）
  const snowGround = new THREE.Mesh(topGeo, snowMaterial);
  snowGround.position.y = 0.017;
  snowGround.receiveShadow = false;
  snowGround.visible = false;
  snowGround.renderOrder = 2;
  group.add(snowGround);
  snowMaterial.map = grassTex;
  snowMaterial.bumpMap = grassTex;
  snowMaterial.bumpScale = 0.018;
  snowMaterial.color.set('#f3f8fc');

  /* ---------------- 断崖与岩层 ---------------- */

  const bandOffsets = [0, -0.5, -1.18, -2.0, -2.9, -3.85, -4.7];
  const bandScales = [1.0, 0.987, 0.945, 0.87, 0.72, 0.48, 0.2];
  const cliffPositions = [];
  const cliffColors = [];
  const cliffIndices = [];
  const cliffRow = SEGS + 1;
  const bandCount = bandOffsets.length;
  const topBandColors = [
    new THREE.Color('#4a412d'), new THREE.Color('#39342a'), new THREE.Color('#453b2c'),
    new THREE.Color('#3a332b'), new THREE.Color('#302e2a'), new THREE.Color('#292826'), new THREE.Color('#232322'),
  ];
  for (let b = 0; b < bandCount; b++) {
    for (let s = 0; s <= SEGS; s++) {
      const theta = (s / SEGS) * Math.PI * 2;
      const bp = boundaryPoint(theta);
      const yTop = heightAt(bp.x * 0.985, bp.z * 0.985);
      const jitter = noise(theta * 7.2 + b * 1.3, b * 2.7);
      const stretch = 1 + jitter * 0.055;
      const x = bp.x * bandScales[b] * stretch;
      const z = bp.z * bandScales[b] * stretch;
      let y = yTop + bandOffsets[b] * (0.92 + jitter * 0.14);
      // 岩层起伏
      y += Math.sin(theta * 9 + b * 0.7) * (b > 0 ? 0.1 : 0.02);
      cliffPositions.push(x, y, z);
      const base = topBandColors[b];
      const strata = 0.82 + noise(theta * 4.2, b * 5.1) * 0.36;
      const warm = b === 2 || b === 3 ? 0.1 : 0;
      cliffColors.push(
        clamp(base.r * strata + warm, 0, 1),
        clamp(base.g * strata + warm * 0.7, 0, 1),
        clamp(base.b * strata + warm * 0.4, 0, 1)
      );
    }
  }
  for (let b = 0; b < bandCount - 1; b++) {
    for (let s = 0; s < SEGS; s++) {
      const a = b * cliffRow + s;
      const bb = a + 1;
      const c = a + cliffRow;
      const d = c + 1;
      cliffIndices.push(a, c, bb, bb, c, d);
    }
  }
  // 底部收拢
  const tipIndex = cliffPositions.length / 3;
  cliffPositions.push(1.2, ISLAND.cliffBottom - 0.85, -0.6);
  cliffColors.push(0.1, 0.1, 0.095);
  for (let s = 0; s < SEGS; s++) {
    const a = (bandCount - 1) * cliffRow + s;
    const bb = a + 1;
    cliffIndices.push(a, tipIndex, bb);
  }
  const cliffGeo = new THREE.BufferGeometry();
  cliffGeo.setAttribute('position', new THREE.Float32BufferAttribute(cliffPositions, 3));
  cliffGeo.setAttribute('color', new THREE.Float32BufferAttribute(cliffColors, 3));
  cliffGeo.setIndex(cliffIndices);
  cliffGeo.computeVertexNormals();
  const cliffMat = new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 0.97, metalness: 0.02,
    flatShading: true, envMapIntensity: 0.28,
  });
  const cliff = new THREE.Mesh(cliffGeo, cliffMat);
  cliff.castShadow = true;
  cliff.receiveShadow = true;
  group.add(cliff);

  // 悬挂根系
  const rootGeos = [];
  const rootMat = new THREE.MeshStandardMaterial({ color: '#3b2c1e', roughness: 0.95, metalness: 0.02 });
  for (let i = 0; i < 11; i++) {
    const theta = (i / 11) * Math.PI * 2 + rnd() * 0.3;
    const bp = boundaryPoint(theta);
    const start = new THREE.Vector3(bp.x * 1.01, heightAt(bp.x * 0.98, bp.z * 0.98) - 0.3, bp.z * 1.01);
    const mid = new THREE.Vector3(
      start.x * 0.9 + (rnd() - 0.5) * 1.2,
      start.y - 1.4 - rnd() * 1.6,
      start.z * 0.9 + (rnd() - 0.5) * 1.2
    );
    const end = new THREE.Vector3(
      start.x * 0.55 + (rnd() - 0.5) * 1.5,
      start.y - 3.4 - rnd() * 2.2,
      start.z * 0.55 + (rnd() - 0.5) * 1.5
    );
    const curve = new THREE.CatmullRomCurve3([start, mid, end]);
    const tube = new THREE.TubeGeometry(curve, 10, 0.018 + rnd() * 0.022, 4, false);
    rootGeos.push(tube);
  }
  const roots = new THREE.Mesh(mergeGeometries(rootGeos), rootMat);
  roots.castShadow = false;
  group.add(roots);

  // 岛底碎岩
  const underRockGeo = new THREE.DodecahedronGeometry(1, 0);
  const underRockMat = new THREE.MeshStandardMaterial({ color: '#433d34', roughness: 0.96, flatShading: true });
  const underRocks = new THREE.InstancedMesh(underRockGeo, underRockMat, 16);
  {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 16; i++) {
      const theta = rnd() * Math.PI * 2;
      const bp = boundaryPoint(theta);
      dummy.position.set(bp.x * (0.5 + rnd() * 0.5), -3.2 - rnd() * 2.2, bp.z * (0.5 + rnd() * 0.5));
      dummy.scale.set(0.12 + rnd() * 0.3, 0.1 + rnd() * 0.22, 0.12 + rnd() * 0.3);
      dummy.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
      dummy.updateMatrix();
      underRocks.setMatrixAt(i, dummy.matrix);
    }
  }
  group.add(underRocks);

  /* ---------------- 雪山 ---------------- */

  const mountainMat = new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 0.9, metalness: 0.02,
    envMapIntensity: 0.3, flatShading: true,
  });

  function createMountainMassif(cx, cz) {
    const RAD = 3.6;
    const RINGS = 26;
    const SEG = 96;
    const peaksLocal = [
      { x: 0.0, z: -0.2, h: 6.2, s: 1.9 },
      { x: -1.55, z: 0.35, h: 5.5, s: 1.5 },
      { x: 1.5, z: -0.4, h: 4.8, s: 1.35 },
      { x: 0.55, z: 1.35, h: 3.8, s: 1.1 },
      { x: -0.6, z: -1.4, h: 3.2, s: 1.0 },
    ];
    const worldPos = [];
    const heightsAbove = [];
    const positions = [];
    const uvs = [];
    const indices = [];
    for (let r = 0; r <= RINGS; r++) {
      const rf = r / RINGS;
      for (let s = 0; s <= SEG; s++) {
        const a = (s / SEG) * Math.PI * 2.0;
        const boundary = 1 + Math.sin(a * 3.1 + 0.8) * 0.045 + Math.sin(a * 6.7 - 1.2) * 0.03 + Math.sin(a * 11.3 + 2.2) * 0.018;
        const radius = RAD * rf * boundary;
        const lx = Math.cos(a) * radius;
        const lz = Math.sin(a) * radius;
        const wx = cx + lx;
        const wz = cz + lz;
        let m = 0;
        for (const p of peaksLocal) {
          const d2 = (lx - p.x) ** 2 + (lz - p.z) ** 2;
          const g = p.h * Math.exp(-d2 / (2 * p.s * p.s));
          m = Math.max(m, g);
          m += g * 0.24;
        }
        const ridge = 1 - Math.abs(noise(lx * 1.55 + 6.2, lz * 1.55 - 2.3));
        const ridgeFine = 1 - Math.abs(noise(lx * 3.4 - 2.1, lz * 3.4 + 5.4));
        m *= 0.8 + ridge * 0.26;
        m += ridgeFine * 0.32 * smoothstep(0.6, 3.2, m) * (1 - rf);
        m += noise(lx * 4.2 + 3, lz * 4.2 - 7) * 0.17 * (1 - rf) * smoothstep(0.4, 2.4, m);
        m *= 1 - smoothstep(RAD * 0.63, RAD * 0.99, radius);
        const base = heightAt(wx, wz);
        const y = base + m - 0.05;
        positions.push(wx, y, wz);
        uvs.push(wx / 9 + 0.5, wz / 9 + 0.5);
        worldPos.push([wx, wz]);
        heightsAbove.push(m);
      }
    }
    for (let r = 0; r < RINGS; r++) {
      for (let s = 0; s < SEG; s++) {
        const a = r * (SEG + 1) + s;
        const b = a + 1;
        const c = a + SEG + 1;
        const d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    const normals = geo.attributes.normal;
    const colors = new Float32Array(positions.length);
    const rockDark = new THREE.Color('#353b3f');
    const rockLight = new THREE.Color('#8c8d86');
    const snowLight = new THREE.Color('#f5fafc');
    const snowShadow = new THREE.Color('#b3c8da');
    const grass = new THREE.Color('#50784b');
    const tmp = new THREE.Color();
    for (let i = 0; i < heightsAbove.length; i++) {
      const m = heightsAbove[i];
      const wx = worldPos[i][0];
      const wz = worldPos[i][1];
      const slope = 1 - clamp(normals.getY(i), 0, 1);
      const grain = noise(wx * 2.5, wz * 2.5) * 0.5 + 0.5;
      const grain2 = noise(wx * 0.9 + 4, wz * 0.9 - 2) * 0.5 + 0.5;
      const grain3 = noise(wx * 6.4 - 3, wz * 6.4 + 7) * 0.5 + 0.5;
      const t = clamp(m / 7.0, 0, 1);
      tmp.copy(rockDark).lerp(rockLight, grain * 0.78 + 0.1);
      if (slope > 0.32) tmp.lerp(rockDark, smoothstep(0.32, 0.9, slope) * 0.7);
      if (grain3 > 0.62) tmp.multiplyScalar(0.86);
      let snowMask = smoothstep(0.36, 0.58, t + grain2 * 0.18) * (1 - smoothstep(0.4, 0.82, slope) * 0.9);
      if (grain3 < 0.22) snowMask *= 0.35;
      const snowCol = snowShadow.clone().lerp(snowLight, clamp((t - 0.3) * 1.5 + grain * 0.3, 0, 1));
      tmp.lerp(snowCol, snowMask);
      if (t < 0.11) tmp.lerp(grass, (1 - smoothstep(0, 0.11, t)) * 0.75);
      colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mesh = new THREE.Mesh(geo, mountainMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }

  createMountainMassif(-5.0, -4.6);

  /* ---------------- 水体 ---------------- */

  const waterMat = makeWaterMaterial({ kind: 0, deep: '#245f73', shallow: '#75c2c4' });
  const lakeMat = makeWaterMaterial({ kind: 1, deep: '#245f73', shallow: '#75c2c4' });

  const riverPts = riverCurve.getPoints(90);
  const riverGeo = makeRibbonGeometry(riverPts, 0.92, WATER_Y + 0.015, 8.5);
  const river = new THREE.Mesh(riverGeo, waterMat);
  river.receiveShadow = false;
  river.renderOrder = 3;
  group.add(river);

  // 湖泊：不规则圆形水面
  const lakeSegs = 96;
  const lakePositions = [LAKE.x, WATER_Y + 0.012, LAKE.z];
  const lakeUvs = [0.5, 0.5];
  const lakeIndices = [];
  const lakeRingPositions = [];
  const lakeRingIndices = [];
  for (let i = 0; i <= lakeSegs; i++) {
    const a = (i / lakeSegs) * Math.PI * 2;
    const rr = LAKE.r * (1 + Math.sin(a * 3 + 1.1) * 0.055 + Math.sin(a * 7 - 0.4) * 0.035 + Math.sin(a * 11 + 2.0) * 0.02);
    lakePositions.push(LAKE.x + Math.cos(a) * rr, WATER_Y + 0.012, LAKE.z + Math.sin(a) * rr);
    lakeUvs.push(0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5);
    lakeRingPositions.push(LAKE.x + Math.cos(a) * rr * 0.9, WATER_Y - 0.005, LAKE.z + Math.sin(a) * rr * 0.9);
    lakeRingPositions.push(LAKE.x + Math.cos(a) * rr * 1.34, WATER_Y - 0.002, LAKE.z + Math.sin(a) * rr * 1.34);
  }
  for (let i = 1; i <= lakeSegs; i++) {
    lakeIndices.push(0, i, i + 1);
    const a = (i - 1) * 2, b = a + 1, c = a + 2, d = a + 3;
    lakeRingIndices.push(a, c, b, b, c, d);
  }
  const lakeGeo = new THREE.BufferGeometry();
  lakeGeo.setAttribute('position', new THREE.Float32BufferAttribute(lakePositions, 3));
  lakeGeo.setAttribute('uv', new THREE.Float32BufferAttribute(lakeUvs, 2));
  lakeGeo.setIndex(lakeIndices);
  lakeGeo.computeVertexNormals();
  const lake = new THREE.Mesh(lakeGeo, lakeMat);
  lake.renderOrder = 3;
  group.add(lake);

  // 湿润的湖岸暗色带
  const shoreGeo = new THREE.BufferGeometry();
  shoreGeo.setAttribute('position', new THREE.Float32BufferAttribute(lakeRingPositions, 3));
  shoreGeo.setIndex(lakeRingIndices);
  shoreGeo.computeVertexNormals();
  const shore = new THREE.Mesh(
    shoreGeo,
    new THREE.MeshStandardMaterial({ color: '#4d4a3c', roughness: 0.94, metalness: 0.02, side: THREE.DoubleSide })
  );
  shore.receiveShadow = true;
  shore.renderOrder = 2;
  group.add(shore);

  // 睡莲叶
  const lilyGeo = new THREE.CircleGeometry(0.11, 8);
  const lilyMat = new THREE.MeshStandardMaterial({ color: '#4d7f50', roughness: 0.8, side: THREE.DoubleSide });
  const lilies = new THREE.InstancedMesh(lilyGeo, lilyMat, 10);
  {
    const dummyLily = new THREE.Object3D();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + 0.4;
      const rr = LAKE.r * (0.35 + (i % 3) * 0.16);
      dummyLily.position.set(LAKE.x + Math.cos(a) * rr, WATER_Y + 0.026, LAKE.z + Math.sin(a) * rr);
      dummyLily.rotation.x = -Math.PI / 2;
      dummyLily.rotation.z = a * 1.7;
      dummyLily.scale.setScalar(0.7 + (i % 4) * 0.12);
      dummyLily.updateMatrix();
      lilies.setMatrixAt(i, dummyLily.matrix);
    }
  }
  group.add(lilies);

  // 出水口
  const outletGeo = makeRibbonGeometry([
    new THREE.Vector3(LAKE.x + 0.6, WATER_Y, LAKE.z),
    new THREE.Vector3(LAKE.x + 1.4, WATER_Y, LAKE.z + 0.02),
    new THREE.Vector3(LAKE.outletX, WATER_Y, LAKE.z),
  ], 0.7, WATER_Y + 0.008, 2.2);
  const outlet = new THREE.Mesh(outletGeo, waterMat);
  outlet.renderOrder = 3;
  group.add(outlet);

  // 出水口石质溢流槽
  const spillMat = new THREE.MeshStandardMaterial({ color: '#454741', roughness: 0.94, metalness: 0.02 });
  const spillGeo = makeRibbonGeometry([
    new THREE.Vector3(LAKE.x + 0.7, WATER_Y, LAKE.z),
    new THREE.Vector3(LAKE.x + 1.7, WATER_Y, LAKE.z + 0.02),
    new THREE.Vector3(LAKE.outletX + 0.15, WATER_Y, LAKE.z),
  ], 1.16, WATER_Y - 0.045, 2.2);
  const spill = new THREE.Mesh(spillGeo, spillMat);
  spill.receiveShadow = true;
  group.add(spill);

  // 瀑布
  const waterfallMat = makeWaterfallMaterial();
  const fallH = WATER_Y - (-5.1);
  const fallPlane = new THREE.PlaneGeometry(0.96, fallH, 1, 12);
  fallPlane.translate(0, -fallH / 2, 0);
  const fall = new THREE.Mesh(fallPlane, waterfallMat);
  fall.position.set(LAKE.outletX + 0.02, WATER_Y + 0.02, LAKE.z);
  fall.rotation.y = Math.atan2(0.92, 0.38);
  fall.renderOrder = 6;
  group.add(fall);

  const fallBackMat = waterfallMat.clone();
  fallBackMat.uniforms.uOpacity.value = 0.4;
  const fall2 = new THREE.Mesh(fallPlane, fallBackMat);
  fall2.position.copy(fall.position);
  fall2.rotation.y = Math.atan2(0.6, 0.8);
  fall2.scale.x = 1.18;
  fall2.renderOrder = 6;
  group.add(fall2);

  // 瀑布顶部横溢水线
  const crest = new THREE.Mesh(
    new THREE.BoxGeometry(0.98, 0.025, 0.08),
    new THREE.MeshBasicMaterial({ color: '#e8f6f7', transparent: true, opacity: 0.72 })
  );
  crest.position.set(LAKE.outletX, WATER_Y + 0.03, LAKE.z);
  crest.rotation.y = Math.atan2(0.92, 0.38);
  group.add(crest);

  // 湖岸石块
  const bankRockGeo = new THREE.DodecahedronGeometry(1, 0);
  const bankRockMat = new THREE.MeshStandardMaterial({ color: '#6b6456', roughness: 0.95, flatShading: true });
  const bankRocks = new THREE.InstancedMesh(bankRockGeo, bankRockMat, 26);
  {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const rr = LAKE.r * (1.02 + rnd() * 0.16);
      const x = LAKE.x + Math.cos(a) * rr;
      const z = LAKE.z + Math.sin(a) * rr;
      dummy.position.set(x, heightAt(x, z) + 0.01, z);
      dummy.scale.set(0.09 + rnd() * 0.2, 0.07 + rnd() * 0.12, 0.09 + rnd() * 0.2);
      dummy.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
      dummy.updateMatrix();
      bankRocks.setMatrixAt(i, dummy.matrix);
    }
  }
  bankRocks.castShadow = true;
  bankRocks.receiveShadow = true;
  group.add(bankRocks);

  // 木栈桥
  const dockGroup = new THREE.Group();
  const dockY = WATER_Y + 0.11;
  const woodMat = new THREE.MeshStandardMaterial({ color: '#6b4f35', roughness: 0.86, metalness: 0.02 });
  const woodDark = new THREE.MeshStandardMaterial({ color: '#4a3624', roughness: 0.9 });
  for (let i = 0; i < 7; i++) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.035, 0.78), i % 2 ? woodMat : woodDark);
    plank.position.set(-0.6 + i * 0.18, dockY, 0);
    plank.castShadow = true;
    plank.receiveShadow = true;
    dockGroup.add(plank);
  }
  for (const z of [-0.36, 0.36]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.04, 0.04), woodDark);
    rail.position.set(-0.03, dockY + 0.3, z);
    dockGroup.add(rail);
    for (const x of [-0.58, 0.06] ) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.34, 6), woodDark);
      post.position.set(x, dockY + 0.16, z);
      dockGroup.add(post);
    }
  }
  dockGroup.position.set(LAKE.x - 1.5, 0, LAKE.z + 0.4);
  dockGroup.rotation.y = -0.35;
  group.add(dockGroup);

  // 小木船
  const boat = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.55, 4, 8), woodMat);
  hull.rotation.z = Math.PI / 2;
  hull.scale.set(1, 0.55, 0.8);
  boat.add(hull);
  const boatInner = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.44, 4, 8), woodDark);
  boatInner.rotation.z = Math.PI / 2;
  boatInner.scale.set(1, 0.5, 0.68);
  boatInner.position.y = 0.05;
  boat.add(boatInner);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.035, 0.24), woodMat);
  seat.position.set(0, 0.09, 0);
  boat.add(seat);
  const oar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.65, 5), woodDark);
  oar.rotation.z = 1.25;
  oar.position.set(0.1, 0.12, 0.06);
  boat.add(oar);
  boat.position.set(LAKE.x - 1.9, WATER_Y + 0.08, LAKE.z + 0.1);
  boat.rotation.y = 0.8;
  group.add(boat);

  // 河岸苔石
  const riverRocks = new THREE.InstancedMesh(bankRockGeo, bankRockMat, 30);
  {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 30; i++) {
      const t = i / 30;
      const idx = Math.min(riverPts.length - 2, Math.floor(t * (riverPts.length - 1)));
      const p = riverPts[idx];
      const tangent = riverPts[idx + 1].clone().sub(p).normalize();
      const sideSign = i % 2 === 0 ? 1 : -1;
      const off = 0.55 + rnd() * 0.35;
      const x = p.x + -tangent.z * off * sideSign;
      const z = p.z + tangent.x * off * sideSign;
      dummy.position.set(x, heightAt(x, z) - 0.02, z);
      dummy.scale.set(0.06 + rnd() * 0.16, 0.05 + rnd() * 0.11, 0.06 + rnd() * 0.16);
      dummy.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
      dummy.updateMatrix();
      riverRocks.setMatrixAt(i, dummy.matrix);
    }
  }
  riverRocks.castShadow = true;
  riverRocks.receiveShadow = true;
  group.add(riverRocks);

  /* ---------------- 植被 ---------------- */

  const trees = [];
  const treeMinDist = 0.62;

  function isTreeSpotFree(x, z, minDist = treeMinDist) {
    if (!isOnIsland(x, z, 0.32)) return false;
    if (insideBuildingRect(x, z, 0.75)) return false;
    if (distanceToRiver(x, z) < 1.05) return false;
    if (distanceToLake(x, z) < 0.8) return false;
    if (Math.hypot(x - SNOW_MOUNTAIN.x, z - SNOW_MOUNTAIN.z) < 3.3) return false;
    // 广场铺装区不种树
    if (x > -5.35 && x < 5.1 && z > -2.5 && z < 5.25) return false;
    const k = Math.hypot((x - ROAD.cx) / ROAD.rx, (z - ROAD.cz) / ROAD.rz);
    if (Math.abs(k - 1) * 1.18 < 0.82) return false;
    // 互动道具附近留白
    if (Math.hypot(x - 3.06, z - 4.42) < 0.9) return false;
    if (Math.hypot(x + 3.55, z - 4.35) < 0.9) return false;
    for (const t of trees) {
      if (Math.hypot(x - t.x, z - t.z) < minDist) return false;
    }
    return true;
  }

  const clusters = [
    { cx: -7.1, cz: 6.4, rad: 1.9, n: 5, types: ['cherry', 'broadleaf'] },
    { cx: 7.4, cz: 5.8, rad: 1.2, n: 3, types: ['cherry', 'broadleaf'] },
    { cx: -6.1, cz: -3.7, rad: 2.2, n: 7, types: ['pine', 'pine', 'broadleaf'] },
    { cx: 2.1, cz: -6.5, rad: 2.2, n: 7, types: ['pine', 'broadleaf', 'cherry'] },
    { cx: 5.8, cz: -6.1, rad: 1.7, n: 6, types: ['pine', 'broadleaf'] },
    { cx: 7.6, cz: -1.4, rad: 1.2, n: 2, types: ['broadleaf'] },
    { cx: -8.2, cz: 0.2, rad: 1.4, n: 4, types: ['broadleaf', 'pine'] },
    { cx: 6.1, cz: 2.0, rad: 1.0, n: 2, types: ['cherry', 'broadleaf'] },
    { cx: -3.3, cz: 6.9, rad: 1.3, n: 3, types: ['cherry'] },
    { cx: 3.6, cz: 7.2, rad: 1.0, n: 2, types: ['broadleaf'] },
    { cx: -4.8, cz: -1.8, rad: 1.1, n: 2, types: ['pine'] },
    { cx: -8.5, cz: -4.5, rad: 1.5, n: 4, types: ['pine', 'broadleaf'] },
    { cx: 8.4, cz: -3.6, rad: 1.3, n: 3, types: ['pine', 'broadleaf'] },
  ];

  for (const cl of clusters) {
    let placed = 0;
    for (let attempt = 0; attempt < 80 && placed < cl.n; attempt++) {
      const a = rnd() * Math.PI * 2;
      const r = Math.sqrt(rnd()) * cl.rad;
      const x = cl.cx + Math.cos(a) * r;
      const z = cl.cz + Math.sin(a) * r;
      if (!isTreeSpotFree(x, z)) continue;
      const type = cl.types[Math.floor(rnd() * cl.types.length)];
      const h = type === 'pine' ? 2.2 + rnd() * 1.45 : type === 'cherry' ? 1.3 + rnd() * 0.65 : 1.6 + rnd() * 1.2;
      trees.push({ x, z, type, h, rot: rnd() * Math.PI * 2, lean: (rnd() - 0.5) * 0.08 });
      placed++;
    }
  }

  // 手动主景树：环岛中心樱树 + 两棵门面树
  trees.push({ x: 0.05, z: ROAD.cz, type: 'cherry', h: 1.08, rot: 0.4, lean: 0, hero: true });
  trees.push({ x: -5.95, z: 4.85, type: 'broadleaf', h: 2.05, rot: 1.1, lean: 0.02, hero: true });
  trees.push({ x: 4.92, z: 4.15, type: 'cherry', h: 1.38, rot: 2.4, lean: 0, hero: true });
  // 岛缘树，勾勒悬浮轮廓
  const rimTrees = [
    [-9.0, -1.2, 'pine', 2.8], [-7.7, -5.9, 'pine', 3.1], [-4.9, -6.9, 'pine', 2.6],
    [0.4, -7.4, 'broadleaf', 2.8], [4.8, -7.0, 'pine', 3.0], [8.0, -4.7, 'broadleaf', 2.7],
    [8.8, 1.9, 'cherry', 1.9], [-8.9, 2.2, 'broadleaf', 2.5], [6.9, 6.8, 'broadleaf', 2.1],
  ];
  for (const [x, z, type, h] of rimTrees) {
    if (isTreeSpotFree(x, z, 0.5)) {
      trees.push({ x, z, type, h, rot: rnd() * Math.PI * 2, lean: (rnd() - 0.5) * 0.1 });
    }
  }
  // 岛缘森林带
  for (let i = 0; i < 110; i++) {
    const a = rnd() * Math.PI * 2;
    const bp = boundaryPoint(a, 0.35 + rnd() * 1.4);
    const x = bp.x;
    const z = bp.z;
    if (z > 3.6 && Math.abs(x) < 6.2) continue;
    if (!isTreeSpotFree(x, z, 0.46)) continue;
    let type;
    if (z < -1.5) type = rnd() > 0.38 ? 'pine' : 'broadleaf';
    else if (z > 2.5) type = rnd() > 0.55 ? 'cherry' : 'broadleaf';
    else type = rnd() > 0.5 ? 'pine' : 'broadleaf';
    const h = type === 'pine' ? 2.4 + rnd() * 1.5 : type === 'cherry' ? 1.4 + rnd() * 0.7 : 2.0 + rnd() * 1.3;
    trees.push({ x, z, type, h, rot: rnd() * Math.PI * 2, lean: (rnd() - 0.5) * 0.1 });
    if (trees.length > 110) break;
  }
  // 手工补植：沿岛缘与视线焦点布置
  const handTrees = [
    [0.5, -6.4, 'pine', 3.2], [2.4, -6.7, 'broadleaf', 3.0], [4.2, -6.3, 'pine', 3.4], [5.9, -6.5, 'broadleaf', 2.8],
    [7.0, -5.2, 'pine', 3.4], [8.1, -4.5, 'broadleaf', 3.0],
    [-8.4, -4.6, 'pine', 3.0], [-8.9, 1.0, 'broadleaf', 2.8], [-6.2, 6.3, 'cherry', 1.8],
    [-5.8, 5.8, 'broadleaf', 2.4], [7.9, 4.9, 'cherry', 1.8], [9.3, -0.4, 'broadleaf', 2.2],
    [-2.8, 6.55, 'cherry', 1.12], [2.8, 6.55, 'cherry', 1.12],
  ];
  for (const [x, z, type, h] of handTrees) {
    if (!isOnIsland(x, z, 0.25)) continue;
    if (insideBuildingRect(x, z, 0.3)) continue;
    if (distanceToRiver(x, z) < 0.75 || distanceToLake(x, z) < 0.35) continue;
    const roadK = Math.hypot((x - ROAD.cx) / ROAD.rx, (z - ROAD.cz) / ROAD.rz);
    const inGarden = Math.abs(x) < 4.2 && Math.abs(z - ROAD.cz) < 0.85;
    if (Math.abs(roadK - 1) * 1.18 < 0.7 && !inGarden) continue;
    trees.push({ x, z, type, h, rot: rnd() * Math.PI * 2, lean: (rnd() - 0.5) * 0.08 });
  }
  // 建筑背后的高树冠，形成层叠森林
  const tallBackdrop = [
    [-2.0, -3.15, 'broadleaf', 4.4],
    [1.15, -3.25, 'broadleaf', 4.2],
    [6.95, -5.25, 'broadleaf', 3.8],
    [5.35, -5.6, 'pine', 4.0],
    [-7.7, 1.9, 'broadleaf', 3.4],
  ];
  for (const [x, z, type, h] of tallBackdrop) {
    if (!isOnIsland(x, z, 0.6)) continue;
    if (insideBuildingRect(x, z, 0.3)) continue;
    if (distanceToRiver(x, z) < 0.9 || distanceToLake(x, z) < 0.7) continue;
    trees.push({ x, z, type, h, rot: rnd() * Math.PI * 2, lean: (rnd() - 0.5) * 0.06 });
  }
  for (const t of trees) {
    if (!t.hero) t.h *= 1.1 + rnd() * 0.12;
  }

  // 为 NPC 记录树干障碍
  for (const t of trees) {
    walkObstacles.push({ x: t.x, z: t.z, r: 0.24 + t.h * 0.04 });
  }

  // 几何体
  const trunkGeo = new THREE.CylinderGeometry(0.62, 1, 1, 7, 1);
  trunkGeo.translate(0, 0.5, 0);
  const leafGeo = new THREE.IcosahedronGeometry(1, 1);
  {
    const pos = leafGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const n = noise(x * 2.3 + 4, z * 2.3 + y * 1.7) * 0.1;
      pos.setXYZ(i, x * (1 + n), y * (1 + n), z * (1 + n));
    }
    leafGeo.computeVertexNormals();
  }
  const pineGeo = new THREE.ConeGeometry(1, 1, 9, 1);
  pineGeo.translate(0, 0.5, 0);
  const snowCapGeo = new THREE.SphereGeometry(1, 12, 7, 0, Math.PI * 2, 0, Math.PI * 0.54);

  const trunkMat = new THREE.MeshStandardMaterial({ color: '#4a3627', roughness: 0.92, metalness: 0.02 });
  const leafMat = new THREE.MeshStandardMaterial({ color: '#6f9c58', roughness: 0.85, metalness: 0.0, envMapIntensity: 0.3, flatShading: false });
  const pineMat = new THREE.MeshStandardMaterial({ color: '#3f6b4e', roughness: 0.88, metalness: 0.0, envMapIntensity: 0.28, flatShading: false });
  const cherryMat = new THREE.MeshStandardMaterial({ color: '#efa9bd', roughness: 0.82, metalness: 0.0, envMapIntensity: 0.3 });
  const snowLeafMat = snowMaterial.clone();
  snowLeafMat.opacity = 0;

  const trunkMatrices = [];
  const leafMatrices = [];
  const pineMatrices = [];
  const cherryMatrices = [];
  const snowLeafMatrices = [];
  const leafColors = [];
  const cherryColors = [];
  const pineColors = [];
  const dummy = new THREE.Object3D();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const v = new THREE.Vector3();
  const s = new THREE.Vector3();

  for (const t of trees) {
    const baseY = heightAt(t.x, t.z) - 0.03;
    const trunkH = t.type === 'pine' ? t.h * 0.38 : t.h * 0.46;
    const trunkW = 0.035 + t.h * 0.018;
    dummy.position.set(t.x, baseY, t.z);
    dummy.rotation.set(t.lean, t.rot, 0);
    dummy.scale.set(trunkW * 12, trunkH, trunkW * 12);
    dummy.updateMatrix();
    trunkMatrices.push(dummy.matrix.clone());

    if (t.type === 'pine') {
      const layers = 3;
      for (let i = 0; i < layers; i++) {
        const ly = baseY + trunkH * 0.55 + (i / layers) * t.h * 0.72;
        const lr = t.h * (0.34 - i * 0.075);
        const lh = t.h * (0.44 - i * 0.06);
        dummy.position.set(t.x, ly, t.z);
        dummy.rotation.set(0, t.rot + i * 0.45, 0);
        dummy.scale.set(lr, lh, lr);
        dummy.updateMatrix();
        pineMatrices.push(dummy.matrix.clone());
        const fade = 0.86 + rnd() * 0.18;
        pineColors.push(new THREE.Color(fade, fade, fade));
        if (i >= 1) {
          dummy.position.set(t.x, ly + lh * 0.2, t.z);
          dummy.scale.set(lr * 0.66, lh * 0.15, lr * 0.66);
          dummy.updateMatrix();
          snowLeafMatrices.push(dummy.matrix.clone());
        }
      }
      // 顶部积雪帽
      dummy.position.set(t.x, baseY + trunkH * 0.55 + t.h * 0.72 + t.h * 0.07, t.z);
      dummy.rotation.set(0, t.rot, 0);
      dummy.scale.set(t.h * 0.075, t.h * 0.09, t.h * 0.075);
      dummy.updateMatrix();
      snowLeafMatrices.push(dummy.matrix.clone());
    } else {
      const blobCount = t.type === 'cherry' ? 4 : 4;
      const topY = baseY + trunkH + t.h * 0.13;
      const spread = t.type === 'cherry' ? 0.29 : 0.23;
      for (let i = 0; i < blobCount; i++) {
        const angle = t.rot + (i / blobCount) * Math.PI * 2 + rnd() * 0.4;
        const rad = i === 0 ? 0 : spread * t.h * (0.55 + rnd() * 0.5);
        const bx = t.x + Math.cos(angle) * rad;
        const bz = t.z + Math.sin(angle) * rad;
        const by = topY + (i === 0 ? t.h * 0.12 : rnd() * t.h * 0.16 - t.h * 0.03);
        const br = t.h * (i === 0 ? 0.3 : 0.21 + rnd() * 0.07);
        dummy.position.set(bx, by, bz);
        dummy.rotation.set(rnd() * 0.5, rnd() * Math.PI, rnd() * 0.5);
        dummy.scale.set(br * (t.type === 'cherry' ? 1.25 : 1.05), br * 0.82, br * (t.type === 'cherry' ? 1.15 : 1.0));
        dummy.updateMatrix();
        if (t.type === 'cherry') {
          cherryMatrices.push(dummy.matrix.clone());
          const fade = 0.88 + rnd() * 0.18;
          cherryColors.push(new THREE.Color(fade * 1.02, fade * 0.95, fade));
        } else {
          leafMatrices.push(dummy.matrix.clone());
          const fade = 0.82 + rnd() * 0.24;
          leafColors.push(new THREE.Color(fade, fade * (0.98 + rnd() * 0.08), fade * 0.94));
        }
        // 树冠雪帽
        dummy.position.set(bx, by + br * 0.5, bz);
        dummy.rotation.set(rnd() * 0.3, rnd() * Math.PI, rnd() * 0.3);
        dummy.scale.set(br * 0.72, br * 0.22, br * 0.72);
        dummy.updateMatrix();
        snowLeafMatrices.push(dummy.matrix.clone());
      }
    }
  }

  function makeInstanced(geo, mat, matrices, colors, cast = true) {
    if (!matrices.length) return null;
    const mesh = new THREE.InstancedMesh(geo, mat, matrices.length);
    for (let i = 0; i < matrices.length; i++) {
      mesh.setMatrixAt(i, matrices[i]);
      if (colors && colors[i]) mesh.setColorAt(i, colors[i]);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.castShadow = cast;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }

  makeInstanced(trunkGeo, trunkMat, trunkMatrices, null);
  makeInstanced(leafGeo, leafMat, leafMatrices, leafColors);
  makeInstanced(leafGeo, cherryMat, cherryMatrices, cherryColors);
  makeInstanced(pineGeo, pineMat, pineMatrices, pineColors);
  const treeSnow = makeInstanced(snowCapGeo, snowLeafMat, snowLeafMatrices, null, false);
  if (treeSnow) treeSnow.visible = false;

  /* ---------------- 环岛中心花坛 ---------------- */

  const planterGroup = new THREE.Group();
  const planterY = PLAZA_Y + 0.03;
  const planterStone = new THREE.MeshStandardMaterial({ color: '#5a5a54', roughness: 0.9 });
  const planterRing = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.085, 8, 34), planterStone);
  planterRing.rotation.x = Math.PI / 2;
  planterRing.position.y = planterY + 0.06;
  planterRing.castShadow = true;
  planterRing.receiveShadow = true;
  planterGroup.add(planterRing);
  const planterSoil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 0.08, 28),
    new THREE.MeshStandardMaterial({ color: '#392c20', roughness: 1 })
  );
  planterSoil.position.y = planterY + 0.03;
  planterGroup.add(planterSoil);
  // 花坛内的小灌木
  const shrubGeo = new THREE.IcosahedronGeometry(0.16, 1);
  const shrubMat = new THREE.MeshStandardMaterial({ color: '#557f4a', roughness: 0.9 });
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const shrub = new THREE.Mesh(shrubGeo, shrubMat);
    shrub.position.set(Math.cos(a) * 0.42, planterY + 0.15, Math.sin(a) * 0.42);
    shrub.scale.set(1, 0.8, 1);
    shrub.castShadow = true;
    planterGroup.add(shrub);
  }
  planterGroup.position.set(0.05, 0, ROAD.cz);
  group.add(planterGroup);

  /* ---------------- 草丛 ---------------- */

  const bladeGeoParts = [];
  for (let i = 0; i < 4; i++) {
    const g = new THREE.PlaneGeometry(0.045, 0.24, 1, 2);
    g.translate(0, 0.12, 0);
    g.rotateY((i / 4) * Math.PI * 1.4);
    g.rotateZ((i - 1.5) * 0.06);
    bladeGeoParts.push(g);
  }
  const grassBladeGeo = mergeGeometries(bladeGeoParts);
  const grassMat = new THREE.MeshStandardMaterial({
    color: '#719b58', roughness: 0.95, metalness: 0, side: THREE.DoubleSide, envMapIntensity: 0.2,
  });
  const grassMatrices = [];
  const grassColors = [];
  for (let i = 0; i < 520; i++) {
    let x = (rnd() - 0.5) * 18.5;
    let z = (rnd() - 0.5) * 14.5;
    if (!isTreeSpotFree(x, z, 0.1)) {
      // 广场允许草缝
      const inPlaza = x > -5.2 && x < 4.8 && z > -2.0 && z < 5.0;
      if (!inPlaza || insideBuildingRect(x, z, 0.4) || distanceToRiver(x, z) < 0.9 || distanceToLake(x, z) < 0.5) continue;
      if (Math.abs(Math.hypot((x - ROAD.cx) / ROAD.rx, (z - ROAD.cz) / ROAD.rz) - 1) * 1.18 > 0.75) continue;
      if (Math.abs(x) < 0.9 && Math.abs(z - ROAD.cz) < 1.2) continue;
    }
    const y = heightAt(x, z);
    const sc = 0.7 + rnd() * 0.95;
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, rnd() * Math.PI * 2, 0);
    dummy.scale.set(sc, sc * (0.7 + rnd() * 0.5), sc);
    dummy.updateMatrix();
    grassMatrices.push(dummy.matrix.clone());
    const tint = 0.78 + rnd() * 0.35;
    grassColors.push(new THREE.Color(tint, tint * 1.02, tint * 0.88));
  }
  const grassTufts = makeInstanced(grassBladeGeo, grassMat, grassMatrices, grassColors, false);
  if (grassTufts) grassTufts.receiveShadow = true;

  /* ---------------- 草花 ---------------- */

  const flowerStemGeo = new THREE.CylinderGeometry(0.008, 0.01, 0.16, 4);
  flowerStemGeo.translate(0, 0.08, 0);
  const flowerHeadGeo = new THREE.IcosahedronGeometry(0.035, 0);
  const flowerStemMat = new THREE.MeshStandardMaterial({ color: '#5c7a48', roughness: 0.9 });
  const flowerHeadMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7, metalness: 0 });
  const stemMatrices = [];
  const headMatrices = [];
  const headColors = [];
  const flowerPalette = ['#f1eccf', '#dba7b7', '#e5c47a', '#c4d8a3'];
  for (let i = 0; i < 110; i++) {
    let x = (rnd() - 0.5) * 17.8;
    let z = (rnd() - 0.5) * 13.6;
    if (!isOnIsland(x, z, 1.0)) continue;
    if (insideBuildingRect(x, z, 0.7)) continue;
    if (distanceToRiver(x, z) < 1.0 || distanceToLake(x, z) < 0.7) continue;
    const k = Math.hypot((x - ROAD.cx) / ROAD.rx, (z - ROAD.cz) / ROAD.rz);
    if (Math.abs(k - 1) * 1.18 < 0.6) continue;
    const y = heightAt(x, z);
    const sc = 1.1 + rnd() * 1.0;
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, rnd() * Math.PI * 2, 0);
    dummy.scale.setScalar(sc);
    dummy.updateMatrix();
    stemMatrices.push(dummy.matrix.clone());
    dummy.position.set(x, y + 0.16 * sc, z);
    dummy.scale.setScalar(sc * (0.8 + rnd() * 0.5));
    dummy.updateMatrix();
    headMatrices.push(dummy.matrix.clone());
    headColors.push(new THREE.Color(flowerPalette[Math.floor(rnd() * flowerPalette.length)]));
  }
  const flowerStems = makeInstanced(flowerStemGeo, flowerStemMat, stemMatrices, null, false);
  const flowerHeads = makeInstanced(flowerHeadGeo, flowerHeadMat, headMatrices, headColors, false);
  if (flowerStems) flowerStems.visible = true;
  if (flowerHeads) flowerHeads.visible = true;

  /* ---------------- 灌木丛 ---------------- */

  const bushGeo = new THREE.IcosahedronGeometry(1, 1);
  const bushMat = new THREE.MeshStandardMaterial({ color: '#5d8b50', roughness: 0.9, envMapIntensity: 0.25 });
  const shrubMatrices = [];
  const shrubColors = [];
  for (let i = 0; i < 190; i++) {
    let x = (rnd() - 0.5) * 18.5;
    let z = (rnd() - 0.5) * 14.5;
    if (!isOnIsland(x, z, 0.9)) continue;
    if (insideBuildingRect(x, z, 0.45)) continue;
    if (distanceToRiver(x, z) < 0.7 || distanceToLake(x, z) < 0.4) continue;
    if (x > -5.0 && x < 4.6 && z > -2.1 && z < 4.9) continue;
    const k = Math.hypot((x - ROAD.cx) / ROAD.rx, (z - ROAD.cz) / ROAD.rz);
    if (Math.abs(k - 1) * 1.18 < 0.55) continue;
    const y = heightAt(x, z);
    const sc = 0.15 + rnd() * 0.32;
    dummy.position.set(x, y + sc * 0.55, z);
    dummy.rotation.set(0, rnd() * Math.PI * 2, 0);
    dummy.scale.set(sc * (1 + rnd() * 0.35), sc * (0.7 + rnd() * 0.35), sc * (1 + rnd() * 0.3));
    dummy.updateMatrix();
    shrubMatrices.push(dummy.matrix.clone());
    const tint = 0.8 + rnd() * 0.3;
    shrubColors.push(new THREE.Color(tint, tint * 1.04, tint * 0.86));
  }
  const bushSpots = [
    [-4.9, 4.9, 0.3], [4.75, 5.2, 0.28], [4.8, 2.5, 0.24], [-5.0, 0.4, 0.26],
    [8.9, 2.6, 0.22], [-1.5, -3.6, 0.3], [3.1, -3.6, 0.26], [6.6, 6.9, 0.24],
    [-6.4, 6.4, 0.22], [8.2, 4.7, 0.25], [-8.5, 1.4, 0.24], [7.5, -5.4, 0.28],
  ];
  for (const [x, z, sc] of bushSpots) {
    if (!isOnIsland(x, z, 0.3)) continue;
    if (insideBuildingRect(x, z, 0.2)) continue;
    if (distanceToRiver(x, z) < 0.55 || distanceToLake(x, z) < 0.15) continue;
    const y = heightAt(x, z);
    dummy.position.set(x, y + sc * 0.55, z);
    dummy.rotation.set(0, rnd() * Math.PI * 2, 0);
    dummy.scale.set(sc * 1.15, sc * 0.85, sc);
    dummy.updateMatrix();
    shrubMatrices.push(dummy.matrix.clone());
    shrubColors.push(new THREE.Color('#7fa46a'));
  }
  const shrubs = makeInstanced(bushGeo, bushMat, shrubMatrices, shrubColors, false);
  if (shrubs) shrubs.receiveShadow = true;

  /* ---------------- 岩石与蘑菇 ---------------- */

  const rockGeo = new THREE.DodecahedronGeometry(1, 0);
  const rockMat = new THREE.MeshStandardMaterial({ color: '#6a6558', roughness: 0.95, metalness: 0.02, flatShading: true });
  const rockMatrices = [];
  const rockColors = [];
  for (let i = 0; i < 40; i++) {
    let x = (rnd() - 0.5) * 18.5;
    let z = (rnd() - 0.5) * 14.5;
    if (!isOnIsland(x, z, 0.9)) continue;
    if (insideBuildingRect(x, z, 0.5)) continue;
    if (distanceToRiver(x, z) < 0.55 || distanceToLake(x, z) < 0.15) continue;
    const k = Math.hypot((x - ROAD.cx) / ROAD.rx, (z - ROAD.cz) / ROAD.rz);
    if (Math.abs(k - 1) * 1.18 < 0.68) continue;
    const y = heightAt(x, z);
    const sc = 0.09 + rnd() * 0.3;
    dummy.position.set(x, y + sc * 0.22, z);
    dummy.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    dummy.scale.set(sc * (1 + rnd() * 0.5), sc * (0.55 + rnd() * 0.35), sc * (1 + rnd() * 0.4));
    dummy.updateMatrix();
    rockMatrices.push(dummy.matrix.clone());
    const tint = 0.8 + rnd() * 0.35;
    rockColors.push(new THREE.Color(tint, tint * 0.97, tint * 0.9));
  }
  // 湖边主景石
  for (const [x, z, sc] of [[5.3, 4.1, 0.42], [5.6, 1.9, 0.3], [8.6, 4.4, 0.33]]) {
    dummy.position.set(x, heightAt(x, z) + sc * 0.18, z);
    dummy.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    dummy.scale.set(sc * 1.2, sc * 0.7, sc);
    dummy.updateMatrix();
    rockMatrices.push(dummy.matrix.clone());
    rockColors.push(new THREE.Color('#8b8d80'));
  }
  makeInstanced(rockGeo, rockMat, rockMatrices, rockColors);

  // 蘑菇
  const mushStemGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.1, 5);
  mushStemGeo.translate(0, 0.05, 0);
  const mushCapGeo = new THREE.SphereGeometry(0.05, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const mushStemMat = new THREE.MeshStandardMaterial({ color: '#d8c8a8', roughness: 0.9 });
  const mushCapMat = new THREE.MeshStandardMaterial({ color: '#b94f3b', roughness: 0.72 });
  const mushStemM = [];
  const mushCapM = [];
  for (let i = 0; i < 20; i++) {
    const t = trees[Math.floor(rnd() * trees.length)];
    if (!t) continue;
    const a = rnd() * Math.PI * 2;
    const rad = 0.3 + rnd() * 0.4;
    const x = t.x + Math.cos(a) * rad;
    const z = t.z + Math.sin(a) * rad;
    if (!isOnIsland(x, z, 0.7)) continue;
    const y = heightAt(x, z);
    const sc = 0.6 + rnd() * 0.8;
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, rnd() * Math.PI * 2, 0);
    dummy.scale.setScalar(sc);
    dummy.updateMatrix();
    mushStemM.push(dummy.matrix.clone());
    dummy.position.y = y + 0.09 * sc;
    dummy.scale.set(sc, sc * 0.8, sc);
    dummy.updateMatrix();
    mushCapM.push(dummy.matrix.clone());
  }
  const mushStems = makeInstanced(mushStemGeo, mushStemMat, mushStemM, null, false);
  const mushCaps = makeInstanced(mushCapGeo, mushCapMat, mushCapM, null, false);
  if (mushStems) mushStems.visible = true;
  if (mushCaps) mushCaps.visible = true;

  /* ---------------- 小动物 ---------------- */

  function makeDeer(x, z, rot, scale = 0.5, seed = 1) {
    const dr = mulberry32(seed);
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#9a6f46', roughness: 0.82 });
    const creamMat = new THREE.MeshStandardMaterial({ color: '#dcc4a2', roughness: 0.85 });
    const darkMat = new THREE.MeshStandardMaterial({ color: '#2c2118', roughness: 0.8 });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.34, 4, 8), bodyMat);
    body.rotation.x = Math.PI / 2;
    body.position.y = 0.44;
    g.add(body);
    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), creamMat);
    chest.position.set(0, 0.47, 0.23);
    chest.scale.set(1, 0.85, 0.7);
    g.add(chest);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.34, 6), bodyMat);
    neck.position.set(0, 0.66, 0.24);
    neck.rotation.x = -0.4;
    g.add(neck);
    const head = new THREE.Group();
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.095, 9, 7), bodyMat);
    skull.scale.set(0.9, 0.9, 1.2);
    head.add(skull);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), darkMat);
    nose.position.set(0, -0.01, 0.11);
    head.add(nose);
    for (const sx of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.11, 4), creamMat);
      ear.position.set(sx * 0.07, 0.1, -0.02);
      ear.rotation.z = sx * 0.5;
      head.add(ear);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.013, 4, 3), darkMat);
      eye.position.set(sx * 0.055, 0.025, 0.085);
      head.add(eye);
      // 鹿角
      const antler1 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.2, 4), creamMat);
      antler1.position.set(sx * 0.035, 0.16, -0.02);
      antler1.rotation.z = sx * 0.35;
      head.add(antler1);
      const antler2 = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.009, 0.12, 4), creamMat);
      antler2.position.set(sx * 0.08, 0.24, -0.02);
      antler2.rotation.z = sx * 1.0;
      head.add(antler2);
    }
    head.position.set(0, 0.86, 0.33);
    head.rotation.x = 0.2;
    g.add(head);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.023, 0.018, 0.36, 5), bodyMat);
      leg.position.set(sx * 0.09, 0.19, sz * 0.13);
      g.add(leg);
      const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 0.045, 5), darkMat);
      hoof.position.set(sx * 0.09, 0.02, sz * 0.13);
      g.add(hoof);
    }
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 5), creamMat);
    tail.position.set(0, 0.5, -0.25);
    g.add(tail);
    // 斑点
    for (let i = 0; i < 5; i++) {
      const spot = new THREE.Mesh(new THREE.SphereGeometry(0.018, 4, 3), creamMat);
      spot.position.set((dr() - 0.5) * 0.12, 0.48 + dr() * 0.08, -0.1 + dr() * 0.28);
      g.add(spot);
    }
    g.position.set(x, heightAt(x, z), z);
    g.rotation.y = rot;
    g.scale.setScalar(scale);
    g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    group.add(g);
    return { group: g, head, baseY: g.position.y, phase: dr() * Math.PI * 2 };
  }

  const deer1 = makeDeer(2.25, -6.02, -1.9, 0.46, 4);
  const deer2 = makeDeer(3.15, -5.55, -2.5, 0.38, 9);

  // 飞鸟
  const birds = [];
  const birdMat = new THREE.MeshStandardMaterial({ color: '#2b3340', roughness: 0.8 });
  function makeBird() {
    const bg = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 5), birdMat);
    body.scale.set(0.6, 0.55, 1.3);
    bg.add(body);
    const wings = [];
    for (const sx of [-1, 1]) {
      const wing = new THREE.Group();
      const w = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.075), birdMat);
      w.position.x = sx * 0.11;
      wing.add(w);
      wings.push(wing);
      bg.add(wing);
    }
    bg.traverse((o) => { if (o.isMesh) { o.material.side = THREE.DoubleSide; } });
    group.add(bg);
    return { g: bg, wings, phase: Math.random() * 6.28 };
  }
  for (let i = 0; i < 3; i++) birds.push(makeBird());

  // 蝴蝶
  const butterflies = [];
  const butterflyColors = ['#e9c7d3', '#e9d49b'];
  for (let i = 0; i < 2; i++) {
    const g = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ color: butterflyColors[i], side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    for (const sx of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.055), mat);
      wing.position.x = sx * 0.045;
      wing.rotation.y = sx * 0.4;
      g.add(wing);
    }
    g.position.set(-6.1 + i * 0.4, heightAt(-6.1, 4.8) + 0.5, 4.8);
    group.add(g);
    butterflies.push({ g, phase: i * 2.1 });
  }

  /* ---------------- 互动代理 ---------------- */

  const lakeProxy = proxySphere(1.9, LAKE.x, WATER_Y + 0.5, LAKE.z, 'lake');
  group.add(lakeProxy);
  pickProxies.push(lakeProxy);

  const fallProxy = proxySphere(1.5, LAKE.outletX - 0.15, -2.0, LAKE.z, 'waterfall');
  group.add(fallProxy);
  pickProxies.push(fallProxy);

  const mountainProxy = proxySphere(2.6, SNOW_MOUNTAIN.x, 4.8, SNOW_MOUNTAIN.z, 'mountain');
  group.add(mountainProxy);
  pickProxies.push(mountainProxy);

  const cherryProxy = proxySphere(1.15, 0.05, PLAZA_Y + 1.8, ROAD.cz, 'cherryGrove');
  group.add(cherryProxy);
  pickProxies.push(cherryProxy);

  const deerProxy = proxySphere(0.85, 2.7, heightAt(2.7, -5.8) + 0.4, -5.8, 'deer');
  group.add(deerProxy);
  pickProxies.push(deerProxy);

  /* ---------------- 更新 ---------------- */

  const tmpColor = new THREE.Color();
  function update(dt, time) {
    waterMat.uniforms.uTime.value = time;
    lakeMat.uniforms.uTime.value = time;
    waterfallMat.uniforms.uTime.value = time;
    fallBackMat.uniforms.uTime.value = time + 2.1;

    for (const d of [deer1, deer2]) {
      d.head.rotation.x = 0.2 + Math.sin(time * 0.7 + d.phase) * 0.08;
      d.head.rotation.y = Math.sin(time * 0.24 + d.phase) * 0.28;
      d.group.position.y = d.baseY + Math.sin(time * 0.8 + d.phase) * 0.008;
    }

    birds.forEach((b, i) => {
      const a = time * 0.28 + (i / birds.length) * Math.PI * 2;
      const radius = 2.4 + i * 0.38;
      b.g.position.set(LAKE.x + Math.cos(a) * radius, 5.4 + Math.sin(time * 0.6 + i) * 0.3, LAKE.z + Math.sin(a) * radius);
      b.g.rotation.y = -a + Math.PI / 2;
      b.g.rotation.z = Math.sin(a) * 0.25;
      const flap = Math.sin(time * 7.5 + i * 2) * 0.65;
      b.wings[0].rotation.z = flap;
      b.wings[1].rotation.z = -flap;
    });

    butterflies.forEach((b, i) => {
      const a = time * 0.6 + b.phase;
      b.g.position.x = -6.1 + Math.cos(a) * 0.6;
      b.g.position.z = 4.8 + Math.sin(a * 0.8) * 0.45;
      b.g.position.y = heightAt(b.g.position.x, b.g.position.z) + 0.45 + Math.sin(a * 2.4) * 0.12;
      b.g.rotation.y = -a;
      b.g.scale.setScalar(0.9 + Math.sin(time * 9 + i) * 0.15);
    });

    boat.position.y = WATER_Y + 0.08 + Math.sin(time * 0.9) * 0.015;
    boat.rotation.z = Math.sin(time * 0.6) * 0.025;
    boat.rotation.y = 0.8 + Math.sin(time * 0.3) * 0.03;

    // 冬季树冠积雪淡入
    const snowOp = snowMaterial.opacity;
    snowLeafMat.opacity = snowOp * 0.58;
    if (treeSnow) treeSnow.visible = snowOp > 0.02;
    void tmpColor;
  }

  return {
    group,
    terrain,
    terrainMat,
    cliff,
    snowGround,
    snowMaterial,
    treeSnow,
    leafMat,
    pineMat,
    cherryMat,
    grassMat,
    flowerHeads,
    flowerStems,
    waterMat,
    lakeMat,
    waterfallMat,
    fallBackMat,
    lakeProxy,
    fallProxy,
    mountainProxy,
    cherryProxy,
    deerProxy,
    pickProxies,
    walkObstacles,
    trees,
    update,
  };
}
