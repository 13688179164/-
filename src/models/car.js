import * as THREE from 'three';
import { addMesh, box, canvasTexture, ellipsoid, limb, physical, standard, tag, textPlate, tube } from './parts.js';

function extrudedProfile(parent, points, width, mat, bevel = 0.035) {
  const shape = new THREE.Shape(points.map(([z, y]) => new THREE.Vector2(z, y)));
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    steps: 1,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 12,
  });
  geometry.translate(0, 0, -width / 2);
  geometry.rotateY(-Math.PI / 2);
  return addMesh(parent, geometry, mat);
}

function sidePanel(parent, side, points, mat, x = 0.802) {
  const shape = new THREE.Shape(points.map(([z, y]) => new THREE.Vector2(-side * z, y)));
  const panel = addMesh(parent, new THREE.ShapeGeometry(shape), mat, [side * x, 0, 0], [1, 1, 1], [0, side * Math.PI / 2, 0]);
  panel.material.side = THREE.DoubleSide;
  return panel;
}

function createLogo() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#151a1b';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 124, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8eded';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 89, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = i % 2 === 0 ? '#2c85b9' : '#f2f4f2';
      ctx.beginPath();
      ctx.moveTo(w / 2, h / 2);
      ctx.arc(w / 2, h / 2, 84, i * Math.PI / 2, (i + 1) * Math.PI / 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 34px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BMW', w / 2, 48);
  });
}

function createWheel(parent, x, z, paint, trims) {
  const wheel = new THREE.Group();
  wheel.position.set(x, 0.38, z);
  parent.add(wheel);
  const side = Math.sign(x);
  const tire = standard('#121514', 0.88);
  const rubberSide = standard('#242826', 0.82);
  const alloy = physical('#b8bdba', { metalness: 0.9, roughness: 0.23, clearcoat: 0.4 });
  const darkAlloy = physical('#505653', { metalness: 0.82, roughness: 0.32 });
  const brake = standard('#777d79', 0.48, 0.75);
  const caliper = physical('#466c83', { metalness: 0.55, roughness: 0.3 });

  addMesh(wheel, new THREE.CylinderGeometry(0.345, 0.345, 0.235, 48, 2), tire, [0, 0, 0], [1, 1, 1], [0, 0, Math.PI / 2]);
  addMesh(wheel, new THREE.TorusGeometry(0.269, 0.071, 16, 48), rubberSide, [side * 0.121, 0, 0], [1, 1, 1], [0, Math.PI / 2, 0]);
  addMesh(wheel, new THREE.CylinderGeometry(0.238, 0.238, 0.018, 48), darkAlloy, [side * 0.13, 0, 0], [1, 1, 1], [0, 0, Math.PI / 2]);
  addMesh(wheel, new THREE.CylinderGeometry(0.19, 0.19, 0.02, 40), brake, [side * 0.143, 0, 0], [1, 1, 1], [0, 0, Math.PI / 2]);
  box(wheel, [0.025, 0.11, 0.05], [side * 0.16, 0.03, -0.15], caliper, 0.008);

  for (let i = 0; i < 10; i += 1) {
    const angle = (i / 10) * Math.PI * 2;
    const spoke = box(wheel, [0.025, 0.17, 0.018], [side * 0.166, Math.cos(angle) * 0.115, Math.sin(angle) * 0.115], alloy, 0.006);
    spoke.rotation.x = -angle;
  }
  addMesh(wheel, new THREE.CylinderGeometry(0.053, 0.053, 0.035, 32), alloy, [side * 0.168, 0, 0], [1, 1, 1], [0, 0, Math.PI / 2]);
  addMesh(wheel, new THREE.CircleGeometry(0.036, 24), new THREE.MeshBasicMaterial({ map: createLogo(), transparent: true }), [side * 0.188, 0, 0], [1, 1, 1], [0, side * Math.PI / 2, 0]);

  const arch = addMesh(parent, new THREE.TorusGeometry(0.373, 0.022, 8, 40, Math.PI), trims, [side * 0.921, 0.39, z], [1, 1, 1], [0, Math.PI / 2, 0]);
  arch.castShadow = false;
  return wheel;
}

