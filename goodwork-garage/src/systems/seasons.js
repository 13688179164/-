/**
 * 四季系统：光照、雾、植被、玻璃、水体、积雪与粒子协同过渡
 */
import * as THREE from 'three';
import { SEASONS } from '../core/config.js';
import { damp } from '../core/utils.js';

export class SeasonSystem {
  constructor({
    scene, renderer, bloomPass, lights, island, buildings, particles, environment,
    onSeasonChanged,
  }) {
    this.scene = scene;
    this.renderer = renderer;
    this.bloomPass = bloomPass;
    this.lights = lights;
    this.island = island;
    this.buildings = buildings;
    this.particles = particles;
    this.environment = environment;
    this.onSeasonChanged = onSeasonChanged || (() => {});

    this.index = 0;
    this.season = SEASONS[0];
    this.autoEnabled = true;
    this.nextIn = this.randomInterval();
    this.elapsed = 0;
    this.switchCooldown = 0;

    const first = SEASONS[0];
    this.current = {
      fog: new THREE.Color(first.fog),
      hemiSky: new THREE.Color(first.hemiSky),
      hemiGround: new THREE.Color(first.hemiGround),
      keyColor: new THREE.Color(first.keyColor),
      rimColor: new THREE.Color(first.rimColor),
      ambient: new THREE.Color(first.ambient),
      grass: new THREE.Color(first.grassTint),
      canopy: new THREE.Color(first.canopy),
      pine: new THREE.Color(first.pine),
      cherry: new THREE.Color(first.cherry),
      waterDeep: new THREE.Color(first.waterDeep),
      waterShallow: new THREE.Color(first.waterShallow),
      glassTint: new THREE.Color(first.glassTint),
      cubeTint: new THREE.Color(first.glassTint).lerp(new THREE.Color('#7fa8e0'), 0.35),
      fogDensity: first.fogDensity,
      hemiIntensity: first.hemiIntensity,
      keyIntensity: first.keyIntensity,
      rimIntensity: first.rimIntensity,
      ambientIntensity: first.ambientIntensity,
      exposure: first.exposure,
      bloom: first.bloom,
      groundSnow: first.groundSnow,
    };
    this.target = this.buildTarget(first);
    this.applyImmediate();
    this.particles.setSeason(first.id, true);
  }

  buildTarget(season) {
    return {
      fog: new THREE.Color(season.fog),
      hemiSky: new THREE.Color(season.hemiSky),
      hemiGround: new THREE.Color(season.hemiGround),
      keyColor: new THREE.Color(season.keyColor),
      rimColor: new THREE.Color(season.rimColor),
      ambient: new THREE.Color(season.ambient),
      grass: new THREE.Color(season.grassTint),
      canopy: new THREE.Color(season.canopy),
      pine: new THREE.Color(season.pine),
      cherry: new THREE.Color(season.cherry),
      waterDeep: new THREE.Color(season.waterDeep),
      waterShallow: new THREE.Color(season.waterShallow),
      glassTint: new THREE.Color(season.glassTint),
      cubeTint: new THREE.Color(season.glassTint).lerp(new THREE.Color('#7fa8e0'), 0.35),
      fogDensity: season.fogDensity,
      hemiIntensity: season.hemiIntensity,
      keyIntensity: season.keyIntensity,
      rimIntensity: season.rimIntensity,
      ambientIntensity: season.ambientIntensity,
      exposure: season.exposure,
      bloom: season.bloom,
      groundSnow: season.groundSnow,
    };
  }

  randomInterval() {
    return 18 + Math.random() * 10;
  }

  get id() { return this.season.id; }

  setSeason(idOrIndex, manual = true, instant = false) {
    const index = typeof idOrIndex === 'number'
      ? idOrIndex
      : SEASONS.findIndex((s) => s.id === idOrIndex);
    if (index < 0) return;
    if (!instant && this.switchCooldown > 0) return;
    this.switchCooldown = instant ? 0 : 0.8;
    this.index = index;
    this.season = SEASONS[index];
    this.target = this.buildTarget(this.season);
    this.particles.setSeason(this.season.id, instant);
    this.nextIn = this.randomInterval();
    this.elapsed = 0;
    if (instant) {
      for (const key of Object.keys(this.current)) {
        const v = this.current[key];
        const t = this.target[key];
        if (v instanceof THREE.Color) v.copy(t);
        else this.current[key] = t;
      }
    }
    this.onSeasonChanged(this.season, { manual, instant });
  }

