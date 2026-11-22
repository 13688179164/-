/* ============================================================
   WebAudio interaction palette
   ============================================================ */

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.enabled = true;
    this.noise = null;
  }

  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.enabled ? 0.5 : 0;
    this.master.connect(this.ctx.destination);

    const len = this.ctx.sampleRate * 1.4;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this.noise = buf;
  }

  setEnabled(v) {
    this.enabled = v;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(v ? 0.5 : 0, this.ctx.currentTime, 0.05);
    }
  }

  tone(freq, dur = 0.15, type = 'sine', vol = 0.08, slide = null, delay = 0) {
    if (!this.ctx || !this.enabled) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  noiseBurst(dur = 0.45, vol = 0.05, freq = 900, q = 1.2) {
    if (!this.ctx || !this.enabled || !this.noise) return;
    const t0 = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, t0);
    filter.frequency.exponentialRampToValueAtTime(freq * 2.4, t0 + dur);
    filter.Q.value = q;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter).connect(gain).connect(this.master);
    src.start(t0);
    src.stop(t0 + dur + 0.05);
  }

  hover() { this.tone(1560, 0.05, 'sine', 0.022, 1280); }
  click() {
    this.tone(540, 0.08, 'triangle', 0.045, 480);
    this.tone(820, 0.12, 'sine', 0.03, 760, 0.03);
  }
  whoosh() { this.noiseBurst(0.7, 0.055, 420, 0.9); }
  step() {
    this.tone(660, 0.1, 'sine', 0.04);
    this.tone(990, 0.16, 'sine', 0.028, 940, 0.09);
  }
  success() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, 0.5, 'sine', 0.05, f * 1.002, i * 0.11));
    this.noiseBurst(0.9, 0.03, 1400, 2);
  }
  error() { this.tone(190, 0.22, 'sawtooth', 0.035, 140); }
  open() {
    this.tone(110, 0.55, 'sine', 0.035, 165);
    this.noiseBurst(0.55, 0.03, 300, 1);
  }
}
