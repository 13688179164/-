import * as THREE from 'three';
import { addMesh, box, canvasTexture, disposeGroup, ellipsoid, limb, physical, standard, tag, tube, v3 } from './parts.js';

const DEFAULT_OUTFIT = {
  jacket: 'lavender',
  pants: 'black',
  shoes: 'white',
  accessory: 'backpack',
};

const JACKETS = {
  lavender: { color: '#aaa7d8', name: '雾紫机能外套', kicker: 'OUTERWEAR / 01', description: '参考日常照片还原的高领机能外套。宽领、双向拉链与压胶口袋保留轻户外轮廓，雾紫色在暖光下呈现柔和层次。', specs: ['宽松廓形', '高领防风', '雾紫哑光面料'] },
  floral: { color: '#c9bea0', name: '花园提花夹克', kicker: 'OUTERWEAR / 02', description: '以参考照片中的提花外套为灵感，将鼠尾草绿枝叶与铁锈红花簇织入米色布面，内搭黑色高领与蝴蝶项链效果最佳。', specs: ['植物提花', '翻领开襟', '黑色高领内搭'] },
  bomber: { color: '#272b29', name: '夜幕飞行员夹克', kicker: 'OUTERWEAR / 03', description: '短版飞行员夹克用细腻缎面与罗纹收口形成材质反差，肩线利落，适合搭配修身长裤与皮鞋。', specs: ['短版廓形', '罗纹收口', '缎面微光'] },
  overshirt: { color: '#d5c7ad', name: '燕麦工装衬衫', kicker: 'OUTERWEAR / 04', description: '低饱和燕麦色搭配不对称胸袋和哑光纽扣，版型干净松弛，让日常造型更轻盈。', specs: ['燕麦色', '贴袋设计', '棉质斜纹'] },
};

const PANTS = {
  black: { color: '#252826', name: '黑色锥形长裤', kicker: 'BOTTOMS / 01', description: '从胯部到脚踝自然收束的锥形剪裁，保留适度活动量，视觉上延伸腿部线条。', specs: ['锥形剪裁', '中腰设计', '柔软斜纹'] },
  denim: { color: '#536979', name: '水洗直筒牛仔裤', kicker: 'BOTTOMS / 02', description: '低饱和蓝灰水洗色，加入裤线、袋口与脚口缝线，直筒轮廓平衡上身量感。', specs: ['蓝灰水洗', '直筒剪裁', '撞色缝线'] },
  cream: { color: '#cfc5ae', name: '米白阔腿长裤', kicker: 'BOTTOMS / 03', description: '宽松垂坠的阔腿裤，以干净的前中挺线维持利落感，与深色上装形成明暗对比。', specs: ['阔腿垂坠', '前中挺线', '米白色调'] },
  cargo: { color: '#666b60', name: '鼠尾草工装裤', kicker: 'BOTTOMS / 04', description: '带立体侧袋的轻工装轮廓，灰绿色与雾紫、燕麦上装都能形成自然搭配。', specs: ['立体侧袋', '宽松直筒', '灰绿棉料'] },
};

const SHOES = {
  white: { color: '#e8e6df', name: '极简白色板鞋', kicker: 'FOOTWEAR / 01', description: '圆头低帮板鞋，以分层橡胶鞋底、独立鞋带和后跟拼接补全近景细节。', specs: ['低帮圆头', '分层鞋底', '皮革鞋面'] },
  black: { color: '#242625', name: '黑色德比皮鞋', kicker: 'FOOTWEAR / 02', description: '微方头德比轮廓，抛光皮革与深色鞋底呼应正式上装，适合让整体造型更干练。', specs: ['抛光皮革', '德比鞋型', '低跟鞋底'] },
  runner: { color: '#a8ada7', name: '银灰复古跑鞋', kicker: 'FOOTWEAR / 03', description: '银灰鞋面搭配多层次鞋底和荧光黄绿细节，强调轻运动感，与机能造型自然衔接。', specs: ['复古跑鞋', '复合鞋面', '轻运动轮廓'] },
};

