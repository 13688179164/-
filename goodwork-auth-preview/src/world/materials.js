/**
 * 材质库：玻璃、水体、金属、招牌与自定义着色器
 */
import * as THREE from 'three';

/* ---------------- 环境反射 ---------------- */

export function createEnvironment(renderer) {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x04070d);

  const panel = (color, intensity, size, pos, rot) => {
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size[0], size[1]), mat);
    mesh.position.copy(pos);
    mesh.rotation.set(rot[0], rot[1], rot[2]);
    envScene.add(mesh);
  };

  panel('#20365a', 0.9, [60, 40], new THREE.Vector3(-24, 8, 6), [0, Math.PI / 2, 0]);
  panel('#d8b477', 1.9, [14, 26], new THREE.Vector3(22, 10, 4), [0, -Math.PI / 2, 0]);
  panel('#9fc9ff', 1.3, [40, 10], new THREE.Vector3(0, 26, -4), [Math.PI / 2, 0, 0]);
  panel('#0a1528', 0.5, [70, 70], new THREE.Vector3(0, -20, 0), [-Math.PI / 2, 0, 0]);
  panel('#f4e2b8', 2.4, [4, 16], new THREE.Vector3(8, 12, 20), [0, Math.PI, 0]);
  panel('#6f95c9', 1.6, [3, 20], new THREE.Vector3(-12, 10, -16), [0, 0, 0]);

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const rt = pmrem.fromScene(envScene, 0.04);
  const tex = rt.texture;
  tex.userData.disposeTarget = rt;
  pmrem.dispose();
  envScene.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) o.material.dispose();
  });
  return tex;
}

/* ---------------- 立方体玻璃 ---------------- */

export function makeCubeGlassMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uTint: { value: new THREE.Color('#a9c7f2') },
      uOpacity: { value: 1 },
    },
    vertexShader: /* glsl */`
      varying vec3 vWorld;
      varying vec3 vNormalW;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */`
      uniform vec3 uTint;
      uniform float uTime;
      uniform float uOpacity;
      varying vec3 vWorld;
      varying vec3 vNormalW;
      varying vec2 vUv;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorld);
        float fres = pow(1.0 - abs(dot(normalize(vNormalW), viewDir)), 3.2);
        float face = 0.028 + fres * 0.23;

        // 玻璃划痕与微弱污渍
        float scratchSeed = hash(floor(vWorld.xz * 1.7) + floor(vWorld.y * 0.4));
        float scratch = smoothstep(0.975, 1.0, sin(vWorld.y * 84.0 + scratchSeed * 40.0)) * 0.045;
        scratch += smoothstep(0.985, 1.0, sin(vWorld.x * 51.0 + vWorld.y * 3.0 + scratchSeed * 12.0)) * 0.026;

        float band = smoothstep(0.35, 0.5, abs(fract(vUv.y * 1.0) - 0.5)) * 0.0;
        float topGlow = smoothstep(0.55, 1.0, vUv.y) * 0.075;

        vec3 col = uTint * (face + scratch + topGlow + band);
        col += vec3(0.85, 0.76, 0.55) * fres * 0.035;
        float alpha = (face + scratch + topGlow) * uOpacity;

        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}

/* ---------------- 建筑玻璃 ---------------- */

export function makeBuildingGlassMaterial(tint = '#d8ecff') {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(tint),
    metalness: 0.08,
    roughness: 0.055,
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide,
    depthWrite: false,
    envMapIntensity: 1.0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    sheen: 0.4,
    sheenColor: new THREE.Color('#bcd6ff'),
    sheenRoughness: 0.4,
  });
}

export function makeTintedGlass(tint = '#9fc0e8', opacity = 0.28) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(tint),
    metalness: 0.1,
    roughness: 0.08,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    depthWrite: false,
    envMapIntensity: 1.5,
    clearcoat: 1,
  });
}

/* ---------------- 水体 ---------------- */

const waterVert = /* glsl */`
  varying vec2 vUv;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const waterFrag = /* glsl */`
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uFoam;
  uniform float uKind; // 0 river, 1 lake
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying vec3 vNormalW;

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorld);
    float fres = pow(1.0 - clamp(dot(normalize(vNormalW), viewDir), 0.0, 1.0), 2.0);

    float t = uTime;
    vec2 p = vUv;
    float flow = uKind < 0.5 ? p.x : p.y;
    float n1 = noise(vec2(p.x * 20.0 - t * (uKind < 0.5 ? 1.35 : 0.22), p.y * 9.0 + sin(p.x * 7.0 + t * 0.4) * 0.6));
    float n2 = noise(vec2(p.x * 52.0 - t * 2.4, p.y * 21.0 - t * 0.4));
    float n3 = noise(vec2(p.x * 6.0 + t * 0.12, p.y * 5.0 - t * 0.2));

    vec3 col = mix(uDeep, uShallow, clamp(n1 * 0.38 + fres * 0.55 + n3 * 0.22, 0.0, 1.0));
    col += vec3(0.62, 0.82, 0.9) * pow(n2, 4.0) * 0.22;
    col += vec3(0.95, 0.82, 0.58) * pow(n2, 7.0) * 0.04;

    float shore;
    if (uKind < 0.5) {
      shore = smoothstep(0.43, 0.5, abs(p.y - 0.5));
    } else {
      vec2 q = p - 0.5;
      shore = smoothstep(0.42, 0.5, length(q));
    }
    float foamWave = sin(p.x * 46.0 + t * 2.2) * 0.03 + sin(p.y * 33.0 - t * 1.6) * 0.022;
    float foam = smoothstep(0.58, 0.94, shore + foamWave + n1 * 0.05);
    col = mix(col, uFoam, foam * 0.24);

    float alpha = mix(0.66, 0.92, fres) + foam * 0.1;
    gl_FragColor = vec4(col, alpha * uOpacity);
  }
