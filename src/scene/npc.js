import * as THREE from 'three';

/* ============================================================
   A* navigation + staff NPC choreography
   ============================================================ */

const COLS = 32;
const ROWS = 22;
const CELL_X = 2;
const CELL_Z = 1.35;
const ORIGIN_X = -32;
const ORIGIN_Z = -6;
const WALK_Z_MIN = 3.85;
const WALK_Z_MAX = 10.25;

class MinHeap {
  constructor() { this.items = []; }
  get size() { return this.items.length; }
  push(node) {
    const a = this.items;
    a.push(node);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p].f <= a[i].f) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.items;
    if (!a.length) return null;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = i * 2 + 1, r = l + 1;
        let s = i;
        if (l < a.length && a[l].f < a[s].f) s = l;
        if (r < a.length && a[r].f < a[s].f) s = r;
        if (s === i) break;
        [a[s], a[i]] = [a[i], a[s]];
        i = s;
      }
    }
    return top;
  }
}

class NavGrid {
  constructor(nav) {
    this.blocked = new Uint8Array(COLS * ROWS);
    this.build(nav);
  }

  idx(c, r) { return r * COLS + c; }
  inBounds(c, r) { return c >= 0 && c < COLS && r >= 0 && r < ROWS; }
  center(c, r) {
    return { x: ORIGIN_X + (c + 0.5) * CELL_X, z: ORIGIN_Z + (r + 0.5) * CELL_Z };
  }
  cellOf(x, z) {
    return {
      c: THREE.MathUtils.clamp(Math.floor((x - ORIGIN_X) / CELL_X), 0, COLS - 1),
      r: THREE.MathUtils.clamp(Math.floor((z - ORIGIN_Z) / CELL_Z), 0, ROWS - 1),
    };
  }

