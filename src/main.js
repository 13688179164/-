import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createPerson } from './models/person.js';
import { createCar } from './models/car.js';
import { canvasTexture } from './models/parts.js';

function startStudio() {
const icons = {
  cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  expand: '<path d="M8 3H3v5m13-5h5v5M8 21H3v-5m13 5h5v-5"/>',
  rotate: '<path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 0-2 5"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  front: '<circle cx="12" cy="8" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3M8 13h8"/>',
  side: '<path d="M13 4a3 3 0 0 1 2 5l-1 2 3 4-2 6M9 21l2-7-3-3 2-4"/>',
  reset: '<path d="M3 11a9 9 0 1 1 2.6 6.4M3 4v7h7"/>',
  shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="14" r="4"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  mouse: '<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 6v4"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
};
const icon = (name, className = '') => `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ''}</svg>`;

const app = document.querySelector('#app');
app.innerHTML = `
  <main class="studio" id="studio">
    <div id="scene-container" role="img" aria-label="李嘉航的 3D 全身形象与白色 BMW 325i，可拖动旋转和滚轮缩放"></div>
    <header class="topbar">
      <a class="brand" href="#" aria-label="ATELIER 173 首页">
        <span class="brand-mark">A<span>173</span></span>
        <span class="brand-word">ATELIER<small>PERSONAL WARDROBE</small></span>
      </a>
      <div class="session-status"><span class="live-dot"></span> LIVE 3D <span class="status-divider"></span> LOOK <strong id="look-number">01</strong></div>
      <div class="header-actions">
        <button class="text-button" id="reference-button">${icon('image')}<span>照片参考</span></button>
        <button class="icon-button" id="fullscreen-button" title="全屏查看" aria-label="全屏查看">${icon('expand')}</button>
      </div>
    </header>

    <section class="profile-panel" aria-label="个人信息">
      <p class="eyebrow">PERSONAL AVATAR</p>
      <h1>李嘉航</h1>
      <p class="latin-name">LI JIAHANG</p>
      <div class="profile-stats">
        <div><strong>173</strong><span>cm / 身高</span></div>
        <div><strong>54</strong><span>kg / 体重</span></div>
      </div>
      <div class="profile-line"></div>
      <p class="profile-caption">个人数字形象<br><span>依据照片特征风格化建模</span></p>
    </section>

    <div class="look-caption">
      <span class="look-index" id="look-index">01</span>
      <div><strong id="look-name">雾紫轻户外</strong><small id="look-description">雾紫机能外套 · 黑色锥形长裤</small></div>
    </div>

    <aside class="wardrobe" id="wardrobe" aria-label="我的衣橱">
      <button class="drawer-handle" id="drawer-handle" aria-label="展开或收起衣橱"><span></span></button>
      <div class="wardrobe-head">
        <div><p class="eyebrow">THE WARDROBE</p><h2>我的衣橱</h2></div>
        <span class="item-total">14 件单品</span>
        <button class="icon-button drawer-close" id="drawer-close" aria-label="收起衣橱">${icon('chevron')}</button>
      </div>
      <div class="wardrobe-tabs" role="tablist" aria-label="衣物分类">
        <button class="active" data-category="jacket" role="tab" aria-selected="true">外套</button>
        <button data-category="pants" role="tab" aria-selected="false">裤装</button>
        <button data-category="shoes" role="tab" aria-selected="false">鞋履</button>
        <button data-category="accessory" role="tab" aria-selected="false">配饰</button>
      </div>
      <div class="wardrobe-scroll">
        <p class="category-caption" id="category-caption"></p>
        <div class="wardrobe-grid" id="wardrobe-items"></div>
      </div>
      <div class="wardrobe-footer">
        <div class="current-palette"><span>当前配色</span><div id="current-colors"></div></div>
        <div class="wardrobe-actions">
          <button class="primary-button" id="random-button">${icon('shuffle')} 随机搭配</button>
          <button class="save-button" id="save-button" title="保存造型图片" aria-label="保存造型图片">${icon('camera')}</button>
        </div>
      </div>
    </aside>

    <nav class="view-controls" aria-label="3D 视角控制">
      <button data-view="front" class="active" title="正面视角">${icon('front')}<span>正面</span></button>
      <button data-view="side" title="侧面视角">${icon('side')}<span>侧面</span></button>
      <button data-view="back" title="背面视角">${icon('rotate')}<span>背面</span></button>
      <span class="control-divider"></span>
      <button id="auto-rotate" title="自动旋转" aria-label="自动旋转" aria-pressed="false">${icon('rotate')}</button>
      <button id="reset-view" title="重置视角" aria-label="重置视角">${icon('reset')}</button>
    </nav>
    <div class="interaction-hint">${icon('mouse')}<span>拖动旋转&nbsp;&nbsp;·&nbsp;&nbsp;滚轮缩放&nbsp;&nbsp;·&nbsp;&nbsp;点击查看详情</span></div>

    <section class="detail-panel" id="detail-panel" aria-live="polite" hidden>
      <button class="detail-close" id="detail-close" aria-label="关闭详情">${icon('close')}</button>
      <p class="eyebrow" id="detail-kicker"></p>
      <h2 id="detail-name"></h2>
      <p id="detail-description"></p>
      <div class="detail-specs" id="detail-specs"></div>
    </section>

    <dialog class="reference-modal" id="reference-modal">
      <div class="reference-head"><div><p class="eyebrow">VISUAL REFERENCE</p><h2>形象参考</h2></div><button class="icon-button" id="reference-close" aria-label="关闭参考照片">${icon('close')}</button></div>
      <div class="reference-photos">
        <figure><img src="/reference-01.jpg" alt="李嘉航穿着雾紫色外套的参考照片"><figcaption>01 / 雾紫机能</figcaption></figure>
        <figure><img src="/reference-02.jpg" alt="李嘉航穿着提花外套与蝴蝶项链的参考照片"><figcaption>02 / 花园提花</figcaption></figure>
        <figure><img src="/reference-03.jpg" alt="李嘉航黑色中分发型的参考照片"><figcaption>03 / 发型特征</figcaption></figure>
      </div>
      <p class="reference-note">提取发型、配色与单品特征进行风格化 3D 建模，并非摄影测量扫描。</p>
    </dialog>
    <div class="toast" id="toast" role="status"></div>
    <div class="loader" id="loader"><div class="loader-brand">A<span>173</span></div><p>正在构建你的数字衣橱</p><div class="loader-track"><span></span></div><small>GEOMETRY · MATERIAL · LIGHT</small></div>
  </main>
`;

const categoryOrder = ['jacket', 'pants', 'shoes', 'accessory'];
const categories = {
  jacket: { label: '外套', caption: '04 件外套 · 点击即可试穿', items: ['lavender', 'floral', 'bomber', 'overshirt'] },
  pants: { label: '裤装', caption: '04 条长裤 · 调整整体比例', items: ['black', 'denim', 'cream', 'cargo'] },
  shoes: { label: '鞋履', caption: '03 双鞋履 · 完善造型细节', items: ['white', 'black', 'runner'] },
  accessory: { label: '配饰', caption: '03 种选择 · 增加个人印记', items: ['backpack', 'necklace', 'none'] },
};
const artColors = {
  lavender: '#aaa7d8', floral: '#c6b995', bomber: '#2c312e', overshirt: '#d4c5a9',
  black: '#292d2a', denim: '#5b7180', cream: '#d0c5ac', cargo: '#6a7164',
  white: '#e8e6de', runner: '#9fa8a2', backpack: '#252b28', necklace: '#aab2b0', none: '#dbdcd5',
};
const lookNames = { lavender: '雾紫轻户外', floral: '花园复古', bomber: '夜幕都会', overshirt: '燕麦日常' };

function garmentArt(category, id) {
  const color = artColors[id];
  const common = `stroke="#434a45" stroke-width="1.2" stroke-linejoin="round"`;
  let content = '';
  if (category === 'jacket') {
    const pattern = id === 'floral' ? '<pattern id="flowers" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#c6b995"/><path d="M4 18Q8 8 5 0M13 18Q9 9 14 0" stroke="#667257" fill="none"/><circle cx="6" cy="6" r="3" fill="#8d5545"/><circle cx="14" cy="13" r="2.5" fill="#975f4c"/></pattern>' : '';
    content = `${pattern}<path d="M56 24 37 35 20 82l20 9 9-25-4 45h70l-4-45 9 25 20-9-17-47-19-11-12 9H68l-12-9Z" fill="${id === 'floral' ? 'url(#flowers)' : color}" ${common}/><path d="M68 33 80 52l12-19M80 52v58M48 80l12 4M112 80l-12 4" fill="none" ${common}/>${id === 'lavender' ? '<path d="M62 25v22h36V25" fill="#aaa7d8" stroke="#434a45" stroke-width="1.2"/><circle cx="63" cy="65" r="3" fill="none" stroke="#615d81"/>' : ''}${id === 'floral' ? '<path d="M68 34h24l-5 72H73Z" fill="#222725"/><path d="m68 33 12 19-12 17M92 33 80 52l12 17" fill="#c6b995" stroke="#686555"/>' : ''}${id === 'bomber' ? '<path d="M46 102h68M30 82l16 6M130 82l-16 6" stroke="#111614" stroke-width="6"/>' : ''}${id === 'overshirt' ? '<path d="M51 61h20v19H51zM89 61h20v19H89z" fill="none" stroke="#8f836c"/><path d="M80 60v40" stroke="#8f836c" stroke-dasharray="2 5"/>' : ''}`;
  } else if (category === 'pants') {
    content = `<path d="M51 19h58l-4 39 9 57H91L80 63l-8 52H46l9-57-4-39Z" fill="${color}" ${common}/><path d="M51 31h58M80 20v43M53 35l15 12M107 35 92 47" fill="none" ${common}/>${id === 'cargo' ? '<path d="M42 58h23v25H42zM96 58h22v25H96z" fill="#626a5e" stroke="#434a45"/>' : ''}${id === 'denim' ? '<path d="M52 107h18M95 107h17" stroke="#c6b999" stroke-width="2"/>' : ''}`;
  } else if (category === 'shoes') {
    content = `<g transform="translate(12 3) rotate(-8 80 65)"><path d="M32 61c15 2 27-4 34-20l22 8 8 22c9 4 20 8 26 17 3 5 0 12-7 13H34c-12 0-16-8-12-18l10-22Z" fill="${color}" ${common}/><path d="M22 86c26 5 72 3 100 2l2 10c-24 8-77 9-99 3-5-3-5-10-3-15Z" fill="${id === 'black' ? '#1b1f1d' : '#d2d2ca'}" ${common}/><path d="m54 57 32 8M51 64l38 8M47 72l44 7" ${common} fill="none"/>${id === 'runner' ? '<path d="m55 81 21-12 19 15" stroke="#d7f35a" stroke-width="4" fill="none"/>' : ''}</g>`;
  } else if (id === 'backpack') {
    content = `<path d="M57 33c0-20 46-20 46 0" fill="none" stroke="#252b28" stroke-width="7"/><path d="M47 43c0-17 66-17 66 0l8 61H39l8-61Z" fill="${color}" ${common}/><path d="M45 55h70M52 77h56v27H52zM38 61H29v31h11M114 61h9v31h-11" fill="none" ${common}/><path d="M58 43V29M102 43V29" stroke="#252b28" stroke-width="5"/>`;
  } else if (id === 'necklace') {
    content = `<path d="M48 20c3 44 13 70 32 78 19-8 29-34 32-78" fill="none" stroke="#8e9895" stroke-width="2"/><path d="M80 95C60 71 52 97 72 100 54 114 77 119 80 102c3 17 26 12 8-2 20-3 12-29-8-5Z" fill="#bdc5c3" stroke="#737d7a"/><path d="M80 94v14" stroke="#737d7a" stroke-width="2"/>`;
  } else {
    content = `<circle cx="80" cy="65" r="32" fill="none" stroke="#a5aaa2" stroke-width="1.5"/><path d="m58 87 44-44" stroke="#a5aaa2" stroke-width="1.5"/>`;
  }
  return `<svg viewBox="0 0 160 130" aria-hidden="true">${content}</svg>`;
}

const container = document.querySelector('#scene-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#e7e6df');
scene.fog = new THREE.FogExp2('#e7e6df', 0.028);

const camera = new THREE.PerspectiveCamera(32, container.clientWidth / container.clientHeight, 0.05, 80);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

const pmrem = new THREE.PMREMGenerator(renderer);
const room = new RoomEnvironment();
const environment = pmrem.fromScene(room, 0.04).texture;
scene.environment = environment;
scene.environmentIntensity = 0.72;
room.dispose();
pmrem.dispose();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.enablePan = false;
controls.minDistance = 2.5;
controls.maxDistance = 10;
controls.minPolarAngle = 0.28;
controls.maxPolarAngle = Math.PI / 2 - 0.025;
controls.rotateSpeed = 0.72;
controls.zoomSpeed = 0.8;
controls.autoRotateSpeed = 0.65;

const hemi = new THREE.HemisphereLight('#fff8e9', '#777d75', 1.15);
scene.add(hemi);
const key = new THREE.DirectionalLight('#fff3df', 2.35);
key.position.set(-3.5, 5.5, 4.5);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.left = -4.5;
key.shadow.camera.right = 4.5;
key.shadow.camera.top = 4.5;
key.shadow.camera.bottom = -4.5;
key.shadow.camera.near = 0.1;
key.shadow.camera.far = 15;
key.shadow.bias = -0.00025;
key.shadow.normalBias = 0.025;
scene.add(key);
const rim = new THREE.DirectionalLight('#e2edff', 1.45);
rim.position.set(4, 3.4, -4.5);
scene.add(rim);
const fill = new THREE.DirectionalLight('#ffffff', 0.45);
fill.position.set(4, 1.5, 4);
scene.add(fill);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: '#dcdcd4', roughness: 0.96, metalness: 0 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.045;
floor.receiveShadow = true;
scene.add(floor);
const platform = new THREE.Mesh(new THREE.CylinderGeometry(3.55, 3.58, 0.075, 128), new THREE.MeshStandardMaterial({ color: '#d4d4cb', roughness: 0.86, metalness: 0.03 }));
platform.position.y = -0.006;
platform.receiveShadow = true;
scene.add(platform);
const ring = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.006, 6, 160), new THREE.MeshBasicMaterial({ color: '#b7bab1', transparent: true, opacity: 0.65 }));
ring.rotation.x = Math.PI / 2;
ring.position.y = 0.035;
scene.add(ring);

