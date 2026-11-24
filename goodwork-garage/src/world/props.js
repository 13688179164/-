/**
 * 广场、环道、车流、行人、票据箱、审批终端、路灯、配送车、停车牌
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { mulberry32 } from '../core/utils.js';
import {
  ROAD, PLAZA_Y, LAKE, heightAt, isOnIsland, insideBuildingRect,
} from './terrain.js';
import {
  makeAsphaltTexture, makeStoneTexture, makeGlowTexture, makeParkingSignTexture,
  makeVanSideTexture, makeMedallionTexture, makeTicketSignTexture,
  makeTerminalScreenTexture, makePlateTexture,
} from '../core/textures.js';
import {
  makeGoldMaterial, makeDarkMetal, makeSteelMaterial, makeSignMaterial,
  makeCanvasScreenMaterial,
} from './materials.js';

const rnd = mulberry32(8803);

function tagGroup(group, key) {
  group.traverse((o) => {
    if (!o.isMesh) return;
    if (o.userData.noPick) return;
    if (!o.userData.interactiveKey) o.userData.interactiveKey = key;
  });
}

function invisiblePickSphere(r, x, y, z, key) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(r, 10, 8),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false })
  );
  mesh.position.set(x, y, z);
  mesh.userData.interactiveKey = key;
  mesh.renderOrder = -1;
  return mesh;
}

function makePathGeometry(points, width) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.3);
  const pts = curve.getPoints(40);
  const positions = [];
  const uvs = [];
  const indices = [];
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    tangent.set(next.x - prev.x, 0, next.z - prev.z).normalize();
    side.set(-tangent.z, 0, tangent.x);
    const w = width / 2;
    const yL = heightAt(p.x + side.x * w, p.z + side.z * w) + 0.045;
    const yR = heightAt(p.x - side.x * w, p.z - side.z * w) + 0.045;
    positions.push(p.x + side.x * w, yL, p.z + side.z * w);
    positions.push(p.x - side.x * w, yR, p.z - side.z * w);
    uvs.push(0, i * 0.18, 1, i * 0.18);
  }
  for (let i = 0; i < pts.length - 1; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    indices.push(a, c, b, b, c, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function ellipseRingGeometry(rx, rz, width, segments, y) {
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const ca = Math.cos(a), sa = Math.sin(a);
    const ox = (rx + width / 2) * ca;
    const oz = (rz + width / 2) * sa;
    const ix = (rx - width / 2) * ca;
    const iz = (rz - width / 2) * sa;
    positions.push(ox, y, oz, ix, y, iz);
    uvs.push(i / segments * 12, 0, i / segments * 12, 1);
  }
  for (let i = 0; i < segments; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    indices.push(a, c, b, b, c, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function makeCarShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 3, 32, 32, 31);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.62)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.3)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createCarFleet(scene) {
  const bodyGeo = new RoundedBoxGeometry(1.14, 0.26, 0.48, 3, 0.07);
  bodyGeo.translate(0, 0.27, 0);
  const roofGeo = new RoundedBoxGeometry(0.5, 0.04, 0.4, 2, 0.02);
  roofGeo.translate(-0.07, 0.585, 0);
  const cabinGeo = new RoundedBoxGeometry(0.56, 0.23, 0.42, 2, 0.05);
  cabinGeo.translate(-0.07, 0.47, 0);
  const wheelGeo = new THREE.CylinderGeometry(0.155, 0.155, 0.13, 14);
  wheelGeo.rotateX(Math.PI / 2);
  const rimGeo = new THREE.CylinderGeometry(0.082, 0.082, 0.138, 12);
  rimGeo.rotateX(Math.PI / 2);
  const headGeo = new RoundedBoxGeometry(0.04, 0.06, 0.16, 1, 0.02);
  headGeo.translate(0.57, 0.29, 0);
  const tailGeo = new RoundedBoxGeometry(0.04, 0.055, 0.42, 1, 0.02);
  tailGeo.translate(-0.57, 0.32, 0);
  const shadowGeo = new THREE.PlaneGeometry(1.6, 0.82);
  shadowGeo.rotateX(-Math.PI / 2);

  const count = 8;
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: '#ffffff', metalness: 0.62, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.55,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: '#0a131c', metalness: 0.5, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.8,
  });
  const tireMat = new THREE.MeshStandardMaterial({ color: '#0c0e12', roughness: 0.9, metalness: 0.04 });
  const rimMat = new THREE.MeshStandardMaterial({ color: '#d9d2c2', metalness: 0.95, roughness: 0.2, envMapIntensity: 1.6 });
  const headMat = new THREE.MeshStandardMaterial({ color: '#fff7e0', emissive: '#ffdda0', emissiveIntensity: 1.2, roughness: 0.25 });
  const tailMat = new THREE.MeshStandardMaterial({ color: '#8c1c1c', emissive: '#ff4438', emissiveIntensity: 1.1, roughness: 0.35 });
  const shadowMat = new THREE.MeshBasicMaterial({ map: makeCarShadowTexture(), transparent: true, opacity: 0.85, depthWrite: false });

  const bodies = new THREE.InstancedMesh(bodyGeo, bodyMat, count);
  const roofs = new THREE.InstancedMesh(roofGeo, bodyMat, count);
  const cabins = new THREE.InstancedMesh(cabinGeo, glassMat, count);
  const wheels = new THREE.InstancedMesh(wheelGeo, tireMat, count * 4);
  const rims = new THREE.InstancedMesh(rimGeo, rimMat, count * 4);
  const heads = new THREE.InstancedMesh(headGeo, headMat, count);
  const tails = new THREE.InstancedMesh(tailGeo, tailMat, count);
  const shadows = new THREE.InstancedMesh(shadowGeo, shadowMat, count);
  bodies.userData.interactiveKey = 'traffic';
  roofs.userData.interactiveKey = 'traffic';
  rims.userData.interactiveKey = 'traffic';
  bodies.receiveShadow = true;
  for (const m of [bodies, roofs, cabins, wheels, rims, heads, tails, shadows]) {
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    m.frustumCulled = false;
  }
  shadows.renderOrder = 1;

  const palette = ['#c9b488', '#7e2733', '#31526c', '#d8d4c8', '#3f5f4a', '#6b4e87', '#a85f37', '#343a42'];
  const cars = [];
  const dummy = new THREE.Object3D();
  const wheelDummy = new THREE.Object3D();
  wheelDummy.rotation.order = 'YXZ';
  for (let i = 0; i < count; i++) {
    const c = new THREE.Color(palette[i]);
    bodies.setColorAt(i, c);
    roofs.setColorAt(i, c);
    const phase = (i / count) * Math.PI * 2 + rnd() * 0.2;
    cars.push({ phase, speed: 0.075 + rnd() * 0.035, radiusOffset: (rnd() - 0.5) * 0.22 });
  }
  bodies.instanceColor.needsUpdate = true;
  roofs.instanceColor.needsUpdate = true;

  const carGroup = new THREE.Group();
  carGroup.add(shadows, bodies, roofs, cabins, wheels, rims, heads, tails);
  scene.add(carGroup);

  function update(time) {
    const laneY = PLAZA_Y + 0.075;
    const wheelY = laneY + 0.155;
    const spinRate = ROAD.rx / 0.155;
    for (let i = 0; i < count; i++) {
      const car = cars[i];
      const a = time * car.speed + car.phase;
      const rx = ROAD.rx + car.radiusOffset;
      const rz = ROAD.rz + car.radiusOffset * 0.3;
      const x = ROAD.cx + Math.cos(a) * rx;
      const z = ROAD.cz + Math.sin(a) * rz;
      const dx = -Math.sin(a) * rx;
      const dz = Math.cos(a) * rz;
      const yaw = Math.atan2(-dz, dx);
      dummy.position.set(x, laneY, z);
      dummy.rotation.set(0, yaw, 0);
      dummy.scale.setScalar(0.98);
      dummy.updateMatrix();
      bodies.setMatrixAt(i, dummy.matrix);
      roofs.setMatrixAt(i, dummy.matrix);
      cabins.setMatrixAt(i, dummy.matrix);
      heads.setMatrixAt(i, dummy.matrix);
      tails.setMatrixAt(i, dummy.matrix);
      // 车底柔和投影（车灯阴影不参与动态阴影贴图，用贴图代替）
      dummy.position.set(x, PLAZA_Y + 0.079, z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      shadows.setMatrixAt(i, dummy.matrix);
      // 四个车轮：加宽轮距使轮胎露出车身，轮毂随车速滚动
      const cos = Math.cos(yaw), sin = Math.sin(yaw);
      const roll = -(time * car.speed * spinRate) % (Math.PI * 2);
      const wheelPos = [[0.37, 0.265], [-0.37, 0.265], [0.37, -0.265], [-0.37, -0.265]];
      for (let w = 0; w < 4; w++) {
        const [lx, lz] = wheelPos[w];
        const wx = x + lx * cos + lz * sin;
        const wz = z - lx * sin + lz * cos;
        wheelDummy.position.set(wx, wheelY, wz);
        wheelDummy.rotation.set(0, yaw, roll);
        wheelDummy.scale.setScalar(0.98);
        wheelDummy.updateMatrix();
        wheels.setMatrixAt(i * 4 + w, wheelDummy.matrix);
        rims.setMatrixAt(i * 4 + w, wheelDummy.matrix);
      }
    }
    for (const m of [bodies, roofs, cabins, wheels, rims, heads, tails, shadows]) m.instanceMatrix.needsUpdate = true;
  }

  return { group: carGroup, update };
}

function createPedestrians(scene) {
  const bodyGeo = new THREE.CapsuleGeometry(0.055, 0.26, 3, 6);
  bodyGeo.translate(0, 0.34, 0);
  const headGeo = new THREE.SphereGeometry(0.055, 7, 6);
  headGeo.translate(0, 0.57, 0);

  const count = 20;
  const bodyMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8 });
  const headMat = new THREE.MeshStandardMaterial({ color: '#c99a78', roughness: 0.8 });
  const bodies = new THREE.InstancedMesh(bodyGeo, bodyMat, count);
  const heads = new THREE.InstancedMesh(headGeo, headMat, count);
  bodies.castShadow = false;
  bodies.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  heads.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  bodies.frustumCulled = false;
  heads.frustumCulled = false;

  const paths = [
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.6, 0, 4.1), new THREE.Vector3(-2.4, 0, 4.72),
      new THREE.Vector3(0.1, 0, 4.15), new THREE.Vector3(2.4, 0, 4.72),
      new THREE.Vector3(4.6, 0, 4.1), new THREE.Vector3(4.75, 0, 4.78),
      new THREE.Vector3(2.4, 0, 5.05), new THREE.Vector3(0.1, 0, 4.75),
      new THREE.Vector3(-2.4, 0, 5.05), new THREE.Vector3(-4.75, 0, 4.78),
    ], true, 'catmullrom', 0.2),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.2, 0, 3.9), new THREE.Vector3(-4.65, 0, 2.2),
      new THREE.Vector3(-5.2, 0, 1.35), new THREE.Vector3(-5.85, 0, 2.35),
      new THREE.Vector3(-5.45, 0, 4.1),
    ], true, 'catmullrom', 0.3),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(5.1, 0, 4.3), new THREE.Vector3(5.25, 0, 3.0),
      new THREE.Vector3(4.95, 0, 1.75), new THREE.Vector3(4.62, 0, 2.65),
      new THREE.Vector3(4.85, 0, 4.35),
    ], true, 'catmullrom', 0.3),
  ];

  const palette = ['#33475e', '#6a4a3e', '#3e5a46', '#5b3d4b', '#525a66', '#7c6a4e', '#2f3b4a', '#7a4c40'];
  const walkers = [];
  const dummy = new THREE.Object3D();
  const tmpColor = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const pathIndex = i < 9 ? 0 : i < 15 ? 1 : 2;
    walkers.push({
      path: paths[pathIndex],
      t: rnd(),
      speed: 0.012 + rnd() * 0.012,
      dir: rnd() > 0.5 ? 1 : -1,
      offset: (rnd() - 0.5) * 0.55,
      phase: rnd() * 6.28,
      scale: 0.82 + rnd() * 0.22,
    });
    tmpColor.set(palette[Math.floor(rnd() * palette.length)]);
    bodies.setColorAt(i, tmpColor);
    tmpColor.setHSL(0.07 + rnd() * 0.02, 0.3 + rnd() * 0.12, 0.62 + rnd() * 0.12);
    heads.setColorAt(i, tmpColor);
  }
  bodies.instanceColor.needsUpdate = true;
  heads.instanceColor.needsUpdate = true;

  const group = new THREE.Group();
  group.add(bodies, heads);
  scene.add(group);

  const tangent = new THREE.Vector3();
  const point = new THREE.Vector3();
  function update(time, dt) {
    for (let i = 0; i < count; i++) {
      const w = walkers[i];
      w.t = (w.t + dt * w.speed * w.dir + 1) % 1;
      const t = w.t;
      w.path.getPointAt(t, point);
      w.path.getTangentAt(t, tangent);
      const nx = -tangent.z, nz = tangent.x;
      const x = point.x + nx * w.offset;
      const z = point.z + nz * w.offset;
      const y = heightAt(x, z) + 0.02 + Math.abs(Math.sin(time * 5.6 + w.phase)) * 0.016;
      const yaw = Math.atan2(tangent.x * w.dir, tangent.z * w.dir);
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, yaw, 0);
      dummy.scale.setScalar(w.scale);
      dummy.updateMatrix();
      bodies.setMatrixAt(i, dummy.matrix);
      heads.setMatrixAt(i, dummy.matrix);
    }
    bodies.instanceMatrix.needsUpdate = true;
    heads.instanceMatrix.needsUpdate = true;
  }

  return { group, update };
}

/* ------------------------------------------------------------------ */