  build(nav) {
    const treeXs = nav.treeXs || [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const { x, z } = this.center(c, r);
        let blocked = z < WALK_Z_MIN || z > WALK_Z_MAX;
        if (!blocked) {
          for (const [x1, x2, z1, z2] of nav.blockedRects) {
            if (x > x1 - 0.35 && x < x2 + 0.35 && z > z1 - 0.35 && z < z2 + 0.35) { blocked = true; break; }
          }
        }
        if (!blocked) {
          for (const tx of treeXs) {
            if (Math.hypot(x - tx, z - 7.3) < 1.15) { blocked = true; break; }
          }
        }
        if (!blocked) {
          for (const lx of [-20, -6.5, 4.8, 14.2, 25]) {
            if (Math.hypot(x - lx, z - 9.62) < 0.55) { blocked = true; break; }
          }
        }
        this.blocked[this.idx(c, r)] = blocked ? 1 : 0;
      }
    }
  }

  isBlocked(c, r, extra = null) {
    if (!this.inBounds(c, r) || this.blocked[this.idx(c, r)]) return true;
    if (extra && extra.has(this.idx(c, r))) return true;
    return false;
  }

  nearestFree(c, r, extra = null) {
    if (!this.isBlocked(c, r, extra)) return { c, r };
    for (let radius = 1; radius < 12; radius++) {
      for (let dr = -radius; dr <= radius; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
          if (Math.max(Math.abs(dc), Math.abs(dr)) !== radius) continue;
          const nc = c + dc, nr = r + dr;
          if (!this.isBlocked(nc, nr, extra)) return { c: nc, r: nr };
        }
      }
    }
    return { c, r };
  }

  findPath(sx, sz, gx, gz, extra = null) {
    const start = this.nearestFree(this.cellOf(sx, sz).c, this.cellOf(sx, sz).r, extra);
    const goal = this.nearestFree(this.cellOf(gx, gz).c, this.cellOf(gx, gz).r, extra);
    const startI = this.idx(start.c, start.r);
    const goalI = this.idx(goal.c, goal.r);
    if (startI === goalI) return [this.center(start.c, start.r)];

    const gScore = new Float32Array(COLS * ROWS).fill(Infinity);
    const fScore = new Float32Array(COLS * ROWS).fill(Infinity);
    const parent = new Int32Array(COLS * ROWS).fill(-1);
    const closed = new Uint8Array(COLS * ROWS);
    const open = new MinHeap();
    const goalCenter = this.center(goal.c, goal.r);
    const h = (c, r) => {
      const p = this.center(c, r);
      return Math.hypot(p.x - goalCenter.x, p.z - goalCenter.z);
    };
    gScore[startI] = 0;
    fScore[startI] = h(start.c, start.r);
    open.push({ i: startI, c: start.c, r: start.r, f: fScore[startI] });

    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1],
    ];

    while (open.size) {
      const node = open.pop();
      if (closed[node.i]) continue;
      closed[node.i] = 1;
      if (node.i === goalI) break;
      for (const [dc, dr] of dirs) {
        const nc = node.c + dc;
        const nr = node.r + dr;
        if (!this.inBounds(nc, nr) || this.isBlocked(nc, nr, extra)) continue;
        if (dc !== 0 && dr !== 0) {
          if (this.isBlocked(node.c + dc, node.r, extra) || this.isBlocked(node.c, node.r + dr, extra)) continue;
        }
        const ni = this.idx(nc, nr);
        if (closed[ni]) continue;
        const step = (dc !== 0 && dr !== 0)
          ? Math.hypot(CELL_X, CELL_Z)
          : (dc !== 0 ? CELL_X : CELL_Z);
        const tentative = gScore[node.i] + step;
        if (tentative < gScore[ni]) {
          gScore[ni] = tentative;
          fScore[ni] = tentative + h(nc, nr);
          parent[ni] = node.i;
          open.push({ i: ni, c: nc, r: nr, f: fScore[ni] });
        }
      }
    }

    if (parent[goalI] === -1 && goalI !== startI) return [];
    const path = [];
    let cur = goalI;
    while (cur !== -1) {
      const c = cur % COLS;
      const r = (cur / COLS) | 0;
      path.push(this.center(c, r));
      if (cur === startI) break;
      cur = parent[cur];
    }
    path.reverse();
    return this.smooth(path, extra);
  }

  lineOfSight(a, b, extra = null) {
    const dist = Math.hypot(b.x - a.x, b.z - a.z);
    const steps = Math.max(2, Math.ceil(dist / 0.3));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = a.x + (b.x - a.x) * t;
      const z = a.z + (b.z - a.z) * t;
      if (z < WALK_Z_MIN || z > WALK_Z_MAX) return false;
      const { c, r } = this.cellOf(x, z);
      if (this.isBlocked(c, r, extra)) return false;
    }
    return true;
  }

  smooth(points, extra = null) {
    if (points.length <= 2) return points;
    const out = [points[0]];
    let i = 0;
    while (i < points.length - 1) {
      let j = points.length - 1;
      while (j > i + 1 && !this.lineOfSight(points[i], points[j], extra)) j--;
      out.push(points[j]);
      i = j;
    }
    return out;
  }

  isWalkableWorld(x, z) {
    if (z < WALK_Z_MIN || z > WALK_Z_MAX) return false;
    const { c, r } = this.cellOf(x, z);
    return !this.blocked[this.idx(c, r)];
  }
}

/* ---------- NPC factory ---------- */

