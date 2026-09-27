/**
 * Web Audio API synthesizer & Gemini Neural TTS Voice Engine for Salon d'Emma
 */

export type VoiceMode = 'ai' | 'webspeech' | 'off';

class LoungeSoundManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: number | null = null;

  // Active audio elements for speech
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;
  private audioCache: Map<string, string> = new Map();

  // Settings
  private voiceMode: VoiceMode = 'ai';
  private selectedAiVoice: string = 'Kore'; // 'Kore' or 'Zephyr'
  private volume: number = 0.9;

  // Listeners
  private onSpeakingChangeCallbacks: Set<(speaking: boolean) => void> = new Set();

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Subscribe to speaking state changes
  onSpeakingChange(callback: (speaking: boolean) => void) {
    this.onSpeakingChangeCallbacks.add(callback);
    return () => {
      this.onSpeakingChangeCallbacks.delete(callback);
    };
  }

  private setSpeaking(speaking: boolean) {
    this.isSpeaking = speaking;
    this.onSpeakingChangeCallbacks.forEach((cb) => cb(speaking));
  }

  getSpeakingStatus() {
    return this.isSpeaking;
  }

  setVoiceMode(mode: VoiceMode) {
    this.voiceMode = mode;
    if (mode === 'off') {
      this.stopSpeech();
    }
  }

  getVoiceMode(): VoiceMode {
    return this.voiceMode;
  }

  setAiVoice(voiceName: string) {
    this.selectedAiVoice = voiceName;
  }

  getAiVoice(): string {
    return this.selectedAiVoice;
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  // Play crystal champagne glass toast clink
  playGlassClink() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(3200, now);
      osc1.frequency.exponentialRampToValueAtTime(3180, now + 1.2);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(6420, now);
      osc2.frequency.exponentialRampToValueAtTime(6380, now + 0.8);

      gain.gain.setValueAtTime(0.3 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  // Play champagne cork pop & sparkle fizz
  playChampagnePop() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Pop thump
      const osc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      popGain.gain.setValueAtTime(0.8 * this.volume, now);
      popGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(popGain);
      popGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);

      // Sparkle fizz (filtered noise)
      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(4500, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(0.2 * this.volume, now + 0.05);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now + 0.05);
      noise.stop(now + 1.6);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  // Play subtle interaction chime
  playSoftChime() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [1046.5, 1318.5, 1567.98]; // C6, E6, G6

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.12 * this.volume, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.6);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  // Toggle ambient jazz lounge chords loop
  toggleBgm(enable: boolean) {
    this.initContext();
    if (!this.ctx) return;

    if (!enable) {
      this.isBgmPlaying = false;
      if (this.bgmIntervalId) {
        clearInterval(this.bgmIntervalId);
        this.bgmIntervalId = null;
      }
      return;
    }

    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    const chords = [
      [174.61, 261.63, 329.63, 392.00, 440.00],
      [146.83, 220.00, 261.63, 329.63, 349.23],
      [196.00, 293.66, 349.23, 440.00, 466.16],
      [130.81, 196.00, 233.08, 293.66, 329.63],
    ];

    let chordIndex = 0;

    const playChord = () => {
      if (!this.isBgmPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const chord = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      chord.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const filter = this.ctx!.createBiquadFilter();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);

        gain.gain.setValueAtTime(0, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.02 * this.volume, now + i * 0.05 + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + 3.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + 4.0);
      });
    };

    playChord();
    this.bgmIntervalId = window.setInterval(playChord, 4000);
  }

  // Stop any active speech
  stopSpeech() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.setSpeaking(false);
  }

  // Primary speech function that delegates to Neural AI TTS or fallback
  async speak(text: string, mood?: string): Promise<void> {
    if (this.voiceMode === 'off') return;

    this.stopSpeech();

    // Clean text of parenthesis or emojis
    const cleanText = text.replace(/（.*?）|\(.*?\)|『.*?』|\*.*?\*/g, '').trim();
    if (!cleanText) return;

    if (this.voiceMode === 'ai') {
      try {
        await this.playNeuralAiSpeech(cleanText, mood);
        return;
      } catch (err) {
        console.warn('Gemini Neural TTS failed, falling back to Web Speech:', err);
        // Fallback to Web Speech if Gemini TTS fails
        this.playWebSpeech(cleanText);
      }
    } else if (this.voiceMode === 'webspeech') {
      this.playWebSpeech(cleanText);
    }
  }

  // Play high-fidelity neural voice using Gemini TTS (/api/tts)
  private async playNeuralAiSpeech(text: string, mood?: string): Promise<void> {
    const cacheKey = `${this.selectedAiVoice}:${mood || 'neutral'}:${text}`;
    let audioDataUri = this.audioCache.get(cacheKey);

    if (!audioDataUri) {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          mood: mood || 'neutral',
          voiceName: this.selectedAiVoice,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS server responded with ${response.status}`);
      }

      const data = await response.json();
      if (!data.success || !data.audio) {
        throw new Error('TTS returned no audio');
      }

      const mime = data.mimeType || 'audio/wav';
      audioDataUri = `data:${mime};base64,${data.audio}`;
      this.audioCache.set(cacheKey, audioDataUri);
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio(audioDataUri);
      audio.volume = this.volume;
      this.currentAudio = audio;
      this.setSpeaking(true);

      audio.onended = () => {
        this.setSpeaking(false);
        this.currentAudio = null;
        resolve();
      };

      audio.onerror = (e) => {
        this.setSpeaking(false);
        this.currentAudio = null;
        reject(e);
      };

      audio.play().catch((err) => {
        this.setSpeaking(false);
        this.currentAudio = null;
        reject(err);
      });
    });
  }

  // Fallback Web Speech with improved voice matching & natural speed
  private playWebSpeech(cleanText: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.pitch = 1.1;
    utterance.rate = 1.0;
    utterance.volume = this.volume;

    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural Japanese voices
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('ja') &&
        (v.name.includes('Natural') ||
          v.name.includes('Otoya') ||
          v.name.includes('Kyoko') ||
          v.name.includes('Nanami') ||
          v.name.includes('Ayumi') ||
          v.name.includes('Google 日本語') ||
          v.name.includes('Haruka'))
    );

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    this.setSpeaking(true);

    utterance.onend = () => {
      this.setSpeaking(false);
    };

    utterance.onerror = () => {
      this.setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }
}

export const loungeAudio = new LoungeSoundManager();
