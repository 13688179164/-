/**
 * GOODWORK 古德車房 与配套建筑
 * 双层玻璃幕墙 / 金边主招牌 / 竖式灯箱 / 侧招 / 举升机跑车 / 财务室 / 仓库 / 宿舍
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { mulberry32 } from '../core/utils.js';
import { BUILDINGS, PLAZA_Y, heightAt } from './terrain.js';
import {
  makeMainSignTexture, makeVerticalSignTexture, makeBladeSignTexture,
  makeBuildingSignTexture, makePlateTexture, makeDarkWoodTexture,
  makeStoneTexture, makeInteriorScreenTexture, makeTerminalScreenTexture,
} from '../core/textures.js';
import {
  makeGoldMaterial, makeDarkMetal, makeSteelMaterial, makeBuildingGlassMaterial,
  makeCarPaint, makeSignMaterial, makeCanvasScreenMaterial,
} from './materials.js';

const rnd = mulberry32(5521);

function addBox(parent, w, h, d, mat, x, y, z, opts = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = opts.cast !== false;
  mesh.receiveShadow = opts.receive !== false;
  if (opts.rotY) mesh.rotation.y = opts.rotY;
  if (opts.rotX) mesh.rotation.x = opts.rotX;
  if (opts.rotZ) mesh.rotation.z = opts.rotZ;
  parent.add(mesh);
  return mesh;
}

function addSnow(parent, w, h, d, x, y, z, snowMaterial, snowMeshes, rotX = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), snowMaterial);
  mesh.position.set(x, y, z);
  mesh.rotation.x = rotX;
  mesh.receiveShadow = false;
  mesh.castShadow = false;
  mesh.userData.noPick = true;
  parent.add(mesh);
  snowMeshes.push(mesh);
  return mesh;
}

function tagGroup(group, key) {
  group.traverse((o) => {
    if (!o.isMesh) return;
    if (o.userData.noPick) return;
    if (!o.userData.interactiveKey) o.userData.interactiveKey = key;
  });
}

function pickProxy(parent, w, h, d, x, y, z, key) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false })
  );
  mesh.position.set(x, y, z);
  mesh.userData.interactiveKey = key;
  mesh.renderOrder = -1;
  parent.add(mesh);
  return mesh;
}

/* ------------------------------------------------------------------ */

function buildHeroCar() {
  const group = new THREE.Group();
  const paint = makeCarPaint('#a32738');
  const dark = new THREE.MeshStandardMaterial({ color: '#101218', roughness: 0.45, metalness: 0.5 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: '#0d1620', roughness: 0.08, metalness: 0.35, transparent: true, opacity: 0.86,
    envMapIntensity: 1.5, clearcoat: 1,
  });
  const chrome = makeSteelMaterial();
  const lightWhite = new THREE.MeshStandardMaterial({
    color: '#ffffff', emissive: '#ffe9c4', emissiveIntensity: 1.4, roughness: 0.3,
  });
  const lightRed = new THREE.MeshStandardMaterial({
    color: '#7a1216', emissive: '#ff4238', emissiveIntensity: 1.5, roughness: 0.4,
  });

  const chassis = new THREE.Mesh(new RoundedBoxGeometry(2.72, 0.30, 1.16, 4, 0.08), paint);
  chassis.position.y = 0.43;
  group.add(chassis);
  const lower = new THREE.Mesh(new RoundedBoxGeometry(2.84, 0.16, 1.1, 4, 0.05), makeCarPaint('#3c1017'));
  lower.position.y = 0.3;
  group.add(lower);
  const hood = new THREE.Mesh(new RoundedBoxGeometry(0.82, 0.18, 1.08, 3, 0.06), paint);
  hood.position.set(0.98, 0.59, 0);
  hood.rotation.z = -0.035;
  group.add(hood);
  const trunk = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.17, 1.08, 3, 0.06), paint);
  trunk.position.set(-1.0, 0.6, 0);
  trunk.rotation.z = 0.04;
  group.add(trunk);
  const cabinGlass = new THREE.Mesh(new RoundedBoxGeometry(1.28, 0.4, 0.96, 4, 0.12), glass);
  cabinGlass.position.set(-0.1, 0.79, 0);
  group.add(cabinGlass);
  const roof = new THREE.Mesh(new RoundedBoxGeometry(1.02, 0.1, 0.9, 3, 0.06), paint);
  roof.position.set(-0.14, 0.97, 0);
  group.add(roof);
  // 前后灯
  addBox(group, 0.05, 0.1, 0.32, lightWhite, 1.4, 0.58, 0.34);
  addBox(group, 0.05, 0.1, 0.32, lightWhite, 1.4, 0.58, -0.34);
  addBox(group, 0.05, 0.085, 0.82, lightRed, -1.4, 0.65, 0);
  addBox(group, 0.1, 0.15, 0.7, dark, 1.42, 0.43, 0);
  // 侧裙 / 后视镜 / 尾翼
  addBox(group, 1.85, 0.05, 1.2, makeCarPaint('#2e0b10'), 0, 0.28, 0);
  addBox(group, 0.17, 0.07, 0.12, paint, 0.44, 0.86, 0.55);
  addBox(group, 0.17, 0.07, 0.12, paint, 0.44, 0.86, -0.55);
  addBox(group, 0.34, 0.045, 1.02, dark, -1.35, 0.94, 0);
  addBox(group, 0.05, 0.18, 0.05, dark, -1.25, 0.85, 0.42);
  addBox(group, 0.05, 0.18, 0.05, dark, -1.25, 0.85, -0.42);
  // 轮毂
  const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.17, 18);
  wheelGeo.rotateX(Math.PI / 2);
  const rimGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.185, 18);
  rimGeo.rotateX(Math.PI / 2);
  for (const sx of [-0.94, 0.94]) {
    for (const sz of [-0.6, 0.6]) {
      const wheel = new THREE.Mesh(wheelGeo, dark);
      wheel.position.set(sx, 0.28, sz);
      wheel.castShadow = true;
      group.add(wheel);
      const rim = new THREE.Mesh(rimGeo, chrome);
      rim.position.set(sx, 0.28, sz);
      group.add(rim);
    }
  }
  group.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      o.userData.interactiveKey = 'liftCar';
    }
  });
  return group;
}

