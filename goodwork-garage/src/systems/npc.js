/**
 * NPC 系统：32×22 A* 寻路 / 视线平滑 / 分离 / 肢体动画
 */
import * as THREE from 'three';
import { mulberry32, clamp } from '../core/utils.js';
import { EMPLOYEES } from '../core/config.js';
import { WORLD } from '../core/config.js';
import { heightAt, isBlockedForWalk } from '../world/terrain.js';

/* ---------------- 小顶堆 ---------------- */

class MinHeap {
  constructor() {
    this.items = [];
    this.priorities = [];
  }
  push(item, priority) {
    this.items.push(item);
    this.priorities.push(priority);
    let i = this.items.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.priorities[p] <= this.priorities[i]) break;
      this.swap(i, p);
      i = p;
    }
  }
  pop() {
    if (!this.items.length) return -1;
    const top = this.items[0];
    const lastItem = this.items.pop();
    const lastPri = this.priorities.pop();
    if (this.items.length) {
      this.items[0] = lastItem;
      this.priorities[0] = lastPri;
      let i = 0;
      const n = this.items.length;
      while (true) {
        const l = i * 2 + 1, r = l + 1;
        let smallest = i;
        if (l < n && this.priorities[l] < this.priorities[smallest]) smallest = l;
        if (r < n && this.priorities[r] < this.priorities[smallest]) smallest = r;
        if (smallest === i) break;
        this.swap(i, smallest);
        i = smallest;
      }
    }
    return top;
  }
  swap(a, b) {
    [this.items[a], this.items[b]] = [this.items[b], this.items[a]];
    [this.priorities[a], this.priorities[b]] = [this.priorities[b], this.priorities[a]];
  }
  get size() { return this.items.length; }
  clear() { this.items.length = 0; this.priorities.length = 0; }
}

/* ---------------- 导航网格 ---------------- */

class NavGrid {
  constructor({ island, props }) {
    const nav = WORLD.nav;
    this.cols = nav.cols;
    this.rows = nav.rows;
    this.minX = nav.minX;
    this.minZ = nav.minZ;
    this.cellW = (nav.maxX - nav.minX) / this.cols;
    this.cellH = (nav.maxZ - nav.minZ) / this.rows;
    this.blocked = new Uint8Array(this.cols * this.rows);
    this.obstacles = [...(island.walkObstacles || []), ...(props.obstacles || [])];
    for (let iz = 0; iz < this.rows; iz++) {
      for (let ix = 0; ix < this.cols; ix++) {
        const x = this.worldX(ix), z = this.worldZ(iz);
        let blocked = isBlockedForWalk(x, z);
        if (!blocked) {
          for (const o of this.obstacles) {
            if (Math.hypot(x - o.x, z - o.z) < o.r + 0.14) { blocked = true; break; }
          }
        }
        this.blocked[iz * this.cols + ix] = blocked ? 1 : 0;
      }
    }
    this.g = new Float32Array(this.cols * this.rows);
    this.f = new Float32Array(this.cols * this.rows);
    this.came = new Int32Array(this.cols * this.rows);
    this.closed = new Uint8Array(this.cols * this.rows);
    this.heap = new MinHeap();
  }

  worldX(ix) { return this.minX + (ix + 0.5) * this.cellW; }
  worldZ(iz) { return this.minZ + (iz + 0.5) * this.cellH; }
  cellX(x) { return clamp(Math.floor((x - this.minX) / this.cellW), 0, this.cols - 1); }
  cellZ(z) { return clamp(Math.floor((z - this.minZ) / this.cellH), 0, this.rows - 1); }
  isFree(ix, iz) {
    if (ix < 0 || iz < 0 || ix >= this.cols || iz >= this.rows) return false;
    return !this.blocked[iz * this.cols + ix];
  }
  index(ix, iz) { return iz * this.cols + ix; }

