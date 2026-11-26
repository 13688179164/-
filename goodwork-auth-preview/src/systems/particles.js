/**
 * 粒子系统：四季天气（单批次）、环境浮尘、焊接火花
 */
import * as THREE from 'three';
import { mulberry32 } from '../core/utils.js';
import { heightAt, isOnIsland, PLAZA_Y } from '../world/terrain.js';
import { PARTICLES } from '../core/config.js';
import { makeGlowTexture } from '../core/textures.js';

const isMobile = () => window.innerWidth < 760 || /Mobi|Android/i.test(navigator.userAgent);

/* ------------------------------------------------------------------ */
/* 天气 Points 着色器                                                  */
/* ------------------------------------------------------------------ */

const weatherVert = /* glsl */`
  attribute float aSize;
  attribute float aSeed;
  attribute float aAlpha;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uOpacity;
  uniform float uDrift;
  varying float vAlpha;
  varying float vRot;
  varying float vSeed;

  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.55 + aSeed * 31.0) * uDrift;
    p.z += cos(uTime * 0.47 + aSeed * 23.0) * uDrift * 0.72;
    p.y += sin(uTime * 0.32 + aSeed * 17.0) * uDrift * 0.16;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = clamp(aSize * uPixelRatio * (102.0 / max(-mv.z, 1.0)), 1.0, 13.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = uOpacity * aAlpha;
    vRot = uTime * (0.35 + aSeed * 0.9) + aSeed * 6.2831;
    vSeed = aSeed;
  }
`;

const weatherFrag = /* glsl */`
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform int uShape; // 0 petal, 1 leaf, 2 snow
  varying float vAlpha;
  varying float vRot;
  varying float vSeed;

  mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }

  float hash(vec2 p) {
    p = fract(p * vec2(123.4, 345.6));
    p += dot(p, p + 34.5);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    uv = rot(vRot) * uv;
    float d;
    vec3 col;

    if (uShape == 0) {
      // 樱瓣：柔和椭圆 + 缺口
      vec2 p = uv * vec2(1.0, 1.55);
      d = length(p);
      float notch = length((uv - vec2(0.0, 0.17)) * vec2(2.4, 1.6));
      d = max(d, 0.33 - notch);
      col = mix(uColorA, uColorB, smoothstep(-0.22, 0.2, uv.y));
    } else if (uShape == 1) {
      // 叶片：窄长弧形，带中脉
      vec2 p = uv * vec2(1.7, 0.92);
      d = length(p);
      float vein = (1.0 - smoothstep(0.0, 0.012, abs(uv.x))) * 0.35;
      col = mix(uColorA, uColorB, smoothstep(-0.25, 0.25, uv.y));
      col += vein * 0.08;
    } else {
      // 雪花：柔和光点 + 六角微光
      float r = length(uv);
      float ang = atan(uv.y, uv.x);
      float spikes = pow(abs(cos(ang * 3.0)), 24.0) * (1.0 - smoothstep(0.1, 0.5, r));
      d = (1.0 - smoothstep(0.02, 0.34, r)) + spikes * 0.55;
      col = mix(uColorA, uColorB, clamp(r * 1.8, 0.0, 1.0));
    }

    float alpha = 0.0;
    if (uShape == 2) {
      alpha = clamp(d, 0.0, 1.0) * 0.92;
    } else {
      alpha = 1.0 - smoothstep(0.2, 0.47, d);
      alpha *= 0.92;
    }
    alpha *= vAlpha;
    if (alpha < 0.012) discard;

    float rim = smoothstep(0.24, 0.46, d) * (uShape == 2 ? 0.0 : 1.0);
    col += vec3(0.1, 0.12, 0.14) * rim;
    gl_FragColor = vec4(col, alpha);
  }
`;

function createWeatherMaterial(shape, colorA, colorB, drift, pixelRatio) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uOpacity: { value: 0 },
      uDrift: { value: drift },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uShape: { value: shape },
    },
    vertexShader: weatherVert,
    fragmentShader: weatherFrag,
  });
}