function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.24)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makePerson(cfg) {
  const group = new THREE.Group();
  const upper = new THREE.Group();
  group.add(upper);

  const coatMat = new THREE.MeshStandardMaterial({ color: cfg.coat, roughness: 0.78, metalness: 0.06 });
  const accentMat = new THREE.MeshStandardMaterial({ color: cfg.accent, roughness: 0.72, metalness: 0.08 });
  const skinMat = new THREE.MeshStandardMaterial({ color: cfg.skin, roughness: 0.75 });
  const hairMat = new THREE.MeshStandardMaterial({ color: cfg.hair, roughness: 0.9 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: cfg.pants, roughness: 0.82 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.7 });

  const legL = new THREE.Group();
  const legR = new THREE.Group();
  legL.position.set(-0.11, 0.88, 0);
  legR.position.set(0.11, 0.88, 0);
  group.add(legL, legR);
  [legL, legR].forEach((leg) => {
    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.38, 3, 8), pantsMat);
    thigh.position.y = -0.25;
    thigh.castShadow = true;
    leg.add(thigh);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.09, 0.28), shoeMat);
    shoe.position.set(0, -0.52, 0.06);
    shoe.castShadow = true;
    leg.add(shoe);
  });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.185, 0.46, 4, 10), coatMat);
  torso.position.y = 1.22;
  torso.castShadow = true;
  upper.add(torso);

  const apron = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.42, 0.05), accentMat);
  apron.position.set(0, 1.12, 0.185);
  upper.add(apron);
  const chestTag = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.05, 0.02), new THREE.MeshBasicMaterial({ color: 0xd8b878, toneMapped: false }));
  chestTag.position.set(0, 1.36, 0.2);
  upper.add(chestTag);

  const armL = new THREE.Group();
  const armR = new THREE.Group();
  armL.position.set(-0.265, 1.4, 0);
  armR.position.set(0.265, 1.4, 0);
  upper.add(armL, armR);
  [armL, armR].forEach((arm) => {
    const limb = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.34, 3, 8), coatMat);
    limb.position.y = -0.22;
    limb.castShadow = true;
    arm.add(limb);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 6), skinMat);
    hand.position.y = -0.44;
    arm.add(hand);
  });

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.08, 8), skinMat);
  neck.position.y = 1.52;
  upper.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.155, 14, 12), skinMat);
  head.position.y = 1.67;
  head.castShadow = true;
  upper.add(head);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62), hairMat);
  hair.position.y = 1.7;
  upper.add(hair);

  if (cfg.cap) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.175, 0.1, 14), accentMat);
    cap.position.y = 1.79;
    upper.add(cap);
    const brim = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.025, 0.16), accentMat);
    brim.position.set(0, 1.75, 0.18);
    upper.add(brim);
  }

  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, opacity: 0.7, depthWrite: false });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  group.add(shadow);

  return { group, upper, legL, legR, armL, armR, torso, head };
}

/* ---------- main NPC system ---------- */

export class NPCSystem {
  constructor(scene, world, camera, options = {}) {
    this.scene = scene;
    this.world = world;
    this.camera = camera;
    this.nav = new NavGrid(world.nav);
    this.onTaskUpdate = options.onTaskUpdate || (() => {});
    this.onStepComplete = options.onStepComplete || (() => {});
    this.npcs = [];
    this.entries = [];
    this.questSeq = 7;
    this.chain = { step: 0, done: [false, false, false], active: false, cool: 0 };
    this.build();
    this.questState = { step: 0, done: [false, false, false], statuses: ['active', 'pending', 'pending'], questNo: this.questNo() };
    this.startChainDelay = 1.6;
  }

  questNo() { return `GW-1122-${String(this.questSeq).padStart(2, '0')}`; }