const ACCESSORIES = {
  backpack: { name: '黑色机能背包', kicker: 'ACCESSORY / 01', description: '参考照片中的黑色背包，制作独立包体、提手、肩带、侧袋与前胸织带，转身后也能看到完整结构。', specs: ['立体包体', '双肩织带', '机能侧袋'] },
  necklace: { name: '银色蝴蝶项链', kicker: 'ACCESSORY / 02', description: '灵感来自参考照片中的吊坠，细银链沿胸前自然垂落，蝴蝶吊坠由四片独立翼面组成。', specs: ['银色细链', '蝴蝶吊坠', '立体翼面'] },
  none: { name: '不佩戴配饰', kicker: 'ACCESSORY / 00', description: '移除背包和项链，保留服装本身的干净轮廓。', specs: ['简洁造型'] },
};

function createFloralTexture() {
  const texture = canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#c8bda1';
    ctx.fillRect(0, 0, w, h);
    let seed = 173;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 28; i += 1) {
      const x = random() * w;
      const y = random() * h;
      const length = 50 + random() * 95;
      ctx.strokeStyle = random() > 0.5 ? '#596b49' : '#788264';
      ctx.lineWidth = 3 + random() * 2;
      ctx.beginPath();
      ctx.moveTo(x, y + length);
      ctx.quadraticCurveTo(x - 14, y + length * 0.4, x + 5, y);
      ctx.stroke();
      for (let j = 0; j < 4; j += 1) {
        const ly = y + length * (0.22 + j * 0.18);
        const direction = j % 2 ? 1 : -1;
        ctx.fillStyle = '#6d7958';
        ctx.beginPath();
        ctx.ellipse(x + direction * 10, ly, 13, 4, direction * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      const petalColor = random() > 0.45 ? '#854d40' : '#a17c62';
      ctx.fillStyle = petalColor;
      for (let p = 0; p < 6; p += 1) {
        const a = (p / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * 8, y + Math.sin(a) * 8, 7, 4, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#d0ad78';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y + 1);
      ctx.stroke();
    }
  });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1.4);
  return texture;
}

function addHand(parent, x, skin) {
  const hand = new THREE.Group();
  parent.add(hand);
  box(hand, [0.064, 0.09, 0.035], [x, 0.866, 0.064], skin, 0.016, [0.06, 0, x > 0 ? -0.08 : 0.08]);
  for (let i = 0; i < 4; i += 1) {
    const fx = x + (i - 1.5) * 0.014;
    limb(hand, [fx, 0.845, 0.066], [fx, 0.805 + Math.abs(i - 1.5) * 0.004, 0.069], 0.008, 0.006, skin, 12);
  }
  limb(hand, [x + (x > 0 ? -0.035 : 0.035), 0.875, 0.065], [x + (x > 0 ? -0.052 : 0.052), 0.842, 0.079], 0.01, 0.007, skin, 12);
}