class WeatherPoints {
  constructor(scene, {
    kind, count, sizeRange, speedRange, colors, shape, drift, opacityAttr = 0.7,
  }) {
    this.kind = kind;
    this.count = count;
    this.rnd = mulberry32(kind.length * 997 + count);
    this.speedRange = speedRange;
    this.ground = new Float32Array(count);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);
    const alphas = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      this.reset(i, positions, true);
      sizes[i] = sizeRange[0] + this.rnd() * (sizeRange[1] - sizeRange[0]);
      seeds[i] = this.rnd();
      alphas[i] = opacityAttr * (0.65 + this.rnd() * 0.5);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    this.positions = positions;
    this.geo = geo;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
    this.material = createWeatherMaterial(shape, colors[0], colors[1], drift, pixelRatio);
    this.mesh = new THREE.Points(geo, this.material);
    this.mesh.name = `weather-${kind}`;
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
    this.mesh.renderOrder = 8;
    scene.add(this.mesh);
  }

  reset(i, positions, initial = false) {
    const x = (this.rnd() - 0.5) * 25.5;
    const z = (this.rnd() - 0.5) * 25.5;
    const y = initial ? 1.0 + this.rnd() * 11.2 : 10.6 + this.rnd() * 2.2;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    const overIsland = isOnIsland(x, z, 0.2);
    this.ground[i] = overIsland ? heightAt(x, z) + 0.06 : -9.0;
  }

  update(dt) {
    if (!this.mesh.visible) return;
    const pos = this.positions;
    for (let i = 0; i < this.count; i++) {
      const speed = this.speedRange[0] + (i % 23) / 23 * (this.speedRange[1] - this.speedRange[0]);
      pos[i * 3 + 1] -= speed * dt;
      if (pos[i * 3 + 1] < this.ground[i]) {
        this.reset(i, pos);
      }
    }
    this.geo.attributes.position.needsUpdate = true;
  }

  setOpacity(v) {
    this.material.uniforms.uOpacity.value = v;
    this.mesh.visible = v > 0.004;
  }

  updateTime(t) { this.material.uniforms.uTime.value = t; }
}

/* ------------------------------------------------------------------ */
/* 雨丝                                                                */
/* ------------------------------------------------------------------ */

class RainSystem {
  constructor(scene) {
    this.count = (isMobile() ? PARTICLES.weatherMobile : PARTICLES.weatherDesktop).rain;
    this.rnd = mulberry32(7719);
    this.positions = new Float32Array(this.count * 6);
    this.alphas = new Float32Array(this.count * 2);
    this.ground = new Float32Array(this.count);
    this.lengths = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) {
      this.reset(i, true);
      this.alphas[i * 2] = 0.46;
      this.alphas[i * 2 + 1] = 0.12;
      this.lengths[i] = 0.35 + this.rnd() * 0.55;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alphas, 1));
    this.geo = geo;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uOpacity: { value: 0 },
        uColor: { value: new THREE.Color('#b9dcf2') },
        uPixelRatio: { value: pixelRatio },
      },
      vertexShader: /* glsl */`
        attribute float aAlpha;
        varying float vAlpha;
        void main() {
          vAlpha = aAlpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        uniform float uOpacity;
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(uColor, vAlpha * uOpacity);
        }
      `,
    });
    this.mesh = new THREE.LineSegments(geo, this.material);
    this.mesh.name = 'weather-rain';
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
    this.mesh.renderOrder = 8;
    scene.add(this.mesh);
  }

  reset(i, initial = false) {
    const x = (this.rnd() - 0.5) * 25.5;
    const z = (this.rnd() - 0.5) * 25.5;
    const y = initial ? 0.5 + this.rnd() * 11.8 : 11.0 + this.rnd() * 1.8;
    const len = this.lengths[i] || 0.4 + this.rnd() * 0.6;
    this.lengths[i] = len;
    const arr = this.positions;
    arr[i * 6] = x;
    arr[i * 6 + 1] = y;
    arr[i * 6 + 2] = z;
    arr[i * 6 + 3] = x + 0.06;
    arr[i * 6 + 4] = y - len;
    arr[i * 6 + 5] = z + 0.02;
    const overIsland = isOnIsland(x, z, 0.1);
    this.ground[i] = overIsland ? heightAt(x, z) + 0.03 : -9.0;
  }

  update(dt, time) {
    if (!this.mesh.visible) return;
    const arr = this.positions;
    for (let i = 0; i < this.count; i++) {
      const fall = 7.5 + (i % 17) * 0.32;
      const sway = Math.sin(time * 1.2 + i) * 0.02;
      arr[i * 6 + 1] -= fall * dt;
      arr[i * 6 + 3] = arr[i * 6] + 0.06 + sway;
      arr[i * 6 + 4] = arr[i * 6 + 1] - this.lengths[i];
      arr[i * 6 + 5] = arr[i * 6 + 2] + 0.02;
      if (arr[i * 6 + 1] < this.ground[i]) this.reset(i);
    }
    this.geo.attributes.position.needsUpdate = true;
  }

  setOpacity(v) {
    this.material.uniforms.uOpacity.value = v;
    this.mesh.visible = v > 0.004;
  }
}