function buildLift() {
  const group = new THREE.Group();
  const steel = makeDarkMetal();
  const gold = makeGoldMaterial();
  const postGeo = new THREE.BoxGeometry(0.15, 2.15, 0.17);
  for (const x of [-2.62, 0.5]) {
    const post = new THREE.Mesh(postGeo, steel);
    post.position.set(x, 1.38, -0.12);
    post.castShadow = true;
    group.add(post);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.26), gold);
    cap.position.set(x, 2.49, -0.12);
    group.add(cap);
    for (const sz of [-0.48, 0.48]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 0.64), steel);
      arm.position.set(x, 1.32, -0.12 + sz * 0.55);
      group.add(arm);
    }
  }
  const cross = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.11, 0.14), steel);
  cross.position.set(-1.06, 2.5, -0.12);
  group.add(cross);
  const goldLine = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.025, 0.03), gold);
  goldLine.position.set(-1.06, 2.56, -0.12);
  group.add(goldLine);
  addBox(group, 0.32, 0.05, 0.9, makeDarkMetal(), -2.62, 1.19, 0.1);
  addBox(group, 0.32, 0.05, 0.9, makeDarkMetal(), 0.5, 1.19, 0.1);
  group.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      o.userData.interactiveKey = 'liftCar';
    }
  });
  return group;
}

function buildMechanic() {
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: '#c8956f', roughness: 0.7 });
  const overalls = new THREE.MeshStandardMaterial({ color: '#1c2d3c', roughness: 0.85 });
  const accent = new THREE.MeshStandardMaterial({ color: '#c9a465', roughness: 0.5, metalness: 0.5 });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.26, 4, 8), overalls);
  torso.position.y = 0.62;
  g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), skin);
  head.position.y = 0.91;
  g.add(head);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.105, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.5), overalls);
  cap.position.y = 0.94;
  g.add(cap);
  for (const sx of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.42, 6), overalls);
    leg.position.set(sx * 0.06, 0.21, 0);
    g.add(leg);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.033, 0.03, 0.34, 6), overalls);
    arm.position.set(sx * 0.16, 0.63, 0.03);
    arm.rotation.z = sx * 0.18;
    arm.rotation.x = 0.2;
    g.add(arm);
  }
  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.018, 6, 16), accent);
  belt.rotation.x = Math.PI / 2;
  belt.position.y = 0.48;
  g.add(belt);
  // 扳手
  const wrench = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.19, 0.03), makeSteelMaterial());
  wrench.position.set(0.26, 0.47, 0.14);
  wrench.rotation.z = 0.5;
  g.add(wrench);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

function buildCat() {
  const g = new THREE.Group();
  const fur = new THREE.MeshStandardMaterial({ color: '#22262e', roughness: 0.88 });
  const cream = new THREE.MeshStandardMaterial({ color: '#d9c9ae', roughness: 0.86 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), fur);
  body.scale.set(1.25, 0.72, 0.9);
  body.position.y = 0.1;
  g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), fur);
  head.position.set(0.14, 0.17, 0.02);
  g.add(head);
  for (const sx of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.065, 4), fur);
    ear.position.set(0.14 + sx * 0.05, 0.25, 0.02);
    g.add(ear);
  }
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 5), cream);
  muzzle.position.set(0.22, 0.155, 0.02);
  muzzle.scale.set(1, 0.7, 1);
  g.add(muzzle);
  const tail = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 5, 12, Math.PI * 1.35), fur);
  tail.rotation.x = Math.PI / 2;
  tail.position.set(-0.15, 0.05, 0);
  g.add(tail);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  g.userData.tail = tail;
  return g;
}

/* ------------------------------------------------------------------ */