function buildHead(parent, skin, hair, hairLight) {
  const head = new THREE.Group();
  parent.add(head);
  tag(head, '李嘉航 · 数字形象', 'AVATAR / 173 CM', '以三张日常照片为视觉参考制作的风格化 3D 形象：蓬松黑色中分发型、清晰眉眼与纤细体态。人物按 173 cm 等比构建。', ['身高 173 cm', '体重 54 kg', '照片参考建模']);

  const headGeometry = new THREE.SphereGeometry(1, 64, 48);
  const positions = headGeometry.attributes.position;
  for (let i = 0; i < positions.count; i += 1) {
    const y = positions.getY(i);
    const x = positions.getX(i);
    if (y < -0.15) positions.setX(i, x * (0.88 + (y + 1) * 0.1));
  }
  headGeometry.computeVertexNormals();
  addMesh(head, headGeometry, skin, [0, 1.585, 0], [0.108, 0.137, 0.099]);
  ellipsoid(head, [0, 1.481, 0.018], [0.067, 0.045, 0.07], skin);
  ellipsoid(head, [-0.11, 1.585, -0.002], [0.023, 0.042, 0.018], skin);
  ellipsoid(head, [0.11, 1.585, -0.002], [0.023, 0.042, 0.018], skin);
  const earInner = standard('#c88f7d', 0.85);
  ellipsoid(head, [-0.119, 1.586, 0.007], [0.009, 0.025, 0.009], earInner, 20);
  ellipsoid(head, [0.119, 1.586, 0.007], [0.009, 0.025, 0.009], earInner, 20);

  const eyeWhite = physical('#eee9df', { roughness: 0.25, clearcoat: 0.8 });
  const iris = physical('#241b18', { roughness: 0.2, clearcoat: 1 });
  const pupil = standard('#090b0a', 0.2);
  const catchlight = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  const eyeMeshes = [];
  [-1, 1].forEach((side) => {
    const x = side * 0.041;
    eyeMeshes.push(ellipsoid(head, [x, 1.605, 0.091], [0.027, 0.0105, 0.009], eyeWhite));
    eyeMeshes.push(ellipsoid(head, [x + side * 0.001, 1.605, 0.099], [0.010, 0.010, 0.005], iris, 24));
    eyeMeshes.push(ellipsoid(head, [x + side * 0.001, 1.605, 0.103], [0.005, 0.0065, 0.003], pupil, 20));
    ellipsoid(head, [x - 0.003, 1.609, 0.106], [0.0023, 0.0023, 0.0015], catchlight, 12);
    tube(head, [[x - 0.027, 1.608, 0.096], [x, 1.617, 0.102], [x + 0.027, 1.609, 0.096]], 0.0026, hair, false, 18);
    tube(head, [[x - 0.025, 1.638, 0.091], [x, 1.645 + (side < 0 ? 0.002 : 0), 0.094], [x + 0.024, 1.639, 0.09]], 0.004, hair, false, 18);
  });

  const noseShadow = standard('#c8917e', 0.85);
  limb(head, [0, 1.599, 0.094], [0, 1.562, 0.115], 0.008, 0.012, skin, 20);
  ellipsoid(head, [0, 1.558, 0.116], [0.017, 0.012, 0.014], skin, 24);
  ellipsoid(head, [-0.01, 1.554, 0.119], [0.004, 0.0024, 0.002], noseShadow, 16);
  ellipsoid(head, [0.01, 1.554, 0.119], [0.004, 0.0024, 0.002], noseShadow, 16);
  const lip = physical('#a96968', { roughness: 0.58, clearcoat: 0.15 });
  tube(head, [[-0.027, 1.526, 0.087], [-0.009, 1.531, 0.098], [0, 1.527, 0.101], [0.009, 1.531, 0.098], [0.027, 1.526, 0.087]], 0.0036, lip, false, 24);
  tube(head, [[-0.024, 1.525, 0.088], [0, 1.519, 0.096], [0.024, 1.525, 0.088]], 0.0032, lip, false, 20);

  const cap = new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, 1.48);
  addMesh(head, cap, hair, [0, 1.648, -0.002], [0.119, 0.132, 0.112]);
  const backCap = new THREE.SphereGeometry(1, 48, 32, Math.PI, Math.PI, 0, 2.23);
  addMesh(head, backCap, hair, [0, 1.634, -0.005], [0.119, 0.14, 0.111]);
  ellipsoid(head, [-0.096, 1.617, -0.02], [0.035, 0.083, 0.067], hair);
  ellipsoid(head, [0.098, 1.619, -0.018], [0.033, 0.08, 0.064], hair);

  const locks = [
    [-0.087, 1.672, 0.066, -0.42, 0.078, 0.022], [-0.062, 1.685, 0.086, -0.35, 0.09, 0.022],
    [-0.038, 1.684, 0.099, -0.2, 0.105, 0.021], [-0.016, 1.687, 0.101, 0.25, 0.08, 0.017],
    [0.02, 1.684, 0.102, -0.28, 0.087, 0.018], [0.043, 1.675, 0.096, 0.3, 0.102, 0.022],
    [0.067, 1.669, 0.083, 0.45, 0.094, 0.023], [0.086, 1.653, 0.062, 0.38, 0.072, 0.021],
    [-0.075, 1.632, 0.081, -0.28, 0.072, 0.017], [0.071, 1.63, 0.08, 0.32, 0.07, 0.017],
  ];
  locks.forEach(([x, y, z, angle, length, radius], index) => {
    const lock = addMesh(head, new THREE.CapsuleGeometry(radius, length, 6, 14), index % 3 === 0 ? hairLight : hair, [x, y, z], [1, 1, 0.7], [0.1, 0, angle]);
    lock.castShadow = true;
  });
  for (let i = 0; i < 12; i += 1) {
    const angle = (i / 12) * Math.PI * 2;
    const x = Math.cos(angle) * 0.065;
    const z = Math.sin(angle) * 0.048 - 0.018;
    ellipsoid(head, [x, 1.728 + Math.sin(i * 2.3) * 0.008, z], [0.05, 0.05, 0.047], i % 4 === 0 ? hairLight : hair, 24);
  }
  tube(head, [[-0.025, 1.735, 0.04], [-0.01, 1.775, 0.015], [0.015, 1.782, -0.005]], 0.003, hairLight, false, 12);
  tube(head, [[0.06, 1.728, 0.04], [0.09, 1.746, 0.025], [0.112, 1.731, 0.005]], 0.0025, hairLight, false, 12);
  eyeMeshes.forEach((eye) => { eye.userData.baseScaleY = eye.scale.y; });
  return eyeMeshes;
}

