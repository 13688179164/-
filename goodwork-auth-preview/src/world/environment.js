/**
 * 深空背景、玻璃立方体、云、雾、漂浮岩石
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { WORLD } from '../core/config.js';
import { mulberry32 } from '../core/utils.js';
import {
  makeSpaceTexture, makePlanetTexture, makeMistTexture, makeGlowTexture,
  makeBokehTexture, makeStreetPlaqueTexture,
} from '../core/textures.js';
import { makeCubeGlassMaterial, makeSignMaterial, makeDarkMetal, makeGoldMaterial } from './materials.js';

function proxySphere(r, pos, color = '#d8b477') {
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, colorWrite: false });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat);
  mesh.position.copy(pos);
  mesh.renderOrder = -1;
  return mesh;
}

export function createEnvironment(scene) {
  const rnd = mulberry32(7081);
  const group = new THREE.Group();
  group.name = 'environment';
  scene.add(group);

  /* ---------------- 深空背景 ---------------- */

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(320, 64, 40),
    new THREE.MeshBasicMaterial({
      map: makeSpaceTexture(),
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    })
  );
  sky.name = 'space-dome';
  group.add(sky);

  // 近层星点，提供轻微视差
  const starCount = 280;
  const starPos = new Float32Array(starCount * 3);
  const starCol = new Float32Array(starCount * 3);
  const c = new THREE.Color();
  for (let i = 0; i < starCount; i++) {
    const r = 36 + rnd() * 130;
    const theta = rnd() * Math.PI * 2;
    const phi = Math.acos(1 - rnd() * 1.6);
    starPos[i * 3] = Math.cos(theta) * Math.sin(phi) * r;
    starPos[i * 3 + 1] = Math.cos(phi) * r * 0.7 + 8;
    starPos[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * r;
    c.setHSL(0.55 + rnd() * 0.1, 0.35, 0.72 + rnd() * 0.18);
    if (rnd() > 0.9) c.setHSL(0.11, 0.5, 0.8);
    starCol[i * 3] = c.r; starCol[i * 3 + 1] = c.g; starCol[i * 3 + 2] = c.b;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
    size: 0.38, sizeAttenuation: true, vertexColors: true, transparent: true,
    opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false,
  }));
  stars.name = 'starfield';
  group.add(stars);

  // 远景行星
  const planetGroup = new THREE.Group();
  planetGroup.position.set(4, 12, -62);
  const planetTex = makePlanetTexture();
  const planetMat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: planetTex },
      uLightDir: { value: new THREE.Vector3(-0.65, 0.45, 0.62).normalize() },
      uRim: { value: new THREE.Color('#8fb4f0') },
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      varying vec3 vNormalW;
      varying vec3 vViewDir;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vViewDir = normalize(cameraPosition - wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap;
      uniform vec3 uLightDir;
      uniform vec3 uRim;
      varying vec2 vUv;
      varying vec3 vNormalW;
      varying vec3 vViewDir;
      void main() {
        vec3 base = texture2D(uMap, vUv).rgb;
        float ndl = dot(normalize(vNormalW), normalize(uLightDir));
        float shade = clamp(ndl * 0.65 + 0.4, 0.0, 1.0);
        float fres = pow(1.0 - abs(dot(normalize(vNormalW), normalize(vViewDir))), 3.0);
        vec3 col = base * (0.75 + shade * 1.05);
        col += uRim * fres * 0.8;
        col += vec3(0.15, 0.22, 0.42) * shade * 0.35;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    fog: false,
  });
  const planet = new THREE.Mesh(new THREE.SphereGeometry(5.0, 48, 32), planetMat);
  planet.rotation.z = 0.22;
  planet.rotation.y = -0.4;
  planetGroup.add(planet);
  group.add(planetGroup);

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(2.1, 20, 14),
    new THREE.MeshBasicMaterial({ color: '#5f6e86', fog: false, toneMapped: false })
  );
  moon.position.set(-42, 22, -96);
  group.add(moon);

  // 远景柔光 / 散景，增加深空层次
  const bokehTex = makeBokehTexture();
  const bokehSprites = [];
  const bokehColors = ['#7fa7e0', '#d8b477', '#9dc4d8', '#8b7fc0'];
  for (let i = 0; i < 26; i++) {
    const mat = new THREE.SpriteMaterial({
      map: bokehTex, color: new THREE.Color(bokehColors[i % bokehColors.length]),
      transparent: true, opacity: 0.04 + rnd() * 0.1, depthWrite: false,
      blending: THREE.AdditiveBlending, fog: false, toneMapped: false,
    });
    const sp = new THREE.Sprite(mat);
    const far = i > 13;
    sp.position.set(
      (rnd() - 0.5) * (far ? 110 : 24),
      (rnd() - 0.3) * (far ? 60 : 16) + (far ? 10 : -2),
      far ? -70 - rnd() * 70 : -7 - rnd() * 10
    );
    const s = far ? 5 + rnd() * 10 : 1.2 + rnd() * 3.2;
    sp.scale.set(s, s, 1);
    sp.userData.baseY = sp.position.y;
    sp.userData.phase = rnd() * Math.PI * 2;
    sp.userData.speed = 0.05 + rnd() * 0.14;
    group.add(sp);
    bokehSprites.push(sp);
  }

  /* ---------------- 玻璃立方体 ---------------- */

  const cube = new THREE.Group();
  cube.name = 'glass-cube';
  const { w, h, d, y } = WORLD.cube;
  cube.position.y = y;
  group.add(cube);

  const cubeGlassMat = makeCubeGlassMaterial();
  const glass = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), cubeGlassMat);
  glass.userData.glass = true;
  glass.renderOrder = 12;
  cube.add(glass);

  // 发光边线
  const edgeMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#a6c8ee'), transparent: true, opacity: 0.5,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false,
  });
  const t = 0.04;
  const edgeGeos = [];
  const addEdge = (geo, x, yy, z) => {
    geo.translate(x, yy, z);
    edgeGeos.push(geo);
  };
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    addEdge(new THREE.BoxGeometry(t, h, t), sx * w / 2, 0, sz * d / 2);
  }
  const capGeos = [];
  for (const yy of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const g = new THREE.BoxGeometry(w, t, t); g.translate(0, yy * h / 2, sz * d / 2); capGeos.push(g);
    }
    for (const sx of [-1, 1]) {
      const g = new THREE.BoxGeometry(t, t, d); g.translate(sx * w / 2, yy * h / 2, 0); capGeos.push(g);
    }
  }
  const edges = new THREE.Mesh(mergeGeometries([...edgeGeos, ...capGeos]), edgeMat);
  edges.renderOrder = 13;
  cube.add(edges);

  // 四角金属立柱与顶部铜环
  const postMat = makeDarkMetal();
  postMat.metalness = 0.92;
  postMat.roughness = 0.22;
  const postGeos = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const g = new THREE.BoxGeometry(0.09, h, 0.09);
    g.translate(sx * (w / 2 - 0.015), 0, sz * (d / 2 - 0.015));
    postGeos.push(g);
  }
  const posts = new THREE.Mesh(mergeGeometries(postGeos), postMat);
  posts.renderOrder = 14;
  cube.add(posts);

  const goldMat = makeGoldMaterial();
  const cornerCaps = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const g = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    g.translate(sx * (w / 2 - 0.015), h / 2 - 0.1, sz * (d / 2 - 0.015));
    cornerCaps.push(g);
  }
  const caps = new THREE.Mesh(mergeGeometries(cornerCaps), goldMat);
  caps.renderOrder = 14;
  cube.add(caps);

  // 底部展示铭牌
  const plaqueTex = makeStreetPlaqueTexture();
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 1.16),
    makeSignMaterial(plaqueTex, { emissive: 0.18 })
  );
  plaque.position.set(0, -h / 2 + 0.85, d / 2 + 0.002);
  plaque.rotation.x = 0;
  cube.add(plaque);

  // 岛底冷光晕，强化悬浮感
  const islandHalo = new THREE.Mesh(
    new THREE.PlaneGeometry(25, 25),
    new THREE.MeshBasicMaterial({
      map: makeGlowTexture(), color: new THREE.Color('#6e8fcf'),
      transparent: true, opacity: 0.16, depthWrite: false,
      blending: THREE.AdditiveBlending, toneMapped: false, fog: false,
    })
  );
  islandHalo.rotation.x = -Math.PI / 2;
  islandHalo.position.set(0, -4.1, 0);
  islandHalo.renderOrder = 1;
  group.add(islandHalo);

  /* ---------------- 云 ---------------- */

  const cloudGeos = [];
  const puffCount = 9;
  for (let i = 0; i < puffCount; i++) {
    const g = new THREE.SphereGeometry(1, 12, 9);
    const s = 0.6 + rnd() * 0.8;
    g.scale(s * (1 + rnd() * 0.5), s * (0.55 + rnd() * 0.25), s * (0.7 + rnd() * 0.35));
    g.translate((rnd() - 0.5) * 3.6, (rnd() - 0.4) * 0.55, (rnd() - 0.5) * 1.5);
    cloudGeos.push(g);
  }
  const cloudGeo = mergeGeometries(cloudGeos);
  cloudGeo.computeVertexNormals();
  const cloudMat = new THREE.MeshStandardMaterial({
    color: '#e9f1fc', roughness: 0.98, metalness: 0.0,
    transparent: true, opacity: 0.94, emissive: new THREE.Color('#1b2940'), emissiveIntensity: 0.18,
    envMapIntensity: 0.35, flatShading: false,
  });
  const clouds = [];
  const cloudDefs = [
    [4.2, 10.6, -4.4, 0.75],
    [7.6, 9.4, 1.2, 0.55],
    [1.8, 11.3, 3.8, 0.5],
    [-8.2, 10.6, 5.0, 0.45],
    [0.2, 9.3, -6.4, 0.4],
    [5.2, 11.0, 5.2, 0.45],
  ];
  for (const [x, yy, z, s] of cloudDefs) {
    const cloud = new THREE.Mesh(cloudGeo, cloudMat);
    cloud.position.set(x, yy, z);
    cloud.scale.setScalar(s);
    cloud.rotation.y = rnd() * Math.PI;
    cloud.userData.baseX = x;
    cloud.userData.baseY = yy;
    cloud.userData.baseZ = z;
    cloud.userData.phase = rnd() * Math.PI * 2;
    cloud.userData.speed = 0.1 + rnd() * 0.08;
    cloud.castShadow = false;
    cloud.receiveShadow = false;
    group.add(cloud);
    clouds.push(cloud);
  }

  /* ---------------- 薄雾 ---------------- */

  const mistTex = makeMistTexture();
  const mists = [];
  const mistDefs = [
    // 湖泊与瀑布
    [8.2, 0.8, 3.4, 5.2, 0.15],
    [9.4, -1.5, 3.1, 5.8, 0.2],
    [9.9, -3.5, 3.0, 5.0, 0.16],
    // 湖面
    [6.2, 0.9, 3.8, 4.0, 0.1],
    [7.7, 0.7, 2.2, 3.4, 0.08],
    // 森林与山脚
    [-5.0, 2.6, -2.6, 4.4, 0.09],
    [-7.6, 1.2, 0.4, 4.0, 0.075],
    [3.4, 1.2, -1.4, 3.6, 0.06],
    // 峰顶薄雾
    [-5.2, 9.0, -4.7, 2.8, 0.075],
    [-3.4, 8.2, -5.6, 2.2, 0.06],
    // 岛底
    [2.2, -4.0, -1.0, 6.8, 0.14],
    [-3.6, -4.8, 1.6, 6.0, 0.12],
    [0.0, -6.8, 2.5, 7.6, 0.1],
    // 世界边缘
    [9.8, -7.5, 6.5, 9.0, 0.08],
    [-10.6, -7.0, -6.5, 8.0, 0.07],
    [0.0, -8.9, -11.0, 10.0, 0.06],
  ];
  for (let i = 0; i < mistDefs.length; i++) {
    const [x, yy, z, s, op] = mistDefs[i];
    const mat = new THREE.SpriteMaterial({
      map: mistTex,
      color: new THREE.Color(i < 5 ? '#cfe7f0' : '#c4d4e6'),
      transparent: true, opacity: op, depthWrite: false,
      blending: THREE.NormalBlending, fog: true, toneMapped: false,
    });
    const sp = new THREE.Sprite(mat);
    sp.position.set(x, yy, z);
    sp.scale.set(s, s * 0.62, 1);
    sp.userData.baseX = x;
    sp.userData.baseY = yy;
    sp.userData.baseOpacity = op;
    sp.userData.phase = rnd() * Math.PI * 2;
    sp.userData.speed = 0.05 + rnd() * 0.09;
    sp.userData.sway = 0.4 + rnd() * 1.2;
    group.add(sp);
    mists.push(sp);
  }

  /* ---------------- 漂浮岩块 ---------------- */

  const rockGeo = new THREE.DodecahedronGeometry(1, 1);
  {
    const pos = rockGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), yy = pos.getY(i), z = pos.getZ(i);
      const n = Math.sin(x * 9 + yy * 7) * Math.cos(z * 8 - yy * 3) * 0.09;
      pos.setXYZ(i, x * (1 + n), yy * (0.8 + n), z * (1 + n));
    }
    rockGeo.computeVertexNormals();
  }
  const rockMat = new THREE.MeshStandardMaterial({
    color: '#514c43', roughness: 0.92, metalness: 0.05, flatShading: true, envMapIntensity: 0.4,
  });
  const floatingRocks = new THREE.InstancedMesh(rockGeo, rockMat, 12);
  floatingRocks.castShadow = false;
  floatingRocks.receiveShadow = false;
  const rockData = [];
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 12; i++) {
    const angle = rnd() * Math.PI * 2;
    const radius = 5.5 + rnd() * 3.5;
    const data = {
      base: new THREE.Vector3(Math.cos(angle) * radius, -4.3 - rnd() * 3.2, Math.sin(angle) * radius * 0.9),
      scale: 0.14 + rnd() * 0.4,
      phase: rnd() * Math.PI * 2,
      speed: 0.2 + rnd() * 0.5,
      rot: new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3),
    };
    rockData.push(data);
    dummy.position.copy(data.base);
    dummy.scale.setScalar(data.scale);
    dummy.rotation.copy(data.rot);
    dummy.updateMatrix();
    floatingRocks.setMatrixAt(i, dummy.matrix);
  }
  floatingRocks.instanceMatrix.needsUpdate = true;
  group.add(floatingRocks);

  // 互动代理：云与雾
  const cloudProxy = proxySphere(2.4, new THREE.Vector3(2.6, 10.4, -3.8));
  cloudProxy.userData.interactiveKey = 'clouds';
  group.add(cloudProxy);
  const mistProxy = proxySphere(2.0, new THREE.Vector3(9.0, 1.0, 3.0));
  mistProxy.userData.interactiveKey = 'mist';
  group.add(mistProxy);

  /* ---------------- 更新 ---------------- */

  const clock = { t: 0 };
  function update(dt, time) {
    clock.t = time;
    cubeGlassMat.uniforms.uTime.value = time;

    for (const cloud of clouds) {
      const u = cloud.userData;
      cloud.position.x = u.baseX + Math.sin(time * u.speed + u.phase) * 0.55;
      cloud.position.y = u.baseY + Math.sin(time * u.speed * 1.7 + u.phase) * 0.16;
      cloud.position.z = u.baseZ + Math.cos(time * u.speed * 0.8 + u.phase) * 0.3;
      cloud.rotation.y += dt * 0.008;
    }

    for (const m of mists) {
      const u = m.userData;
      m.position.x = u.baseX + Math.sin(time * u.speed + u.phase) * u.sway;
      m.position.y = u.baseY + Math.cos(time * u.speed * 0.8 + u.phase) * 0.2;
      m.material.opacity = u.baseOpacity * (0.78 + Math.sin(time * 0.4 + u.phase) * 0.22);
      const s = m.userData.baseOpacity > 0.15 ? 1.02 : 1.0;
      const baseScale = m.scale.x;
      m.scale.x = baseScale;
      m.scale.y = baseScale * 0.62 * s;
    }

    for (let i = 0; i < bokehSprites.length; i++) {
      const sp = bokehSprites[i];
      sp.position.y = sp.userData.baseY + Math.sin(time * sp.userData.speed + sp.userData.phase) * 0.7;
      sp.material.opacity = (0.045 + Math.abs(Math.sin(time * 0.08 + i)) * 0.055);
    }

    for (let i = 0; i < rockData.length; i++) {
      const r = rockData[i];
      dummy.position.copy(r.base);
      dummy.position.y += Math.sin(time * r.speed * 1.6 + r.phase) * 0.22;
      dummy.position.x += Math.sin(time * r.speed * 0.5 + r.phase) * 0.15;
      dummy.scale.setScalar(r.scale);
      dummy.rotation.set(r.rot.x + time * 0.05, r.rot.y + time * 0.08, r.rot.z + time * 0.04);
      dummy.updateMatrix();
      floatingRocks.setMatrixAt(i, dummy.matrix);
    }
    floatingRocks.instanceMatrix.needsUpdate = true;

    planetGroup.rotation.y = Math.sin(time * 0.02) * 0.04;
  }

  return {
    group,
    cube,
    glass,
    cubeGlassMat,
    clouds,
    mists,
    plaque,
    cloudProxy,
    mistProxy,
    update,
  };
}