  build() {
    const defs = [
      {
        id: 'npc-lin', name: '林晓', role: '报销专员', code: 'NPC-01',
        coat: 0x3b3a3a, accent: 0xb08a4e, skin: 0xd3ad90, hair: 0x171412, pants: 0x1f2329,
        start: [1.4, 8.9], speed: 1.45, cap: false,
      },
      {
        id: 'npc-zheng', name: '郑野', role: '机修主管', code: 'NPC-02',
        coat: 0x263848, accent: 0x8a6a35, skin: 0xb98867, hair: 0x141312, pants: 0x1d2228,
        start: [-3.4, 5.6], speed: 1.2, cap: true,
      },
      {
        id: 'npc-su', name: '苏禾', role: '财务复核', code: 'NPC-03',
        coat: 0x2c4a48, accent: 0xc5a76a, skin: 0xd9b69b, hair: 0x1a1512, pants: 0x23272d,
        start: [-16.6, 6.4], speed: 1.15, cap: false,
      },
      {
        id: 'npc-kai', name: '阿凯', role: '仓储配送', code: 'NPC-04',
        coat: 0x4b3a2c, accent: 0xa9874b, skin: 0xbc8b6a, hair: 0x141210, pants: 0x20242a,
        start: [12.4, 9.5], speed: 1.3, cap: true,
      },
    ];

    const meta = this.world.npcMeta;
    defs.forEach((def) => {
      const model = makePerson(def);
      model.group.position.set(def.start[0], 0.15, def.start[1]);
      model.group.rotation.y = Math.PI * 0.15;
      this.scene.add(model.group);

      const label = this.world.makeLabelSprite(def.code, def.name, def.role.toUpperCase());
      label.scale.set(3.0, 0.75, 1);
      label.position.set(def.start[0], 2.5, def.start[1]);
      this.scene.add(label);
      this.world.labels.push(label);

      const entry = this.world.registerEntry({
        id: def.id, ...meta[def.id],
        objects: [model.group], focus: [def.start[0], 1.2, def.start[1]], radius: 0.85,
      });
      entry.getFocus = () => new THREE.Vector3(np.group.position.x, 1.35, np.group.position.z);

      const np = {
        ...def, ...model, label,
        pos: new THREE.Vector3(def.start[0], 0.15, def.start[1]),
        path: [], pathIndex: 0, state: 'idle', waitTimer: 0, waitCb: null,
        phase: Math.random() * 6.28, angle: Math.PI * 0.15,
        stuck: 0, lastX: def.start[0], lastZ: def.start[1],
        scheduleIndex: 0, onArrive: null, entry,
      };
      this.npcs.push(np);
      this.entries.push(entry);
    });

    this.lin = this.npcs[0];
    this.zheng = this.npcs[1];
    this.su = this.npcs[2];
    this.kai = this.npcs[3];

    this.schedules = {
      'npc-zheng': [[-3.6, 4.7], [14.8, 4.3], [-1.8, 4.7], [9.0, 9.4]],
      'npc-su': [[-18.4, 4.6], [5.0, 8.1], [-2.2, 8.7]],
      'npc-kai': [[12.8, 4.3], [10.4, 9.4], [25.6, 4.5], [20.2, 8.7]],
    };
    this.npcs.slice(1).forEach((np) => this.nextSchedule(np, true));
  }

  nextSchedule(np, immediate = false) {
    const list = this.schedules[np.id];
    const target = list[np.scheduleIndex % list.length];
    np.scheduleIndex++;
    this.goTo(np, target[0], target[1], () => {
      this.wait(np, 1.4 + Math.random() * 2.2, () => this.nextSchedule(np));
    }, immediate);
  }

  goTo(np, x, z, onArrive = null, immediate = false) {
    const dynamic = this.dynamicBlocked(np);
    const path = this.nav.findPath(np.pos.x, np.pos.z, x, z, dynamic);
    np.path = path;
    np.pathIndex = 0;
    np.onArrive = onArrive;
    np.stuck = 0;
    if (!path.length) {
      np.state = 'work';
      np.waitTimer = 0.8;
      np.waitCb = onArrive;
      return;
    }
    np.state = 'walk';
  }

  wait(np, seconds, cb) {
    np.state = 'work';
    np.waitTimer = seconds;
    np.waitCb = cb;
  }

  dynamicBlocked(self) {
    const extra = new Set();
    for (const other of this.npcs) {
      if (other === self) continue;
      const { c, r } = this.nav.cellOf(other.pos.x, other.pos.z);
      extra.add(this.nav.idx(c, r));
    }
    return extra;
  }