function makeJacket(group, id, skin, innerMat) {
  const item = JACKETS[id];
  tag(group, item.name, item.kicker, item.description, item.specs);
  const floral = id === 'floral';
  const fabric = physical(item.color, {
    roughness: floral ? 0.86 : id === 'bomber' ? 0.38 : 0.74,
    metalness: 0,
    clearcoat: id === 'bomber' ? 0.25 : 0.02,
    map: floral ? createFloralTexture() : null,
  });
  const seam = standard(id === 'lavender' ? '#777394' : id === 'floral' ? '#756e5c' : item.color, 0.82);
  const dark = standard('#242826', 0.78);

  const profile = [
    new THREE.Vector2(0.137, 0.86), new THREE.Vector2(0.146, 0.9), new THREE.Vector2(0.151, 1.03),
    new THREE.Vector2(0.175, 1.22), new THREE.Vector2(0.19, 1.34), new THREE.Vector2(0.164, 1.395),
  ];
  const torso = addMesh(group, new THREE.LatheGeometry(profile, 48), fabric);
  torso.scale.z = 0.64;
  [-1, 1].forEach((side) => {
    const shoulder = [side * 0.176, 1.345, 0];
    const elbow = [side * 0.25, 1.115, 0.018];
    const wrist = [side * 0.235, 0.928, 0.059];
    ellipsoid(group, shoulder, [0.073, 0.073, 0.068], fabric);
    limb(group, shoulder, elbow, 0.073, 0.059, fabric);
    ellipsoid(group, elbow, [0.059, 0.06, 0.056], fabric);
    limb(group, elbow, wrist, 0.059, 0.043, fabric);
    if (id === 'bomber') {
      limb(group, [side * 0.237, 0.956, 0.055], wrist, 0.045, 0.043, dark);
    }
  });

  const innerHeight = id === 'floral' ? 0.15 : 0.07;
  addMesh(group, new THREE.CylinderGeometry(0.066, 0.073, innerHeight, 32), innerMat, [0, 1.407, 0], [1, 1, 0.84]);

  if (id === 'lavender') {
    const collar = addMesh(group, new THREE.CylinderGeometry(0.082, 0.1, 0.15, 40, 1, true, 0.35, Math.PI * 2 - 0.7), fabric, [0, 1.435, 0.004], [1, 1, 0.82]);
    collar.material.side = THREE.DoubleSide;
    tube(group, [[0, 0.883, 0.09], [0, 1.16, 0.108], [0, 1.405, 0.085]], 0.004, seam);
    box(group, [0.018, 0.035, 0.009], [0.012, 1.348, 0.096], seam, 0.004, [0, 0, -0.2]);
    [-1, 1].forEach((side) => {
      tube(group, [[side * 0.085, 0.965, 0.091], [side * 0.115, 1.06, 0.104]], 0.004, seam, false, 12);
      box(group, [0.032, 0.006, 0.008], [side * 0.103, 1.015, 0.105], seam, 0.002, [0, 0, side * 0.45]);
    });
    const logo = standard('#514f70', 0.75);
    addMesh(group, new THREE.TorusGeometry(0.011, 0.002, 6, 20), logo, [-0.066, 1.25, 0.112]);
    for (let i = 0; i < 7; i += 1) {
      const a = (i / 7) * Math.PI * 2;
      limb(group, [-0.066 + Math.cos(a) * 0.014, 1.25 + Math.sin(a) * 0.014, 0.113], [-0.066 + Math.cos(a) * 0.02, 1.25 + Math.sin(a) * 0.02, 0.113], 0.0015, 0.0015, logo, 6);
    }
  } else if (id === 'floral') {
    box(group, [0.115, 0.44, 0.018], [0, 1.125, 0.105], innerMat, 0.015);
    const lapelGeometry = new THREE.ShapeGeometry(new THREE.Shape([
      new THREE.Vector2(0, 0), new THREE.Vector2(0.072, 0.105), new THREE.Vector2(0.065, -0.09), new THREE.Vector2(0.02, -0.15),
    ]));
    addMesh(group, lapelGeometry, fabric, [-0.025, 1.29, 0.121], [1, 1, 1], [0, 0, 0.08]);
    addMesh(group, lapelGeometry, fabric, [0.025, 1.29, 0.121], [-1, 1, 1], [0, 0, -0.08]);
    tube(group, [[-0.08, 1.38, 0.092], [-0.065, 1.17, 0.124], [-0.052, 0.9, 0.096]], 0.002, seam);
    tube(group, [[0.08, 1.38, 0.092], [0.065, 1.17, 0.124], [0.052, 0.9, 0.096]], 0.002, seam);
  } else if (id === 'bomber') {
    addMesh(group, new THREE.TorusGeometry(0.076, 0.012, 10, 40), dark, [0, 1.403, 0], [1, 1, 0.75], [Math.PI / 2, 0, 0]);
    addMesh(group, new THREE.CylinderGeometry(0.142, 0.14, 0.055, 40), dark, [0, 0.882, 0], [1, 1, 0.65]);
    tube(group, [[0, 0.91, 0.097], [0, 1.19, 0.113], [0, 1.38, 0.091]], 0.003, standard('#a4a49b', 0.4, 0.6));
    [-1, 1].forEach((side) => tube(group, [[side * 0.07, 1.03, 0.104], [side * 0.12, 1.09, 0.11]], 0.003, dark));
  } else {
    const collarMat = standard('#c5b79e', 0.82);
    [-1, 1].forEach((side) => {
      const shape = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(side * 0.07, 0.07), new THREE.Vector2(side * 0.063, -0.065)]);
      addMesh(group, new THREE.ShapeGeometry(shape), collarMat, [0, 1.36, 0.11]);
      box(group, [0.072, 0.085, 0.013], [side * 0.087, 1.19, 0.105], fabric, 0.008);
      tube(group, [[side * 0.12, 1.225, 0.114], [side * 0.055, 1.225, 0.114]], 0.002, seam);
    });
    for (let y = 0.94; y < 1.36; y += 0.09) {
      addMesh(group, new THREE.CylinderGeometry(0.006, 0.006, 0.005, 16), dark, [0, y, 0.112], [1, 1, 1], [Math.PI / 2, 0, 0]);
    }
  }
}

