import * as THREE from 'three';

/* ============================================================
   Seasonal atmosphere + GPU-light particle weather
   ============================================================ */

const PRESETS = {
  spring: {
    key: 'spring', label: '春 · 樱瓣', en: 'SPRING / CHERRY BLOSSOM',
    temp: '16.2°C', wind: '2.4 m/s', vis: '8.6 km',
    skyTop: 0x08111d, skyMid: 0x152436, skyHorizon: 0x394351, skyGlow: 0x7a6040,
    fog: 0x101923, fogDensity: 0.0096,
    lightColor: 0xb4cde2, lightIntensity: 1.5, moonColor: 0xdfe9f4, moonOpacity: 0.72,
    hemiSky: 0x7d9cb6, hemiGround: 0x0d1015, hemiIntensity: 0.55,
    star: 0.55, glass: 0xa8c7c8, glassOpacity: 0.115,
    foliage: 0x4c6b50, snow: 0, ground: 0xb5bcc4, sidewalk: 0x9da1a6, cone: 1.0, wet: 0.3,
  },
  summer: {
    key: 'summer', label: '夏 · 骤雨', en: 'SUMMER / SUDDEN RAIN',
    temp: '27.4°C', wind: '7.2 m/s', vis: '4.1 km',
    skyTop: 0x060d16, skyMid: 0x0e1b28, skyHorizon: 0x222f3a, skyGlow: 0x4a4a3a,
    fog: 0x0b141d, fogDensity: 0.0122,
    lightColor: 0x9ab8cf, lightIntensity: 1.35, moonColor: 0x9fb4c6, moonOpacity: 0.25,
    hemiSky: 0x64849d, hemiGround: 0x080b0f, hemiIntensity: 0.65,
    star: 0.12, glass: 0x87aeb7, glassOpacity: 0.135,
    foliage: 0x223f2c, snow: 0, ground: 0x9ba3ad, sidewalk: 0x84898f, cone: 1.15, wet: 0.16,
  },
  autumn: {
    key: 'autumn', label: '秋 · 落叶', en: 'AUTUMN / FALLING LEAVES',
    temp: '12.8°C', wind: '3.8 m/s', vis: '7.2 km',
    skyTop: 0x0d1018, skyMid: 0x211f28, skyHorizon: 0x4a3e34, skyGlow: 0x8f5f33,
    fog: 0x181715, fogDensity: 0.0108,
    lightColor: 0xd0c0a4, lightIntensity: 1.4, moonColor: 0xe4d3b4, moonOpacity: 0.62,
    hemiSky: 0x8d8172, hemiGround: 0x100e0c, hemiIntensity: 0.52,
    star: 0.5, glass: 0xc4bda5, glassOpacity: 0.12,
    foliage: 0x9a6830, snow: 0, ground: 0xb2ada4, sidewalk: 0x9c9892, cone: 1.05, wet: 0.28,
  },
  winter: {
    key: 'winter', label: '冬 · 细雪', en: 'WINTER / FINE SNOW',
    temp: '-3.2°C', wind: '1.6 m/s', vis: '5.8 km',
    skyTop: 0x050b16, skyMid: 0x101d2e, skyHorizon: 0x2f3d4d, skyGlow: 0x665a45,
    fog: 0x0d1722, fogDensity: 0.0112,
    lightColor: 0xc4d8ec, lightIntensity: 1.75, moonColor: 0xeaf3fc, moonOpacity: 0.9,
    hemiSky: 0x8aa6c2, hemiGround: 0x0d1015, hemiIntensity: 0.62,
    star: 0.9, glass: 0xbcd3d8, glassOpacity: 0.105,
    foliage: 0x42514a, snow: 1, ground: 0xbfc7d0, sidewalk: 0xaab0b7, cone: 1.0, wet: 0.36,
  },
};