const architecture = new THREE.Group();
scene.add(architecture);
const architecturalMat = new THREE.MeshStandardMaterial({ color: '#deded6', roughness: 0.88 });
[-3.25, -2.65, 2.65, 3.25].forEach((x, index) => {
  const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.055, 3.5 + (index % 2) * 0.6, 0.12), architecturalMat);
  pillar.position.set(x, 1.7, -4.35);
  architecture.add(pillar);
});
const halo = new THREE.Mesh(new THREE.TorusGeometry(1.92, 0.014, 8, 160), new THREE.MeshStandardMaterial({ color: '#fff9e8', emissive: '#fff4d9', emissiveIntensity: 1.2, roughness: 0.4 }));
halo.position.set(0.2, 1.65, -4.25);
architecture.add(halo);
const haloBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.055, 0.22), architecturalMat);
haloBase.position.set(0.2, 0.025, -4.25);
architecture.add(haloBase);

function addContactShadow(x, z, width, depth, opacity) {
  const texture = canvasTexture(256, 256, (ctx, w, h) => {
    const gradient = ctx.createRadialGradient(w / 2, h / 2, 5, w / 2, h / 2, w / 2);
    gradient.addColorStop(0, `rgba(28,35,30,${opacity})`);
    gradient.addColorStop(0.45, `rgba(28,35,30,${opacity * 0.55})`);
    gradient.addColorStop(1, 'rgba(28,35,30,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(x, 0.037, z);
  scene.add(shadow);
}
addContactShadow(0.5, -2.35, 2.25, 5.3, 0.3);
addContactShadow(-0.62, 0.34, 0.85, 0.8, 0.38);

const person = createPerson();
person.group.position.set(-0.62, 0.014, 0.32);
person.group.scale.setScalar(0.97);
scene.add(person.group);
const car = createCar();
car.group.position.set(0.5, -0.002, -2.35);
car.group.rotation.y = 0.035;
scene.add(car.group);

let seed = 325;
const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const dustPositions = new Float32Array((window.innerWidth < 700 ? 55 : 120) * 3);
for (let i = 0; i < dustPositions.length; i += 3) {
  dustPositions[i] = (random() - 0.5) * 8;
  dustPositions[i + 1] = 0.2 + random() * 3.4;
  dustPositions[i + 2] = (random() - 0.5) * 7;
}
const dustGeometry = new THREE.BufferGeometry();
dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: '#fffdf2', size: 0.011, transparent: true, opacity: 0.45, depthWrite: false }));
scene.add(dust);

