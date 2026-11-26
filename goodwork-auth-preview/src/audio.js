/**
 * WebAudio 合成音效与氛围声
 */
export class AudioEngine {
  constructor() {
    this.ready = false;
    this.muted = false;
    this.lastHover = 0;
    this.season = 'spring';
    this.rainGain = null;
    this.rainFilter = null;
    this.master = null;
    this.ctx = null;
  }

  init() {
    if (this.ready) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      const ctx = new Ctx();
      this.ctx = ctx;
      this.master = ctx.createGain();
      this.master.gain.value = 0.7;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 3;
      this.master.connect(comp);
      comp.connect(ctx.destination);

      // 简易混响
      const convolver = ctx.createConvolver();
      const len = ctx.sampleRate * 3.2;
      const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = impulse.getChannelData(ch);
        for (let i = 0; i < len; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
        }
      }
      convolver.buffer = impulse;
      const wet = ctx.createGain();
      wet.gain.value = 0.32;
      convolver.connect(wet);
      wet.connect(this.master);
      this.reverb = convolver;

      // 氛围低音 pad
      const padFilter = ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.value = 520;
      padFilter.Q.value = 0.7;
      const padGain = ctx.createGain();
      padGain.gain.value = 0.045;
      padFilter.connect(padGain);
      padGain.connect(this.master);
      const send = ctx.createGain();
      send.gain.value = 0.45;
      padGain.connect(send);
      send.connect(convolver);
      const notes = [73.42, 110.0, 146.83, 174.61];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = f;
        osc.detune.value = (i - 1.5) * 5;
        const g = ctx.createGain();
        g.gain.value = i === 0 ? 0.34 : 0.13;
        osc.connect(g);
        g.connect(padFilter);
        osc.start();
        // 缓慢呼吸
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.02 + i * 0.011;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = i === 0 ? 3 : 5;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.detune);
        lfo.start();
      });

      // 风噪
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const nd = noiseBuffer.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      const wind = ctx.createBufferSource();
      wind.buffer = noiseBuffer;
      wind.loop = true;
      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.value = 420;
      const windGain = ctx.createGain();
      windGain.gain.value = 0.02;
      wind.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(this.master);
      wind.start();

      // 雨噪
      const rain = ctx.createBufferSource();
      rain.buffer = noiseBuffer;
      rain.loop = true;
      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'bandpass';
      rainFilter.frequency.value = 2100;
      rainFilter.Q.value = 0.55;
      const rainGain = ctx.createGain();
      rainGain.gain.value = 0;
      rain.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(this.master);
      rain.start();
      this.rainGain = rainGain;
      this.rainFilter = rainFilter;

      this.ready = true;
      if (ctx.state === 'suspended') ctx.resume();
      if (this.muted) this.master.gain.value = 0.0001;
      this.setSeason(this.season);
    } catch (err) {
      console.warn('Audio init failed', err);
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (!this.ready) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.linearRampToValueAtTime(muted ? 0.0001 : 0.7, now + 0.4);
  }

  setSeason(id) {
    this.season = id;
    if (!this.ready) return;
    const now = this.ctx.currentTime;
    if (this.rainGain) {
      this.rainGain.gain.cancelScheduledValues(now);
      this.rainGain.gain.linearRampToValueAtTime(id === 'summer' ? 0.035 : 0, now + 1.8);
    }
    if (this.rainFilter) {
      this.rainFilter.frequency.cancelScheduledValues(now);
      this.rainFilter.frequency.linearRampToValueAtTime(id === 'summer' ? 2300 : 1400, now + 1.2);
    }
  }

  tone(freq, duration = 0.2, type = 'sine', gain = 0.05, when = 0, slideTo = null) {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(g);
    g.connect(this.master);
    if (this.reverb) {
      const send = ctx.createGain();
      send.gain.value = 0.35;
      g.connect(send);
      send.connect(this.reverb);
    }
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  hover() {
    if (!this.ready) return;
    const now = performance.now();
    if (now - this.lastHover < 90) return;
    this.lastHover = now;
    this.tone(1280, 0.07, 'sine', 0.018);
  }

  click() {
    this.tone(620, 0.16, 'triangle', 0.045);
    this.tone(930, 0.22, 'sine', 0.028, 0.04);
  }

  open() {
    this.tone(146.8, 0.8, 'sine', 0.06);
    this.tone(220, 0.9, 'triangle', 0.035, 0.08);
    this.tone(440, 0.6, 'sine', 0.018, 0.16);
  }

  close() {
    this.tone(330, 0.28, 'sine', 0.025, 0, 220);
  }

  seasonChange() {
    this.tone(523.25, 0.6, 'sine', 0.028, 0.02);
    this.tone(659.25, 0.8, 'sine', 0.02, 0.12);
    this.tone(783.99, 1.0, 'triangle', 0.014, 0.22);
  }

  submit() {
    const notes = [392, 523.25, 659.25, 783.99];
    notes.forEach((n, i) => this.tone(n, 0.5, 'triangle', 0.03, i * 0.08));
  }

  approve() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => this.tone(n, 0.9, 'sine', 0.035, i * 0.1));
    this.tone(261.63, 1.6, 'triangle', 0.03, 0.05);
  }

  collect() {
    this.tone(880, 0.18, 'triangle', 0.03);
    this.tone(1174.66, 0.3, 'sine', 0.022, 0.07);
  }

  error() {
    this.tone(160, 0.32, 'sawtooth', 0.02);
  }
}