function makePants(group, id) {
  const item = PANTS[id];
  tag(group, item.name, item.kicker, item.description, item.specs);
  const mat = standard(item.color, id === 'denim' ? 0.91 : 0.79);
  const seam = standard(id === 'denim' ? '#a7a18b' : id === 'cream' ? '#aea48e' : '#171c19', 0.9);
  const wide = id === 'cream' || id === 'cargo';
  ellipsoid(group, [0, 0.88, 0], [0.15, 0.115, 0.088], mat);
  [-1, 1].forEach((side) => {
    const x = side * 0.084;
    const hip = [x, 0.9, 0];
    const knee = [x + side * 0.006, 0.535, 0.008];
    const ankle = [x + side * 0.009, 0.175, 0.018];
    limb(group, hip, knee, wide ? 0.093 : 0.082, wide ? 0.078 : 0.063, mat, 32);
    ellipsoid(group, knee, [wide ? 0.079 : 0.064, 0.07, wide ? 0.073 : 0.059], mat);
    limb(group, knee, ankle, wide ? 0.079 : 0.064, wide ? 0.075 : 0.047, mat, 32);
    tube(group, [[x + side * 0.02, 0.84, 0.073], [x + side * 0.025, 0.55, 0.061], [x + side * 0.026, 0.2, wide ? 0.068 : 0.044]], 0.0015, seam, false, 24);
    if (id === 'denim') {
      tube(group, [[x - side * 0.06, 0.92, 0.045], [x, 0.845, 0.085], [x + side * 0.055, 0.915, 0.055]], 0.002, seam, false, 16);
      tube(group, [[x - 0.035, 0.19, 0.045], [x + 0.04, 0.19, 0.045]], 0.002, seam, false, 8);
    }
    if (id === 'cargo') {
      box(group, [0.075, 0.115, 0.032], [x + side * 0.072, 0.665, 0.005], mat, 0.012, [0, side * 0.25, 0]);
      box(group, [0.078, 0.026, 0.036], [x + side * 0.073, 0.72, 0.006], seam, 0.007, [0, side * 0.25, 0]);
    }
  });
  tube(group, [[0, 0.93, 0.087], [0, 0.82, 0.092]], 0.002, seam, false, 8);
}

