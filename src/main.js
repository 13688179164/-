import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createWorld } from './scene/world.js';
import { SeasonSystem } from './scene/season.js';
import { NPCSystem } from './scene/npc.js';
import { TrafficSystem } from './scene/traffic.js';
import { UI } from './ui.js';
import { AudioEngine } from './audio.js';

/* ============================================================
   GOODWORK — main stage
   ============================================================ */

const canvas = document.getElementById('scene');
const params = new URLSearchParams(window.location.search);
const QA = params.get('qa') === '1';
const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 760;
const dprCap = QA ? 1 : (isMobile ? 1.5 : 1.75);

const CAM = {
  pos: new THREE.Vector3(10.5, 10.6, 33.5),
  target: new THREE.Vector3(-1.4, 3.9, 0.8),
  introPos: new THREE.Vector3(20.5, 14.8, 47),
  introTarget: new THREE.Vector3(-1.8, 4.6, 0.6),
};
const BASE_FOV = 40;

const state = {
  cinematic: true,
  sound: true,
  labels: true,
  intro: false,
  formOpen: false,
  claimActive: false,
  dossierOpen: false,
  hoveredEntry: null,
  selectedEntry: null,
  hoverPoint: new THREE.Vector3(),
  pointerDirty: false,
  pointerClient: { x: 0, y: 0 },
  cameraTween: null,
  savedCamera: null,
  pointerDown: null,
};

let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let composer = null;
let bloomPass = null;
let world = null;
let season = null;
let traffic = null;
let npcs = null;
let ui = null;
const audio = new AudioEngine();

const raycaster = new THREE.Raycaster();
raycaster.far = 90;
const pointerNDC = new THREE.Vector2(-2, -2);
let lastFrame = performance.now();
let simClock = 0;
let qaRendered = false;
let fpsAccum = 0;
let fpsFrames = 0;
let statAccum = 0;
let lastHoverRay = 0;
let idleTimer = null;

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function $(id) { return document.getElementById(id); }

function bootStep(pct, text) {
  $('boot-fill').style.width = `${pct}%`;
  $('boot-pct').textContent = `${pct}%`;
  $('boot-text').textContent = text;
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
}

function fatal(err) {
  console.error(err);
  const boot = $('boot');
  if (boot) boot.classList.add('hide');
  $('fatal').hidden = false;
  $('fatal-msg').textContent = err && err.message ? err.message : '当前浏览器需要开启 WebGL 2 与硬件加速。';
}

/* ---------------- camera choreography ---------------- */
function tweenCamera(pos, target, duration, onComplete = null, ease = easeInOutCubic) {
  state.cameraTween = {
    fromPos: camera.position.clone(),
    toPos: new THREE.Vector3(pos[0] ?? pos.x, pos[1] ?? pos.y, pos[2] ?? pos.z),
    fromTarget: controls.target.clone(),
    toTarget: new THREE.Vector3(target[0] ?? target.x, target[1] ?? target.y, target[2] ?? target.z),
    duration,
    t: 0,
    ease,
    onComplete,
  };
  controls.enabled = false;
  controls.autoRotate = false;
}

function updateCameraTween(dt) {
  const tw = state.cameraTween;
  if (!tw) return;
  tw.t += dt;
  const k = Math.min(1, tw.t / tw.duration);
  const e = tw.ease(k);
  camera.position.lerpVectors(tw.fromPos, tw.toPos, e);
  controls.target.lerpVectors(tw.fromTarget, tw.toTarget, e);
  camera.lookAt(controls.target);
  if (k >= 1) {
    state.cameraTween = null;
    if (tw.onComplete) tw.onComplete();
  }
}

function startIntro() {
  state.intro = true;
  camera.position.copy(CAM.introPos);
  controls.target.copy(CAM.introTarget);
  camera.lookAt(controls.target);
  controls.enabled = false;
  controls.autoRotate = false;
  tweenCamera(CAM.pos, CAM.target, 5.2, () => {
    state.intro = false;
    controls.enabled = true;
    controls.target.copy(CAM.target);
    controls.autoRotate = state.cinematic;
    controls.update();
  });
}

function skipIntro() {
  if (!state.intro) return;
  state.intro = false;
  state.cameraTween = null;
  camera.position.copy(CAM.pos);
  controls.target.copy(CAM.target);
  camera.lookAt(CAM.target);
  controls.enabled = true;
  controls.autoRotate = state.cinematic;
  controls.update();
}