  next() {
    const nextIndex = (this.index + 1) % SEASONS.length;
    this.setSeason(nextIndex, false);
  }

  applyImmediate() {
    for (const key of Object.keys(this.current)) {
      const v = this.current[key];
      const t = this.target[key];
      if (v instanceof THREE.Color) v.copy(t);
      else this.current[key] = t;
    }
    this.apply(0, 0);
  }

  apply(dt, k) {
    const c = this.current;
    const scene = this.scene;
    if (scene.fog) {
      scene.fog.color.copy(c.fog);
      scene.fog.density = c.fogDensity;
    }
    const l = this.lights;
    if (l.hemi) {
      l.hemi.color.copy(c.hemiSky);
      l.hemi.groundColor.copy(c.hemiGround);
      l.hemi.intensity = c.hemiIntensity;
    }
    if (l.key) {
      l.key.color.copy(c.keyColor);
      l.key.intensity = c.keyIntensity;
    }
    if (l.rim) {
      l.rim.color.copy(c.rimColor);
      l.rim.intensity = c.rimIntensity;
    }
    if (l.ambient) {
      l.ambient.color.copy(c.ambient);
      l.ambient.intensity = c.ambientIntensity;
    }
    this.renderer.toneMappingExposure = c.exposure;
    if (this.bloomPass) this.bloomPass.strength = c.bloom;

    const isl = this.island;
    isl.terrainMat.color.copy(c.grass);
    isl.leafMat.color.copy(c.canopy);
    isl.pineMat.color.copy(c.pine);
    isl.cherryMat.color.copy(c.cherry);
    isl.grassMat.color.copy(c.canopy).lerp(new THREE.Color('#d7d2a8'), 0.25);
    isl.waterMat.uniforms.uDeep.value.copy(c.waterDeep);
    isl.waterMat.uniforms.uShallow.value.copy(c.waterShallow);
    isl.lakeMat.uniforms.uDeep.value.copy(c.waterDeep);
    isl.lakeMat.uniforms.uShallow.value.copy(c.waterShallow);
    isl.waterfallMat.uniforms.uColor.value.copy(c.waterShallow).lerp(new THREE.Color('#ffffff'), 0.32);
    isl.snowMaterial.opacity = c.groundSnow;
    isl.snowGround.visible = c.groundSnow > 0.02;
    const winter = this.season.id === 'winter';
    isl.flowerHeads.visible = !winter && c.groundSnow < 0.3;
    isl.flowerStems.visible = isl.flowerHeads.visible;

    for (const mat of this.buildings.glassMaterials) {
      if (mat.color) mat.color.copy(c.glassTint);
    }
    if (this.environment.cubeGlassMat) {
      this.environment.cubeGlassMat.uniforms.uTint.value.copy(c.cubeTint);
    }
    this.environment.mists.forEach((m) => {
      m.material.color.copy(c.glassTint).lerp(new THREE.Color('#c4d4e6'), 0.55);
    });
  }

  update(dt) {
    this.switchCooldown = Math.max(0, this.switchCooldown - dt);
    this.elapsed += dt;
    if (this.autoEnabled && this.elapsed > this.nextIn) {
      this.next();
    }

    const k = 1 - Math.exp(-1.15 * dt);
    const c = this.current;
    const t = this.target;
    for (const key of Object.keys(c)) {
      const v = c[key];
      const target = t[key];
      if (v instanceof THREE.Color) v.lerp(target, k);
      else c[key] = damp(v, target, 1.15, dt);
    }
    this.apply(dt, k);
  }

  get timeToNext() {
    return Math.max(0, this.nextIn - this.elapsed);
  }
}