  startChain() {
    this.questSeq++;
    this.chain.step = 0;
    this.chain.done = [false, false, false];
    this.chain.active = true;
    this.chain.cool = 0;
    this.emitTask();
    this.startStep(0);
  }

  startStep(index) {
    this.chain.step = index;
    this.emitTask();
    const targets = [[3.1, 7.7], [5.0, 8.1], [-18.4, 4.6]];
    const waits = [2.0, 2.2, 2.8];
    this.lin.state = 'idle';
    this.wait(this.lin, 0.35, () => {
      this.goTo(this.lin, targets[index][0], targets[index][1], () => {
        this.wait(this.lin, waits[index], () => {
          this.chain.done[index] = true;
          this.onStepComplete(index, this.questState.questNo);
          this.emitTask();
          if (index < 2) {
            this.startStep(index + 1);
          } else {
            this.chain.active = false;
            this.chain.cool = 11;
            this.emitTask();
          }
        });
      });
    });
  }

  emitTask() {
    const statuses = this.chain.done.map((done, i) => (
      done ? 'done' : (i === this.chain.step && this.chain.active ? 'active' : 'pending')
    ));
    this.questState = {
      step: this.chain.step,
      done: [...this.chain.done],
      statuses,
      questNo: this.questNo(),
      active: this.chain.active,
    };
    this.onTaskUpdate(this.questState);
  }

  triggerNewClaim() {
    this.startChain();
  }

  update(dt, elapsed) {
    if (this.startChainDelay > 0) {
      this.startChainDelay -= dt;
      if (this.startChainDelay <= 0) this.startChain();
    }
    if (!this.chain.active) {
      this.chain.cool -= dt;
      if (this.chain.cool <= 0 && this.startChainDelay <= 0) this.startChain();
    }

    // step 3 visual: Su walks to finance to receive the package
    if (this.chain.active && this.chain.step === 2 && !this.su.chainAssigned) {
      this.su.chainAssigned = true;
      this.goTo(this.su, -21.2, 4.6, () => this.wait(this.su, 4.2, () => {
        this.su.chainAssigned = false;
        this.nextSchedule(this.su);
      }));
    }
    if (!this.chain.active) this.su.chainAssigned = false;

    for (const np of this.npcs) this.updateNPC(np, dt, elapsed);
  }

