/**
 * 全场景交互：射线拾取（玻璃优先级）、金色光环、跟随浮层、世界空间标签
 */
import * as THREE from 'three';
import { INTERACTIONS } from '../core/archive.js';
import { EMPLOYEES } from '../core/config.js';
import { toScreen } from '../core/utils.js';
import { makeGlowTexture } from '../core/textures.js';
import { heightAt } from '../world/terrain.js';

const HINTS = {
  garage: '点击进入报销',
  ticketBox: '点击收取票据',
  approvalTerminal: '点击打开审批',
  npc: '点击查看 · 派发任务',
  liftCar: '点击查看车辆档案',
};

const LABEL_SHORT = {
  garage: ['GOODWORK 古德車房', 'CORE BUILDING'],
  ticketBox: ['票据箱', 'TICKET'],
  approvalTerminal: ['审批终端', 'APPROVAL'],
  finance: ['财务室', 'FINANCE'],
  warehouse: ['仓库', 'WAREHOUSE'],
  dorm: ['员工宿舍', 'RESIDENCE'],
  lake: ['镜湖', 'MIRROR LAKE'],
  waterfall: ['悬空瀑布', 'SKYFALL'],
};

export class InteractionSystem {
  constructor({ scene, camera, domElement, ui, audio, npcs, onSelect, onHoverChange }) {
    this.scene = scene;
    this.camera = camera;
    this.dom = domElement;
    this.ui = ui;
    this.audio = audio;
    this.npcs = npcs;
    this.onSelect = onSelect;
    this.onHoverChange = onHoverChange || (() => {});
    this.enabled = true;
    this.pickables = [];
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.hover = null;
    this.lastRaycast = 0;
    this.pointerInside = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.down = null;
    this.labelEls = [];
    this._anchor = new THREE.Vector3();
    this._screen = { x: 0, y: 0, visible: false, depth: 0 };
    this.hoverPulse = 0;

    this.config = {
      garage: { anchor: new THREE.Vector3(-0.1, 0.95, 0.55), radius: 4.1, label: false, ring: new THREE.Vector3(-0.1, 0, 1.2) },
      mainSign: { anchor: new THREE.Vector3(-0.1, 7.0, 2.2), radius: 1.1, ring: new THREE.Vector3(-0.1, 0, 3.95) },
      verticalSign: { anchor: new THREE.Vector3(-3.4, 1.55, 3.5), radius: 0.8, ring: new THREE.Vector3(-3.4, 0, 4.05) },
      bladeSign: { anchor: new THREE.Vector3(4.3, 5.75, 3.4), radius: 0.9, ring: new THREE.Vector3(4.2, 0, 4.2) },
      liftCar: { anchor: new THREE.Vector3(-1.1, 2.4, -0.1), radius: 1.2, ring: new THREE.Vector3(-1.1, 1.28, -0.1) },
      ticketBox: { anchor: new THREE.Vector3(3.12, 0.9, 4.42), radius: 0.55, label: true },
      approvalTerminal: { anchor: new THREE.Vector3(-3.62, 0.9, 4.42), radius: 0.6, label: true },
      parkingSign: { anchor: new THREE.Vector3(5.32, 0.9, 4.28), radius: 0.6 },
      streetLamp: { anchor: null, radius: 0.55 },
      deliveryVan: { anchor: new THREE.Vector3(-6.35, 1.05, 1.18), radius: 1.5 },
      traffic: { anchor: null, radius: 0.8 },
      cherryGrove: { anchor: new THREE.Vector3(0.05, 0.95, 6.55), radius: 1.05 },
      lake: { anchor: new THREE.Vector3(7.0, 0.5, 3.0), radius: 1.9, label: true },
      waterfall: { anchor: new THREE.Vector3(9.95, 0.5, 3.0), radius: 1.2, label: false },
      mountain: { anchor: new THREE.Vector3(-5.0, 1.0, -4.6), radius: 2.5 },
      deer: { anchor: new THREE.Vector3(2.7, 0.4, -5.8), radius: 0.9 },
      finance: { anchor: new THREE.Vector3(7.05, 1.2, -2.75), radius: 2.0, label: true, ring: new THREE.Vector3(6.4, 0, -0.7) },
      warehouse: { anchor: new THREE.Vector3(-7.15, 1.1, -1.55), radius: 2.1, label: true, ring: new THREE.Vector3(-6.5, 0, 0.75) },
      dorm: { anchor: new THREE.Vector3(-7.25, 1.2, 3.75), radius: 2.0, label: true, ring: new THREE.Vector3(-6.7, 0, 5.55) },
      npc: { anchor: null, radius: 0.45 },
      clouds: { anchor: new THREE.Vector3(3.8, 9.7, -4.0), radius: 1.5 },
      mist: { anchor: new THREE.Vector3(9.0, 1.0, 3.0), radius: 1.6 },
    };

    this.buildRing();
    this.buildLabels();
    this.scan();
    this.bind();
  }

