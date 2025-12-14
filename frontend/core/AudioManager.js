// ═══════════════════════════════════════════════════════════════════════════════
// AudioManager - Background Music & Ambient Sound System
// Handles wholesome country-specific music that plays quietly
// ═══════════════════════════════════════════════════════════════════════════════

export class AudioManager {
  constructor() {
    // Audio elements
    this.backgroundMusic = null;
    this.ambientSound = null;
    this.sfxPool = new Map();
    
    // Volume settings (0-1) - Very subtle background atmosphere
    this.musicVolume = 0.08;      // Background music - quiet radio
    this.ambientVolume = 0.04;    // Ambient sounds - barely there café atmosphere
    this.sfxVolume = 0.4;         // Sound effects
    this.masterVolume = 1.0;
    
    // State
    this.currentLanguage = null;
    this.isMuted = false;
    this.isInitialized = false;
    
    // Fade settings
    this.fadeTime = 2000; // 2 seconds crossfade
    
    // Music paths per language
    this.musicPaths = {
      french: '/sounds/music_french.mp3',
      german: '/sounds/music_german.mp3',
      spanish: '/sounds/music_spanish.mp3',
      italian: '/sounds/music_italian.mp3',
      japanese: '/sounds/music_japanese.mp3',
      mandarin: '/sounds/music_mandarin.mp3',
      polish: '/sounds/music_polish.mp3',
      english: '/sounds/music_english.mp3',
    };
    
    // Ambient paths per language
    this.ambientPaths = {
      french: '/sounds/ambient_french.mp3',
      german: '/sounds/ambient_german.mp3',
      spanish: '/sounds/ambient_spanish.mp3',
      italian: '/sounds/ambient_italian.mp3',
      japanese: '/sounds/ambient_japanese.mp3',
      mandarin: '/sounds/ambient_mandarin.mp3',
      polish: '/sounds/ambient_polish.mp3',
      english: '/sounds/ambient_english.mp3',
    };
    
    // Sound effects
    this.sfxPaths = {
      dialogue_open: '/sounds/dialogue_open.mp3',
      dialogue_advance: '/sounds/dialogue_advance.mp3',
      interact_prompt: '/sounds/interact_prompt.mp3',
      quest_complete: '/sounds/quest_complete.mp3',
      cat_meow: '/sounds/cat_meow.mp3',
      bird_chirp: '/sounds/bird_chirp.mp3',
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════

  async initialize() {
    if (this.isInitialized) return;
    
    // Preload sound effects
    for (const [name, path] of Object.entries(this.sfxPaths)) {
      try {
        const audio = new Audio(path);
        audio.preload = 'auto';
        this.sfxPool.set(name, audio);
      } catch (e) {
        console.warn(`Could not preload SFX: ${name}`, e);
      }
    }
    
    this.isInitialized = true;
    console.log('🎵 AudioManager initialized');
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // BACKGROUND MUSIC
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Play background music for a specific language/country
   * @param {string} language - Language code (french, german, etc.)
   * @param {boolean} crossfade - Whether to crossfade from current music
   */
  async playMusic(language, crossfade = true) {
    if (this.isMuted) return;
    
    const musicPath = this.musicPaths[language];
    if (!musicPath) {
      console.warn(`No music found for language: ${language}`);
      return;
    }
    
    // If same language, don't restart
    if (this.currentLanguage === language && this.backgroundMusic && !this.backgroundMusic.paused) {
      return;
    }
    
    // Crossfade from current music
    if (crossfade && this.backgroundMusic) {
      await this._fadeOut(this.backgroundMusic);
    }
    
    // Create new audio element
    this.backgroundMusic = new Audio(musicPath);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0;
    
    try {
      await this.backgroundMusic.play();
      await this._fadeIn(this.backgroundMusic, this.musicVolume * this.masterVolume);
      this.currentLanguage = language;
      console.log(`🎵 Playing ${language} music`);
    } catch (e) {
      console.warn('Could not play music (user interaction required):', e);
    }
  }

  /**
   * Play ambient sound for a specific language/country
   * @param {string} language - Language code
   */
  async playAmbient(language) {
    if (this.isMuted) return;
    
    const ambientPath = this.ambientPaths[language];
    if (!ambientPath) return;
    
    // Stop current ambient
    if (this.ambientSound) {
      await this._fadeOut(this.ambientSound);
    }
    
    this.ambientSound = new Audio(ambientPath);
    this.ambientSound.loop = true;
    this.ambientSound.volume = 0;
    
    try {
      await this.ambientSound.play();
      await this._fadeIn(this.ambientSound, this.ambientVolume * this.masterVolume);
    } catch (e) {
      console.warn('Could not play ambient:', e);
    }
  }

  /**
   * Start both music and ambient for a language
   * @param {string} language - Language code
   */
  async setLanguageAudio(language) {
    await Promise.all([
      this.playMusic(language),
      this.playAmbient(language)
    ]);
  }

  /**
   * Stop all background audio
   */
  async stopAll() {
    const promises = [];
    
    if (this.backgroundMusic) {
      promises.push(this._fadeOut(this.backgroundMusic));
    }
    if (this.ambientSound) {
      promises.push(this._fadeOut(this.ambientSound));
    }
    
    await Promise.all(promises);
    this.currentLanguage = null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SOUND EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Play a sound effect
   * @param {string} name - Sound effect name
   */
  playSFX(name) {
    if (this.isMuted) return;
    
    const audio = this.sfxPool.get(name);
    if (audio) {
      // Clone for overlapping playback
      const clone = audio.cloneNode();
      clone.volume = this.sfxVolume * this.masterVolume;
      clone.play().catch(() => {});
    }
  }

  /**
   * Play dialogue open sound
   */
  playDialogueOpen() {
    this.playSFX('dialogue_open');
  }

  /**
   * Play dialogue advance sound
   */
  playDialogueAdvance() {
    this.playSFX('dialogue_advance');
  }

  /**
   * Play interaction prompt sound
   */
  playInteractPrompt() {
    this.playSFX('interact_prompt');
  }

  /**
   * Play quest complete fanfare
   */
  playQuestComplete() {
    this.playSFX('quest_complete');
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // VOLUME CONTROLS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Set master volume (affects all audio)
   * @param {number} volume - 0-1
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this._updateVolumes();
  }

  /**
   * Set music volume
   * @param {number} volume - 0-1
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
    }
  }

  /**
   * Set ambient volume
   * @param {number} volume - 0-1
   */
  setAmbientVolume(volume) {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientSound) {
      this.ambientSound.volume = this.ambientVolume * this.masterVolume;
    }
  }

  /**
   * Set SFX volume
   * @param {number} volume - 0-1
   */
  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Toggle mute all audio
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      if (this.backgroundMusic) this.backgroundMusic.pause();
      if (this.ambientSound) this.ambientSound.pause();
    } else {
      if (this.backgroundMusic) this.backgroundMusic.play().catch(() => {});
      if (this.ambientSound) this.ambientSound.play().catch(() => {});
    }
    
    return this.isMuted;
  }

  /**
   * Set muted state
   * @param {boolean} muted
   */
  setMuted(muted) {
    if (this.isMuted !== muted) {
      this.toggleMute();
    }
  }

  _updateVolumes() {
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
    }
    if (this.ambientSound) {
      this.ambientSound.volume = this.ambientVolume * this.masterVolume;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // FADE UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════════

  _fadeIn(audio, targetVolume) {
    return new Promise((resolve) => {
      audio.volume = 0;
      const steps = 20;
      const stepTime = this.fadeTime / steps;
      const volumeStep = targetVolume / steps;
      let currentStep = 0;
      
      const fade = setInterval(() => {
        currentStep++;
        audio.volume = Math.min(targetVolume, volumeStep * currentStep);
        
        if (currentStep >= steps) {
          clearInterval(fade);
          audio.volume = targetVolume;
          resolve();
        }
      }, stepTime);
    });
  }

  _fadeOut(audio) {
    return new Promise((resolve) => {
      if (!audio || audio.paused) {
        resolve();
        return;
      }
      
      const startVolume = audio.volume;
      const steps = 20;
      const stepTime = this.fadeTime / steps;
      const volumeStep = startVolume / steps;
      let currentStep = 0;
      
      const fade = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(0, startVolume - (volumeStep * currentStep));
        
        if (currentStep >= steps) {
          clearInterval(fade);
          audio.pause();
          audio.currentTime = 0;
          resolve();
        }
      }, stepTime);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // STATUS
  // ═══════════════════════════════════════════════════════════════════════════════

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isMuted: this.isMuted,
      currentLanguage: this.currentLanguage,
      isMusicPlaying: this.backgroundMusic && !this.backgroundMusic.paused,
      isAmbientPlaying: this.ambientSound && !this.ambientSound.paused,
      volumes: {
        master: this.masterVolume,
        music: this.musicVolume,
        ambient: this.ambientVolume,
        sfx: this.sfxVolume
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════════════

  dispose() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
    }
    if (this.ambientSound) {
      this.ambientSound.pause();
      this.ambientSound = null;
    }
    this.sfxPool.clear();
    this.isInitialized = false;
  }
}

// Singleton instance
export const audioManager = new AudioManager();
export default audioManager;

