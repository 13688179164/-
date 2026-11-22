import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/* ============================================================
   GPU-instanced traffic & sidewalk pedestrians
   ============================================================ */

const CAR_COLORS = [0x27323d, 0x3c2a28, 0x223038, 0x4a4033, 0x1c2229, 0x53302e, 0x2d3a36];

export class TrafficSystem {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.count = 12;
    this.cars = [];
    this.hoverInstance = -1;
    this.hoverFocus = new THREE.Vector3();

    this.buildCars();
    this.buildPedestrians();
    this.registerEntry();

    this.update(0.016, 0);
  }

  buildCars() {
    const n = this.count;
    const bodyGeo = new RoundedBoxGeometry(4.1, 0.58, 1.88, 3, 0.16);
    const cabinGeo = new RoundedBoxGeometry(2.1, 0.52, 1.68, 3, 0.14);
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.24, 14);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.86, roughness: 0.3, envMapIntensity: 1.3 });
    const cabinMat = new THREE.MeshPhysicalMaterial({ color: 0x0a1016, metalness: 0.6, roughness: 0.08, envMapIntensity: 2, clearcoat: 1 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0e1013, roughness: 0.9, metalness: 0.05 });

    this.bodyMesh = new THREE.InstancedMesh(bodyGeo, bodyMat, n);
    this.cabinMesh = new THREE.InstancedMesh(cabinGeo, cabinMat, n);
    this.wheelMesh = new THREE.InstancedMesh(wheelGeo, wheelMat, n * 4);
    this.bodyMesh.castShadow = false;
    this.bodyMesh.receiveShadow = false;
    this.cabinMesh.castShadow = false;
    this.wheelMesh.castShadow = false;
    this.bodyMesh.frustumCulled = false;
    this.cabinMesh.frustumCulled = false;
    this.wheelMesh.frustumCulled = false;

    for (let i = 0; i < n; i++) {
      const lane = i < n / 2 ? 0 : 1;
      const dir = lane === 0 ? 1 : -1;
      const car = {
        dir,
        z: lane === 0 ? 14.7 : 23.1,
        x: -46 + (i % (n / 2)) * 15 + Math.random() * 8,
        speed: 6.5 + Math.random() * 6.5,
        y: 0.0,
        color: new THREE.Color(CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]),
      };
      this.cars.push(car);
      this.bodyMesh.setColorAt(i, car.color);
    }
    this.bodyMesh.instanceColor.needsUpdate = true;
    this.scene.add(this.bodyMesh, this.cabinMesh, this.wheelMesh);

    // head / tail lights as one additive Points batch
    const lightCount = n * 4;
    const positions = new Float32Array(lightCount * 3);
    const colors = new Float32Array(lightCount * 3);
    const sizes = new Float32Array(lightCount);
    for (let i = 0; i < n; i++) {
      const head = new THREE.Color(0xfff0cf);
      const tail = new THREE.Color(0xff4d3c);
      for (let k = 0; k < 4; k++) {
        const idx = i * 4 + k;
        const c = k < 2 ? head : tail;
        colors[idx * 3] = c.r; colors[idx * 3 + 1] = c.g; colors[idx * 3 + 2] = c.b;
        sizes[idx] = k < 2 ? 0.22 : 0.16;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uScale: { value: 900 }, uOpacity: { value: 1 } },
      vertexShader: `
        attribute vec3 aColor; attribute float aSize;
        varying vec3 vColor; uniform float uScale;
        void main(){
          vColor = aColor;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(aSize * uScale / max(0.5, -mv.z), 1.0, 48.0);
        }`,
      fragmentShader: `
        varying vec3 vColor;
        uniform float uOpacity;
        void main(){
          vec2 p = gl_PointCoord - 0.5;
          float d = length(p);
          float a = smoothstep(0.5, 0.04, d);
          gl_FragColor = vec4(vColor, a * 0.9 * uOpacity);
        }`,
    });
    this.lightPoints = new THREE.Points(geo, mat);
    this.lightPoints.frustumCulled = false;
    this.scene.add(this.lightPoints);
    this.lightPositions = positions;

    this._bodyDummy = new THREE.Object3D();
    this._mat = new THREE.Matrix4();
    this._quat = new THREE.Quaternion();
    this._pos = new THREE.Vector3();
    this._scale = new THREE.Vector3(1, 1, 1);
    this._local = new THREE.Matrix4();
    this._wheelQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  }

  buildPedestrians() {
    const n = 14;
    this.pedestrians = [];
    const bodyGeo = new THREE.CapsuleGeometry(0.17, 0.55, 4, 8);
    const headGeo = new THREE.SphereGeometry(0.135, 10, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, metalness: 0.05 });
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    this.pedBody = new THREE.InstancedMesh(bodyGeo, bodyMat, n);
    this.pedHead = new THREE.InstancedMesh(headGeo, headMat, n);
    this.pedBody.frustumCulled = false;
    this.pedHead.frustumCulled = false;
    const coats = [0x3b4650, 0x4e3c34, 0x2e3a34, 0x55504a, 0x3b3244, 0x60452f, 0x2c3c48];
    const skins = [0xc9a58b, 0xa97e63, 0xd9b69b, 0x8f6752];
    for (let i = 0; i < n; i++) {
      const dir = i % 2 === 0 ? 1 : -1;
      this.pedestrians.push({
        x: -34 + Math.random() * 68,
        z: i % 2 === 0 ? 9.05 : 5.15,
        dir,
        speed: 0.35 + Math.random() * 0.55,
        phase: Math.random() * 6.28,
        color: new THREE.Color(coats[Math.floor(Math.random() * coats.length)]),
        skin: new THREE.Color(skins[Math.floor(Math.random() * skins.length)]),
      });
      this.pedBody.setColorAt(i, this.pedestrians[i].color);
      this.pedHead.setColorAt(i, this.pedestrians[i].skin);
    }
    this.pedBody.instanceColor.needsUpdate = true;
    this.pedHead.instanceColor.needsUpdate = true;
    this.scene.add(this.pedBody, this.pedHead);
  }

  registerEntry() {
    const entry = this.world.registerEntry({
      id: 'traffic',
      code: 'GW-18',
      name: '夜间车流 · TRAFFIC', en: 'NIGHT TRAFFIC / 主干道', category: '业务设施',
      tags: ['通勤里程', '差旅数据', '实时车流'],
      desc: '门前主干道的车流由 GPU InstancedMesh 驱动，双向车道循环不息。车灯掠过湿柏油形成流动的反光，通勤里程与差旅数据同步进入报销中心。',
      specs: [['在途车辆', '12 辆'], ['通勤里程', '1,284 km'], ['车道', '双向 4 车道'], ['数据同步', '实时']],
      docs: [['01', '本周通勤里程', 'TRF-2026-11-W4', '实时'], ['02', '差旅补贴清单', 'TRF-2026-11-010', '待审批']],
      amount: 0, amountNote: '本周通勤 1,284 km',
      preset: { category: '差旅与交通', entity: '仓储中心', vendor: '场景通勤数据', cost: 'GW-DEPOT-03 · 仓储物流', note: '夜间班次通勤与配件配送里程补贴，按场景车流数据自动核算。' },
      objects: [this.bodyMesh, this.cabinMesh],
      focus: [0, 1, 19], radius: 1.2, dynamicFocus: true,
    });
    entry.onHoverInstance = (id) => { this.hoverInstance = id; };
    entry.getFocus = () => {
      const car = this.cars[this.hoverInstance];
      if (car) this.hoverFocus.set(car.x, car.y + 1.1, car.z);
      else this.hoverFocus.set(0, 1.1, 19);
      return this.hoverFocus;
    };
    this.entry = entry;
  }

  setViewScale(scale) {
    this.lightPoints.material.uniforms.uScale.value = scale;
  }

  update(dt, elapsed) {
    const dummy = this._bodyDummy;
    const m = this._mat;
    const q = this._quat;
    const p = this._pos;
    const s = this._scale;
    const local = this._local;
    for (let i = 0; i < this.cars.length; i++) {
      const car = this.cars[i];
      car.x += car.dir * car.speed * dt;
      if (car.x > 47) car.x = -47;
      if (car.x < -47) car.x = 47;
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), car.dir > 0 ? 0 : Math.PI);
      p.set(car.x, 0.0, car.z);
      m.compose(p, q, s);

      local.makeTranslation(0, 0.62, 0);
      this.bodyMesh.setMatrixAt(i, m.clone().multiply(local));

      local.makeTranslation(-0.15, 1.13, 0);
      this.cabinMesh.setMatrixAt(i, m.clone().multiply(local));

      const wx = [-1.32, 1.32];
      const wz = [-0.82, 0.82];
      let wi = 0;
      for (const ox of wx) {
        for (const oz of wz) {
          local.compose(new THREE.Vector3(ox, 0.32, oz), this._wheelQuat, new THREE.Vector3(1, 1, 1));
          this.wheelMesh.setMatrixAt(i * 4 + wi, m.clone().multiply(local));
          wi++;
        }
      }

      const lp = this.lightPositions;
      const front = 2.07, back = -2.03;
      const dir = car.dir;
      const hx = car.x + front * dir;
      const tx = car.x + back * dir;
      const y = 0.66;
      const z1 = car.z - 0.62, z2 = car.z + 0.62;
      lp[i * 12] = hx; lp[i * 12 + 1] = y; lp[i * 12 + 2] = z1;
      lp[i * 12 + 3] = hx; lp[i * 12 + 4] = y; lp[i * 12 + 5] = z2;
      lp[i * 12 + 6] = tx; lp[i * 12 + 7] = y; lp[i * 12 + 8] = z1;
      lp[i * 12 + 9] = tx; lp[i * 12 + 10] = y; lp[i * 12 + 11] = z2;

      if (i === this.hoverInstance) this.hoverFocus.set(car.x, 1.1, car.z);
    }
    this.bodyMesh.instanceMatrix.needsUpdate = true;
    this.cabinMesh.instanceMatrix.needsUpdate = true;
    this.wheelMesh.instanceMatrix.needsUpdate = true;
    this.lightPoints.geometry.attributes.position.needsUpdate = true;

    // pedestrians
    const pedDummy = dummy;
    for (let i = 0; i < this.pedestrians.length; i++) {
      const pd = this.pedestrians[i];
      pd.x += pd.dir * pd.speed * dt;
      if (pd.x > 34) { pd.x = -34; pd.z = pd.z === 9.05 ? 9.25 : 5.15; }
      if (pd.x < -34) { pd.x = 34; pd.z = pd.z === 9.05 ? 9.25 : 5.15; }
      const bob = Math.sin(elapsed * 4.2 + pd.phase) * 0.025;
      pedDummy.position.set(pd.x, 0.85 + bob, pd.z);
      pedDummy.rotation.set(0, 0, 0);
      pedDummy.updateMatrix();
      this.pedBody.setMatrixAt(i, pedDummy.matrix);
      pedDummy.position.set(pd.x, 1.5 + bob, pd.z);
      pedDummy.updateMatrix();
      this.pedHead.setMatrixAt(i, pedDummy.matrix);
    }
    this.pedBody.instanceMatrix.needsUpdate = true;
    this.pedHead.instanceMatrix.needsUpdate = true;
  }
}
