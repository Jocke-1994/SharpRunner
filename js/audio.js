const AudioSfx = {
    ctx: null,
    init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
    play(type) {
        if (!gameSettings.sound) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        const now = this.ctx.currentTime;
        if (type === 'turn') {
            let baseFreq = 400;
            let freq = Math.min(800, baseFreq + (turnCombo * 20));
            osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(Math.max(100, freq - 300), now + 0.1);
            gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.1);
            osc.start(); osc.stop(now + 0.1);
        } else if (type === 'jump') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(600, now + 0.1);
            gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.1);
            osc.start(); osc.stop(now + 0.1);
        } else if (type === 'fail') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(120, now);
            osc.frequency.linearRampToValueAtTime(40, now + 0.3);
            gain.gain.setValueAtTime(0.2, now); gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(); osc.stop(now + 0.3);
        } else if (type === 'win') {
            osc.type = 'square'; osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
            gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.start(); osc.stop(now + 0.4);
        }
    }
};