const selectionMarker = new THREE.Mesh(new THREE.RingGeometry(0.024, 0.031, 32), new THREE.MeshBasicMaterial({ color: '#dfff69', transparent: true, opacity: 0, depthTest: false, side: THREE.DoubleSide }));
selectionMarker.visible = false;
selectionMarker.renderOrder = 20;
scene.add(selectionMarker);
let markerStarted = 0;

const homeTarget = new THREE.Vector3(window.innerWidth < 700 ? -0.5 : 0.05, 0.88, window.innerWidth < 700 ? 0.1 : -0.48);
function homePosition() {
  return window.innerWidth < 700 ? new THREE.Vector3(2.45, 1.8, 5.45) : new THREE.Vector3(3.35, 2.02, 5.5);
}
controls.target.copy(homeTarget);
camera.position.copy(homePosition()).multiplyScalar(1.16);
controls.update();

let cameraTween = null;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  cameraTween = { start: performance.now(), duration: 1500, from: camera.position.clone(), to: homePosition(), targetFrom: homeTarget.clone(), targetTo: homeTarget.clone() };
}
function moveCamera(position, target = homeTarget, duration = 850) {
  cameraTween = { start: performance.now(), duration: reduceMotion ? 1 : duration, from: camera.position.clone(), to: position.clone(), targetFrom: controls.target.clone(), targetTo: target.clone() };
}
controls.addEventListener('start', () => { cameraTween = null; });