function buildGarage(snowMaterial, snowMeshes) {
  const root = new THREE.Group();
  const x = BUILDINGS.garage.x;
  const z = BUILDINGS.garage.z;
  root.position.set(x, PLAZA_Y, z);
  root.name = 'goodwork-garage';

  const stoneTex = makeStoneTexture();
  stoneTex.repeat.set(2, 2);
  const stone = new THREE.MeshStandardMaterial({
    color: '#585b5c', map: stoneTex, roughness: 0.86, metalness: 0.08, envMapIntensity: 0.4,
  });
  const darkStone = new THREE.MeshStandardMaterial({ color: '#32373b', roughness: 0.52, metalness: 0.25, envMapIntensity: 0.8 });
  const polished = new THREE.MeshStandardMaterial({ color: '#1a2026', roughness: 0.22, metalness: 0.45, envMapIntensity: 1.35 });
  const wood = new THREE.MeshStandardMaterial({ color: '#5a4632', map: makeDarkWoodTexture(), roughness: 0.65, metalness: 0.1, envMapIntensity: 0.5 });
  const gold = makeGoldMaterial();
  const dark = makeDarkMetal();
  const white = new THREE.MeshStandardMaterial({ color: '#d9d3c6', roughness: 0.78 });
  const warmEmit = new THREE.MeshStandardMaterial({
    color: '#ffe4b8', emissive: '#ffb768', emissiveIntensity: 0.8, roughness: 0.5,
  });
  const glassMat = makeBuildingGlassMaterial('#d8ecff');
  const glass = (w, h, x0, y0, z0, ry = 0) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMat);
    m.position.set(x0, y0, z0);
    m.rotation.y = ry;
    m.userData.glass = true;
    m.renderOrder = 5;
    m.castShadow = false;
    m.receiveShadow = false;
    root.add(m);
    return m;
  };

  /* 基座与台阶 */
  addBox(root, 8.9, 0.24, 6.75, stone, 0, 0.12, 0);
  const podiumTop = new THREE.Mesh(new THREE.PlaneGeometry(8.85, 6.7), stone);
  podiumTop.rotation.x = -Math.PI / 2;
  podiumTop.position.y = 0.245;
  podiumTop.receiveShadow = true;
  root.add(podiumTop);
  for (let i = 0; i < 3; i++) {
    addBox(root, 4.4 - i * 0.12, 0.075, 0.34, darkStone, 0, 0.19 - i * 0.065, 3.62 - i * 0.31);
  }
  addBox(root, 7.9, 0.12, 5.72, polished, 0, 0.31, 0);

  /* 主体结构 */
  addBox(root, 7.72, 5.02, 0.14, wood, 0, 2.7, -2.72); // 背墙
  addBox(root, 0.1, 5.0, 2.7, darkStone, -3.82, 2.7, -1.32);
  addBox(root, 0.1, 5.0, 2.7, darkStone, 3.82, 2.7, -1.32);
  addBox(root, 0.12, 0.2, 5.7, dark, -3.83, 2.82, 0);
  addBox(root, 0.12, 0.2, 5.7, dark, 3.83, 2.82, 0);
  addBox(root, 7.94, 0.18, 5.86, dark, 0, 2.79, 0);       // 二层楼板
  addBox(root, 7.94, 0.2, 5.86, dark, 0, 5.08, 0);        // 屋顶
  addBox(root, 7.86, 0.08, 5.78, darkStone, 0, 5.21, 0);

  // 玻璃幕墙
  glass(7.55, 2.34, 0, 1.52, 2.72);
  glass(7.55, 2.1, 0, 3.98, 2.72);
  glass(2.72, 2.34, 3.79, 1.52, 1.31, -Math.PI / 2);
  glass(2.72, 2.1, 3.79, 3.98, 1.31, -Math.PI / 2);
  glass(2.72, 2.34, -3.79, 1.52, 1.31, Math.PI / 2);
  glass(2.72, 2.1, -3.79, 3.98, 1.31, Math.PI / 2);

  // 金色竖挺与横带（合并为一个批次）
  const mullionGeos = [];
  for (let i = 0; i <= 8; i++) {
    const mx = -3.75 + i * 0.9375;
    const g1 = new THREE.BoxGeometry(0.05, 2.36, 0.06);
    g1.translate(mx, 1.52, 2.76);
    mullionGeos.push(g1);
    const g2 = new THREE.BoxGeometry(0.05, 2.12, 0.06);
    g2.translate(mx, 3.98, 2.76);
    mullionGeos.push(g2);
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i <= 2; i++) {
      const mz = 0.05 + i * 1.25;
      const g1 = new THREE.BoxGeometry(0.06, 2.36, 0.05);
      g1.translate(side * 3.79, 1.52, mz);
      mullionGeos.push(g1);
      const g2 = new THREE.BoxGeometry(0.06, 2.12, 0.05);
      g2.translate(side * 3.79, 3.98, mz);
      mullionGeos.push(g2);
    }
  }
  const hband = new THREE.BoxGeometry(7.82, 0.07, 0.08);
  hband.translate(0, 2.79, 2.76);
  mullionGeos.push(hband);
  const hband2 = new THREE.BoxGeometry(7.82, 0.05, 0.07);
  hband2.translate(0, 5.0, 2.76);
  mullionGeos.push(hband2);
  for (const g of [-1, 1]) {
    const post = new THREE.BoxGeometry(0.1, 5.0, 0.1);
    post.translate(g * 3.8, 2.7, 2.76);
    mullionGeos.push(post);
  }
  const mullions = new THREE.Mesh(mergeGeometries(mullionGeos), gold);
  mullions.castShadow = true;
  mullions.userData.noPick = true;
  root.add(mullions);

  // 入口玻璃门
  addBox(root, 0.1, 2.35, 0.12, gold, -0.76, 1.5, 2.8);
  addBox(root, 0.1, 2.35, 0.12, gold, 0.76, 1.5, 2.8);
  addBox(root, 1.62, 0.09, 0.12, gold, 0, 2.68, 2.8);
  glass(1.42, 2.24, 0, 1.44, 2.815);
  addBox(root, 0.025, 0.9, 0.04, gold, -0.1, 1.42, 2.84);
  addBox(root, 0.025, 0.9, 0.04, gold, 0.1, 1.42, 2.84);

  // 门厅雨棚
  addBox(root, 2.9, 0.07, 1.05, dark, 0, 3.08, 3.28);
  addBox(root, 2.96, 0.028, 0.05, gold, 0, 3.13, 3.78);
  addBox(root, 2.96, 0.028, 0.05, gold, 0, 3.13, 2.8);
  for (const sx of [-1.2, 1.2]) {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.55, 6), gold);
    rod.position.set(sx, 2.84, 3.62);
    rod.rotation.x = 0.8;
    root.add(rod);
  }
  for (let i = 0; i < 5; i++) {
    const d = new THREE.Mesh(new THREE.CircleGeometry(0.032, 10), warmEmit);
    d.rotation.x = Math.PI / 2;
    d.position.set(-1.0 + i * 0.5, 3.04, 3.5);
    root.add(d);
  }

  /* 室内 */
  // 一层地面与地毯
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 5.4), polished);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.38;
  floor.receiveShadow = true;
  root.add(floor);
  const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 2.2),
    new THREE.MeshStandardMaterial({ color: '#4a3e36', roughness: 0.95 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(1.6, 0.385, 1.1);
  root.add(rug);
  // 楼梯
  for (let i = 0; i < 9; i++) {
    addBox(root, 1.0, 0.16, 0.3, darkStone, 2.95, 0.44 + i * 0.27, 1.6 - i * 0.31, { cast: false });
  }
  addBox(root, 0.05, 0.9, 2.9, glassMat, 2.4, 1.65, 0.15, { });
  // 二层栏杆玻璃
  const railGlass = glassMat;
  addBox(root, 7.2, 0.85, 0.03, railGlass, 0, 3.26, 1.95, { cast: false, receive: false });

  // 接待台
  addBox(root, 2.2, 0.62, 0.68, darkStone, 2.15, 0.7, -0.95);
  addBox(root, 2.24, 0.06, 0.72, gold, 2.15, 1.03, -0.95);
  addBox(root, 1.7, 0.5, 0.04, wood, 2.15, 0.65, -0.6);
  const monitor = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.36), makeCanvasScreenMaterial(makeInteriorScreenTexture(), 1.15));
  monitor.position.set(2.15, 1.22, -0.98);
  monitor.rotation.x = -0.12;
  root.add(monitor);
  const monitorStand = addBox(root, 0.05, 0.2, 0.05, dark, 2.15, 1.05, -1.0);
  monitorStand.userData.noPick = true;
  // 接待台暖灯
  const deskLamp = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), warmEmit);
  deskLamp.position.set(1.3, 1.12, -0.8);
  root.add(deskLamp);
  const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.25, 5), gold);
  lampStem.position.set(1.3, 1.0, -0.8);
  root.add(lampStem);

  // 背景墙招牌
  const backLogo = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 1.18),
    makeSignMaterial(makeBuildingSignTexture('古德車房', 'GOODWORK FINANCE ATELIER', 'GOODWORK'), { emissive: 1.5 })
  );
  backLogo.position.set(-0.45, 2.14, -2.62);
  root.add(backLogo);
  // 展陈屏幕
  const wallScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 0.85), makeCanvasScreenMaterial(makeTerminalScreenTexture(), 0.9));
  wallScreen.position.set(3.0, 2.1, -2.62);
  wallScreen.rotation.y = -0.15;
  root.add(wallScreen);

  // 举升机与跑车
  const lift = buildLift();
  lift.position.set(0, 0, 0);
  root.add(lift);
  const car = buildHeroCar();
  car.position.set(-1.06, 1.36, -0.1);
  root.add(car);
  // 玻璃后车辆的拾取代理（玻璃优先级 + 非玻璃命中）
  const carPick = new THREE.Mesh(
    new THREE.SphereGeometry(1.25, 10, 8),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false })
  );
  carPick.position.set(-1.06, 1.75, 0.15);
  carPick.userData.interactiveKey = 'liftCar';
  carPick.renderOrder = -1;
  root.add(carPick);
  addBox(root, 0.22, 0.03, 1.9, new THREE.MeshStandardMaterial({ color: '#1a1d22', roughness: 0.95 }), -1.06, 0.39, -0.1, { cast: false });

  const mechanic = buildMechanic();
  mechanic.position.set(0.32, 0.38, 0.72);
  mechanic.rotation.y = -0.9;
  mechanic.scale.setScalar(0.95);
  root.add(mechanic);

  // 工具柜 / 轮胎 / 绿植
  addBox(root, 1.2, 1.0, 0.48, new THREE.MeshStandardMaterial({ color: '#26303a', roughness: 0.6, metalness: 0.4 }), -3.0, 0.88, -2.28);
  addBox(root, 1.16, 0.03, 0.44, gold, -3.0, 1.4, -2.28, { cast: false });
  for (let i = 0; i < 3; i++) {
    const tire = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.09, 8, 16), new THREE.MeshStandardMaterial({ color: '#14161a', roughness: 0.92 }));
    tire.rotation.x = Math.PI / 2;
    tire.position.set(-3.3, 0.46 + i * 0.13, -1.3);
    tire.castShadow = true;
    root.add(tire);
  }
  for (const [px, pz] of [[-2.2, 2.3], [2.7, 2.25]]) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.28, 12), darkStone);
    pot.position.set(px, 0.53, pz);
    root.add(pot);
    const plant = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 1), new THREE.MeshStandardMaterial({ color: '#4f7f4b', roughness: 0.9 }));
    plant.position.set(px, 0.77, pz);
    plant.scale.set(1, 0.85, 1);
    root.add(plant);
  }

  // 二层陈设
  addBox(root, 2.4, 0.28, 0.8, new THREE.MeshStandardMaterial({ color: '#2d3239', roughness: 0.82 }), -1.2, 3.0, -0.2);
  addBox(root, 0.9, 0.22, 0.9, new THREE.MeshStandardMaterial({ color: '#4d4034', roughness: 0.6 }), -1.2, 3.0, -1.35);
  addBox(root, 1.1, 0.4, 0.12, new THREE.MeshStandardMaterial({ color: '#2d3239', roughness: 0.82 }), -1.2, 3.35, -0.45);
  for (const [px, pz] of [[1.2, -0.5], [1.5, -1.1]]) {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.08, 0.24, 8), warmEmit);
    lamp.position.set(px, 3.15, pz);
    root.add(lamp);
  }

  // 顶部灯带
  for (let i = 0; i < 3; i++) {
    addBox(root, 0.1, 0.03, 4.4, warmEmit, -2.2 + i * 2.2, 2.66, 0, { cast: false });
    addBox(root, 0.1, 0.03, 4.4, new THREE.MeshStandardMaterial({ color: '#fff1d8', emissive: '#ffd49a', emissiveIntensity: 0.85, roughness: 0.4 }), -2.2 + i * 2.2, 4.96, 0, { cast: false });
  }

  /* 招牌系统 */
  // 主招牌
  const mainSignTex = makeMainSignTexture();
  const signFrame = addBox(root, 6.55, 1.32, 0.18, dark, 0, 5.92, 2.18);
  signFrame.userData.interactiveKey = 'mainSign';
  const mainSign = new THREE.Mesh(new THREE.PlaneGeometry(6.32, 1.12), makeSignMaterial(mainSignTex, { emissive: 2.1 }));
  mainSign.position.set(0, 5.92, 2.275);
  mainSign.userData.interactiveKey = 'mainSign';
  root.add(mainSign);
  // 招牌边框灯带
  addBox(root, 6.55, 0.035, 0.03, new THREE.MeshBasicMaterial({ color: '#ffd99a' }), 0, 6.59, 2.29, { cast: false }).userData.interactiveKey = 'mainSign';
  addBox(root, 6.55, 0.035, 0.03, new THREE.MeshBasicMaterial({ color: '#ffd99a' }), 0, 5.25, 2.29, { cast: false }).userData.interactiveKey = 'mainSign';
  for (const sx of [-2.6, 2.6]) {
    addBox(root, 0.09, 0.55, 0.09, gold, sx, 5.28, 2.25);
  }
  // 屋顶栏杆与设备
  const roofRailGeos = [];
  for (let i = 0; i < 8; i++) {
    const g1 = new THREE.BoxGeometry(0.035, 0.36, 0.035);
    g1.translate(-3.6 + i * 1.03, 5.44, 2.8);
    roofRailGeos.push(g1);
  }
  const roofRail = new THREE.Mesh(mergeGeometries(roofRailGeos), gold);
  root.add(roofRail);
  const railBar = addBox(root, 7.4, 0.035, 0.035, gold, 0, 5.62, 2.8, { cast: false });
  railBar.userData.noPick = true;
  addBox(root, 1.1, 0.6, 0.75, dark, 2.2, 5.4, -1.2);
  addBox(root, 0.55, 0.42, 0.55, dark, -2.3, 5.35, -1.5);
  // 屋顶绿化
  for (const sx of [-1.2, -0.1]) {
    addBox(root, 0.6, 0.22, 0.4, darkStone, sx, 5.3, -2.2);
    const shrub = new THREE.Mesh(new THREE.IcosahedronGeometry(0.18, 1), new THREE.MeshStandardMaterial({ color: '#4f7a4b', roughness: 0.9 }));
    shrub.position.set(sx, 5.5, -2.2);
    root.add(shrub);
  }

  // 竖式灯箱
  addBox(root, 0.96, 3.7, 0.22, dark, -3.3, 2.56, 2.95);
  const vSign = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 3.5), makeSignMaterial(makeVerticalSignTexture(), { emissive: 1.5 }));
  vSign.position.set(-3.3, 2.56, 3.07);
  vSign.userData.interactiveKey = 'verticalSign';
  root.add(vSign);
  addBox(root, 0.98, 0.07, 0.26, gold, -3.3, 4.44, 2.95).userData.noPick = true;
  addBox(root, 0.98, 0.07, 0.26, gold, -3.3, 0.68, 2.95).userData.noPick = true;

  // 侧招
  const bladeFrame = addBox(root, 1.62, 0.98, 0.12, dark, 4.45, 4.22, 2.35);
  bladeFrame.userData.interactiveKey = 'bladeSign';
  const bladeMat = makeSignMaterial(makeBladeSignTexture(), { emissive: 1.35, side: THREE.DoubleSide });
  const blade = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.86), bladeMat);
  blade.position.set(4.45, 4.22, 2.42);
  blade.userData.interactiveKey = 'bladeSign';
  root.add(blade);
  addBox(root, 1.5, 0.03, 0.03, new THREE.MeshBasicMaterial({ color: '#ffd78f' }), 4.45, 4.67, 2.43, { cast: false }).userData.interactiveKey = 'bladeSign';
  addBox(root, 0.55, 0.06, 0.06, gold, 3.98, 4.55, 2.2);
  addBox(root, 0.62, 0.06, 0.06, gold, 3.9, 3.9, 2.2);

  // 门牌与广告牌
  const plaque = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.34), makeSignMaterial(makePlateTexture('NO. 07'), { emissive: 0.15 }));
  plaque.position.set(-2.5, 2.35, 2.78);
  root.add(plaque);

  // 门前花箱与拦车柱
  for (const sx of [-2.55, 2.55]) {
    addBox(root, 0.72, 0.36, 0.5, darkStone, sx, 0.42, 3.48);
    const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.21, 1), new THREE.MeshStandardMaterial({ color: '#587f4d', roughness: 0.9 }));
    bush.position.set(sx, 0.65, 3.48);
    bush.scale.set(1.15, 0.9, 1);
    bush.castShadow = true;
    root.add(bush);
  }
  const bollardMat = new THREE.MeshStandardMaterial({ color: '#23282f', roughness: 0.5, metalness: 0.55 });
  for (const sx of [-3.7, -2.0, 2.0, 3.7]) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.5, 8), bollardMat);
    b.position.set(sx, 0.5, 3.0);
    root.add(b);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 8), gold);
    cap.position.set(sx, 0.76, 3.0);
    root.add(cap);
  }

  // 屋顶雪
  addSnow(root, 7.86, 0.06, 5.78, 0, 5.27, 0, snowMaterial, snowMeshes);
  addSnow(root, 2.86, 0.05, 1.0, 0, 3.13, 3.28, snowMaterial, snowMeshes);
  addSnow(root, 6.1, 0.05, 0.2, 0, 6.63, 2.3, snowMaterial, snowMeshes);

  // 猫咪
  const cat = buildCat();
  cat.position.set(-2.0, 0.31, 3.88);
  cat.rotation.y = 1.2;
  root.add(cat);

  // 灯光
  const warmLight = new THREE.PointLight('#ffc98f', 10.5, 7, 2);
  warmLight.position.set(-0.9, 2.2, 0.6);
  root.add(warmLight);
  const warmLight2 = new THREE.PointLight('#ffddb0', 5.2, 5.5, 2);
  warmLight2.position.set(1.5, 4.1, 0.4);
  root.add(warmLight2);
  const carSpot = new THREE.SpotLight('#ffd3a1', 55, 9, 0.62, 0.7, 2);
  carSpot.position.set(-0.2, 2.6, 2.5);
  carSpot.target.position.set(-1.06, 1.5, -0.1);
  root.add(carSpot, carSpot.target);
  const carFill = new THREE.PointLight('#ffc684', 6.5, 3.6, 2);
  carFill.position.set(-1.5, 2.0, 0.65);
  root.add(carFill);
  // 展示台暖光
  const displayGlow = new THREE.Mesh(
    new THREE.CircleGeometry(0.85, 32),
    new THREE.MeshBasicMaterial({ color: '#f3c987', transparent: true, opacity: 0.11, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  );
  displayGlow.rotation.x = -Math.PI / 2;
  displayGlow.position.set(-1.06, 0.4, -0.1);
  displayGlow.userData.noPick = true;
  root.add(displayGlow);

  return {
    root, car, lift, cat, glassMat, warmLight,
    anchors: {
      garage: new THREE.Vector3(x, PLAZA_Y + 7.2, z + 0.6),
      mainSign: new THREE.Vector3(x, PLAZA_Y + 6.1, z + 1.7),
      verticalSign: new THREE.Vector3(x - 3.3, PLAZA_Y + 4.6, z + 3.1),
      bladeSign: new THREE.Vector3(x + 4.45, PLAZA_Y + 4.8, z + 2.5),
      liftCar: new THREE.Vector3(x - 1.05, PLAZA_Y + 2.3, z - 0.1),
    },
  };
}

/* ------------------------------------------------------------------ */

function buildFinanceOffice(snowMaterial, snowMeshes) {
  const b = BUILDINGS.finance;
  const root = new THREE.Group();
  const y = heightAt(b.x, b.z) - 0.05;
  root.position.set(b.x, y, b.z);
  root.rotation.y = b.rot;

  const stone = new THREE.MeshStandardMaterial({ color: '#6b6458', roughness: 0.82, metalness: 0.05 });
  const cream = new THREE.MeshStandardMaterial({ color: '#c6b395', roughness: 0.75 });
  const dark = makeDarkMetal();
  const gold = makeGoldMaterial();
  const glassMat = makeBuildingGlassMaterial('#cfe4f8');
  const warm = new THREE.MeshStandardMaterial({ color: '#ffe6b7', emissive: '#ffb86c', emissiveIntensity: 1.1, roughness: 0.5 });
  const screenMat = makeCanvasScreenMaterial(makeInteriorScreenTexture(), 1.0);

  addBox(root, 3.85, 0.22, 3.5, stone, 0, 0.11, 0);
  addBox(root, 3.3, 3.9, 2.72, cream, 0, 2.0, -0.1);
  // 前玻璃
  const gf = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.5), glassMat);
  gf.position.set(0, 1.15, 1.28);
  gf.userData.glass = true;
  gf.renderOrder = 5;
  root.add(gf);
  const uf = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.5), glassMat);
  uf.position.set(0, 3.06, 1.28);
  uf.userData.glass = true;
  uf.renderOrder = 5;
  root.add(uf);
  // 金色竖框
  for (const sx of [-1.5, -0.5, 0.5, 1.5]) addBox(root, 0.045, 3.7, 0.06, gold, sx, 2.12, 1.3);
  addBox(root, 3.2, 0.08, 0.09, gold, 0, 2.3, 1.3);
  addBox(root, 3.2, 0.1, 0.09, gold, 0, 4.0, 1.3);
  // 入口
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 1.6), glassMat);
  door.position.set(0, 1.0, 1.32);
  door.userData.glass = true;
  root.add(door);
  addBox(root, 0.05, 1.7, 0.08, gold, -0.43, 1.04, 1.33);
  addBox(root, 0.05, 1.7, 0.08, gold, 0.43, 1.04, 1.33);
  // 标牌
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.62), makeSignMaterial(makeBuildingSignTexture('财务室', 'FINANCE OFFICE', 'GOODWORK'), { emissive: 1.1 }));
  sign.position.set(0, 3.55, 1.44);
  root.add(sign);
  // 上层暖窗
  const winMat = warm;
  for (const sx of [-0.95, 0.95]) {
    addBox(root, 0.55, 0.72, 0.03, winMat, sx, 3.2, 1.34, { cast: false });
  }
  // 金币徽记
  const coin = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 8, 24), gold);
  coin.position.set(1.65, 4.25, 1.2);
  root.add(coin);
  const coinIn = new THREE.Mesh(new THREE.CircleGeometry(0.19, 24), gold);
  coinIn.position.set(1.65, 4.25, 1.21);
  root.add(coinIn);
  addBox(root, 1.0, 0.26, 0.6, dark, -1.1, 4.2, 0.9);
  // 台阶与队列
  for (let i = 0; i < 2; i++) addBox(root, 1.5 - i * 0.1, 0.06, 0.25, stone, 0, 0.16 - i * 0.055, 1.55 + i * 0.24);
  for (const sx of [-0.85, 0.85]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.5, 6), gold);
    post.position.set(sx, 0.4, 1.85);
    root.add(post);
  }
  const rope = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.008, 4, 20, Math.PI), new THREE.MeshStandardMaterial({ color: '#5c4630', roughness: 0.8 }));
  rope.rotation.x = Math.PI / 2;
  rope.rotation.z = Math.PI;
  rope.position.set(0, 0.5, 1.85);
  root.add(rope);
  // 植物
  for (const sx of [-1.65, 1.65]) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.28, 10), stone);
    pot.position.set(sx, 0.25, 1.45);
    root.add(pot);
    const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.24, 1), new THREE.MeshStandardMaterial({ color: '#5b8051', roughness: 0.9 }));
    bush.position.set(sx, 0.55, 1.45);
    bush.scale.set(1, 0.9, 1);
    bush.castShadow = true;
    root.add(bush);
  }
  // 屋顶与雪
  addBox(root, 3.7, 0.16, 3.1, dark, 0, 4.05, -0.1);
  addBox(root, 3.74, 0.05, 3.14, gold, 0, 4.14, -0.1, { cast: false }).userData.noPick = true;
  addSnow(root, 3.56, 0.07, 2.96, 0, 4.21, -0.1, snowMaterial, snowMeshes);
  // 灯光
  const light = new THREE.PointLight('#ffd2a0', 6, 4.5, 2);
  light.position.set(0, 2.2, 0.3);
  root.add(light);
  // 屏
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.66), screenMat);
  scr.position.set(0.9, 1.7, -0.9);
  root.add(scr);

  pickProxy(root, 3.9, 4.5, 3.5, 0, 2.1, 0, 'finance');
  tagGroup(root, 'finance');
  return { root, glassMat, anchors: { finance: new THREE.Vector3(b.x, y + 5.2, b.z + 0.4) } };
}