export function createProps(scene) {
  const group = new THREE.Group();
  group.name = 'props';
  scene.add(group);

  const obstacles = [];
  const anchors = {};

  /* ---------------- 广场 ---------------- */

  const stoneTex = makeStoneTexture();
  stoneTex.repeat.set(2.4, 1.8);
  const stoneMat = new THREE.MeshStandardMaterial({
    color: '#9a968c', map: stoneTex, roughness: 0.62, metalness: 0.08, envMapIntensity: 0.65,
  });
  const pathMat = new THREE.MeshStandardMaterial({
    color: '#aba699', map: stoneTex, roughness: 0.78, metalness: 0.03, envMapIntensity: 0.4,
  });
  const gold = makeGoldMaterial();
  const dark = makeDarkMetal();

  const shape = new THREE.Shape();
  const pw = 10.4, pd = 7.3, pr = 0.55;
  shape.moveTo(-pw / 2 + pr, -pd / 2);
  shape.lineTo(pw / 2 - pr, -pd / 2);
  shape.absarc(pw / 2 - pr, -pd / 2 + pr, pr, -Math.PI / 2, 0);
  shape.lineTo(pw / 2, pd / 2 - pr);
  shape.absarc(pw / 2 - pr, pd / 2 - pr, pr, 0, Math.PI / 2);
  shape.lineTo(-pw / 2 + pr, pd / 2);
  shape.absarc(-pw / 2 + pr, pd / 2 - pr, pr, Math.PI / 2, Math.PI);
  shape.lineTo(-pw / 2, -pd / 2 + pr);
  shape.absarc(-pw / 2 + pr, -pd / 2 + pr, pr, Math.PI, Math.PI * 1.5);
  const plazaGeo = new THREE.ShapeGeometry(shape, 16);
  plazaGeo.rotateX(-Math.PI / 2);
  const plaza = new THREE.Mesh(plazaGeo, stoneMat);
  plaza.position.set(0.05, PLAZA_Y + 0.045, 1.55);
  plaza.receiveShadow = true;
  plaza.castShadow = false;
  group.add(plaza);

  // 铜章
  const medallion = new THREE.Mesh(
    new THREE.PlaneGeometry(1.85, 1.85),
    new THREE.MeshBasicMaterial({
      map: makeMedallionTexture(), transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, opacity: 0.9, toneMapped: false,
    })
  );
  medallion.rotation.x = -Math.PI / 2;
  medallion.position.set(0.05, PLAZA_Y + 0.055, 4.35);
  group.add(medallion);

  // 步道
  const paths = [
    makePathGeometry([
      new THREE.Vector3(5.02, 0, 4.55),
      new THREE.Vector3(5.12, 0, 3.3),
      new THREE.Vector3(5.0, 0, 2.2),
      new THREE.Vector3(4.88, 0, 1.25),
    ], 0.62),
    makePathGeometry([
      new THREE.Vector3(-5.1, 0, 1.1),
      new THREE.Vector3(-5.8, 0, 0.65),
      new THREE.Vector3(-6.25, 0, 0.5),
    ], 0.85),
    makePathGeometry([
      new THREE.Vector3(-5.0, 0, 4.3),
      new THREE.Vector3(-5.8, 0, 4.8),
      new THREE.Vector3(-6.5, 0, 5.2),
    ], 0.85),
  ];
  for (const p of paths) {
    const mesh = new THREE.Mesh(p, pathMat);
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  /* ---------------- 环道 ---------------- */

  const asphalt = makeAsphaltTexture();
  asphalt.repeat.set(10, 1.2);
  const roadMat = new THREE.MeshStandardMaterial({
    color: '#83878c', map: asphalt, roughness: 0.85, metalness: 0.06, envMapIntensity: 0.45,
  });
  const road = new THREE.Mesh(ellipseRingGeometry(ROAD.rx, ROAD.rz, ROAD.width, 144, PLAZA_Y + 0.072), roadMat);
  road.receiveShadow = true;
  group.add(road);

  // 路缘金线
  const edgeMat = new THREE.MeshStandardMaterial({ color: '#b6a176', roughness: 0.36, metalness: 0.8, envMapIntensity: 1.2 });
  for (const side of [1, -1]) {
    const r = new THREE.Mesh(
      ellipseRingGeometry(ROAD.rx + side * ROAD.width / 2, ROAD.rz + side * ROAD.width / 2, 0.035, 144, PLAZA_Y + 0.078),
      edgeMat
    );
    group.add(r);
  }

  // 车道虚线：单批次合并
  const dashGeos = [];
  const dashCount = 52;
  for (let i = 0; i < dashCount; i++) {
    const a = (i / dashCount) * Math.PI * 2;
    const x = ROAD.cx + Math.cos(a) * ROAD.rx;
    const z = ROAD.cz + Math.sin(a) * ROAD.rz;
    const dx = -Math.sin(a), dz = Math.cos(a);
    const yaw = Math.atan2(-dz, dx);
    const g = new THREE.BoxGeometry(0.23, 0.012, 0.038);
    const m = new THREE.Matrix4().makeRotationY(yaw);
    m.setPosition(x, PLAZA_Y + 0.087, z);
    g.applyMatrix4(m);
    dashGeos.push(g);
  }
  const dashes = new THREE.Mesh(mergeGeometries(dashGeos), new THREE.MeshBasicMaterial({ color: '#e8dcc2', transparent: true, opacity: 0.82, toneMapped: false }));
  group.add(dashes);

  // 入口车道（短）
  const entryPts = [
    new THREE.Vector3(-6.55, 0, 7.18),
    new THREE.Vector3(-5.75, 0, 6.9),
    new THREE.Vector3(-5.15, 0, 6.65),
  ];
  const entryGeo = makePathGeometry(entryPts, 0.82);
  const entry = new THREE.Mesh(entryGeo, roadMat);
  entry.receiveShadow = true;
  group.add(entry);

  // 车流
  const fleet = createCarFleet(scene);
  // 行人
  const pedestrians = createPedestrians(scene);

  /* ---------------- 路灯 ---------------- */

  const lampGlowTex = makeGlowTexture();
  const lampPositions = [
    [-4.95, 3.38, 0.25],
    [4.95, 3.38, -0.25],
    [8.7, 1.0, 1.2],
  ];
  const lampGlobes = [];
  lampPositions.forEach(([x, z, rot], idx) => {
    const y = heightAt(x, z);
    const lamp = new THREE.Group();
    lamp.position.set(x, y, z);
    lamp.rotation.y = rot;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.19, 0.1, 12), dark);
    base.position.y = 0.05;
    base.castShadow = true;
    lamp.add(base);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.04, 2.05, 8), dark);
    stem.position.y = 1.1;
    stem.castShadow = true;
    lamp.add(stem);
    for (const yy of [0.4, 1.2]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.009, 5, 14), gold);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = yy;
      lamp.add(ring);
    }
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.04, 0.04), dark);
    arm.position.set(0.2, 2.12, 0);
    lamp.add(arm);
    const cage = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.18, 0.32, 6, 1, true), gold);
    cage.position.set(0.4, 1.99, 0);
    lamp.add(cage);
    const globeMat = new THREE.MeshStandardMaterial({
      color: '#ffe8bb', emissive: '#ffc476', emissiveIntensity: 2.1, roughness: 0.4,
    });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.095, 10, 8), globeMat);
    globe.position.set(0.4, 1.96, 0);
    lamp.add(globe);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.11, 8), dark);
    cap.position.set(0.4, 2.2, 0);
    lamp.add(cap);
    const pool = new THREE.Mesh(
      new THREE.PlaneGeometry(2.9, 2.9),
      new THREE.MeshBasicMaterial({
        map: lampGlowTex, color: '#ffca8c', transparent: true, opacity: 0.24,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
      })
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.06;
    pool.userData.noPick = true;
    lamp.add(pool);
    tagGroup(lamp, 'streetLamp');
    group.add(lamp);
    lampGlobes.push(globeMat);
    obstacles.push({ x, z, r: 0.26 });
    if (idx === 0) anchors.streetLamp = new THREE.Vector3(x, y + 2.6, z);
  });

  /* ---------------- 票据箱 ---------------- */

  const ticketGroup = new THREE.Group();
  const tx = 3.12, tz = 4.42;
  const ty = heightAt(tx, tz);
  ticketGroup.position.set(tx, ty, tz);
  ticketGroup.rotation.y = -0.28;
  const ticketStone = new THREE.MeshStandardMaterial({ color: '#505a60', roughness: 0.55, metalness: 0.2 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.12, 0.48), ticketStone);
  base.position.y = 0.06;
  base.castShadow = true;
  base.receiveShadow = true;
  ticketGroup.add(base);
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.36), dark);
  body.position.y = 0.57;
  body.castShadow = true;
  ticketGroup.add(body);
  const screenMat = makeCanvasScreenMaterial(makeTicketSignTexture(), 1.25);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.52), screenMat);
  screen.position.set(0, 0.64, 0.185);
  screen.rotation.x = -0.06;
  ticketGroup.add(screen);
  for (const yy of [0.24, 1.02]) {
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.035, 0.4), gold);
    trim.position.y = yy;
    ticketGroup.add(trim);
  }
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.025, 0.02), new THREE.MeshBasicMaterial({ color: '#efdcb2' }));
  slot.position.set(0, 0.94, 0.19);
  ticketGroup.add(slot);
  for (let i = 0; i < 3; i++) {
    const paper = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.1),
      new THREE.MeshStandardMaterial({ color: '#f4ecd8', roughness: 0.9, side: THREE.DoubleSide })
    );
    paper.position.set(-0.05 + i * 0.06, 0.99 + i * 0.012, 0.2);
    paper.rotation.z = (i - 1) * 0.18;
    paper.rotation.x = -0.1;
    paper.userData.noPick = true;
    ticketGroup.add(paper);
  }
  tagGroup(ticketGroup, 'ticketBox');
  group.add(ticketGroup);
  const ticketPick = invisiblePickSphere(0.52, tx, ty + 0.65, tz, 'ticketBox');
  group.add(ticketPick);
  obstacles.push({ x: tx, z: tz, r: 0.38 });
  anchors.ticketBox = new THREE.Vector3(tx, ty + 1.55, tz);

  /* ---------------- 审批终端 ---------------- */

  const terminalGroup = new THREE.Group();
  const ax = -3.62, az = 4.42;
  const ay = heightAt(ax, az);
  terminalGroup.position.set(ax, ay, az);
  terminalGroup.rotation.y = 0.28;
  const tBase = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.1, 0.56), ticketStone);
  tBase.position.y = 0.05;
  tBase.castShadow = true;
  terminalGroup.add(tBase);
  const tBody = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.98, 0.3), dark);
  tBody.position.y = 0.6;
  tBody.castShadow = true;
  terminalGroup.add(tBody);
  const screenMatT = makeCanvasScreenMaterial(makeTerminalScreenTexture(), 1.3);
  const tScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.54), screenMatT);
  tScreen.position.set(0, 0.78, 0.163);
  tScreen.rotation.x = -0.22;
  terminalGroup.add(tScreen);
  const tTrim = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.36), gold);
  tTrim.position.y = 1.12;
  terminalGroup.add(tTrim);
  const statusMat = new THREE.MeshStandardMaterial({ color: '#8fc7a3', emissive: '#6fe3a0', emissiveIntensity: 1.6, roughness: 0.4 });
  const statusLight = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), statusMat);
  statusLight.position.set(0.24, 1.05, 0.18);
  terminalGroup.add(statusLight);
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
      map: lampGlowTex, color: '#7fd4a8', transparent: true, opacity: 0.18,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    })
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.055;
  glow.userData.noPick = true;
  terminalGroup.add(glow);
  tagGroup(terminalGroup, 'approvalTerminal');
  group.add(terminalGroup);
  const terminalPick = invisiblePickSphere(0.56, ax, ay + 0.7, az, 'approvalTerminal');
  group.add(terminalPick);
  obstacles.push({ x: ax, z: az, r: 0.4 });
  anchors.approvalTerminal = new THREE.Vector3(ax, ay + 1.65, az);

  /* ---------------- 停车牌 ---------------- */

  const parkingGroup = new THREE.Group();
  const px = 5.32, pz = 4.28;
  const py = heightAt(px, pz);
  parkingGroup.position.set(px, py, pz);
  parkingGroup.rotation.y = -0.35;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 2.0, 8), dark);
  pole.position.y = 1.0;
  pole.castShadow = true;
  parkingGroup.add(pole);
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.8, 0.05), dark);
  signBoard.position.set(0, 1.82, 0);
  signBoard.castShadow = true;
  parkingGroup.add(signBoard);
  const signFace = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.72), makeSignMaterial(makeParkingSignTexture(), { emissive: 0.55 }));
  signFace.position.set(0, 1.82, 0.032);
  parkingGroup.add(signFace);
  const arrow = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.16), makeSignMaterial(makePlateTexture('P  →  访客'), { emissive: 0.35 }));
  arrow.position.set(0, 1.35, 0.03);
  parkingGroup.add(arrow);
  tagGroup(parkingGroup, 'parkingSign');
  group.add(parkingGroup);
  group.add(invisiblePickSphere(0.5, px, py + 1.6, pz, 'parkingSign'));
  obstacles.push({ x: px, z: pz, r: 0.22 });
  anchors.parkingSign = new THREE.Vector3(px, py + 2.5, pz);

  /* ---------------- 配送车 ---------------- */

  const van = new THREE.Group();
  const vx = -6.35, vz = 1.18;
  const vy = heightAt(vx, vz);
  van.position.set(vx, vy, vz);
  van.rotation.y = 0.12;
  const cream = new THREE.MeshPhysicalMaterial({ color: '#ded4c0', metalness: 0.45, roughness: 0.38, clearcoat: 0.8, envMapIntensity: 1.0 });
  const vanDark = new THREE.MeshStandardMaterial({ color: '#1a2028', roughness: 0.7, metalness: 0.2 });
  const vanGlass = new THREE.MeshPhysicalMaterial({ color: '#0d1822', roughness: 0.08, metalness: 0.3, envMapIntensity: 1.4 });
  const cargo = new THREE.Mesh(new RoundedBoxGeometry(1.55, 1.18, 1.12, 3, 0.1), cream);
  cargo.position.set(-0.48, 0.9, 0);
  cargo.castShadow = true;
  cargo.receiveShadow = true;
  van.add(cargo);
  const cab = new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.72, 1.06, 3, 0.12), cream);
  cab.position.set(0.74, 0.76, 0);
  cab.castShadow = true;
  van.add(cab);
  const windshield = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.4), vanGlass);
  windshield.position.set(1.22, 0.9, 0);
  windshield.rotation.y = Math.PI / 2;
  windshield.rotation.x = 0.18;
  van.add(windshield);
  for (const sz of [-1, 1]) {
    const sideWin = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.34), vanGlass);
    sideWin.position.set(0.78, 0.9, sz * 0.536);
    sideWin.rotation.y = sz > 0 ? 0 : Math.PI;
    van.add(sideWin);
    const decal = new THREE.Mesh(
      new THREE.PlaneGeometry(1.38, 0.69),
      new THREE.MeshStandardMaterial({ map: makeVanSideTexture(), roughness: 0.55, metalness: 0.15 })
    );
    decal.position.set(-0.45, 0.9, sz * 0.562);
    decal.rotation.y = sz > 0 ? 0 : Math.PI;
    van.add(decal);
  }
  const vanWheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 14);
  vanWheelGeo.rotateX(Math.PI / 2);
  for (const sx of [-0.75, 0.78]) {
    for (const sz of [-1, 1]) {
      const wheel = new THREE.Mesh(vanWheelGeo, vanDark);
      wheel.position.set(sx, 0.26, sz * 0.56);
      wheel.castShadow = true;
      van.add(wheel);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.145, 10), makeSteelMaterial());
      hub.rotation.x = Math.PI / 2;
      hub.position.set(sx, 0.26, sz * 0.56);
      van.add(hub);
    }
  }
  const headLightMat = new THREE.MeshStandardMaterial({ color: '#fff4d8', emissive: '#ffd68a', emissiveIntensity: 1.3, roughness: 0.3 });
  for (const sz of [-1, 1]) {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.18), headLightMat);
    hl.position.set(1.2, 0.63, sz * 0.33);
    van.add(hl);
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.1, 0.14), new THREE.MeshStandardMaterial({ color: '#7a1b1b', emissive: '#ff4b3a', emissiveIntensity: 0.9 }));
    tl.position.set(-1.29, 0.75, sz * 0.38);
    van.add(tl);
  }
  const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 1.0), vanDark);
  bumper.position.set(1.28, 0.36, 0);
  van.add(bumper);
  const goldStripe = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.035, 0.02), gold);
  goldStripe.position.set(-0.45, 0.45, 0.57);
  van.add(goldStripe);
  const roofRack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.04, 0.9), vanDark);
  roofRack.position.set(-0.48, 1.52, 0);
  van.add(roofRack);
  tagGroup(van, 'deliveryVan');
  group.add(van);
  group.add(invisiblePickSphere(1.3, vx, vy + 0.8, vz, 'deliveryVan'));
  obstacles.push({ x: vx, z: vz, r: 1.15 });
  anchors.deliveryVan = new THREE.Vector3(vx, vy + 1.95, vz);

  /* ---------------- 其他细节 ---------------- */

  // 入口导视牌
  const guide = new THREE.Mesh(
    new THREE.PlaneGeometry(1.0, 0.26),
    makeSignMaterial(makePlateTexture('GOODWORK  →  GARAGE'), { emissive: 0.25 })
  );
  guide.rotation.x = -Math.PI / 2;
  guide.rotation.z = -0.04;
  guide.position.set(0.05, PLAZA_Y + 0.075, 4.95);
  guide.scale.set(1.4, 1, 1);
  group.add(guide);

  // 广场边花箱
  const planterMat = new THREE.MeshStandardMaterial({ color: '#494b4b', roughness: 0.8 });
  const shrubMat2 = new THREE.MeshStandardMaterial({ color: '#4d794e', roughness: 0.9 });
  for (const [sx, sz] of [[-5.35, 2.15], [4.98, 1.15]]) {
    const pot = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.55), planterMat);
    pot.position.set(sx, heightAt(sx, sz) + 0.21, sz);
    pot.castShadow = true;
    pot.receiveShadow = true;
    group.add(pot);
    const shrub = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 1), shrubMat2);
    shrub.position.set(sx, heightAt(sx, sz) + 0.56, sz);
    shrub.scale.set(1, 0.88, 1);
    shrub.castShadow = true;
    group.add(shrub);
    obstacles.push({ x: sx, z: sz, r: 0.4 });
  }

  /* ---------------- 状态 ---------------- */

  let ticketCollected = false;
  let terminalStatus = 'ready';
  const statusColors = {
    ready: { color: '#8fc7a3', emissive: '#6fe3a0', intensity: 1.6 },
    pending: { color: '#e0b46b', emissive: '#ffbf63', intensity: 1.8 },
    approved: { color: '#8fc7a3', emissive: '#6fe3a0', intensity: 2.3 },
  };
  function setTicketCollected(v) {
    ticketCollected = v;
    screenMat.emissiveIntensity = v ? 0.55 : 1.25;
    screenMat.color.set(v ? '#9aa4ad' : '#ffffff');
  }
  function setTerminalStatus(status) {
    terminalStatus = status;
    const s = statusColors[status] || statusColors.ready;
    statusMat.color.set(s.color);
    statusMat.emissive.set(s.emissive);
    statusMat.emissiveIntensity = s.intensity;
    screenMatT.emissiveIntensity = status === 'pending' ? 1.6 : 1.3;
  }

  function update(dt, time) {
    fleet.update(time);
    pedestrians.update(time, dt);
    lampGlobes.forEach((m, i) => {
      m.emissiveIntensity = 2.0 + Math.sin(time * 2.0 + i * 1.7) * 0.12;
    });
    screenMat.emissiveIntensity = (ticketCollected ? 0.55 : 1.25) + Math.sin(time * 2.2) * 0.06;
    if (!ticketCollected) {
      screenMatT.emissiveIntensity = (terminalStatus === 'pending' ? 1.6 : 1.3) + Math.sin(time * 1.7) * 0.05;
    }
    glow.material.opacity = 0.15 + Math.sin(time * 1.5) * 0.04;
  }

  return {
    group,
    fleet,
    pedestrians,
    obstacles,
    anchors,
    ticketGroup,
    terminalGroup,
    parkingGroup,
    deliveryVan: van,
    screenMat,
    screenMatT,
    statusMat,
    setTicketCollected,
    setTerminalStatus,
    update,
  };
}
