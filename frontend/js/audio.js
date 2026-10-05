/**
 * QuizPulse Elite - Sound Engine
 * Synthesized audio using Web Audio API (Zero external assets, instant response, 100% offline & deploy safe)
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('quizpulse_muted') === 'true';
    this.initialized = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.initialized = true;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('quizpulse_muted', this.muted);
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1, startTime = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime + startTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(gainVal, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  playClick() {
    this.playTone(800, 'triangle', 0.04, 0.05);
  }

  playCorrect() {
    if (this.muted) return;
    this.init();
    // Harmonious major arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.22, 0.08, idx * 0.06);
    });
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    // Low minor dissonance
    this.playTone(220, 'sawtooth', 0.25, 0.08, 0);
    this.playTone(207.65, 'sawtooth', 0.25, 0.08, 0.08);
  }

  playStreak(streakCount) {
    if (this.muted) return;
    this.init();
    // Higher pitch flourish depending on streak
    const base = 440 + Math.min(streakCount * 50, 400);
    this.playTone(base, 'triangle', 0.15, 0.08, 0);
    this.playTone(base * 1.25, 'triangle', 0.18, 0.08, 0.08);
    this.playTone(base * 1.5, 'triangle', 0.25, 0.1, 0.16);
  }

  playTimerTick() {
    this.playTone(600, 'sine', 0.03, 0.02);
  }

  playWarningTick() {
    this.playTone(880, 'square', 0.08, 0.05);
  }

  playLifeline() {
    if (this.muted) return;
    this.init();
    // Ascending whoosh
    [300, 450, 600, 900].forEach((freq, i) => {
      this.playTone(freq, 'sine', 0.12, 0.06, i * 0.04);
    });
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    const chords = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 0.1 },
      { f: 783.99, t: 0.2 },
      { f: 1046.5, t: 0.35 },
      { f: 1318.5, t: 0.55 },
      { f: 1567.98, t: 0.75 }
    ];
    chords.forEach(c => {
      this.playTone(c.f, 'triangle', 0.4, 0.09, c.t);
    });
  }
}

const sounds = new SoundEngine();