let currentCategory = 'jacket';
const wardrobeItems = document.querySelector('#wardrobe-items');
function renderWardrobe() {
  const category = categories[currentCategory];
  const outfit = person.getOutfit();
  document.querySelector('#category-caption').textContent = category.caption;
  wardrobeItems.innerHTML = category.items.map((id, index) => {
    const item = person.getItem(currentCategory, id);
    const active = outfit[currentCategory] === id;
    return `<button class="garment-item ${active ? 'active' : ''}" data-id="${id}" aria-pressed="${active}" aria-label="试穿${item.name}">
      <span class="garment-visual">${garmentArt(currentCategory, id)}<span class="item-number">${String(index + 1).padStart(2, '0')}</span>${active ? `<span class="selected-check">${icon('check')}</span>` : ''}</span>
      <span class="garment-name">${item.name}</span><span class="garment-meta">${item.specs[0]}</span>
    </button>`;
  }).join('');
  updateLookSummary();
}

function updateLookSummary() {
  const outfit = person.getOutfit();
  const jacket = person.getItem('jacket', outfit.jacket);
  const pants = person.getItem('pants', outfit.pants);
  const number = 1 + (categories.jacket.items.indexOf(outfit.jacket) * 7 + categories.pants.items.indexOf(outfit.pants) * 3 + categories.shoes.items.indexOf(outfit.shoes) * 2 + categories.accessory.items.indexOf(outfit.accessory)) % 24;
  document.querySelector('#look-number').textContent = String(number).padStart(2, '0');
  document.querySelector('#look-index').textContent = String(number).padStart(2, '0');
  document.querySelector('#look-name').textContent = lookNames[outfit.jacket];
  document.querySelector('#look-description').textContent = `${jacket.name} · ${pants.name}`;
  const colors = [artColors[outfit.jacket], artColors[outfit.pants], artColors[outfit.shoes]];
  document.querySelector('#current-colors').innerHTML = colors.map((color) => `<i style="--swatch:${color}"></i>`).join('');
}