/* ------------------------------------------------------------------ */
/* 环境浮尘                                                            */
/* ------------------------------------------------------------------ */

class DustSystem {
  constructor(scene) {
    this.count = PARTICLES.dust;
    const rnd = mulberry32(2424);
    const positions = new Float32Array(this.count * 3);
    const sizes = new Float32Array(this.count);
    const seeds = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) {
      positions[i * 3] = (rnd() - 0.5) * 24;
      positions[i * 3 + 1] = -7 + rnd() * 17.5;
      positions[i * 3 + 2] = (rnd() - 0.5) * 24;
      sizes[i] = 0.8 + rnd() * 2.6;
      seeds[i] = rnd();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    this.geo = geo;
    this.positions = positions;
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.75) },
        uOpacity: { value: 1 },
        uColorWarm: { value: new THREE.Color('#ecd6a7') },
        uColorCool: { value: new THREE.Color('#a9c9f2') },
      },
      vertexShader: /* glsl */`
        attribute float aSize;
        attribute float aSeed;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vSeed;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          float rise = mod(p.y + uTime * (0.07 + aSeed * 0.1) + 8.0, 17.0) - 8.0;
          p.y = rise;
          p.x += sin(uTime * 0.2 + aSeed * 30.0) * 0.4;
          p.z += cos(uTime * 0.17 + aSeed * 26.0) * 0.4;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = clamp(aSize * uPixelRatio * (115.0 / max(-mv.z, 1.0)), 1.0, 9.0);
          gl_Position = projectionMatrix * mv;
          vSeed = aSeed;
          vAlpha = 0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * 1.4 + aSeed * 47.0), 2.0);
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3 uColorWarm;
        uniform vec3 uColorCool;
        uniform float uOpacity;
        varying float vSeed;
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float r = length(uv);
          float a = 1.0 - smoothstep(0.02, 0.5, r);
          a *= a;
          vec3 col = mix(uColorWarm, uColorCool, smoothstep(0.2, 0.8, vSeed));
          gl_FragColor = vec4(col, a * vAlpha * 0.55 * uOpacity);
        }
      `,
    });
    this.mesh = new THREE.Points(geo, this.material);
    this.mesh.name = 'ambient-dust';
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 9;
    scene.add(this.mesh);
  }
  update(t) { this.material.uniforms.uTime.value = t; }
}

/* ------------------------------------------------------------------ */
/* 焊接火花                                                            */
/* ------------------------------------------------------------------ */

class SparkSystem {
  constructor(scene, origin) {
    this.count = isMobile() ? PARTICLES.sparksMobile : PARTICLES.sparks;
    this.origin = origin.clone();
    this.positions = new Float32Array(this.count * 3);
    this.colors = new Float32Array(this.count * 3);
    this.vel = new Float32Array(this.count * 3);
    this.life = new Float32Array(this.count);
    this.maxLife = new Float32Array(this.count);
    this.cursor = 0;
    this.cooldown = 2.5;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geo = geo;
    const glow = makeGlowTexture();
    this.material = new THREE.PointsMaterial({
      size: 0.07,
      map: glow,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      sizeAttenuation: true,
      toneMapped: false,
    });
    this.mesh = new THREE.Points(geo, this.material);
    this.mesh.name = 'welding-sparks';
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 10;
    scene.add(this.mesh);
    for (let i = 0; i < this.count; i++) this.positions[i * 3 + 1] = -999;
  }