  nearestFree(ix, iz) {
    if (this.isFree(ix, iz)) return [ix, iz];
    for (let r = 1; r < 10; r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
          if (this.isFree(ix + dx, iz + dz)) return [ix + dx, iz + dz];
        }
      }
    }
    return null;
  }

  lineFreeWorld(ax, az, bx, bz) {
    const dist = Math.hypot(bx - ax, bz - az);
    const steps = Math.max(2, Math.ceil(dist / (Math.min(this.cellW, this.cellH) * 0.45)));
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const x = ax + (bx - ax) * t;
      const z = az + (bz - az) * t;
      if (!this.isFree(this.cellX(x), this.cellZ(z))) return false;
    }
    return true;
  }

  findPath(sx, sz, tx, tz) {
    let start = this.nearestFree(this.cellX(sx), this.cellZ(sz));
    let goal = this.nearestFree(this.cellX(tx), this.cellZ(tz));
    if (!start || !goal) return null;
    const [gx, gz] = goal;
    const startIdx = this.index(start[0], start[1]);
    const goalIdx = this.index(gx, gz);
    if (startIdx === goalIdx) {
      return [new THREE.Vector3(tx, heightAt(tx, tz), tz)];
    }

    this.g.fill(Infinity);
    this.f.fill(Infinity);
    this.came.fill(-1);
    this.closed.fill(0);
    this.heap.clear();

    const h = (ix, iz) => {
      const dx = Math.abs(ix - gx), dz = Math.abs(iz - gz);
      return (dx + dz) + (Math.SQRT2 - 2) * Math.min(dx, dz);
    };
    this.g[startIdx] = 0;
    this.f[startIdx] = h(start[0], start[1]);
    this.heap.push(startIdx, this.f[startIdx]);

    const dirs = [
      [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
      [1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2],
    ];
    let found = false;
    let guard = 0;
    while (this.heap.size && guard++ < 4000) {
      const cur = this.heap.pop();
      if (cur === goalIdx) { found = true; break; }
      if (this.closed[cur]) continue;
      this.closed[cur] = 1;
      const cx = cur % this.cols;
      const cz = (cur / this.cols) | 0;
      for (const [dx, dz, cost] of dirs) {
        const nx = cx + dx, nz = cz + dz;
        if (!this.isFree(nx, nz)) continue;
        if (dx !== 0 && dz !== 0) {
          if (!this.isFree(cx + dx, cz) || !this.isFree(cx, cz + dz)) continue;
        }
        const ni = this.index(nx, nz);
        if (this.closed[ni]) continue;
        const ng = this.g[cur] + cost;
        if (ng < this.g[ni]) {
          this.g[ni] = ng;
          this.f[ni] = ng + h(nx, nz);
          this.came[ni] = cur;
          this.heap.push(ni, this.f[ni]);
        }
      }
    }
    if (!found) return null;

    const cells = [];
    let node = goalIdx;
    let safety = 0;
    while (node !== -1 && safety++ < 900) {
      cells.push(node);
      if (node === startIdx) break;
      node = this.came[node];
    }
    cells.reverse();
    const raw = cells.map((idx) => new THREE.Vector3(
      this.worldX(idx % this.cols),
      heightAt(this.worldX(idx % this.cols), this.worldZ((idx / this.cols) | 0)),
      this.worldZ((idx / this.cols) | 0)
    ));
    // 视线平滑
    const smooth = [];
    let i = 0;
    if (raw.length > 1) {
      smooth.push(raw[0]);
      while (i < raw.length - 1) {
        let j = raw.length - 1;
        for (; j > i + 1; j--) {
          if (this.lineFreeWorld(raw[i].x, raw[i].z, raw[j].x, raw[j].z)) break;
        }
        smooth.push(raw[j]);
        i = j;
      }
    } else {
      smooth.push(...raw);
    }
    const last = smooth[smooth.length - 1];
    if (last) {
      last.x = tx;
      last.z = tz;
      last.y = heightAt(tx, tz);
    }
    return smooth;
  }
}

/* ---------------- NPC ---------------- */