  updateNPC(np, dt, elapsed) {
    let moving = false;

    // safety: if a companion pushes an NPC into a blocked cell, recover to the nearest free cell
    const inBlocked = !this.nav.isWalkableWorld(np.pos.x, np.pos.z);
    np.blockedTime = (np.blockedTime || 0) + (inBlocked ? dt : -dt * 2);
    if (np.blockedTime > 1.2) {
      const { c, r } = this.nav.nearestFree(
        this.nav.cellOf(np.pos.x, np.pos.z).c,
        this.nav.cellOf(np.pos.x, np.pos.z).r
      );
      const free = this.nav.center(c, r);
      np.pos.set(free.x, 0.15, free.z);
      np.blockedTime = 0;
      if (np.state === 'walk') {
        np.path = this.nav.findPath(np.pos.x, np.pos.z, np.path[np.path.length - 1]?.x ?? np.pos.x, np.path[np.path.length - 1]?.z ?? np.pos.z);
        np.pathIndex = 0;
      }
      np.stuck = 0;
    }

    if (np.state === 'walk' && np.path.length) {
      const wp = np.path[np.pathIndex];
      const dx = wp.x - np.pos.x;
      const dz = wp.z - np.pos.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.22) {
        np.pathIndex++;
        if (np.pathIndex >= np.path.length) {
          np.state = 'idle';
          np.path = [];
          const cb = np.onArrive;
          np.onArrive = null;
          if (cb) cb();
        }
      } else {
        moving = true;
        let vx = dx / dist;
        let vz = dz / dist;
        // separation from companions
        let sx = 0, sz = 0;
        for (const other of this.npcs) {
          if (other === np) continue;
          const ox = np.pos.x - other.pos.x;
          const oz = np.pos.z - other.pos.z;
          const d = Math.hypot(ox, oz);
          if (d > 0.001 && d < 1.15) {
            const f = (1.15 - d) / 1.15;
            sx += (ox / d) * f * 0.9;
            sz += (oz / d) * f * 0.9;
          }
        }
        vx += sx;
        vz += sz;
        const vlen = Math.hypot(vx, vz) || 1;
        vx /= vlen; vz /= vlen;
        const step = np.speed * dt;
        const nx = np.pos.x + vx * step;
        const nz = np.pos.z + vz * step;
        if (this.nav.isWalkableWorld(nx, nz) && this.nav.isWalkableWorld(nx + 0.05, nz + 0.05)) {
          np.pos.x = nx;
          np.pos.z = nz;
        } else {
          np.stuck += dt * 1.6;
        }
        const targetAngle = Math.atan2(vx, vz);
        np.angle = this.lerpAngle(np.angle, targetAngle, 1 - Math.exp(-dt * 9));
        np.group.rotation.y = np.angle;
        np.phase += dt * (5.0 + np.speed * 2.2);
        np.legL.rotation.x = Math.sin(np.phase) * 0.52;
        np.legR.rotation.x = -Math.sin(np.phase) * 0.52;
        np.armL.rotation.x = -Math.sin(np.phase) * 0.38;
        np.armR.rotation.x = Math.sin(np.phase) * 0.38;
        np.upper.position.y = Math.abs(Math.sin(np.phase)) * 0.025;
        np.head.rotation.z = Math.sin(np.phase * 0.5) * 0.02;
      }

      // obstacle / stuck detection → replan
      const moved = Math.hypot(np.pos.x - np.lastX, np.pos.z - np.lastZ);
      np.lastX = np.pos.x; np.lastZ = np.pos.z;
      if (moving && moved < 0.002) np.stuck += dt; else np.stuck = Math.max(0, np.stuck - dt * 0.4);
      if (np.stuck > 1.1 && np.path.length) {
        np.stuck = 0;
        const last = np.path[np.path.length - 1];
        const cb = np.onArrive;
        this.goTo(np, last.x, last.z, cb);
        if (!np.path.length) {
          np.state = 'idle';
          np.waitTimer = 1.0;
        }
      }
    } else if (np.state === 'work') {
      np.waitTimer -= dt;
      np.upper.position.y = Math.sin(elapsed * 1.8 + np.phase) * 0.008;
      np.armL.rotation.x = -0.12 + Math.sin(elapsed * 1.2) * 0.03;
      np.armR.rotation.x = 0.18 + Math.sin(elapsed * 1.1) * 0.03;
      np.legL.rotation.x = 0;
      np.legR.rotation.x = 0;
      if (np.waitTimer <= 0) {
        np.state = 'idle';
        const cb = np.waitCb;
        np.waitCb = null;
        if (cb) cb();
      }
    } else {
      np.upper.position.y = Math.sin(elapsed * 1.6 + np.phase) * 0.007;
      np.armL.rotation.x *= 0.96;
      np.armR.rotation.x *= 0.96;
      np.legL.rotation.x *= 0.92;
      np.legR.rotation.x *= 0.92;
      if (np.state === 'idle' && np.waitTimer > 0) {
        np.waitTimer -= dt;
      }
    }

    np.group.position.set(np.pos.x, 0.15, np.pos.z);
    np.label.position.set(np.pos.x, 2.42, np.pos.z);
    np.entry.focus.set(np.pos.x, 1.35, np.pos.z);
  }

  lerpAngle(a, b, t) {
    let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
    if (d < -Math.PI) d += Math.PI * 2;
    return a + d * t;
  }

  get entryCount() { return this.entries.length; }
}