function resetCamera() {
  if (state.formOpen || state.claimActive) return;
  skipIntro();
  ui.closeDossier(false);
  state.selectedEntry = null;
  state.dossierOpen = false;
  state.hoveredEntry = null;
  world.hideHover();
  ui.hideTooltip();
  tweenCamera(CAM.pos, CAM.target, 1.25, () => {
    controls.enabled = true;
    controls.autoRotate = state.cinematic;
    controls.update();
  });
}

/* ---------------- claim flow ---------------- */
function beginClaim(entry) {
  if (!entry || state.claimActive || state.formOpen) return;
  state.claimActive = true;
  state.formOpen = true;
  state.dossierOpen = false;
  state.selectedEntry = null;
  state.hoveredEntry = null;
  ui.hideTooltip();
  ui.closeDossier(false);
  world.hideHover();
  audio.open();

  state.savedCamera = { pos: camera.position.clone(), target: controls.target.clone() };
  controls.autoRotate = false;
  controls.enabled = false;

  const stages = entry.cameraStages;
  const targets = entry.cameraTargets;
  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    ui.openForm(entry);
    state.formOpen = true;
  };

  if (!stages || !targets) {
    window.setTimeout(reveal, 180);
    return;
  }

  let index = 0;
  const step = () => {
    if (index >= stages.length) { reveal(); return; }
    const isLast = index === stages.length - 1;
    if (isLast) reveal();
    const stage = stages[index];
    const target = targets[index];
    const duration = isLast ? 1.2 : 0.95;
    index += 1;
    tweenCamera(stage, target, duration, () => {
      if (index >= stages.length) {
        // keep the camera locked while the drawer is open
        controls.enabled = false;
        controls.autoRotate = false;
      } else {
        step();
      }
    });
  };
  step();
}

function closeFormFlow() {
  state.formOpen = false;
  const saved = state.savedCamera;
  state.savedCamera = null;
  if (saved) {
    controls.autoRotate = false;
    tweenCamera(saved.pos, saved.target, 1.25, () => {
      state.claimActive = false;
      controls.enabled = true;
      controls.autoRotate = state.cinematic;
      controls.update();
    }, easeInOutCubic);
  } else {
    state.claimActive = false;
    controls.enabled = true;
    controls.autoRotate = state.cinematic;
    controls.update();
  }
  state.hoveredEntry = null;
  state.selectedEntry = null;
  state.pointerDirty = true;
}

function locateEntry(entry) {
  if (!entry || state.formOpen || state.claimActive) return;
  state.selectedEntry = entry;
  state.dossierOpen = false;
  const stage = entry.cameraStages ? entry.cameraStages[entry.cameraStages.length - 1] : null;
  const target = entry.cameraTargets ? entry.cameraTargets[entry.cameraTargets.length - 1] : null;
  if (stage && target) {
    tweenCamera(stage, target, 1.3, () => {
      controls.enabled = true;
      controls.autoRotate = state.cinematic;
      controls.update();
    });
  } else {
    state.hoverPoint.copy(entry.focus);
  }
  world.showHover(entry, state.hoverPoint);
  ui.toast(`已在场景中标记：${entry.name}`);
}

function focusQuest() {
  const quest = $('quest');
  if (!quest) return;
  quest.style.transition = 'box-shadow .4s ease, border-color .4s ease';
  quest.style.boxShadow = '0 0 0 1px rgba(216,184,120,.65), 0 0 46px rgba(216,184,120,.28)';
  quest.style.borderColor = 'rgba(216,184,120,.65)';
  window.setTimeout(() => {
    quest.style.boxShadow = '';
    quest.style.borderColor = '';
  }, 1600);
  ui.toast('NPC 任务链：取票 → 提交 → 审批 · 正在场景中执行');
  audio.click();
}

/* ---------------- raycast / hover ---------------- */
function chooseHit(hits) {
  if (!hits.length) return null;
  const nearest = hits[0];
  const nearestEntry = world.entryById.get(nearest.object.userData.entryId);
  if (!nearestEntry) return null;
  if (!nearest.object.userData.glass) return { entry: nearestEntry, hit: nearest };

  // glass is intentionally transparent to the pointer: prefer key interior objects behind it
  const priority = new Set(['liftCar', 'workbench', 'tires', 'reception']);
  for (let i = 1; i < hits.length; i++) {
    const h = hits[i];
    if (h.object.userData.glass) continue;
    const entry = world.entryById.get(h.object.userData.entryId);
    if (!entry) continue;
    if (priority.has(entry.id)) return { entry, hit: h };
    break;
  }
  return { entry: nearestEntry, hit: nearest };
}