function makeNameTag(name, role) {
  const c = document.createElement('canvas');
  c.width = 320; c.height = 96;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 320, 96);
  const g = ctx.createLinearGradient(0, 0, 320, 96);
  g.addColorStop(0, 'rgba(9,15,26,.9)');
  g.addColorStop(1, 'rgba(14,22,36,.74)');
  ctx.fillStyle = g;
  ctx.beginPath();
  const r = 10;
  ctx.roundRect(4, 4, 312, 88, r);
  ctx.fill();
  ctx.strokeStyle = 'rgba(216,180,119,.55)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#e8d4a7';
  ctx.beginPath();
  ctx.arc(30, 48, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#eef3fa';
  ctx.font = '500 30px "Noto Sans CJK SC", sans-serif';
  ctx.fillText(name, 48, 39);
  ctx.fillStyle = 'rgba(154,172,194,.8)';
  ctx.font = '400 16px "Noto Sans CJK SC", sans-serif';
  ctx.fillText(role, 48, 68);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.05, 0.315, 1);
  return sprite;
}

class NPC {
  constructor(employee, nav, scene) {
    this.employee = employee;
    this.nav = nav;
    this.id = employee.id;
    this.speed = 0.82;
    this.position = new THREE.Vector3();
    const spawn = nav.nearestFree(nav.cellX(employee.spawn[0]), nav.cellZ(employee.spawn[1])) || [16, 11];
    this.position.set(nav.worldX(spawn[0]), 0, nav.worldZ(spawn[1]));
    this.position.y = heightAt(this.position.x, this.position.z);
    this.home = new THREE.Vector3(employee.home[0], 0, employee.home[1]);
    this.group = this.build(employee);
    this.group.position.copy(this.position);
    this.group.rotation.y = Math.random() * Math.PI * 2;
    this.heading = this.group.rotation.y;
    scene.add(this.group);

    this.path = [];
    this.pathIndex = 0;
    this.target = null;
    this.onArrive = null;
    this.state = 'idle';
    this.idleTimer = 1.5 + Math.random() * 3;
    this.walkPhase = Math.random() * Math.PI * 2;
    this.stuck = 0;
    this.moving = false;
    this.anchor = new THREE.Vector3();
    this.nameTag = makeNameTag(employee.name, employee.role);
    this.nameTag.position.y = 1.52;
    this.group.add(this.nameTag);
    this.updateAnchor();

    this.group.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.userData.interactiveKey = 'npc';
        o.userData.npcId = employee.id;
      }
    });
  }

  build(e) {
    const root = new THREE.Group();
    const jacket = new THREE.MeshStandardMaterial({ color: e.jacket, roughness: 0.76, metalness: 0.05 });
    const pants = new THREE.MeshStandardMaterial({ color: e.pants, roughness: 0.82 });
    const skin = new THREE.MeshStandardMaterial({ color: '#c9926d', roughness: 0.68 });
    const hair = new THREE.MeshStandardMaterial({ color: '#221a17', roughness: 0.9 });
    const accent = new THREE.MeshStandardMaterial({ color: e.accent, roughness: 0.42, metalness: 0.55 });
    const dark = new THREE.MeshStandardMaterial({ color: '#171a20', roughness: 0.7 });

    const hips = new THREE.Group();
    hips.position.y = 0.46;
    root.add(hips);

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.42, 8), jacket);
    torso.position.y = 0.27;
    hips.add(torso);
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.14, 0.15, 8), jacket);
    chest.position.y = 0.46;
    hips.add(chest);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.012, 5, 12), accent);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 0.54;
    hips.add(collar);
    // 领带 / 拉链
    const zip = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.31, 0.012), accent);
    zip.position.set(0, 0.31, 0.153);
    hips.add(zip);
    // 工牌
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.045, 0.008), new THREE.MeshStandardMaterial({
      color: '#e9d5a8', emissive: '#7a5a22', emissiveIntensity: 0.25, roughness: 0.5,
    }));
    badge.position.set(0.07, 0.4, 0.16);
    hips.add(badge);

    const headGroup = new THREE.Group();
    headGroup.position.y = 0.62;
    hips.add(headGroup);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.05, 6), skin);
    neck.position.y = -0.03;
    headGroup.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 10), skin);
    head.position.y = 0.09;
    headGroup.add(head);
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.109, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.56), hair);
    hairCap.position.y = 0.1;
    hairCap.rotation.x = -0.12;
    headGroup.add(hairCap);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.016, 5, 4), skin);
    nose.position.set(0, 0.08, 0.105);
    headGroup.add(nose);
    for (const sx of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.011, 4, 3), dark);
      eye.position.set(sx * 0.035, 0.105, 0.093);
      headGroup.add(eye);
    }
    this.headGroup = headGroup;

    const limbs = {};
    const makeLeg = (sx) => {
      const pivot = new THREE.Group();
      pivot.position.set(sx * 0.075, 0, 0);
      hips.add(pivot);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.038, 0.42, 6), pants);
      leg.position.y = -0.21;
      pivot.add(leg);
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.16), dark);
      shoe.position.set(0, -0.43, 0.035);
      pivot.add(shoe);
      return pivot;
    };
    const makeArm = (sx) => {
      const pivot = new THREE.Group();
      pivot.position.set(sx * 0.155, 0.49, 0);
      hips.add(pivot);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, 0.32, 6), jacket);
      arm.position.y = -0.15;
      pivot.add(arm);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.038, 7, 6), skin);
      hand.position.y = -0.32;
      pivot.add(hand);
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.008, 4, 10), accent);
      cuff.rotation.x = Math.PI / 2;
      cuff.position.y = -0.28;
      pivot.add(cuff);
      pivot.rotation.z = sx * 0.05;
      return pivot;
    };
    limbs.legL = makeLeg(-1);
    limbs.legR = makeLeg(1);
    limbs.armL = makeArm(-1);
    limbs.armR = makeArm(1);
    this.limbs = limbs;

    return root;
  }

  updateAnchor() {
    this.anchor.set(this.position.x, this.position.y + 1.72, this.position.z);
  }

  walkTo(x, z, onArrive = null) {
    const path = this.nav.findPath(this.position.x, this.position.z, x, z);
    if (!path || !path.length) return false;
    this.path = path;
    this.pathIndex = 0;
    this.target = new THREE.Vector3(x, 0, z);
    this.onArrive = onArrive;
    this.state = 'walk';
    this.stuck = 0;
    return true;
  }

  wander() {
    const rnd = this.nav;
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 2.6;
      const x = this.home.x + Math.cos(angle) * radius;
      const z = this.home.z + Math.sin(angle) * radius;
      const cell = rnd.nearestFree(rnd.cellX(x), rnd.cellZ(z));
      if (cell) {
        const wx = rnd.worldX(cell[0]);
        const wz = rnd.worldZ(cell[1]);
        if (this.walkTo(wx, wz, null)) return;
      }
    }
    this.idleTimer = 1 + Math.random() * 2;
  }

  update(dt, time, others) {
    let moving = false;
    if (this.state === 'walk' && this.path.length) {
      const wp = this.path[this.pathIndex];
      if (wp) {
        const dx = wp.x - this.position.x;
        const dz = wp.z - this.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.1) {
          this.pathIndex++;
          if (this.pathIndex >= this.path.length) {
            this.state = 'idle';
            this.idleTimer = 2.2 + Math.random() * 3.8;
            this.path = [];
            this.target = null;
            const cb = this.onArrive;
            this.onArrive = null;
            if (cb) cb(this);
          }
        } else {
          let vx = (dx / dist) * this.speed;
          let vz = (dz / dist) * this.speed;
          // 同伴分离
          let sepX = 0, sepZ = 0;
          for (const o of others) {
            if (o === this) continue;
            const ox = this.position.x - o.position.x;
            const oz = this.position.z - o.position.z;
            const od = Math.hypot(ox, oz);
            if (od < 0.55 && od > 0.001) {
              const f = (0.55 - od) / 0.55;
              sepX += (ox / od) * f * 0.7;
              sepZ += (oz / od) * f * 0.7;
            }
          }
          vx += sepX;
          vz += sepZ;
          const step = Math.min(this.speed * dt, dist);
          const nx = this.position.x + vx * dt;
          const nz = this.position.z + vz * dt;
          if (this.nav.isFree(this.nav.cellX(nx), this.nav.cellZ(nz))) {
            this.position.x = nx;
            this.position.z = nz;
            this.position.y = heightAt(nx, nz);
            moving = true;
            const targetHeading = Math.atan2(dx, dz);
            let diff = targetHeading - this.heading;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            this.heading += diff * Math.min(1, dt * 7);
            this.stuck = 0;
            void step;
          } else {
            this.stuck += dt;
          }
          if (this.stuck > 0.9 && this.target) {
            this.walkTo(this.target.x, this.target.z, this.onArrive);
            this.stuck = 0;
          }
        }
      }
    }

    this.moving = moving;
    if (moving) {
      this.walkPhase += dt * 8.2;
      const s = Math.sin(this.walkPhase);
      const s2 = Math.sin(this.walkPhase + Math.PI);
      this.limbs.legL.rotation.x = s * 0.62;
      this.limbs.legR.rotation.x = s2 * 0.62;
      this.limbs.armL.rotation.x = s2 * 0.45;
      this.limbs.armR.rotation.x = s * 0.45;
      this.group.position.y = this.position.y + Math.abs(Math.sin(this.walkPhase)) * 0.018;
      this.headGroup.rotation.z = Math.sin(this.walkPhase) * 0.03;
    } else {
      this.state === 'idle' && (this.idleTimer -= dt);
      if (this.state === 'idle' && this.idleTimer <= 0) {
        if (Math.random() > 0.35) this.wander();
        else this.idleTimer = 2 + Math.random() * 3;
      }
      const k = Math.min(1, dt * 6);
      this.limbs.legL.rotation.x += (0 - this.limbs.legL.rotation.x) * k;
      this.limbs.legR.rotation.x += (0 - this.limbs.legR.rotation.x) * k;
      this.limbs.armL.rotation.x += (Math.sin(time * 1.3 + 1) * 0.035 - this.limbs.armL.rotation.x) * k;
      this.limbs.armR.rotation.x += (Math.sin(time * 1.3 + 2) * 0.035 - this.limbs.armR.rotation.x) * k;
      this.group.position.y = this.position.y + Math.sin(time * 1.6) * 0.006;
      this.headGroup.rotation.y = Math.sin(time * 0.5 + (this.employee.name.charCodeAt(0) % 6)) * 0.2;
    }

    this.group.position.x = this.position.x;
    this.group.position.z = this.position.z;
    if (!moving) this.group.position.y = this.position.y;
    this.group.rotation.y = this.heading;
    this.updateAnchor();
  }
}

/* ---------------- 总控 ---------------- */

export class NPCSystem {
  constructor(scene, island, props) {
    this.scene = scene;
    this.nav = new NavGrid({ island, props });
    this.npcs = EMPLOYEES.map((e) => new NPC(e, this.nav, scene));
    this.byId = Object.fromEntries(this.npcs.map((n) => [n.id, n]));
    this.meshes = [];
    for (const npc of this.npcs) {
      npc.group.traverse((o) => {
        if (o.isMesh && o.userData.interactiveKey === 'npc') this.meshes.push(o);
      });
    }
  }

  get(id) { return this.byId[id]; }

  sendTo(id, x, z, cb) {
    const npc = this.byId[id];
    if (!npc) return false;
    return npc.walkTo(x, z, cb);
  }

  gather() {
    return this.npcs.map((n) => ({
      id: n.id,
      name: n.employee.name,
      role: n.employee.role,
      dept: n.employee.dept,
      code: n.employee.code,
      line: n.employee.line,
      moving: n.moving,
      position: n.position.clone(),
    }));
  }

  update(dt, time) {
    for (const npc of this.npcs) npc.update(dt, time, this.npcs);
  }
}