function makeShoes(group, id) {
  const item = SHOES[id];
  tag(group, item.name, item.kicker, item.description, item.specs);
  const upper = physical(item.color, { roughness: id === 'black' ? 0.25 : 0.65, clearcoat: id === 'black' ? 0.7 : 0.1 });
  const sole = standard(id === 'black' ? '#181b19' : '#d8d7d0', 0.88);
  const lace = standard(id === 'black' ? '#343735' : '#f3f1e9', 0.8);
  const accent = standard('#d7f35a', 0.65);
  [-1, 1].forEach((side) => {
    const x = side * 0.094;
    const height = id === 'black' ? 0.075 : 0.09;
    box(group, [0.12, 0.035, 0.255], [x, 0.037, 0.073], sole, 0.018);
    box(group, [0.112, height, 0.225], [x, 0.082, 0.068], upper, id === 'black' ? 0.025 : 0.037);
    ellipsoid(group, [x, 0.074, 0.164], [0.055, height * 0.52, 0.07], upper, 28);
    box(group, [0.1, id === 'black' ? 0.07 : 0.1, 0.067], [x, id === 'black' ? 0.1 : 0.119, -0.022], upper, 0.024, [-0.15, 0, 0]);
    for (let i = 0; i < 4; i += 1) {
      const z = 0.035 + i * 0.024;
      tube(group, [[x - 0.034, 0.132 - i * 0.004, z], [x, 0.139 - i * 0.004, z + 0.006], [x + 0.034, 0.132 - i * 0.004, z]], 0.0024, lace, false, 10);
    }
    if (id === 'runner') {
      box(group, [0.122, 0.018, 0.14], [x, 0.057, 0.062], standard('#777f7b', 0.85), 0.007);
      tube(group, [[x + side * 0.057, 0.09, 0.01], [x + side * 0.059, 0.104, 0.09], [x + side * 0.05, 0.095, 0.145]], 0.004, accent, false, 14);
    }
    if (id === 'black') {
      tube(group, [[x - 0.043, 0.091, 0.156], [x, 0.103, 0.172], [x + 0.043, 0.091, 0.156]], 0.0018, lace, false, 16);
    }
  });
}

function makeAccessory(group, id) {
  const item = ACCESSORIES[id];
  tag(group, item.name, item.kicker, item.description, item.specs);
  if (id === 'none') return;
  if (id === 'backpack') {
    const fabric = standard('#202523', 0.87);
    const webbing = standard('#111614', 0.9);
    const buckle = physical('#4b504c', { roughness: 0.45, metalness: 0.35 });
    box(group, [0.285, 0.39, 0.14], [0, 1.155, -0.145], fabric, 0.055, [-0.08, 0, 0]);
    box(group, [0.22, 0.14, 0.045], [0, 1.08, -0.225], webbing, 0.025);
    box(group, [0.055, 0.23, 0.09], [-0.16, 1.12, -0.15], fabric, 0.022);
    box(group, [0.055, 0.23, 0.09], [0.16, 1.12, -0.15], fabric, 0.022);
    tube(group, [[-0.06, 1.36, -0.15], [-0.055, 1.42, -0.15], [0.055, 1.42, -0.15], [0.06, 1.36, -0.15]], 0.012, webbing, false, 20);
    [-1, 1].forEach((side) => {
      tube(group, [[side * 0.095, 1.33, -0.13], [side * 0.13, 1.41, -0.015], [side * 0.13, 1.25, 0.09], [side * 0.11, 1.03, 0.095], [side * 0.12, 0.96, -0.09]], 0.013, webbing, false, 32);
      box(group, [0.035, 0.045, 0.015], [side * 0.116, 1.08, 0.105], buckle, 0.005);
    });
    tube(group, [[-0.1, 1.27, -0.225], [0, 1.22, -0.235], [0.1, 1.27, -0.225]], 0.003, buckle, false, 16);
  } else {
    const silver = physical('#c9ced0', { metalness: 0.9, roughness: 0.2, clearcoat: 0.8 });
    tube(group, [[-0.06, 1.4, 0.07], [-0.055, 1.3, 0.115], [0, 1.175, 0.135], [0.055, 1.3, 0.115], [0.06, 1.4, 0.07]], 0.0018, silver, false, 40);
    const wing = new THREE.Shape();
    wing.moveTo(0, 0);
    wing.bezierCurveTo(-0.03, 0.035, -0.047, 0.005, -0.019, -0.013);
    wing.bezierCurveTo(-0.042, -0.03, -0.016, -0.042, 0, -0.012);
    const wingGeometry = new THREE.ShapeGeometry(wing, 8);
    addMesh(group, wingGeometry, silver, [0, 1.17, 0.145], [0.65, 0.65, 0.65], [0, 0, -0.1]);
    addMesh(group, wingGeometry, silver, [0, 1.17, 0.145], [-0.65, 0.65, 0.65], [0, 0, 0.1]);
    ellipsoid(group, [0, 1.164, 0.148], [0.003, 0.014, 0.003], silver, 12);
  }
}