function raycastAtPointer() {
  raycaster.setFromCamera(pointerNDC, camera);
  const hits = raycaster.intersectObjects(world.pickables, false);
  return chooseHit(hits);
}

function refreshReticle() {
  const entry = state.hoveredEntry || state.selectedEntry;
  if (entry) world.showHover(entry, state.hoverPoint);
  else world.hideHover();
}

function clearHoverState() {
  if (state.hoveredEntry && state.hoveredEntry.onHoverInstance) state.hoveredEntry.onHoverInstance(-1);
  state.hoveredEntry = null;
  ui.hideTooltip();
  canvas.style.cursor = 'grab';
  refreshReticle();
}

function updateHover() {
  if (state.formOpen || state.claimActive || state.intro || state.cameraTween) return;
  const picked = raycastAtPointer();
  if (picked) {
    const entry = picked.entry;
    if (state.hoveredEntry !== entry) {
      if (state.hoveredEntry && state.hoveredEntry.onHoverInstance) state.hoveredEntry.onHoverInstance(-1);
      state.hoveredEntry = entry;
      if (entry.onHoverInstance && picked.hit.instanceId !== undefined) entry.onHoverInstance(picked.hit.instanceId);
      audio.hover();
      refreshReticle();
    }
    if (entry.dynamicFocus) state.hoverPoint.copy(picked.hit.point);
    world.showHover(entry, picked.hit.point);
    ui.showTooltip(entry, state.pointerClient.x + 18, state.pointerClient.y + 20);
    canvas.style.cursor = 'pointer';
  } else {
    if (state.hoveredEntry) {
      if (state.hoveredEntry.onHoverInstance) state.hoveredEntry.onHoverInstance(-1);
      state.hoveredEntry = null;
      ui.hideTooltip();
      canvas.style.cursor = 'grab';
    }
    refreshReticle();
  }
}

function handleClick() {
  if (state.formOpen || state.claimActive) return;
  const picked = raycastAtPointer();
  if (!picked) {
    state.selectedEntry = null;
    state.dossierOpen = false;
    world.hideHover();
    ui.hideTooltip();
    if (ui.selectedEntry) ui.closeDossier(true);
    if (state.cinematic) controls.autoRotate = true;
    return;
  }
  const entry = picked.entry;
  if (entry.id === 'garage') {
    beginClaim(entry);
    return;
  }
  state.selectedEntry = entry;
  state.dossierOpen = true;
  state.hoverPoint.copy(picked.hit.point);
  if (entry.onHoverInstance && picked.hit.instanceId !== undefined) entry.onHoverInstance(picked.hit.instanceId);
  controls.autoRotate = false;
  world.showHover(entry, picked.hit.point);
  ui.showDossier(entry);
}

function renderNow() {
  if (!renderer || !scene) return;
  renderer.info.reset();
  if (composer) composer.render();
  else renderer.render(scene, camera);
  if (ui) ui.updatePerf(60, renderer.info.render.calls);
}

function advanceSim(seconds) {
  let left = Math.max(0.1, seconds);
  const step = 1 / 30;
  while (left > 0) {
    const dt = Math.min(step, left);
    simClock += dt;
    updateCameraTween(dt);
    season.update(dt, simClock);
    traffic.update(dt, simClock);
    npcs.update(dt, simClock);
    world.update(dt, simClock, camera);
    left -= dt;
  }
  ui.updateSeason(season.getInfo());
  ui.updateQuest(npcs.questState);
}