`;

export function makeWaterMaterial({ kind = 0, deep = '#245f73', shallow = '#75c2c4' } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(deep) },
      uShallow: { value: new THREE.Color(shallow) },
      uFoam: { value: new THREE.Color('#e6f4f1') },
      uKind: { value: kind },
      uOpacity: { value: 1 },
    },
    vertexShader: waterVert,
    fragmentShader: waterFrag,
  });
}

/* ---------------- 瀑布 ---------------- */

export function makeWaterfallMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#cfeaf0') },
      uOpacity: { value: 1 },
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      varying vec3 vWorld;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      varying vec3 vWorld;

      float hash(vec2 p) {
        p = fract(p * vec2(14.4, 84.6));
        p += dot(p, p + 11.2);
        return fract(p.x * p.y);
      }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1,0)), f.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
      }

      void main() {
        vec2 p = vUv;
        float t = uTime;
        float streak = noise(vec2(p.x * 34.0 + sin(p.y * 9.0 - t * 2.0) * 0.3, p.y * 5.0 - t * 5.2));
        float streak2 = noise(vec2(p.x * 74.0 - 2.0, p.y * 13.0 - t * 8.4));
        float vertical = smoothstep(0.0, 0.16, p.y) * smoothstep(0.0, 0.08, 1.0 - p.y);
        float edge = smoothstep(0.0, 0.16, p.x) * smoothstep(0.0, 0.16, 1.0 - p.x);
        float alpha = (streak * 0.55 + streak2 * 0.35 + 0.18) * vertical * edge;
        alpha *= smoothstep(0.06, 0.32, p.y);
        alpha *= 1.0 - smoothstep(0.9, 1.0, p.y) * 0.25;
        vec3 col = mix(uColor, vec3(1.0), streak2 * 0.45) * (0.72 + streak * 0.5);
        col += vec3(0.55, 0.8, 1.0) * pow(streak2, 3.0) * 0.2;
        gl_FragColor = vec4(col, alpha * 0.5 * uOpacity);
      }
    `,
  });
}

/* ---------------- 通用 ---------------- */

export function makeGoldMaterial() {
  return new THREE.MeshStandardMaterial({
    color: '#c9a465',
    metalness: 0.92,
    roughness: 0.27,
    envMapIntensity: 1.35,
    emissive: new THREE.Color('#3c2a10'),
    emissiveIntensity: 0.18,
  });
}

export function makeDarkMetal() {
  return new THREE.MeshStandardMaterial({
    color: '#1a1f27',
    metalness: 0.72,
    roughness: 0.36,
    envMapIntensity: 1.0,
  });
}

export function makeSteelMaterial() {
  return new THREE.MeshStandardMaterial({
    color: '#98a2ae',
    metalness: 0.85,
    roughness: 0.3,
    envMapIntensity: 1.2,
  });
}

export function makeCarPaint(color = '#7e1f2a') {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    metalness: 0.72,
    roughness: 0.23,
    clearcoat: 1,
    clearcoatRoughness: 0.07,
    envMapIntensity: 1.6,
  });
}

export function makeSignMaterial(texture, { emissive = 1.15, side = THREE.FrontSide } = {}) {
  return new THREE.MeshStandardMaterial({
    color: '#ffffff',
    map: texture,
    emissive: new THREE.Color('#ffffff'),
    emissiveMap: texture,
    emissiveIntensity: emissive,
    roughness: 0.42,
    metalness: 0.16,
    side,
    toneMapped: true,
  });
}

export function makeCanvasScreenMaterial(texture, intensity = 1.35) {
  return new THREE.MeshStandardMaterial({
    color: '#ffffff',
    map: texture,
    emissive: new THREE.Color('#ffffff'),
    emissiveMap: texture,
    emissiveIntensity: intensity,
    roughness: 0.35,
    metalness: 0.1,
    side: THREE.FrontSide,
  });
}

export function makeSnowMaterial() {
  return new THREE.MeshStandardMaterial({
    color: '#f2f7fb',
    roughness: 0.86,
    metalness: 0.02,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
    envMapIntensity: 0.4,
  });
}

export function makeSoftSpriteMaterial(texture, color = '#ffffff', opacity = 0.5) {
  return new THREE.SpriteMaterial({
    map: texture,
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
}