/* ------------------------------------------------------------------ */

function buildWarehouse(snowMaterial, snowMeshes) {
  const b = BUILDINGS.warehouse;
  const root = new THREE.Group();
  const y = heightAt(b.x, b.z) - 0.05;
  root.position.set(b.x, y, b.z);
  root.rotation.y = b.rot;

  const wall = new THREE.MeshStandardMaterial({ color: '#2f4238', roughness: 0.78, metalness: 0.15 });
  const trim = new THREE.MeshStandardMaterial({ color: '#203029', roughness: 0.6, metalness: 0.3 });
  const stone = new THREE.MeshStandardMaterial({ color: '#575850', roughness: 0.9 });
  const gold = makeGoldMaterial();
  const dark = makeDarkMetal();
  const wood = new THREE.MeshStandardMaterial({ color: '#7c5b36', roughness: 0.9 });

  addBox(root, 4.3, 0.2, 3.5, stone, 0, 0.1, 0);
  addBox(root, 3.9, 2.7, 2.9, wall, 0, 1.55, 0);
  // 山形屋顶
  const angle = 0.34;
  for (const sz of [-1, 1]) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(4.25, 0.1, 1.85), trim);
    slab.position.set(0, 3.15, sz * 0.79);
    slab.rotation.x = -sz * angle;
    slab.castShadow = true;
    root.add(slab);
    const snow = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.05, 1.8), snowMaterial);
    snow.position.set(0, 3.21, sz * 0.79);
    snow.rotation.x = -sz * angle;
    snow.userData.noPick = true;
    root.add(snow);
    snowMeshes.push(snow);
  }
  addBox(root, 4.3, 0.13, 0.16, gold, 0, 3.42, 0, { cast: false });
  // 卷帘门
  addBox(root, 2.45, 2.2, 0.1, dark, 0, 1.25, 1.48);
  for (let i = 0; i < 9; i++) addBox(root, 2.3, 0.035, 0.03, new THREE.MeshStandardMaterial({ color: '#3b464e', roughness: 0.55, metalness: 0.4 }), 0, 0.35 + i * 0.23, 1.54, { cast: false });
  addBox(root, 2.5, 0.07, 0.08, gold, 0, 2.38, 1.55, { cast: false });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.58), makeSignMaterial(makeBuildingSignTexture('仓库', 'WAREHOUSE', 'GOODWORK LOGISTICS'), { emissive: 1.0 }));
  sign.position.set(0, 2.72, 1.57);
  root.add(sign);
  // 侧窗
  for (const sz of [-0.85, 0.1]) addBox(root, 0.55, 0.55, 0.03, new THREE.MeshStandardMaterial({ color: '#9fc0c4', emissive: '#5c8790', emissiveIntensity: 0.5, roughness: 0.2, metalness: 0.3 }), 1.96, 2.0, sz);
  // 货箱
  const cratePositions = [[-1.6, 0.35, 1.9, 0.65], [-0.85, 0.28, 1.95, 0.45], [-2.3, 0.24, 1.6, 0.4], [1.5, 0.3, 1.85, 0.5]];
  for (const [cx, cy, cz, s] of cratePositions) {
    addBox(root, s, s * 0.75, s, wood, cx, cy, cz, { rotY: rnd() * 0.3 });
    addBox(root, s * 0.85, 0.03, s * 0.06, dark, cx, cy + s * 0.28, cz - s * 0.45, { cast: false });
  }
  // 油桶
  for (let i = 0; i < 2; i++) {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.48, 12), new THREE.MeshStandardMaterial({ color: '#5b3a2c', roughness: 0.7, metalness: 0.3 }));
    barrel.position.set(1.9 + i * 0.36, 0.34, 1.7);
    barrel.castShadow = true;
    root.add(barrel);
  }
  // 壁灯
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), new THREE.MeshStandardMaterial({ color: '#ffe2ae', emissive: '#ffb257', emissiveIntensity: 1.6 }));
  lamp.position.set(-1.85, 2.5, 1.5);
  root.add(lamp);
  // 雪
  addSnow(root, 4.2, 0.05, 1.0, 0, 3.3, 1.55, snowMaterial, snowMeshes, -0.34);
  // 灯
  const light = new THREE.PointLight('#ffc58a', 4.5, 4, 2);
  light.position.set(-0.9, 2.4, 0.8);
  root.add(light);

  pickProxy(root, 4.3, 3.6, 3.5, 0, 1.8, 0, 'warehouse');
  tagGroup(root, 'warehouse');
  return { root, anchors: { warehouse: new THREE.Vector3(b.x, y + 4.0, b.z + 0.5) } };
}

