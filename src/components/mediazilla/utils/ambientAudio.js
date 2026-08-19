// Web Audio Ambient Synthesizer for MediaZilla Menu Background Music
let audioCtx = null;
let masterGain = null;
let isPlaying = false;
let intervalId = null;

const romanticChords = [
  [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
  [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
  [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
  [196.00, 246.94, 293.66, 392.00]  // Gsus4 / G (G3, B3, D4, G4)
];

export function initAmbientAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
  }
}

export function startAmbientMenuMusic(volume = 0.2) {
  try {
    initAmbientAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (isPlaying) return;
    isPlaying = true;

    masterGain.gain.setValueAtTime(volume, audioCtx.currentTime);

    let chordIndex = 0;
    const playNextChord = () => {
      if (!isPlaying || !audioCtx) return;

      const chord = romanticChords[chordIndex % romanticChords.length];
      chordIndex++;

      chord.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Soft attack and slow warm decay
        const now = audioCtx.currentTime;
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.04 / chord.length, now + 1.2);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + i * 0.15);
        osc.stop(now + 6.0);
      });
    };

    playNextChord();
    intervalId = setInterval(playNextChord, 4500);
  } catch (err) {
    console.warn('Ambient audio could not start:', err);
  }
}

export function stopAmbientMenuMusic() {
  isPlaying = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    } catch {
      // Ignore
    }
  }
}

export function setAmbientVolume(vol) {
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), audioCtx.currentTime);
  }
}