/* ---------------- setup ---------------- */
async function start() {
  try {
    bootStep(6, '初始化渲染管线');
    await nextFrame();

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(QA ? 1 : Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !QA;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.info.autoReset = false;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(BASE_FOV, window.innerWidth / window.innerHeight, 0.1, 320);
    camera.position.copy(CAM.introPos);
    camera.lookAt(CAM.introTarget);

    controls = new OrbitControls(camera, canvas);
    controls.target.copy(CAM.introTarget);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.minDistance = 16;
    controls.maxDistance = 44;
    controls.minPolarAngle = 0.72;
    controls.maxPolarAngle = 1.46;
    controls.minAzimuthAngle = -0.48;
    controls.maxAzimuthAngle = 0.92;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.06;
    controls.zoomSpeed = 0.72;
    controls.rotateSpeed = 0.55;
    controls.enabled = false;

    // render targets with MSAA (desktop) for crisp architectural edges
    if (!QA) {
      const rt = new THREE.WebGLRenderTarget(1, 1, {
        type: THREE.HalfFloatType,
        samples: isMobile ? 0 : 2,
      });
      composer = new EffectComposer(renderer, rt);
      composer.setPixelRatio(renderer.getPixelRatio());
      composer.setSize(window.innerWidth, window.innerHeight);
      composer.addPass(new RenderPass(scene, camera));
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        isMobile ? 0.5 : 0.66,
        0.56,
        0.66
      );
      composer.addPass(bloomPass);
      composer.addPass(new OutputPass());
    }

    bootStep(26, '构建双层玻璃车房');
    await nextFrame();

    world = createWorld(scene, renderer, { isMobile });

    bootStep(50, '接入四季天气与浮尘');
    await nextFrame();

    season = new SeasonSystem(scene, world, renderer, camera, {
      isMobile,
      onSeasonChange: () => {
        if (!ui) return;
        ui.updateSeason(season.getInfo());
      },
      onState: (info) => {
        if (ui) ui.updateSeason(info);
      },
    });

    bootStep(68, '唤醒 NPC 与 GPU 车流');
    await nextFrame();

    traffic = new TrafficSystem(scene, world);
    npcs = new NPCSystem(scene, world, camera, {
      onTaskUpdate: (quest) => {
        if (ui) ui.updateQuest(quest);
      },
      onStepComplete: (index, questNo) => {
        if (!ui) return;
        const labels = ['取票', '提交', '审批'];
        ui.toast(`NPC 已抵达「${labels[index]}」节点 · ${questNo}`);
        audio.step();
      },
    });

    bootStep(84, '映射 22 个可交互资产');
    await nextFrame();

    ui = new UI(world, season, npcs, audio, {
      getCinema: () => state.cinematic,
      setCinema: (v) => {
        state.cinematic = v;
        if (!state.formOpen && !state.claimActive && !state.intro && !state.dossierOpen) {
          controls.autoRotate = v;
        }
      },
      getSound: () => state.sound,
      setSound: (v) => {
        state.sound = v;
        audio.setEnabled(v);
      },
      getLabels: () => state.labels,
      setLabels: (v) => {
        state.labels = v;
        world.setLabelsVisible(v);
      },
      onResetCamera: resetCamera,
      onOpenClaim: beginClaim,
      onDossierClose: () => {
        state.selectedEntry = null;
        state.dossierOpen = false;
        if (state.hoveredEntry) world.showHover(state.hoveredEntry, state.hoverPoint);
        else world.hideHover();
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => {
          if (state.cinematic && !state.formOpen && !state.dossierOpen && !state.claimActive) controls.autoRotate = true;
        }, 1200);
      },
      onFocusQuest: focusQuest,
      onLocate: locateEntry,
      onSubmit: (payload) => {
        npcs.triggerNewClaim();
        ui.updateQuest(npcs.questState);
        console.info('[GOODWORK] claim submitted', payload);
      },
      onFormClose: closeFormFlow,
    });

    ui.setActiveSeason(season.getInfo().key);
    ui.updateSeason(season.getInfo());
    ui.updateQuest(npcs.questState);
    ui.updatePerf(60, 0);

    bindInteractions();
    onResize();

    bootStep(96, '校准镜头与色调');
    await nextFrame();

    bootStep(100, '场景就绪');
    await new Promise((resolve) => setTimeout(resolve, 420));
    $('boot').classList.add('hide');
    if (QA) {
      state.intro = false;
      camera.position.copy(CAM.pos);
      controls.target.copy(CAM.target);
      camera.lookAt(CAM.target);
      controls.enabled = true;
      controls.autoRotate = false;
      controls.update();
    } else {
      window.setTimeout(() => startIntro(), 220);
    }

    if (QA) {
      window.__GW_DEBUG = {
        state, world, season, traffic, npcs, ui, camera, controls, renderer,
        beginClaim, closeFormFlow, handleClick, updateHover, raycastAtPointer,
        advance: advanceSim,
        renderNow,
        selectEntry: (id) => {
          const entry = world.entryById.get(id);
          if (!entry) return null;
          state.selectedEntry = entry;
          state.dossierOpen = true;
          state.hoverPoint.copy(entry.focus);
          controls.autoRotate = false;
          world.showHover(entry, entry.focus);
          ui.showDossier(entry);
          renderNow();
          return entry.name;
        },
        setSeasonNow: (key) => {
          season.setSeason(key, true);
          season.setAuto(false);
          advanceSim(4.5);
          renderNow();
        },
        focusGarage: () => {
          beginClaim(world.entryById.get('garage'));
          advanceSim(4);
          renderNow();
        },
      };
    }

    lastFrame = performance.now();
    requestAnimationFrame(animate);

    controls.addEventListener('start', () => {
      if (state.intro) skipIntro();
      controls.autoRotate = false;
      window.clearTimeout(idleTimer);
    });
    controls.addEventListener('end', () => {
      window.clearTimeout(idleTimer);
      if (!state.cinematic) return;
      idleTimer = window.setTimeout(() => {
        if (!state.formOpen && !state.claimActive && !state.dossierOpen) controls.autoRotate = true;
      }, 6500);
    });
  } catch (err) {
    fatal(err);
  }
}