  buildRing() {
    const g = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#e4c384'), transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false, toneMapped: false,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.72, 0.8, 72), mat);
    ring.rotation.x = -Math.PI / 2;
    g.add(ring);
    const innerMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#f3dfb3'), transparent: true, opacity: 0.45,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false, toneMapped: false,
    });
    const inner = new THREE.Mesh(new THREE.RingGeometry(0.54, 0.56, 64), innerMat);
    inner.rotation.x = -Math.PI / 2;
    g.add(inner);
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 2.6),
      new THREE.MeshBasicMaterial({
        map: makeGlowTexture(), color: '#d6b477', transparent: true, opacity: 0.2,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
      })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -0.005;
    g.add(glow);
    g.visible = false;
    g.renderOrder = 15;
    this.ringGroup = g;
    this.ringMat = mat;
    this.innerMat = innerMat;
    this.ringGlow = glow;
    this.scene.add(g);
  }

  buildLabels() {
    const container = this.ui.el.labels;
    for (const [key, cfg] of Object.entries(this.config)) {
      if (!cfg.label) continue;
      const [text, sub] = LABEL_SHORT[key] || [INTERACTIONS[key]?.name || key, ''];
      const el = document.createElement('div');
      el.className = 'world-label';
      el.innerHTML = `<span class="wl-name">${text}</span><span class="wl-sub">${sub}</span>`;
      container.appendChild(el);
      this.labelEls.push({ key, el });
    }
  }

  scan() {
    this.pickables = [];
    this.scene.traverse((o) => {
      if (!o.isMesh) return;
      const key = o.userData.interactiveKey;
      if (!key) return;
      if (!this.config[key]) return;
      this.pickables.push(o);
    });
  }

  bind() {
    this.dom.addEventListener('pointermove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.pointerInside = true;
      if (!this.enabled) return;
      const now = performance.now();
      if (now - this.lastRaycast < 65) return;
      this.lastRaycast = now;
      this.updateHover(e.clientX, e.clientY);
    }, { passive: true });

    this.dom.addEventListener('pointerleave', () => {
      this.pointerInside = false;
      this.clearHover();
    });

    this.dom.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return;
      if (e.button !== 0) return;
      this.down = { x: e.clientX, y: e.clientY, t: performance.now() };
    });

    window.addEventListener('pointerup', (e) => {
      if (!this.enabled) return;
      if (!this.down) return;
      const dx = e.clientX - this.down.x;
      const dy = e.clientY - this.down.y;
      const dt = performance.now() - this.down.t;
      const valid = dx * dx + dy * dy < 36 && dt < 550;
      if (!valid) {
        this.down = null;
        return;
      }
      if (e.target !== this.dom && !this.dom.contains(e.target)) {
        this.down = null;
        return;
      }
      this.down = null;
      const hit = this.raycastAt(e.clientX, e.clientY);
      if (hit) {
        this.audio.click();
        const npcId = hit.object.userData.npcId;
        this.onSelect(hit.object.userData.interactiveKey, {
          npcId,
          point: hit.point.clone(),
          object: hit.object,
        });
      }
    });

    this.dom.addEventListener('pointerleave', () => { this.down = null; });
  }

  raycastAt(clientX, clientY) {
    const rect = this.dom.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.pickables, false);
    let glassHit = null;
    for (const h of hits) {
      const obj = h.object;
      if (!obj.visible) continue;
      let p = obj;
      let hidden = false;
      while (p) {
        if (p.visible === false) { hidden = true; break; }
        p = p.parent;
      }
      if (hidden) continue;
      if (obj.userData.glass) {
        if (!glassHit) glassHit = h;
        continue;
      }
      return h;
    }
    return glassHit;
  }

  resolveInfo(key, npcId) {
    if (key === 'npc') {
      const emp = EMPLOYEES.find((e) => e.id === npcId) || EMPLOYEES[0];
      return {
        name: `${emp.name} · ${emp.role}`,
        kicker: `NPC · ${emp.dept}`,
        hint: HINTS.npc,
      };
    }
    const meta = INTERACTIONS[key];
    return {
      name: meta?.name || key,
      kicker: meta?.category || '探索',
      hint: HINTS[key] || '点击查看档案',
    };
  }

  updateHover(clientX, clientY) {
    const hit = this.raycastAt(clientX, clientY);
    const key = hit?.object.userData.interactiveKey || null;
    const npcId = hit?.object.userData.npcId || null;
    const same = this.hover && this.hover.key === key && this.hover.npcId === npcId;
    if (!hit) {
      this.clearHover();
      return;
    }
    if (!same) {
      this.hover = { key, npcId, point: hit.point.clone(), object: hit.object };
      const info = this.resolveInfo(key, npcId);
      this.ui.showTooltip({ ...info, x: clientX, y: clientY });
      this.audio.hover();
      this.onHoverChange(key, this.hover);
      this.dom.style.cursor = 'pointer';
      for (const l of this.labelEls) l.el.classList.toggle('is-hot', l.key === key);
    } else {
      this.hover.point.copy(hit.point);
      this.ui.moveTooltip(clientX, clientY);
    }
    this.placeRing(key, hit);
  }

  placeRing(key, hit) {
    const cfg = this.config[key] || { radius: 0.6 };
    const anchor = this._anchor;
    let groundY = 0;
    if (key === 'npc' && hit?.object?.userData?.npcId) {
      const npc = this.npcs?.[hit.object.userData.npcId];
      if (npc) anchor.copy(npc.position);
      else anchor.copy(hit.point);
      groundY = anchor.y + 0.06;
    } else if (key === 'streetLamp') {
      const lamp = hit.object;
      lamp.getWorldPosition(anchor);
      groundY = heightAt(anchor.x, anchor.z) + 0.07;
    } else if (key === 'traffic') {
      anchor.copy(hit.point);
      groundY = heightAt(anchor.x, anchor.z) + 0.09;
    } else {
      if (cfg.ring) anchor.copy(cfg.ring);
      else if (cfg.anchor) anchor.copy(cfg.anchor);
      else anchor.copy(hit.point);
      if (key === 'lake') groundY = 0.46;
      else if (key === 'waterfall') groundY = 0.46;
      else if (key === 'clouds') groundY = cfg.anchor ? cfg.anchor.y : 9.4;
      else if (key === 'mist') groundY = cfg.anchor ? cfg.anchor.y : 1.0;
      else if (key === 'liftCar') groundY = 1.28;
      else groundY = heightAt(anchor.x, anchor.z) + 0.07;
    }
    const radius = cfg.radius || 0.6;
    this.ringGroup.position.set(anchor.x, groundY, anchor.z);
    this.ringGroup.scale.setScalar(radius);
    this.ringGroup.visible = true;
    this.hoverPulse = 0;
  }

  clearHover() {
    if (this.hover) {
      this.onHoverChange(null, null);
    }
    this.hover = null;
    this.ringGroup.visible = false;
    this.ui.hideTooltip();
    this.dom.style.cursor = 'grab';
    for (const l of this.labelEls) l.el.classList.remove('is-hot');
  }

  setEnabled(v) {
    this.enabled = v;
    this.down = null;
    if (!v) this.clearHover();
    this.dom.style.cursor = v ? 'grab' : 'default';
  }

  update(dt, time) {
    if (this.enabled && this.pointerInside) {
      const now = performance.now();
      if (now - this.lastRaycast > 180) {
        this.lastRaycast = now;
        this.updateHover(this.mouseX, this.mouseY);
      }
    }
    if (this.ringGroup.visible) {
      this.hoverPulse += dt;
      const s = 1 + Math.sin(this.hoverPulse * 4.2) * 0.035;
      this.ringGroup.scale.setScalar((this.config[this.hover?.key]?.radius || 0.6) * s);
      this.ringMat.opacity = 0.6 + Math.sin(this.hoverPulse * 3.4) * 0.22;
      this.innerMat.opacity = 0.32 + Math.sin(this.hoverPulse * 3.4 + 1.2) * 0.12;
      this.ringGroup.rotation.y = time * 0.12;
    }

    if (!this.ui.isPanelOpen()) {
      for (const l of this.labelEls) {
        const cfg = this.config[l.key];
        if (!cfg?.label) continue;
        let anchor = cfg.anchor;
        if (l.key === 'garage') anchor = new THREE.Vector3(-0.1, 7.55, 0.9);
        if (l.key === 'ticketBox') anchor = new THREE.Vector3(3.12, 2.1, 4.42);
        if (l.key === 'approvalTerminal') anchor = new THREE.Vector3(-3.62, 2.15, 4.42);
        if (!anchor) continue;
        toScreen(anchor, this.camera, window.innerWidth, window.innerHeight, this._screen);
        const dist = this.camera.position.distanceTo(anchor);
        const show = this._screen.visible && dist < 46 && this._screen.x > 40 && this._screen.x < window.innerWidth - 40;
        if (show) {
          l.el.style.left = `${this._screen.x}px`;
          l.el.style.top = `${this._screen.y - 6}px`;
          l.el.classList.add('is-visible');
          l.el.style.opacity = dist > 38 ? '0.4' : '0.82';
        } else {
          l.el.classList.remove('is-visible');
        }
      }
    } else {
      for (const l of this.labelEls) l.el.classList.remove('is-visible');
    }
  }
}