const WEATHER_COUNTS = {
  petals: { desktop: 1100, mobile: 760 },
  rain: { desktop: 900, mobile: 660 },
  leaves: { desktop: 1000, mobile: 700 },
  snow: { desktop: 1300, mobile: 860 },
};

const AREA = { x0: -34, x1: 36, z0: -14, z1: 20, top: 22 };

const POINT_VERT = `
  uniform float uScale;
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpin;
  varying float vPhase;
  varying float vSpin;
  void main(){
    vPhase = aPhase;
    vSpin = aSpin;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(aSize * uScale / max(0.4, -mv.z), 1.0, 42.0);
  }
`;

function petalMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.NormalBlending,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uScale: { value: 900 }, uTint: { value: 0.0 } },
    vertexShader: POINT_VERT,
    fragmentShader: `
      uniform float uTime; uniform float uOpacity; uniform float uTint;
      varying float vPhase; varying float vSpin;
      void main(){
        if (uOpacity < 0.005) discard;
        float a = vPhase + uTime * (0.55 + vSpin * 0.5) + vSpin * 3.0;
        mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
        vec2 p = rot * (gl_PointCoord - 0.5);
        p.x *= 1.7;
        float d = length(p);
        float alpha = smoothstep(0.38, 0.02, d) * uOpacity;
        vec3 c1 = mix(vec3(0.95,0.32,0.5), vec3(1.0,0.62,0.72), smoothstep(0.0,0.3,d));
        vec3 c2 = mix(vec3(0.9,0.38,0.24), vec3(1.0,0.68,0.34), smoothstep(0.0,0.3,d));
        vec3 col = mix(c1, c2, uTint);
        gl_FragColor = vec4(col, alpha * 0.96);
      }
    `,
  });
}

function snowMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.NormalBlending,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uScale: { value: 900 } },
    vertexShader: POINT_VERT,
    fragmentShader: `
      uniform float uOpacity;
      varying float vPhase; varying float vSpin;
      void main(){
        if (uOpacity < 0.005) discard;
        vec2 p = gl_PointCoord - 0.5;
        float d = length(p);
        float a = smoothstep(0.5, 0.12, d);
        float spark = max(0.0, 1.0 - abs(p.x) * 9.0) + max(0.0, 1.0 - abs(p.y) * 9.0);
        vec3 col = mix(vec3(0.72,0.82,0.94), vec3(1.0,1.0,1.0), a);
        gl_FragColor = vec4(col, a * (0.6 + spark * 0.12) * uOpacity);
      }
    `,
  });
}

function leafMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.NormalBlending,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uScale: { value: 900 } },
    vertexShader: POINT_VERT,
    fragmentShader: `
      uniform float uTime; uniform float uOpacity;
      varying float vPhase; varying float vSpin;
      void main(){
        if (uOpacity < 0.005) discard;
        float a = vPhase + uTime * (0.9 + vSpin * 0.9) + vSpin * 2.0;
        mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
        vec2 p = rot * (gl_PointCoord - 0.5);
        p.x *= 0.55;
        float d = length(p);
        float leaf = smoothstep(0.34, 0.02, d);
        float vein = smoothstep(0.02, 0.0, abs(p.y)) * leaf;
        vec3 col = mix(vec3(0.62,0.24,0.07), vec3(0.95,0.6,0.2), 1.0 - d * 2.2);
        col = mix(col, vec3(1.0,0.82,0.42), vein * 0.4);
        gl_FragColor = vec4(col, leaf * uOpacity);
      }
    `,
  });
}

function rainMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uOpacity: { value: 0 }, uColor: { value: new THREE.Color(0x8fb6cc) } },
    vertexShader: `
      attribute float aAlpha;
      varying float vAlpha;
      void main(){
        vAlpha = aAlpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uOpacity; uniform vec3 uColor;
      varying float vAlpha;
      void main(){
        gl_FragColor = vec4(uColor, vAlpha * uOpacity * 0.85);
      }
    `,
  });
}

function dustMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0.5 }, uScale: { value: 900 }, uColor: { value: new THREE.Color(0xe8d0a4) } },
    vertexShader: POINT_VERT,
    fragmentShader: `
      uniform float uOpacity; uniform float uTime; uniform vec3 uColor;
      varying float vPhase; varying float vSpin;
      void main(){
        vec2 p = gl_PointCoord - 0.5;
        float d = length(p);
        float a = smoothstep(0.5, 0.04, d);
        float twinkle = 0.55 + 0.45 * sin(uTime * (0.9 + vSpin) + vPhase * 4.0);
        gl_FragColor = vec4(uColor, a * twinkle * uOpacity);
      }
    `,
  });
}

export class SeasonSystem {
  constructor(scene, world, renderer, camera, options = {}) {
    this.scene = scene;
    this.world = world;
    this.renderer = renderer;
    this.camera = camera;
    this.isMobile = !!options.isMobile;
    this.onSeasonChange = options.onSeasonChange || (() => {});
    this.onState = options.onState || (() => {});

    this.auto = true;
    this.timer = 20;
    this.nextSwitch = 20 + Math.random() * 8;
    this.manualReset = 18 + Math.random() * 10;

    this.currentKey = 'winter';
    this.targetKey = 'winter';
    this.state = this.makeState(PRESETS.winter);
    this.target = this.makeState(PRESETS.winter);

    this.weather = {};
    this.weatherTarget = { petals: 0, rain: 0, leaves: 0, snow: 1 };
    this.buildWeather();

    this.dust = this.buildDust();
    this.reportedSecond = -1;

    this.update(0.016, 0);
  }

  makeState(p) {
    return {
      skyTop: new THREE.Color(p.skyTop),
      skyMid: new THREE.Color(p.skyMid),
      skyHorizon: new THREE.Color(p.skyHorizon),
      skyGlow: new THREE.Color(p.skyGlow),
      fogColor: new THREE.Color(p.fog),
      fogDensity: p.fogDensity,
      lightColor: new THREE.Color(p.lightColor),
      lightIntensity: p.lightIntensity,
      moonColor: new THREE.Color(p.moonColor),
      moonOpacity: p.moonOpacity,
      hemiSky: new THREE.Color(p.hemiSky),
      hemiGround: new THREE.Color(p.hemiGround),
      hemiIntensity: p.hemiIntensity,
      starOpacity: p.star,
      glassTint: new THREE.Color(p.glass),
      glassOpacity: p.glassOpacity,
      foliage: new THREE.Color(p.foliage),
      snow: p.snow,
      groundTint: new THREE.Color(p.ground),
      sidewalkTint: new THREE.Color(p.sidewalk),
      coneOpacity: p.cone,
      wet: p.wet,
    };
  }

