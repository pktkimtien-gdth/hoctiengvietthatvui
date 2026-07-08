/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Plays a cheerful, encouraging, and uplifting melody using the browser's native AudioContext.
 * Highly robust, handles autoplay blocks gracefully, and works across modern browsers without external assets.
 */
export function playSuccessMelody() {
  try {
    // Get AudioContext (supporting older prefixes just in case)
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Check if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Melodic notes: C5, E5, G5, C6 (Ascending C major arpeggio - classic sweet success sound)
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.12 },  // C5
      { freq: 659.25, time: 0.1, dur: 0.12 },  // E5
      { freq: 783.99, time: 0.2, dur: 0.12 },  // G5
      { freq: 1046.50, time: 0.3, dur: 0.35 }  // C6
    ];

    const now = ctx.currentTime;

    notes.forEach((note) => {
      // Create oscillator and gain node
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Use a friendly triangle wave (softer, like flute/marimba) rather than harsh square or saw waves
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, now + note.time);

      // Simple ADSR envelope for smooth sound
      gainNode.gain.setValueAtTime(0, now + note.time);
      // Fast attack
      gainNode.gain.linearRampToValueAtTime(0.2, now + note.time + 0.02);
      // Smooth decay/release
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);

      // Connect nodes
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Start and stop
      osc.start(now + note.time);
      osc.stop(now + note.time + note.dur);
    });

  } catch (error) {
    console.warn('Audio Context is not supported or was blocked by browser:', error);
  }
}

/**
 * Plays a bubbly correct answer sound for individual question success.
 */
export function playCorrectSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    
    // Quick dual-note sweep (E5 to G5)
    const notes = [
      { freq: 659.25, time: 0.0, dur: 0.08 },
      { freq: 783.99, time: 0.06, dur: 0.15 }
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now + note.time);
      
      gainNode.gain.setValueAtTime(0, now + note.time);
      gainNode.gain.linearRampToValueAtTime(0.15, now + note.time + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + note.time);
      osc.stop(now + note.time + note.dur);
    });
  } catch (e) {
    // Ignore error
  }
}

/**
 * Plays a soft error sound for wrong passcode or incorrect answers.
 */
export function playErrorSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    
    // Quick low frequency buzz
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  } catch (e) {
    // Ignore error
  }
}