  spawn(count, strength = 1) {
    const rnd = Math.random;
    for (let k = 0; k < count; k++) {
      const i = this.cursor;
      this.cursor = (this.cursor + 1) % this.count;
      this.positions[i * 3] = this.origin.x + (rnd() - 0.5) * 0.12;
      this.positions[i * 3 + 1] = this.origin.y + (rnd() - 0.5) * 0.1;
      this.positions[i * 3 + 2] = this.origin.z + (rnd() - 0.5) * 0.12;
      this.vel[i * 3] = (rnd() - 0.5) * 1.8 * strength;
      this.vel[i * 3 + 1] = (0.4 + rnd() * 1.3) * strength;
      this.vel[i * 3 + 2] = (rnd() - 0.5) * 1.8 * strength;
      this.maxLife[i] = 0.35 + rnd() * 0.8;
      this.life[i] = this.maxLife[i];
      const warm = 0.55 + rnd() * 0.45;
      this.colors[i * 3] = 1.0;
      this.colors[i * 3 + 1] = 0.55 * warm + 0.25;
      this.colors[i * 3 + 2] = 0.16 * warm;
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.color.needsUpdate = true;
  }

  burst(strength = 1) { this.spawn(isMobile() ? 10 : 18, strength); }

  update(dt) {
    this.cooldown -= dt;
    if (this.cooldown <= 0) {
      this.cooldown = 4.2 + Math.random() * 4.5;
      this.spawn(isMobile() ? 6 : 12, 0.6 + Math.random() * 0.4);
    }
    let changed = false;
    for (let i = 0; i < this.count; i++) {
      if (this.life[i] <= 0) continue;
      changed = true;
      this.life[i] -= dt;
      this.vel[i * 3 + 1] -= 4.2 * dt;
      this.positions[i * 3] += this.vel[i * 3] * dt;
      this.positions[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.positions[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      const k = Math.max(0, this.life[i] / this.maxLife[i]);
      this.colors[i * 3] = k;
      this.colors[i * 3 + 1] = 0.65 * k * k;
      this.colors[i * 3 + 2] = 0.18 * k * k * k;
      if (this.life[i] <= 0) {
        this.positions[i * 3 + 1] = -999;
      }
    }
    if (changed) {
      this.geo.attributes.position.needsUpdate = true;
      this.geo.attributes.color.needsUpdate = true;
    }
  }
}

/* ------------------------------------------------------------------ */
/* 总控                                                                */
/* ------------------------------------------------------------------ */

export class ParticleSystem {
  constructor(scene, { garageOrigin } = {}) {
    const mobile = isMobile();
    const counts = mobile ? PARTICLES.weatherMobile : PARTICLES.weatherDesktop;
    const rnd = mulberry32(1002);
    this.weather = {
      petal: new WeatherPoints(scene, {
        kind: 'petal', count: counts.petal, sizeRange: [0.55, 1.3], speedRange: [0.35, 0.75],
        colors: ['#f8e3ec', '#e7a9bf'], shape: 0, drift: 0.42, opacityAttr: 0.8,
      }),
      leaf: new WeatherPoints(scene, {
        kind: 'leaf', count: counts.leaf, sizeRange: [0.65, 1.45], speedRange: [0.5, 1.0],
        colors: ['#e8a44f', '#bb6333'], shape: 1, drift: 0.6, opacityAttr: 0.85,
      }),
      snow: new WeatherPoints(scene, {
        kind: 'snow', count: counts.snow, sizeRange: [0.5, 1.35], speedRange: [0.28, 0.62],
        colors: ['#ffffff', '#d5e7f7'], shape: 2, drift: 0.35, opacityAttr: 0.9,
      }),
      rain: new RainSystem(scene),
    };
    this.dust = new DustSystem(scene);
    this.sparks = new SparkSystem(scene, garageOrigin || new THREE.Vector3(0, PLAZA_Y + 1.2, 1.4));
    this.active = 'spring';
    this.target = { petal: 0, leaf: 0, snow: 0, rain: 0 };
    this.current = { petal: 0, leaf: 0, snow: 0, rain: 0 };
    this.time = 0;
    void rnd;
  }

  setSeason(seasonId, instant = false) {
    const map = { spring: 'petal', summer: 'rain', autumn: 'leaf', winter: 'snow' };
    const active = map[seasonId] || 'petal';
    this.active = active;
    for (const key of Object.keys(this.target)) this.target[key] = key === active ? 1 : 0;
    if (instant) {
      for (const key of Object.keys(this.current)) {
        this.current[key] = this.target[key];
        this.weather[key].setOpacity(this.current[key]);
      }
    }
  }

  get count() {
    let n = 0;
    for (const key of Object.keys(this.weather)) {
      const s = this.weather[key];
      const count = key === 'rain' ? s.count : s.count;
      n += count * this.current[key];
    }
    n += this.dust.count;
    n += this.sparks.count;
    return Math.round(n);
  }

  update(dt, time) {
    this.time = time;
    const speed = 1.7;
    for (const key of Object.keys(this.current)) {
      const target = this.target[key];
      const cur = this.current[key];
      let next = cur;
      if (cur < target) next = Math.min(target, cur + dt * speed);
      else if (cur > target) next = Math.max(target, cur - dt * speed);
      if (next !== cur) {
        this.current[key] = next;
        this.weather[key].setOpacity(next);
      }
    }
    for (const key of Object.keys(this.weather)) {
      const sys = this.weather[key];
      if (this.current[key] > 0.004) {
        sys.setOpacity?.(this.current[key]);
        sys.update(dt, time);
        if (sys.updateTime) sys.updateTime(time);
      }
    }
    this.dust.update(time);
    this.sparks.update(dt);
  }
}

export { WeatherPoints, RainSystem };
