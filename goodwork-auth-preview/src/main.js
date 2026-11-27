/**
 * GOODWORK 古德車房 · 悬浮生态财务工作台
 * 入口：渲染器、场景装配、三阶段运镜、业务串联
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { CAMERA, SEASONS, SEASON_MAP } from './core/config.js?v=20261123v93';
import { Ease, Tweens, bus } from './core/utils.js?v=20261123v93';
import { createEnvironment as createEnvMap } from './world/materials.js?v=20261123v93';
import { createEnvironment as createSpace } from './world/environment.js?v=20261123v93';
import { createIsland } from './world/island.js?v=20261123v93';
import { createBuildings } from './world/buildings.js?v=20261123v93';
import { createProps } from './world/props.js?v=20261124v924';
import { ParticleSystem } from './systems/particles.js?v=20261123v93';
import { SeasonSystem } from './systems/seasons.js?v=20261123v93';
import { NPCSystem } from './systems/npc.js?v=20261123v93';
import { InteractionSystem } from './systems/interaction.js?v=20261123v93';
import { QuestSystem } from './systems/quest.js?v=20261123v93';
import { AudioEngine } from './audio.js?v=20261123v93';
import { UI } from './ui/ui.js?v=20261123v93';
import { ReimburseBoard } from './ui/reimburse.js?v=20261127v10';
import { CloudSync } from './core/cloudSync.js?v=20261125v935';
import { AuthCloudSync } from './core/authCloudSync.js?v=20261127v7';

// 🛠️ 在任何 UI 初始化之前，先建立一个独立的 CloudSync 单例
// 这样即使 ReimburseBoard 或 WebGL 有问题，云端同步也能工作
const SyncClass = window.__AUTH_USER__ ? AuthCloudSync : CloudSync;
const __globalCloudSync = new SyncClass({
  getState: () => window.__goodworkAppState || { tasks: [], processedEvents: [] },
  applyState: (state, meta) => {
    window.__goodworkAppState = window.__goodworkAppState || {};
    window.__goodworkAppState.tasks = state.tasks || [];
    window.__goodworkAppState.processedEvents = state.processedEvents || [];
    console.log('[globalCloudSync] applyState:', state.tasks?.length, 'tasks, meta=', meta);
    // 如果 ReimburseBoard 已存在，也通知它
    if (window.__goodworkApp?.reimburse?.applyCloudState) {
      try { window.__goodworkApp.reimburse.applyCloudState(state, meta); } catch {}
    }
  },
  onStatus: (status, detail) => console.log('[globalCloudSync] onStatus:', status, detail?.message || ''),
  onToast: (title, desc, type) => console.log('[globalCloudSync] toast:', title, type),
});
window.__cloudSync = __globalCloudSync;
window.__cloudSyncApp = __globalCloudSync;
// 立即初始化 —— 不阻塞页面渲染
__globalCloudSync.init().then(() => {
  const s = __globalCloudSync.getStatus();
  console.log('%c[globalCloudSync] init 完成', 'color:#0099ff;font-weight:bold', `connected=${s.connected}`);
}).catch(e => {
  console.error('[globalCloudSync] init 失败:', e?.message || e);
});
console.log('%c[globalCloudSync] 已创建，等待 init...', 'color:#0099ff');

const nextPaint = () => new Promise((resolve) => {
  requestAnimationFrame(() => requestAnimationFrame(resolve));
});

class GoodworkApp {
  constructor() {
    this.params = new URLSearchParams(window.location.search);
    this.isTest = this.params.has('test') || this.params.has('nointro');
    this.noIntro = this.params.has('nointro') || this.params.has('test');
    this.tweens = new Tweens();
    this.clock = new THREE.Clock();
    this.time = 0;
    this.introPlaying = true;
    this.focus = {
      active: false,
      entering: false,
      exiting: false,
      savedPos: new THREE.Vector3(),
      savedTarget: new THREE.Vector3(),
      timers: [],
    };
    this.frameCount = 0;
    this.fpsAccum = 0;
    this.fpsTimer = 0;
    this.fps = 60;
    this.ui = null;
    this.interaction = null;
  }

  async boot() {
    const ui = new UI();
    this.ui = ui;
    ui.setLoading(4, '初始化渲染管线');
    await nextPaint();

    const canvas = document.getElementById('scene');
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
      });
    } catch (err) {
      console.error(err);
      // 🛠️ 移动端 / 低性能设备无 WebGL2 时的降级：仍可直接进入报销工作台（纯 DOM）
      ui.setLoading(100, '已进入纯数据模式（无 3D 场景）');
      ui.setReady();
      try {
        this.reimburse = new ReimburseBoard({
          onClose: () => {},
          onToast: (title, desc, type) => this.ui.toast(title, desc, type),
        });
        this.reimburse.open();
        this.openCloudAttachmentFromUrl();
      } catch (e2) {
        console.error('降级进入工作台失败', e2);
        ui.el.loadingStatus.textContent = '当前浏览器不支持 WebGL2，且工作台加载失败。';
      }
      return;
    }
    this.renderer = renderer;
    const pr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(pr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = SEASONS[0].exposure;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.info.autoReset = false;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#04070d');
    scene.fog = new THREE.FogExp2(SEASONS[0].fog, SEASONS[0].fogDensity);
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(CAMERA.fov, window.innerWidth / window.innerHeight, 0.1, 700);
    camera.position.fromArray(CAMERA.home);
    this.camera = camera;

    const controls = new OrbitControls(camera, canvas);
    controls.target.fromArray(CAMERA.homeTarget);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = CAMERA.minDistance;
    controls.maxDistance = CAMERA.maxDistance;
    controls.minPolarAngle = 0.18;
    controls.maxPolarAngle = CAMERA.maxPolarAngle;
    controls.rotateSpeed = 0.62;
    controls.zoomSpeed = 0.8;
    controls.enabled = false;
    controls.update();
    this.controls = controls;

    this.composer = new EffectComposer(renderer);
    this.composer.setPixelRatio(pr);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.renderPass = new RenderPass(scene, camera);
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.55, 0.72, 0.8
    );
    this.outputPass = new OutputPass();
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.outputPass);

    ui.setLoading(10, '预计算环境反射');
    await nextPaint();
    const envTex = createEnvMap(renderer);
    scene.environment = envTex;
    if ('environmentIntensity' in scene) scene.environmentIntensity = 0.82;

    // 灯光
    const first = SEASONS[0];
    const hemi = new THREE.HemisphereLight(first.hemiSky, first.hemiGround, first.hemiIntensity);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(first.keyColor, first.keyIntensity);
    key.position.set(13, 17, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -15;
    key.shadow.camera.right = 15;
    key.shadow.camera.top = 15;
    key.shadow.camera.bottom = -15;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 50;
    key.shadow.bias = -0.0008;
    key.shadow.normalBias = 0.035;
    key.target.position.set(0, 0, 0);
    scene.add(key, key.target);
    const rim = new THREE.DirectionalLight(first.rimColor, first.rimIntensity);
    rim.position.set(-14, 9, -13);
    scene.add(rim);
    const ambient = new THREE.AmbientLight(first.ambient, first.ambientIntensity);
    scene.add(ambient);
    const under = new THREE.PointLight('#6f8fd8', 30, 18, 2);
    under.position.set(0.5, -4.6, 2.0);
    scene.add(under);
    const frontFill = new THREE.DirectionalLight('#b8d0ee', 0.9);
    frontFill.position.set(-4, 8, 18);
    scene.add(frontFill);
    this.lights = { hemi, key, rim, ambient, under };

    ui.setLoading(18, '生成深空与玻璃立方体');
    await nextPaint();
    this.space = createSpace(scene);

    ui.setLoading(32, '塑造雪山、河流与漂浮岛屿');
    await nextPaint();
    this.island = createIsland(scene);

    ui.setLoading(50, '建造 GOODWORK 古德车房');
    await nextPaint();
    this.snowMeshes = [];
    this.buildings = createBuildings(scene, this.island.snowMaterial, this.snowMeshes);

    ui.setLoading(63, '铺设广场、环道与车辆');
    await nextPaint();
    this.props = createProps(scene);

    ui.setLoading(72, '点亮街灯与粒子系统');
    await nextPaint();
    this.particles = new ParticleSystem(scene, {
      garageOrigin: new THREE.Vector3(-0.2, 1.9, 1.2),
    });

    ui.setLoading(82, '召唤 GOODWORK 团队');
    await nextPaint();
    this.npcs = new NPCSystem(scene, this.island, this.props);

    ui.setLoading(88, '连接四季与财务工作台');
    await nextPaint();
    this.audio = new AudioEngine();
    // 小型装饰不参与阴影渲染，控制绘制批次
    {
      const box = new THREE.Box3();
      const size = new THREE.Vector3();
      scene.traverse((o) => {
        if (!o.isMesh || !o.castShadow) return;
        if (o.isInstancedMesh) return;
        box.setFromObject(o);
        if (!box.isEmpty()) {
          box.getSize(size);
          if (Math.max(size.x, size.y, size.z) < 0.5) o.castShadow = false;
        }
      });
      this.npcs.npcs.forEach((n) => {
        n.group.traverse((o) => { if (o.isMesh) o.castShadow = false; });
      });
    }
    this.interaction = new InteractionSystem({
      scene,
      camera,
      domElement: canvas,
      ui,
      audio: this.audio,
      npcs: this.npcs.byId,
      onSelect: (key, ctx) => this.onSelect(key, ctx),
      onHoverChange: (key) => {
        if (key === 'garage' && this.particles) this.particles.sparks.burst(0.6);
      },
    });
    this.interaction.setEnabled(false);

    this.season = new SeasonSystem({
      scene,
      renderer,
      bloomPass: this.bloomPass,
      lights: this.lights,
      island: this.island,
      buildings: this.buildings,
      particles: this.particles,
      environment: this.space,
      onSeasonChanged: (season, meta) => this.onSeasonChanged(season, meta),
    });

    this.quest = new QuestSystem({
      ui,
      npcs: this.npcs,
      props: this.props,
      audio: this.audio,
      onOpenGarage: () => this.enterGarageFlow(),
    });

    this.reimburse = new ReimburseBoard({
      onClose: () => this.exitGarageFocus(),
      onToast: (title, desc, type) => this.ui.toast(title, desc, type),
    });

    this.bindUI();
    this.bindEnvironment();

    const initialSeason = this.params.get('season');
    if (initialSeason && SEASON_MAP[initialSeason]) {
      this.season.autoEnabled = false;
      this.season.setSeason(initialSeason, false, true);
    } else {
      ui.updateSeason('spring');
      this.audio.setSeason('spring');
    }
    ui.updateSeason(this.season.id);

    ui.setLoading(94, '编译着色器与点亮灯塔');
    await nextPaint();
    try {
      renderer.compile(scene, camera);
    } catch (err) {
      console.warn('Shader precompile skipped', err);
    }

    this.startLoop();
    ui.setLoading(100, '进入 GOODWORK 悬浮生态');
    await nextPaint();
    ui.setReady();
    this.startIntro();
    this.exposeDebug();
  }

  bindUI() {
    const ui = this.ui;
    ui.on('cta', () => {
      if (this.introPlaying) return;
      if (ui.panelMode === 'form') return;
      this.enterGarageFlow();
    });
    ui.on('seasonSelect', (id) => {
      if (!SEASON_MAP[id]) return;
      this.season.setSeason(id, true);
    });
    ui.on('panelClose', (mode) => {
      this.audio.close();
      if (this.focus.active) this.exitGarageFocus();
      void mode;
    });
    ui.on('formSubmit', (record) => this.quest.onFormSubmit(record));
    ui.on('collectReceipts', () => this.quest.collectReceipts({ fromForm: true }));
    ui.on('action', (action, entry, context) => this.handleAction(action, entry, context));
    ui.on('archive', () => {
      if (this.focus.active) this.reimburse?.open();
      else this.enterGarageFlow();
    });
    ui.on('questTrack', (id) => this.quest.track(id));
    ui.on('soundToggle', (muted) => this.audio.setMuted(muted));
  }

  bindEnvironment() {
    const initAudio = () => this.audio.init();
    window.addEventListener('pointerdown', initAudio, { once: true, capture: true });
    window.addEventListener('keydown', initAudio, { once: true });
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 250));
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.clock.getDelta();
    });
    document.addEventListener('pointermove', (e) => {
      const label = document.querySelector('.world-label.is-hot');
      if (label) label.classList.add('is-visible');
      void e;
    }, { passive: true });
  }

  handleAction(action, entry, context) {
    switch (action) {
      case 'openForm':
        this.enterGarageFlow();
        break;
      case 'collect':
        this.quest.collectReceipts();
        break;
      case 'approve':
      case 'approveNow':
      case 'submit-approve':
        this.quest.approveNow();
        break;
      case 'sendNpc': {
        const npcId = context?.npcId || this.npcs.npcs[0]?.id;
        this.quest.sendNpc(npcId);
        break;
      }
      case 'asset':
        this.audio.click();
        this.particles.sparks.burst(1.4);
        this.ui.toast('车辆档案已调取', 'Aventis GT · 底盘检修完成 · 等待交付。');
        break;
      case 'archive':
        if (this.focus.active) this.reimburse?.open();
        else {
          this.ui.closePanel(false);
          this.enterGarageFlow();
        }
        break;
      default:
        break;
    }
    void entry;
  }

  onSelect(key, ctx = {}) {
    if (key === 'garage') {
      this.particles.sparks.burst(1.1);
      this.enterGarageFlow();
      return;
    }
    this.audio.click();
    this.interaction.setEnabled(false);
    if (key === 'npc') {
      this.ui.openDetail('npc', {
        npcId: ctx.npcId,
        name: this.npcs.byId[ctx.npcId]?.employee.name,
        line: this.npcs.byId[ctx.npcId]?.employee.line,
      });
      return;
    }
    if (key === 'liftCar') {
      this.particles.sparks.burst(1.2);
    }
    this.ui.openDetail(key, ctx);
  }

  onSeasonChanged(season, meta) {
    this.ui.updateSeason(season.id);
    this.audio.setSeason(season.id);
    if (meta?.manual && !meta?.instant) this.audio.seasonChange();
    if (this.introPlaying || meta?.instant) return;
    this.ui.toast(
      `${season.cn}季 · ${season.copy}`,
      meta?.manual ? '已手动切换季节，环境粒子与光照同步过渡。' : '四季自动流转 · 光照 / 植被 / 粒子平滑过渡。'
    );
  }

  /* ---------------- 三阶段运镜 ---------------- */

  enterGarageFlow() {
    if (this.introPlaying) return;
    if (this.focus.active || this.focus.entering) return;
    if (this.ui.panelMode === 'form') return;
    if (this.ui.panelMode) this.ui.closePanel(false);

    this.focus.active = true;
    this.focus.entering = true;
    this.focus.exiting = false;
    this.focus.savedPos.copy(this.camera.position);
    this.focus.savedTarget.copy(this.controls.target);
    this.controls.enabled = false;
    this.interaction.setEnabled(false);
    this.ui.hideTooltip();
    this.audio.open();
    this.particles.sparks.burst(1.2);
    if (this.props.fleet?.group) this.props.fleet.group.visible = false;
    if (this.props.pedestrians?.group) this.props.pedestrians.group.visible = false;

    this.focus.timers.forEach((t) => clearTimeout(t));
    this.focus.timers = [
      setTimeout(() => document.body.classList.add('is-focus'), 460),
      setTimeout(() => {
        if (!this.focus.active) return;
        this.reimburse?.open();
      }, 1650),
    ];

    this.tweens.clear();
    let delay = 0;
    let fromPos = this.camera.position.clone();
    let fromTarget = this.controls.target.clone();
    const stages = CAMERA.focusStages;
    stages.forEach((stage, index) => {
      const toPos = new THREE.Vector3().fromArray(stage.pos);
      const toTarget = new THREE.Vector3().fromArray(stage.target);
      const startPos = fromPos.clone();
      const startTarget = fromTarget.clone();
      this.tweens.add({
        duration: stage.duration,
        delay,
        ease: index === 0 ? Ease.inOutCubic : Ease.inOutQuint,
        onUpdate: (t) => {
          this.camera.position.lerpVectors(startPos, toPos, t);
          this.controls.target.lerpVectors(startTarget, toTarget, t);
          this.camera.lookAt(this.controls.target);
        },
        onComplete: () => {
          if (index === stages.length - 1) {
            this.focus.entering = false;
            this.controls.target.copy(toTarget);
            this.camera.lookAt(toTarget);
          }
        },
      });
      fromPos = toPos;
      fromTarget = toTarget;
      delay += stage.duration;
    });
  }

  exitGarageFocus() {
    if (!this.focus.active) return;
    this.focus.timers.forEach((t) => clearTimeout(t));
    this.focus.timers = [];
    this.focus.entering = false;
    this.focus.exiting = true;
    document.body.classList.remove('is-focus');
    if (this.props.fleet?.group) this.props.fleet.group.visible = true;
    if (this.props.pedestrians?.group) this.props.pedestrians.group.visible = true;
    this.audio.close();
    this.tweens.clear();
    const fromPos = this.camera.position.clone();
    const fromTarget = this.controls.target.clone();
    const toPos = this.focus.savedPos.clone();
    const toTarget = this.focus.savedTarget.clone();
    this.tweens.add({
      duration: 1.55,
      ease: Ease.inOutQuint,
      onUpdate: (t) => {
        this.camera.position.lerpVectors(fromPos, toPos, t);
        this.controls.target.lerpVectors(fromTarget, toTarget, t);
        this.camera.lookAt(this.controls.target);
      },
      onComplete: () => {
        this.focus.active = false;
        this.focus.exiting = false;
        this.controls.target.copy(toTarget);
        this.camera.lookAt(toTarget);
        this.controls.enabled = !this.introPlaying;
        this.controls.update();
        this.updateInteractionState();
      },
    });
  }

  startIntro() {
    if (this.noIntro) {
      this.introPlaying = false;
      this.camera.position.fromArray(CAMERA.home);
      this.controls.target.fromArray(CAMERA.homeTarget);
      this.camera.lookAt(this.controls.target);
      this.controls.enabled = true;
      this.controls.update();
      this.updateInteractionState();
      return;
    }
    const startPos = new THREE.Vector3(
      CAMERA.home[0] * 1.12,
      CAMERA.home[1] + 3.4,
      CAMERA.home[2] * 1.12
    );
    const endPos = new THREE.Vector3().fromArray(CAMERA.home);
    const startTarget = new THREE.Vector3().fromArray(CAMERA.homeTarget);
    const endTarget = new THREE.Vector3().fromArray(CAMERA.homeTarget);
    this.camera.position.copy(startPos);
    this.controls.target.copy(startTarget);
    this.camera.lookAt(startTarget);
    this.tweens.add({
      duration: 3.1,
      ease: Ease.outCubic,
      onUpdate: (t) => {
        this.camera.position.lerpVectors(startPos, endPos, t);
        this.controls.target.lerpVectors(startTarget, endTarget, t);
        this.camera.lookAt(this.controls.target);
      },
      onComplete: () => {
        this.introPlaying = false;
        this.controls.enabled = true;
        this.controls.update();
        this.updateInteractionState();
        this.ui.toast('悬浮世界已就绪', '拖拽旋转视角 · 点击 GOODWORK 车房进入报销工作台');
      },
    });
  }

  updateInteractionState() {
    if (!this.interaction) return;
    const allow = !this.ui.isPanelOpen() && !this.focus.active && !this.introPlaying;
    if (allow !== this.interaction.enabled) this.interaction.setEnabled(allow);
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.bloomPass.setSize(w, h);
  }

  startLoop() {
    const loop = () => {
      requestAnimationFrame(loop);
      const dt = Math.min(this.clock.getDelta(), 0.05);
      this.time += dt;
      this.frameCount++;

      this.tweens.update(dt);
      if (this.controls.enabled) this.controls.update();

      this.season.update(dt);
      this.particles.update(dt, this.time);
      this.island.update(dt, this.time);
      this.buildings.update(dt, this.time);
      this.props.update(dt, this.time);
      this.npcs.update(dt, this.time);
      this.space.update(dt, this.time);
      this.interaction.update(dt, this.time);

      this.updateInteractionState();

      this.renderer.info.reset();
      this.composer.render();
      if (!this._shadowFrozen) {
        this._shadowFrozen = true;
        this.renderer.shadowMap.autoUpdate = false;
      }
      this.updateStats(dt);
    };
    loop();
  }

  updateStats(dt) {
    this._fpsTimer = (this._fpsTimer || 0) + dt;
    this._fpsFrames = (this._fpsFrames || 0) + 1;
    if (this._fpsTimer > 0.55) {
      this.fps = Math.round(this._fpsFrames / this._fpsTimer);
      this._fpsTimer = 0;
      this._fpsFrames = 0;
      const calls = this.renderer.info.render.calls;
      this.ui.setStats(Math.min(120, this.fps), this.particles.count, calls);
    }
  }

  exposeDebug() {
    window.__GOODWORK__ = {
      app: this,
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      season: this.season,
      quest: this.quest,
      ui: this.ui,
      npcs: this.npcs,
      interaction: this.interaction,
      enterGarage: () => this.enterGarageFlow(),
      exitGarage: () => {
        if (this.ui.isPanelOpen()) this.ui.closePanel(true);
        else this.exitGarageFocus();
      },
      seasonInstant: (id) => this.season.setSeason(id, false, true),
      focusInstant: () => {
        if (this.focus.active || this.introPlaying) return;
        this.focus.active = true;
        this.focus.entering = false;
        this.focus.savedPos.copy(this.camera.position);
        this.focus.savedTarget.copy(this.controls.target);
        this.controls.enabled = false;
        this.interaction.setEnabled(false);
        if (this.props.fleet?.group) this.props.fleet.group.visible = false;
        if (this.props.pedestrians?.group) this.props.pedestrians.group.visible = false;
        this.camera.position.fromArray(CAMERA.focusStages[CAMERA.focusStages.length - 1].pos);
        this.controls.target.fromArray(CAMERA.focusStages[CAMERA.focusStages.length - 1].target);
        this.camera.lookAt(this.controls.target);
        document.body.classList.add('is-focus');
        this.reimburse?.open();
        this.particles.sparks.burst(1.2);
      },
      closeInstant: () => {
        document.body.classList.remove('is-focus');
        this.focus.active = false;
        this.focus.entering = false;
        this.focus.exiting = false;
        if (this.props.fleet?.group) this.props.fleet.group.visible = true;
        if (this.props.pedestrians?.group) this.props.pedestrians.group.visible = true;
        this.camera.position.copy(this.focus.savedPos);
        this.controls.target.copy(this.focus.savedTarget);
        this.camera.lookAt(this.controls.target);
        this.controls.enabled = true;
        this.interaction.setEnabled(true);
        this.reimburse?.close();
      },
      reimburse: this.reimburse,
    };
  }
}

const app = new GoodworkApp();
app.boot().catch((err) => {
  console.error('GOODWORK boot failed', err);
  const status = document.getElementById('loadingStatus');
  if (status) status.textContent = '场景初始化失败，请查看控制台日志。';
  const pct = document.getElementById('loadingPct');
  if (pct) pct.textContent = 'ERR';
});