export function createPerson() {
  const group = new THREE.Group();
  group.name = 'JiahangAvatar';
  const body = new THREE.Group();
  group.add(body);
  tag(body, '李嘉航', 'PERSONAL AVATAR', '身高 173 cm、体重 54 kg 的个人数字形象。拖动可从全身到背面自由观察，点击服装可查看单品细节。', ['173 cm', '54 kg', '全身 3D 形象']);

  const skin = physical('#e8bda3', { roughness: 0.66, clearcoat: 0.05 });
  const inner = standard('#171b1a', 0.88);
  const hair = standard('#111514', 0.64);
  const hairLight = standard('#252a28', 0.58);
  limb(body, [0, 1.36, 0], [0, 1.49, 0.004], 0.069, 0.057, skin, 32);
  ellipsoid(body, [0, 1.355, 0], [0.12, 0.09, 0.068], inner);
  addHand(body, -0.235, skin);
  addHand(body, 0.235, skin);
  const eyes = buildHead(body, skin, hair, hairLight);

  const layers = {
    jacket: new THREE.Group(),
    pants: new THREE.Group(),
    shoes: new THREE.Group(),
    accessory: new THREE.Group(),
  };
  Object.values(layers).forEach((layer) => group.add(layer));
  let outfit = { ...DEFAULT_OUTFIT };
  const transitions = [];

  const builders = { jacket: makeJacket, pants: makePants, shoes: makeShoes, accessory: makeAccessory };
  function rebuild(key) {
    const layer = layers[key];
    disposeGroup(layer);
    if (key === 'jacket') builders[key](layer, outfit[key], skin, inner);
    else builders[key](layer, outfit[key]);
    layer.scale.setScalar(0.94);
    transitions.push({ layer, started: performance.now() });
  }
  Object.keys(layers).forEach(rebuild);

  return {
    group,
    getOutfit: () => ({ ...outfit }),
    getItem: (category, id) => ({ jacket: JACKETS, pants: PANTS, shoes: SHOES, accessory: ACCESSORIES })[category][id],
    setOutfit(next) {
      Object.entries(next).forEach(([key, value]) => {
        if (layers[key] && value && outfit[key] !== value) {
          outfit[key] = value;
          rebuild(key);
        }
      });
    },
    update(time) {
      group.position.y = 0.014 + Math.sin(time * 1.4) * 0.0018;
      group.rotation.z = Math.sin(time * 0.72) * 0.0018;
      const blinkPhase = time % 4.6;
      const eyeScale = blinkPhase < 0.14 ? Math.max(0.08, Math.abs(blinkPhase - 0.07) / 0.07) : 1;
      eyes.forEach((eye) => { eye.scale.y = eye.userData.baseScaleY * eyeScale; });
      for (let i = transitions.length - 1; i >= 0; i -= 1) {
        const transition = transitions[i];
        const progress = Math.min(1, (performance.now() - transition.started) / 360);
        const eased = 1 - Math.pow(1 - progress, 3);
        transition.layer.scale.setScalar(0.94 + eased * 0.06);
        if (progress === 1) transitions.splice(i, 1);
      }
    },
  };
}
