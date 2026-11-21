import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

export function standard(color, roughness = 0.65, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

export function physical(color, options = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.32,
    metalness: 0.08,
    clearcoat: 0.35,
    clearcoatRoughness: 0.2,
    ...options,
  });
}

export function addMesh(parent, geometry, mat, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, mat);
  object.position.set(...position);
  object.scale.set(...scale);
  object.rotation.set(...rotation);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

export function box(parent, size, position, mat, radius = 0.02, rotation = [0, 0, 0]) {
  const safeRadius = Math.min(radius, Math.min(...size) * 0.45);
  return addMesh(parent, new RoundedBoxGeometry(...size, 3, safeRadius), mat, position, [1, 1, 1], rotation);
}

export function ellipsoid(parent, position, scale, mat, segments = 32) {
  return addMesh(parent, new THREE.SphereGeometry(1, segments, Math.max(16, segments / 2)), mat, position, scale);
}

export function limb(parent, start, end, startRadius, endRadius, mat, segments = 24) {
  const a = Array.isArray(start) ? v3(...start) : start;
  const b = Array.isArray(end) ? v3(...end) : end;
  const direction = b.clone().sub(a);
  const geometry = new THREE.CylinderGeometry(endRadius, startRadius, direction.length(), segments, 2);
  const object = addMesh(parent, geometry, mat, a.clone().add(b).multiplyScalar(0.5).toArray());
  object.quaternion.setFromUnitVectors(v3(0, 1, 0), direction.normalize());
  return object;
}

export function tube(parent, points, radius, mat, closed = false, segments = 32) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => (Array.isArray(p) ? v3(...p) : p)), closed, 'centripetal');
  return addMesh(parent, new THREE.TubeGeometry(curve, segments, radius, 8, closed), mat);
}

export function tag(group, name, kicker, description, specs = []) {
  group.userData.details = { name, kicker, description, specs };
  return group;
}

export function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  draw(context, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function textPlate(text, width = 512, height = 160, options = {}) {
  const { background = '#f4f3ef', color = '#161a19', size = 62, letterSpacing = 0 } = options;
  return canvasTexture(width, height, (ctx, w, h) => {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#9a9d98';
    ctx.lineWidth = 5;
    ctx.strokeRect(6, 6, w - 12, h - 12);
    ctx.fillStyle = color;
    ctx.font = `600 ${size}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (letterSpacing && 'letterSpacing' in ctx) ctx.letterSpacing = `${letterSpacing}px`;
    ctx.fillText(text, w / 2, h / 2 + 2);
  });
}

export function disposeGroup(group) {
  const geometries = new Set();
  const materials = new Set();
  group.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.material) {
      (Array.isArray(object.material) ? object.material : [object.material]).forEach((mat) => materials.add(mat));
    }
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((mat) => {
    Object.values(mat).forEach((value) => {
      if (value?.isTexture) value.dispose();
    });
    mat.dispose();
  });
  group.clear();
}