let toastTimer;
function toast(message) {
  const element = document.querySelector('#toast');
  element.textContent = message;
  element.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('visible'), 2200);
}

document.querySelectorAll('[data-category]').forEach((button) => {
  button.addEventListener('click', () => {
    currentCategory = button.dataset.category;
    document.querySelectorAll('[data-category]').forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    renderWardrobe();
  });
});
wardrobeItems.addEventListener('click', (event) => {
  const button = event.target.closest('[data-id]');
  if (!button) return;
  person.setOutfit({ [currentCategory]: button.dataset.id });
  renderWardrobe();
  toast(`已换上 · ${person.getItem(currentCategory, button.dataset.id).name}`);
});

document.querySelector('#random-button').addEventListener('click', () => {
  const next = {};
  categoryOrder.forEach((key) => {
    const items = categories[key].items;
    next[key] = items[Math.floor(Math.random() * items.length)];
  });
  if (next.jacket === person.getOutfit().jacket) next.jacket = categories.jacket.items[(categories.jacket.items.indexOf(next.jacket) + 1) % categories.jacket.items.length];
  person.setOutfit(next);
  renderWardrobe();
  toast('已生成一套新搭配');
});

const detailPanel = document.querySelector('#detail-panel');
function showDetails(details) {
  document.querySelector('#detail-kicker').textContent = details.kicker;
  document.querySelector('#detail-name').textContent = details.name;
  document.querySelector('#detail-description').textContent = details.description;
  document.querySelector('#detail-specs').innerHTML = details.specs.map((spec) => `<span>${spec}</span>`).join('');
  detailPanel.hidden = false;
}
document.querySelector('#detail-close').addEventListener('click', () => { detailPanel.hidden = true; });

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerStart = null;
function setPointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
}
function hitTest(event) {
  setPointer(event);
  raycaster.setFromCamera(pointer, camera);
  return raycaster.intersectObjects([person.group, car.group], true)[0];
}
renderer.domElement.addEventListener('pointerdown', (event) => {
  pointerStart = { x: event.clientX, y: event.clientY };
  container.classList.add('dragging');
});
renderer.domElement.addEventListener('pointerup', (event) => {
  container.classList.remove('dragging');
  if (!pointerStart || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 6) return;
  const hit = hitTest(event);
  if (!hit) { detailPanel.hidden = true; return; }
  let owner = hit.object;
  while (owner && !owner.userData.details) owner = owner.parent;
  if (owner?.userData.details) showDetails(owner.userData.details);
  selectionMarker.position.copy(hit.point);
  selectionMarker.lookAt(camera.position);
  selectionMarker.scale.setScalar(1);
  selectionMarker.material.opacity = 1;
  selectionMarker.visible = true;
  markerStarted = performance.now();
});
renderer.domElement.addEventListener('pointermove', (event) => {
  if (event.buttons) return;
  container.classList.toggle('hovering', Boolean(hitTest(event)));
});
renderer.domElement.addEventListener('pointerleave', () => container.classList.remove('hovering', 'dragging'));