export function createCar() {
  const group = new THREE.Group();
  group.name = 'BMW325i';
  tag(group, 'BMW 325i · 2025', 'VEHICLE / PEARL WHITE', '以 2025 款宝马 3 系 325i 为设计参考的比例模型。珍珠白车身搭配双肾格栅、锐利 LED 灯组、多辐轮毂和黑色全景天窗。', ['珍珠白车漆', '后驱运动轿车', '独立轮毂与灯组']);

  const paint = physical('#f2f2ed', { metalness: 0.42, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.12 });
  const paintShadow = physical('#d9dcd7', { metalness: 0.35, roughness: 0.27, clearcoat: 0.85 });
  const trim = standard('#1a201f', 0.44, 0.25);
  const chrome = physical('#b8bfbd', { metalness: 0.92, roughness: 0.2, clearcoat: 0.65 });
  const glass = physical('#17282d', { metalness: 0.35, roughness: 0.12, clearcoat: 1, transparent: true, opacity: 0.91 });
  const glassSide = physical('#20353b', { metalness: 0.25, roughness: 0.15, clearcoat: 1, transparent: true, opacity: 0.88, side: THREE.DoubleSide });
  const light = physical('#d9f0f3', { emissive: '#b5e4ee', emissiveIntensity: 2.3, roughness: 0.15, clearcoat: 1 });
  const redLight = physical('#a81019', { emissive: '#df1726', emissiveIntensity: 1.25, roughness: 0.24, clearcoat: 1 });

  extrudedProfile(group, [
    [-2.33, 0.39], [-2.34, 0.66], [-2.23, 0.81], [-1.88, 0.91], [-1.15, 0.96],
    [0.82, 0.98], [1.48, 0.91], [2.11, 0.78], [2.31, 0.63], [2.34, 0.42],
    [2.22, 0.31], [1.95, 0.27], [-1.95, 0.27], [-2.22, 0.31],
  ], 1.78, paint, 0.055);

  extrudedProfile(group, [
    [-1.37, 0.93], [-0.79, 1.37], [-0.55, 1.43], [0.19, 1.45], [0.39, 1.39], [1.03, 0.95],
  ], 1.55, glass, 0.025);

  box(group, [1.49, 0.065, 1.03], [0, 1.424, -0.28], paint, 0.03, [0.015, 0, 0]);
  box(group, [1.32, 0.018, 0.72], [0, 1.462, -0.31], glass, 0.025, [0.015, 0, 0]);
  box(group, [1.46, 0.026, 0.88], [0, 1.188, 0.625], glass, 0.018, [0.575, 0, 0]);
  box(group, [1.42, 0.025, 0.68], [0, 1.16, -1.05], glass, 0.018, [-0.69, 0, 0]);
  box(group, [1.65, 0.055, 1.06], [0, 0.93, 1.44], paint, 0.025, [0.075, 0, 0]);
  box(group, [1.65, 0.06, 0.54], [0, 0.885, -1.99], paint, 0.025, [-0.06, 0, 0]);

  [-1, 1].forEach((side) => {
    sidePanel(group, side, [[-0.245, 1.385], [0.18, 1.398], [0.33, 1.34], [0.91, 0.998], [-0.245, 0.998]], glassSide);
    sidePanel(group, side, [[-1.18, 0.998], [-0.75, 1.335], [-0.55, 1.385], [-0.3, 1.39], [-0.3, 0.998]], glassSide);
    const px = side * 0.79;
    tube(group, [[px, 0.97, 1.0], [side * 0.735, 1.22, 0.61], [side * 0.71, 1.42, 0.26]], 0.024, paint, false, 20);
    tube(group, [[px, 0.96, -1.29], [side * 0.74, 1.19, -1.02], [side * 0.71, 1.39, -0.67]], 0.029, paint, false, 20);
    limb(group, [side * 0.805, 0.97, -0.275], [side * 0.735, 1.41, -0.275], 0.028, 0.025, trim, 16);
    tube(group, [[side * 0.79, 1.405, -0.67], [side * 0.78, 1.424, -0.28], [side * 0.76, 1.428, 0.24]], 0.022, paint, false, 20);

    tube(group, [[side * 0.913, 0.9, 0.81], [side * 0.923, 0.51, 0.73], [side * 0.923, 0.4, -0.24], [side * 0.912, 0.91, -0.24]], 0.003, trim, false, 22);
    tube(group, [[side * 0.912, 0.91, -0.3], [side * 0.922, 0.41, -0.3], [side * 0.912, 0.46, -1.33], [side * 0.9, 0.88, -1.46]], 0.003, trim, false, 22);
    box(group, [0.026, 0.028, 0.17], [side * 0.927, 0.86, -0.05], chrome, 0.009);
    box(group, [0.026, 0.028, 0.16], [side * 0.922, 0.86, -1.09], chrome, 0.009);
    box(group, [0.07, 0.09, 1.85], [side * 0.886, 0.31, -0.06], trim, 0.018);
    tube(group, [[side * 0.9, 0.63, 1.8], [side * 0.93, 0.69, 0.9], [side * 0.93, 0.67, -1.7]], 0.008, paintShadow, false, 28);

    limb(group, [side * 0.82, 1.02, 0.67], [side * 0.99, 1.04, 0.65], 0.025, 0.023, trim, 16);
    box(group, [0.2, 0.105, 0.17], [side * 1.0, 1.075, 0.65], paint, 0.045, [0, side * 0.12, side * 0.06]);
    box(group, [0.015, 0.055, 0.115], [side * 1.102, 1.068, 0.655], glass, 0.018, [0, side * 0.12, 0]);
  });

  box(group, [1.72, 0.25, 0.16], [0, 0.45, 2.265], paintShadow, 0.055);
  box(group, [0.68, 0.135, 0.035], [0, 0.42, 2.36], trim, 0.035);
  [-1, 1].forEach((side) => {
    box(group, [0.34, 0.15, 0.04], [side * 0.65, 0.425, 2.34], trim, 0.035, [0, 0, side * 0.08]);
    box(group, [0.47, 0.145, 0.055], [side * 0.612, 0.753, 2.278], trim, 0.04, [0, 0, side * -0.055]);
    box(group, [0.405, 0.097, 0.06], [side * 0.612, 0.76, 2.305], glass, 0.032, [0, 0, side * -0.055]);
    tube(group, [[side * 0.79, 0.77, 2.343], [side * 0.7, 0.794, 2.35], [side * 0.53, 0.79, 2.35], [side * 0.46, 0.758, 2.35]], 0.012, light, false, 22);
    tube(group, [[side * 0.74, 0.724, 2.343], [side * 0.62, 0.72, 2.35], [side * 0.49, 0.729, 2.35]], 0.007, light, false, 16);
  });

  [-1, 1].forEach((side) => {
    box(group, [0.314, 0.267, 0.035], [side * 0.173, 0.702, 2.337], chrome, 0.095);
    box(group, [0.278, 0.235, 0.043], [side * 0.173, 0.702, 2.36], trim, 0.078);
    for (let i = -2; i <= 2; i += 1) {
      box(group, [0.013, 0.176, 0.014], [side * 0.173 + i * 0.043, 0.705, 2.388], chrome, 0.005);
    }
  });
  addMesh(group, new THREE.CircleGeometry(0.052, 32), new THREE.MeshBasicMaterial({ map: createLogo(), transparent: true }), [0, 0.866, 2.338]);

  const frontPlate = new THREE.MeshBasicMaterial({ map: textPlate('LI JIAHANG', 512, 150, { size: 57, letterSpacing: 4 }) });
  addMesh(group, new THREE.PlaneGeometry(0.36, 0.105), frontPlate, [0, 0.425, 2.416]);
  box(group, [1.68, 0.24, 0.14], [0, 0.45, -2.27], paintShadow, 0.045);
  box(group, [0.52, 0.11, 0.035], [0, 0.43, -2.36], trim, 0.02);
  const rearPlate = addMesh(group, new THREE.PlaneGeometry(0.36, 0.105), frontPlate, [0, 0.47, -2.416], [1, 1, 1], [0, Math.PI, 0]);
  rearPlate.castShadow = false;

  [-1, 1].forEach((side) => {
    box(group, [0.53, 0.13, 0.06], [side * 0.59, 0.747, -2.29], redLight, 0.035, [0, 0, side * 0.04]);
    tube(group, [[side * 0.82, 0.76, -2.326], [side * 0.67, 0.77, -2.332], [side * 0.48, 0.73, -2.333], [side * 0.35, 0.73, -2.327]], 0.012, redLight, false, 20);
    addMesh(group, new THREE.CylinderGeometry(0.048, 0.048, 0.16, 24, 1, true), chrome, [side * 0.65, 0.3, -2.31], [1, 1, 1], [Math.PI / 2, 0, 0]);
  });
  const badgeTexture = canvasTexture(256, 96, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#4c5451';
    ctx.font = 'italic 52px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('325i', w / 2, h / 2);
  });
  addMesh(group, new THREE.PlaneGeometry(0.21, 0.079), new THREE.MeshBasicMaterial({ map: badgeTexture, transparent: true }), [-0.61, 0.875, -2.306], [1, 1, 1], [0, Math.PI, 0]);

  [-1, 1].forEach((side) => {
    createWheel(group, side * 0.9, 1.47, paint, trim);
    createWheel(group, side * 0.9, -1.47, paint, trim);
  });

  const interior = standard('#3b3b36', 0.82);
  box(group, [1.28, 0.16, 0.4], [0, 0.99, -0.31], interior, 0.06);
  [-1, 1].forEach((side) => {
    box(group, [0.42, 0.46, 0.16], [side * 0.35, 1.09, -0.46], interior, 0.07, [-0.15, 0, 0]);
    box(group, [0.23, 0.13, 0.12], [side * 0.35, 1.36, -0.51], interior, 0.045);
  });

  group.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  return { group };
}