/* ------------------------------------------------------------------ */

function buildDorm(snowMaterial, snowMeshes) {
  const b = BUILDINGS.dorm;
  const root = new THREE.Group();
  const y = heightAt(b.x, b.z) - 0.05;
  root.position.set(b.x, y, b.z);
  root.rotation.y = b.rot;

  const plaster = new THREE.MeshStandardMaterial({ color: '#a58d74', roughness: 0.88 });
  const timber = new THREE.MeshStandardMaterial({ color: '#4b382c', roughness: 0.78 });
  const stone = new THREE.MeshStandardMaterial({ color: '#5d5b52', roughness: 0.9 });
  const gold = makeGoldMaterial();
  const dark = makeDarkMetal();
  const glow = new THREE.MeshStandardMaterial({ color: '#ffe3b0', emissive: '#ffb45e', emissiveIntensity: 1.25, roughness: 0.45 });

  addBox(root, 3.7, 0.2, 3.4, stone, 0, 0.1, 0);
  addBox(root, 3.3, 3.5, 2.9, plaster, 0, 1.9, 0);
  // 木构架
  for (const sx of [-1.55, 0, 1.55]) addBox(root, 0.12, 3.4, 0.1, timber, sx, 1.92, 1.47);
  addBox(root, 3.3, 0.12, 0.1, timber, 0, 2.3, 1.47);
  addBox(root, 3.3, 0.12, 0.1, timber, 0, 3.5, 1.47);
  addBox(root, 3.5, 0.12, 3.1, timber, 0, 3.62, 0);
  // 屋顶
  const angle = 0.5;
  for (const sz of [-1, 1]) {
    const roof = new THREE.Mesh(new THREE.BoxGeometry(3.85, 0.1, 1.95), new THREE.MeshStandardMaterial({ color: '#4b3a2f', roughness: 0.82 }));
    roof.position.set(0, 4.0, sz * 0.82);
    roof.rotation.x = -sz * angle;
    roof.castShadow = true;
    root.add(roof);
    const snow = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.06, 1.9), snowMaterial);
    snow.position.set(0, 4.07, sz * 0.82);
    snow.rotation.x = -sz * angle;
    snow.userData.noPick = true;
    root.add(snow);
    snowMeshes.push(snow);
  }
  addBox(root, 3.9, 0.1, 0.14, gold, 0, 4.3, 0, { cast: false });
  // 烟囱
  addBox(root, 0.32, 0.8, 0.32, new THREE.MeshStandardMaterial({ color: '#5b4a3d', roughness: 0.9 }), 1.1, 4.25, -0.55);
  addSnow(root, 0.38, 0.04, 0.38, 1.1, 4.68, -0.55, snowMaterial, snowMeshes);
  // 窗户
  const winPositions = [[-1.0, 2.75], [0.95, 2.75], [-0.95, 1.35], [0.95, 1.35]];
  for (const [wx, wy] of winPositions) {
    addBox(root, 0.52, 0.62, 0.04, new THREE.MeshStandardMaterial({ color: '#3b2c23', roughness: 0.6 }), wx, wy, 1.48);
    addBox(root, 0.42, 0.5, 0.02, glow, wx, wy, 1.51, { cast: false });
    addBox(root, 0.02, 0.5, 0.025, timber, wx, wy, 1.52, { cast: false });
    addBox(root, 0.42, 0.02, 0.025, timber, wx, wy, 1.52, { cast: false });
  }
  // 阳台
  addBox(root, 1.6, 0.07, 0.55, timber, -0.55, 3.2, 1.62);
  for (let i = 0; i < 5; i++) {
    addBox(root, 0.025, 0.42, 0.025, gold, -1.3 + i * 0.38, 3.45, 1.86);
  }
  addBox(root, 1.55, 0.03, 0.03, gold, -0.55, 3.66, 1.86);
  // 门
  addBox(root, 0.7, 1.55, 0.08, timber, 0, 0.98, 1.49);
  addBox(root, 0.075, 1.62, 0.1, gold, -0.4, 1.0, 1.5);
  addBox(root, 0.075, 1.62, 0.1, gold, 0.4, 1.0, 1.5);
  addBox(root, 0.06, 0.06, 0.06, gold, 0.22, 1.0, 1.56);
  // 标牌
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.52), makeSignMaterial(makeBuildingSignTexture('员工宿舍', 'STAFF RESIDENCE', 'GOODWORK LIVING'), { emissive: 0.95 }));
  sign.position.set(0, 3.95, 1.52);
  root.add(sign);
  // 台阶
  for (let i = 0; i < 2; i++) addBox(root, 1.1, 0.06, 0.24, stone, 0, 0.17 - i * 0.055, 1.65 + i * 0.22);
  // 自行车（简化）
  const bike = new THREE.Group();
  for (const bz of [-0.3, 0.3]) {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.018, 5, 14), dark);
    wheel.position.set(0, 0.17, bz);
    bike.add(wheel);
  }
  const frame = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.55, 4), new THREE.MeshStandardMaterial({ color: '#8e6b3f', metalness: 0.5, roughness: 0.5 }));
  frame.rotation.x = Math.PI / 2;
  frame.position.set(0, 0.24, 0);
  bike.add(frame);
  bike.position.set(-1.9, 0.03, 1.5);
  bike.rotation.y = 0.35;
  root.add(bike);
  // 灯
  const light = new THREE.PointLight('#ffc387', 5, 4.2, 2);
  light.position.set(0, 2.3, 0.8);
  root.add(light);
  // 屋檐雪
  addSnow(root, 3.85, 0.05, 0.32, 0, 3.72, 1.52, snowMaterial, snowMeshes);

  pickProxy(root, 3.8, 4.4, 3.5, 0, 2.2, 0, 'dorm');
  tagGroup(root, 'dorm');
  return { root, anchors: { dorm: new THREE.Vector3(b.x, y + 4.9, b.z + 0.4) } };
}