  buildWeather() {
    const count = (key) => (this.isMobile ? WEATHER_COUNTS[key].mobile : WEATHER_COUNTS[key].desktop);

    // spring petals
    {
      const n = count('petals');
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(n * 3);
      const sizes = new Float32Array(n);
      const phases = new Float32Array(n);
      const spins = new Float32Array(n);
      const speeds = new Float32Array(n);
      const rnd = Math.random;
      for (let i = 0; i < n; i++) {
        pos[i * 3] = AREA.x0 + rnd() * (AREA.x1 - AREA.x0);
        pos[i * 3 + 1] = rnd() * AREA.top;
        pos[i * 3 + 2] = AREA.z0 + rnd() * (AREA.z1 - AREA.z0);
        sizes[i] = 0.115 + rnd() * 0.15;
        phases[i] = rnd() * 6.28;
        spins[i] = rnd();
        speeds[i] = 0.45 + rnd() * 0.8;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
      geo.setAttribute('aSpin', new THREE.BufferAttribute(spins, 1));
      const mat = petalMaterial();
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      points.visible = false;
      this.scene.add(points);
      this.weather.petals = { type: 'points', count: n, points, geo, mat, arrays: { pos, speeds, phases }, opacity: 0 };
    }

    // summer rain
    {
      const n = count('rain');
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(n * 6);
      const alpha = new Float32Array(n * 2);
      const speed = new Float32Array(n);
      const len = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const x = AREA.x0 + Math.random() * (AREA.x1 - AREA.x0);
        const y = Math.random() * AREA.top;
        const z = AREA.z0 + Math.random() * (AREA.z1 - AREA.z0);
        pos[i * 6] = x; pos[i * 6 + 1] = y; pos[i * 6 + 2] = z;
        pos[i * 6 + 3] = x + 0.1; pos[i * 6 + 4] = y - 0.9; pos[i * 6 + 5] = z;
        alpha[i * 2] = 0.2 + Math.random() * 0.55;
        alpha[i * 2 + 1] = 0.02;
        speed[i] = 12 + Math.random() * 10;
        len[i] = 0.6 + Math.random() * 0.9;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
      const mat = rainMaterial();
      const lines = new THREE.LineSegments(geo, mat);
      lines.frustumCulled = false;
      lines.visible = false;
      this.scene.add(lines);
      this.weather.rain = { type: 'rain', count: n, points: lines, geo, mat, arrays: { pos, speed, len }, opacity: 0 };
    }

    // autumn leaves
    {
      const n = count('leaves');
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(n * 3);
      const sizes = new Float32Array(n);
      const phases = new Float32Array(n);
      const spins = new Float32Array(n);
      const speeds = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        pos[i * 3] = AREA.x0 + Math.random() * (AREA.x1 - AREA.x0);
        pos[i * 3 + 1] = Math.random() * AREA.top;
        pos[i * 3 + 2] = AREA.z0 + Math.random() * (AREA.z1 - AREA.z0);
        sizes[i] = 0.11 + Math.random() * 0.13;
        phases[i] = Math.random() * 6.28;
        spins[i] = Math.random();
        speeds[i] = 0.7 + Math.random() * 1.1;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
      geo.setAttribute('aSpin', new THREE.BufferAttribute(spins, 1));
      const mat = leafMaterial();
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      points.visible = false;
      this.scene.add(points);
      this.weather.leaves = { type: 'points', count: n, points, geo, mat, arrays: { pos, speeds, phases }, opacity: 0 };
    }

    // winter snow
    {
      const n = count('snow');
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(n * 3);
      const sizes = new Float32Array(n);
      const phases = new Float32Array(n);
      const spins = new Float32Array(n);
      const speeds = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        pos[i * 3] = AREA.x0 + Math.random() * (AREA.x1 - AREA.x0);
        pos[i * 3 + 1] = Math.random() * AREA.top;
        pos[i * 3 + 2] = AREA.z0 + Math.random() * (AREA.z1 - AREA.z0);
        sizes[i] = 0.035 + Math.random() * 0.065;
        phases[i] = Math.random() * 6.28;
        spins[i] = Math.random();
        speeds[i] = 0.5 + Math.random() * 1.1;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
      geo.setAttribute('aSpin', new THREE.BufferAttribute(spins, 1));
      const mat = snowMaterial();
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      points.visible = false;
      this.scene.add(points);
      this.weather.snow = { type: 'points', count: n, points, geo, mat, arrays: { pos, speeds, phases }, opacity: 0 };
    }
  }

  buildDust() {
    const n = this.isMobile ? 180 : 280;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    const sizes = new Float32Array(n);
    const phases = new Float32Array(n);
    const spins = new Float32Array(n);
    const speeds = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = AREA.x0 + Math.random() * (AREA.x1 - AREA.x0);
      pos[i * 3 + 1] = 0.3 + Math.random() * 10;
      pos[i * 3 + 2] = AREA.z0 + Math.random() * (AREA.z1 - AREA.z0);
      sizes[i] = 0.015 + Math.random() * 0.035;
      phases[i] = Math.random() * 6.28;
      spins[i] = Math.random() * 2;
      speeds[i] = 0.08 + Math.random() * 0.22;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSpin', new THREE.BufferAttribute(spins, 1));
    const mat = dustMaterial();
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    this.scene.add(points);
    return { count: n, points, geo, mat, arrays: { pos, speeds, phases } };
  }

  getInfo() {
    const p = PRESETS[this.targetKey];
    let particles = this.dust.count;
    Object.values(this.weather).forEach((w) => { if (w.opacity > 0.05) particles += w.count; });
    return {
      ...p,
      auto: this.auto,
      countdown: Math.max(0, this.nextSwitch),
      particles,
      key: this.targetKey,
    };
  }

  setSeason(key, manual = false) {
    if (!PRESETS[key] || key === this.targetKey) {
      if (manual) this.nextSwitch = this.manualReset;
      return;
    }
    this.targetKey = key;
    this.target = this.makeState(PRESETS[key]);
    this.weatherTarget = { petals: 0, rain: 0, leaves: 0, snow: 0 };
    this.weatherTarget[key === 'spring' ? 'petals' : key === 'summer' ? 'rain' : key === 'autumn' ? 'leaves' : 'snow'] = 1;
    this.manualReset = 18 + Math.random() * 10;
    this.nextSwitch = this.manualReset;
    this.onSeasonChange(PRESETS[key]);
  }

  setAuto(v) {
    this.auto = v;
    if (v) this.nextSwitch = this.manualReset;
  }

  setViewScale(scale) {
    Object.values(this.weather).forEach((w) => {
      if (w.mat.uniforms && w.mat.uniforms.uScale) w.mat.uniforms.uScale.value = scale;
    });
    this.dust.mat.uniforms.uScale.value = scale;
  }

  update(dt, elapsed) {
    // auto rotation
    if (this.auto) {
      this.nextSwitch -= dt;
      if (this.nextSwitch <= 0) {
        const keys = Object.keys(PRESETS).filter((k) => k !== this.targetKey);
        const next = keys[Math.floor(Math.random() * keys.length)];
        this.setSeason(next, false);
      }
    }

    // smooth environmental transition
    const damp = 1 - Math.exp(-dt * 1.15);
    const s = this.state;
    const t = this.target;
    s.skyTop.lerp(t.skyTop, damp);
    s.skyMid.lerp(t.skyMid, damp);
    s.skyHorizon.lerp(t.skyHorizon, damp);
    s.skyGlow.lerp(t.skyGlow, damp);
    s.fogColor.lerp(t.fogColor, damp);
    s.lightColor.lerp(t.lightColor, damp);
    s.moonColor.lerp(t.moonColor, damp);
    s.hemiSky.lerp(t.hemiSky, damp);
    s.hemiGround.lerp(t.hemiGround, damp);
    s.glassTint.lerp(t.glassTint, damp);
    s.foliage.lerp(t.foliage, damp);
    s.groundTint.lerp(t.groundTint, damp);
    s.sidewalkTint.lerp(t.sidewalkTint, damp);
    s.fogDensity += (t.fogDensity - s.fogDensity) * damp;
    s.lightIntensity += (t.lightIntensity - s.lightIntensity) * damp;
    s.moonOpacity += (t.moonOpacity - s.moonOpacity) * damp;
    s.hemiIntensity += (t.hemiIntensity - s.hemiIntensity) * damp;
    s.starOpacity += (t.starOpacity - s.starOpacity) * damp;
    s.glassOpacity += (t.glassOpacity - s.glassOpacity) * damp;
    s.coneOpacity += (t.coneOpacity - s.coneOpacity) * damp;
    s.wet += (t.wet - s.wet) * damp;
    s.snow += (t.snow - s.snow) * (1 - Math.exp(-dt * 0.75));

    this.world.setSeason(s);

    // particle fade + simulation
    for (const [name, w] of Object.entries(this.weather)) {
      const target = this.weatherTarget[name] || 0;
      w.opacity += (target - w.opacity) * Math.min(1, dt * 1.7);
      if (w.opacity < 0.004 && target === 0) {
        w.points.visible = false;
        if (w.opacity !== 0) { w.opacity = 0; w.mat.uniforms.uOpacity.value = 0; }
        continue;
      }
      w.points.visible = true;
      w.mat.uniforms.uOpacity.value = w.opacity;
      if (w.mat.uniforms.uTime) w.mat.uniforms.uTime.value = elapsed;
      this.simulateWeather(name, w, dt, elapsed);
    }

    // ambient dust always alive, independent of weather
    const dust = this.dust;
    if (dust.mat.uniforms.uTime) dust.mat.uniforms.uTime.value = elapsed;
    const dp = dust.geo.attributes.position.array;
    const { speeds, phases } = dust.arrays;
    for (let i = 0; i < dust.count; i++) {
      dp[i * 3 + 1] += speeds[i] * dt;
      dp[i * 3] += Math.sin(elapsed * 0.35 + phases[i]) * 0.035 * dt;
      if (dp[i * 3 + 1] > 11) {
        dp[i * 3 + 1] = 0.3;
        dp[i * 3] = AREA.x0 + Math.random() * (AREA.x1 - AREA.x0);
        dp[i * 3 + 2] = AREA.z0 + Math.random() * (AREA.z1 - AREA.z0);
      }
    }
    dust.geo.attributes.position.needsUpdate = true;

    // report every whole second for HUD
    const sec = Math.floor(this.nextSwitch);
    if (sec !== this.reportedSecond) {
      this.reportedSecond = sec;
      this.onState(this.getInfo());
    }
  }

  simulateWeather(name, w, dt, elapsed) {
    const pos = w.geo.attributes.position.array;
    if (w.type === 'rain') {
      const { speed, len } = w.arrays;
      for (let i = 0; i < w.count; i++) {
        const idx = i * 6;
        const fall = speed[i] * dt;
        pos[idx + 1] -= fall;
        pos[idx + 4] -= fall;
        pos[idx] -= 2.0 * dt;
        pos[idx + 3] -= 2.0 * dt;
        if (pos[idx + 1] < 0.1) {
          const x = AREA.x0 + Math.random() * (AREA.x1 - AREA.x0);
          const y = 18 + Math.random() * 5;
          const z = AREA.z0 + Math.random() * (AREA.z1 - AREA.z0);
          pos[idx] = x; pos[idx + 1] = y; pos[idx + 2] = z;
          pos[idx + 3] = x + 0.12; pos[idx + 4] = y - len[i]; pos[idx + 5] = z;
        }
      }
    } else {
      const { speeds, phases } = w.arrays;
      const sway = name === 'leaves' ? 0.9 : name === 'petals' ? 0.55 : 0.22;
      for (let i = 0; i < w.count; i++) {
        const idx = i * 3;
        pos[idx + 1] -= speeds[i] * dt;
        pos[idx] += Math.sin(elapsed * 0.65 + phases[i]) * sway * dt;
        pos[idx + 2] += Math.cos(elapsed * 0.48 + phases[i] * 1.7) * sway * 0.55 * dt;
        if (pos[idx] > AREA.x1) pos[idx] = AREA.x0;
        if (pos[idx] < AREA.x0) pos[idx] = AREA.x1;
        if (pos[idx + 2] > AREA.z1) pos[idx + 2] = AREA.z0;
        if (pos[idx + 2] < AREA.z0) pos[idx + 2] = AREA.z1;
        const floor = name === 'leaves' ? 0.15 : 0.1;
        if (pos[idx + 1] < floor) {
          pos[idx + 1] = AREA.top - Math.random() * 3;
          pos[idx] = AREA.x0 + Math.random() * (AREA.x1 - AREA.x0);
          pos[idx + 2] = AREA.z0 + Math.random() * (AREA.z1 - AREA.z0);
        }
      }
    }
    w.geo.attributes.position.needsUpdate = true;
  }
}