const viewButtons = [...document.querySelectorAll('[data-view]')];
viewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    viewButtons.forEach((item) => item.classList.toggle('active', item === button));
    controls.autoRotate = false;
    document.querySelector('#auto-rotate').classList.remove('active');
    document.querySelector('#auto-rotate').setAttribute('aria-pressed', 'false');
    const positions = {
      front: homePosition(),
      side: new THREE.Vector3(window.innerWidth < 700 ? -4.6 : -4.8, 1.7, 1.5),
      back: new THREE.Vector3(-4.3, 1.75, window.innerWidth < 700 ? -3.4 : -2.7),
    };
    const target = button.dataset.view === 'front' ? homeTarget : new THREE.Vector3(-0.62, 0.88, 0.32);
    moveCamera(positions[button.dataset.view], target);
  });
});
document.querySelector('#auto-rotate').addEventListener('click', (event) => {
  controls.autoRotate = !controls.autoRotate;
  event.currentTarget.classList.toggle('active', controls.autoRotate);
  event.currentTarget.setAttribute('aria-pressed', String(controls.autoRotate));
  viewButtons.forEach((item) => item.classList.remove('active'));
});
document.querySelector('#reset-view').addEventListener('click', () => {
  controls.autoRotate = false;
  document.querySelector('#auto-rotate').classList.remove('active');
  document.querySelector('#auto-rotate').setAttribute('aria-pressed', 'false');
  viewButtons.forEach((item) => item.classList.toggle('active', item.dataset.view === 'front'));
  moveCamera(homePosition());
  toast('已回到初始视角');
});