/* ------------------------------------------------------------------ */

export function createBuildings(scene, snowMaterial, snowMeshes) {
  const group = new THREE.Group();
  group.name = 'buildings';
  scene.add(group);

  const garage = buildGarage(snowMaterial, snowMeshes);
  group.add(garage.root);

  const finance = buildFinanceOffice(snowMaterial, snowMeshes);
  group.add(finance.root);
  const warehouse = buildWarehouse(snowMaterial, snowMeshes);
  group.add(warehouse.root);
  const dorm = buildDorm(snowMaterial, snowMeshes);
  group.add(dorm.root);

  // 车库整体 key（已显式标记特殊元素与车辆）
  tagGroup(garage.root, 'garage');
  // 玻璃仍保留 glass 标记
  garage.root.traverse((o) => {
    if (o.isMesh && o.userData.glass) o.userData.interactiveKey = o.userData.interactiveKey || 'garage';
  });

  const anchors = {
    ...garage.anchors,
    ...finance.anchors,
    ...warehouse.anchors,
    ...dorm.anchors,
  };

  const glassMaterials = [garage.glassMat, finance.glassMat];

  function update(dt, time) {
    if (garage.cat?.userData.tail) {
      garage.cat.userData.tail.rotation.z = Math.sin(time * 0.9) * 0.12;
    }
    garage.warmLight.intensity = 10.2 + Math.sin(time * 2.1) * 0.5;
  }

  return {
    group,
    garage: garage.root,
    garageData: garage,
    finance: finance.root,
    warehouse: warehouse.root,
    dorm: dorm.root,
    anchors,
    pickProxies: [],
    glassMaterials,
    update,
  };
}