/* ---------------- events ---------------- */
function bindInteractions() {
  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    pointerNDC.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    state.pointerClient.x = e.clientX;
    state.pointerClient.y = e.clientY;
    state.pointerDirty = true;
    if (state.hoveredEntry) ui.showTooltip(state.hoveredEntry, e.clientX + 18, e.clientY + 20);
  });

  canvas.addEventListener('pointerleave', () => {
    pointerNDC.set(-2, -2);
    state.pointerDirty = false;
    clearHoverState();
  });

  canvas.addEventListener('pointerdown', (e) => {
    audio.unlock();
    if (e.button !== 0) return;
    if (state.intro) skipIntro();
    state.pointerDown = { x: e.clientX, y: e.clientY, t: performance.now() };
  });

  canvas.addEventListener('pointerup', (e) => {
    const pd = state.pointerDown;
    state.pointerDown = null;
    if (!pd) return;
    if (Math.hypot(e.clientX - pd.x, e.clientY - pd.y) > 6) return;
    if (performance.now() - pd.t > 750) return;
    if (state.intro) skipIntro();
    if (state.formOpen || state.claimActive || state.cameraTween) return;
    state.pointerDirty = false;
    handleClick();
  });

  window.addEventListener('keydown', () => audio.unlock(), { once: true });

  document.addEventListener('visibilitychange', () => {
    lastFrame = performance.now();
  });

  window.addEventListener('resize', onResize);
}

function onResize() {
  if (!renderer) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const aspect = w / h;
  camera.aspect = aspect;
  camera.fov = aspect < 0.95 ? 54 : BASE_FOV;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(QA ? 1 : Math.min(window.devicePixelRatio || 1, dprCap));
  renderer.setSize(w, h, false);
  if (composer) {
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(w, h);
  }
  if (bloomPass) bloomPass.resolution.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
  const bufferHeight = renderer.domElement.height;
  const scale = (bufferHeight * 0.5) / Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
  if (world) world.setViewScale(scale);
  if (season) season.setViewScale(scale);
  if (traffic) traffic.setViewScale(scale);
}

/* ---------------- main loop ---------------- */
function animate(now) {
  requestAnimationFrame(animate);
  if (!renderer || !scene) return;

  renderer.info.reset();
  const dt = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;
  simClock += dt;

  updateCameraTween(dt);

  if (!state.intro && !state.cameraTween) {
    controls.update();
  }

  season.update(dt, simClock);
  traffic.update(dt, simClock);
  npcs.update(dt, simClock);
  world.update(dt, simClock, camera);

  if (state.pointerDirty) {
    updateHover();
    state.pointerDirty = false;
  } else if (!state.formOpen && !state.claimActive && !state.cameraTween && state.hoveredEntry && now - lastHoverRay > 300) {
    lastHoverRay = now;
    state.pointerDirty = true;
  }

  if (!QA) {
    renderer.info.reset();
    composer ? composer.render() : renderer.render(scene, camera);
  } else if (!qaRendered) {
    qaRendered = true;
    renderNow();
  }

  fpsFrames += 1;
  fpsAccum += dt;
  statAccum += dt;
  if (statAccum >= 0.6) {
    const fps = Math.max(1, Math.round(fpsFrames / fpsAccum));
    if (!QA) ui.updatePerf(fps, renderer.info.render.calls);
    statAccum = 0;
    fpsAccum = 0;
    fpsFrames = 0;
    ui.updateSeason(season.getInfo());
  }
}

start();