const referenceModal = document.querySelector('#reference-modal');
document.querySelector('#reference-button').addEventListener('click', () => referenceModal.showModal());
document.querySelector('#reference-close').addEventListener('click', () => referenceModal.close());
referenceModal.addEventListener('click', (event) => {
  if (event.target === referenceModal) {
    const rect = referenceModal.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) referenceModal.close();
  }
});
document.querySelector('#fullscreen-button').addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch { toast('当前浏览器暂不支持全屏'); }
});

const wardrobe = document.querySelector('#wardrobe');
document.querySelector('#drawer-handle').addEventListener('click', () => wardrobe.classList.toggle('open'));
document.querySelector('#drawer-close').addEventListener('click', () => wardrobe.classList.remove('open'));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    detailPanel.hidden = true;
    wardrobe.classList.remove('open');
  }
});

document.querySelector('#save-button').addEventListener('click', () => {
  renderer.render(scene, camera);
  const output = document.createElement('canvas');
  output.width = renderer.domElement.width;
  output.height = renderer.domElement.height;
  const context = output.getContext('2d');
  context.drawImage(renderer.domElement, 0, 0);
  const scale = output.width / 1600;
  context.fillStyle = 'rgba(238,238,230,0.9)';
  context.fillRect(0, output.height - 86 * scale, output.width, 86 * scale);
  context.fillStyle = '#202622';
  context.font = `600 ${24 * scale}px Arial`;
  context.fillText('ATELIER 173', 42 * scale, output.height - 36 * scale);
  context.font = `${18 * scale}px sans-serif`;
  context.textAlign = 'right';
  context.fillText(`李嘉航 / ${document.querySelector('#look-name').textContent}`, output.width - 42 * scale, output.height - 36 * scale);
  output.toBlob((blob) => {
    if (!blob) { toast('图片生成失败，请重试'); return; }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ATELIER-173-${document.querySelector('#look-name').textContent}.png`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('造型图片已保存');
  }, 'image/png');
});

function onResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.fov = window.innerWidth < 700 ? 42 : 32;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', onResize);
onResize();

const clock = new THREE.Clock();
let firstFrame = true;
function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  person.update(time);
  dust.rotation.y = time * 0.009;
  halo.material.emissiveIntensity = 1.05 + Math.sin(time * 0.65) * 0.12;
  if (selectionMarker.visible) {
    const progress = (performance.now() - markerStarted) / 700;
    selectionMarker.scale.setScalar(1 + progress * 1.25);
    selectionMarker.material.opacity = Math.max(0, 1 - progress);
    selectionMarker.lookAt(camera.position);
    if (progress >= 1) selectionMarker.visible = false;
  }
  if (cameraTween) {
    const progress = Math.min(1, (performance.now() - cameraTween.start) / cameraTween.duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    camera.position.lerpVectors(cameraTween.from, cameraTween.to, eased);
    controls.target.lerpVectors(cameraTween.targetFrom, cameraTween.targetTo, eased);
    if (progress === 1) cameraTween = null;
  }
  controls.update();
  renderer.render(scene, camera);
  if (firstFrame) {
    firstFrame = false;
    requestAnimationFrame(() => {
      document.querySelector('#loader').classList.add('loaded');
      document.body.classList.add('ready');
      setTimeout(() => document.querySelector('#loader').remove(), 700);
    });
  }
}
renderWardrobe();
animate();
}

try {
  startStudio();
} catch (error) {
  console.warn('3D studio could not start:', error.message);
  const loader = document.querySelector('#loader');
  if (loader) {
    loader.innerHTML = '<div class="loader-brand">A<span>173</span></div><p>当前浏览器未能启动 3D</p><small>请开启硬件加速，或使用新版 Chrome / Edge 后刷新</small>';
  }
}
