// ═══════════════════════════════════════════════════════════════════════════════
// VoiceManager - ElevenLabs TTS/STT Integration
// Unified voice handling using the standardized API client
// ═══════════════════════════════════════════════════════════════════════════════

import { apiClient } from './APIClient.js';

export class VoiceManager {
  constructor() {
    // API client reference
    this.api = apiClient;
    
    // Audio state
    this.audioContext = null;
    this.currentAudio = null;
    this.isPlaying = false;
    this.isMuted = false;
    
    // Recording state
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.recordingStartTime = 0;
    
    // Voice cache for performance
    this.voiceCache = new Map();
    this.maxCacheSize = 50;
    
    // Current language/character config
    this.currentLanguage = 'french';
    this.currentCharacter = 'amelie';
    
    // Event callbacks
    this.onRecordingStart = null;
    this.onRecordingStop = null;
    this.onPlaybackStart = null;
    this.onPlaybackEnd = null;
    this.onTranscription = null;
    this.onError = null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async initialize() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('🎤 VoiceManager initialized');
      return true;
    } catch (e) {
      console.error('Failed to initialize audio context:', e);
      this._emitError('Audio context initialization failed', e);
      return false;
    }
  }

  setLanguage(language, characterId = null) {
    this.currentLanguage = language;
    if (characterId) {
      this.currentCharacter = characterId;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // TEXT-TO-SPEECH
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Speak text with the current character's voice
   * @param {string} text - Text to speak
   * @param {object} options - Voice options
   */
  async speak(text, options = {}) {
    if (this.isMuted || !text) return;
    
    // Stop any currently playing audio
    this.stop();
    
    const {
      language = this.currentLanguage,
      characterId = this.currentCharacter,
      expression = null,
      useCache = true
    } = options;
    
    try {
      // Check cache first
      const cacheKey = `${text}_${language}_${characterId}_${expression}`;
      let audioBlob;
      
      if (useCache && this.voiceCache.has(cacheKey)) {
        audioBlob = this.voiceCache.get(cacheKey);
      } else {
        // Generate audio via API
        audioBlob = await this.api.speak(text, {
          characterId,
          expression,
          language
        });
        
        // Cache the result
        if (useCache && audioBlob) {
          this._cacheAudio(cacheKey, audioBlob);
        }
      }
      
      if (audioBlob) {
        await this.playBlob(audioBlob);
      }
      
    } catch (e) {
      console.error('TTS error:', e);
      this._emitError('Speech generation failed', e);
    }
  }

  /**
   * Stream text to speech for real-time playback
   * @param {string} text - Text to speak
   * @param {object} options - Voice options
   */
  async speakStream(text, options = {}) {
    if (this.isMuted || !text) return;
    
    this.stop();
    
    const {
      characterId = this.currentCharacter,
      expression = null
    } = options;
    
    try {
      const response = await this.api.speakStream(text, { characterId, expression });
      
      if (!response.body) {
        throw new Error('Streaming not supported');
      }
      
      // Play the stream
      const reader = response.body.getReader();
      const chunks = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      
      const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
      await this.playBlob(audioBlob);
      
    } catch (e) {
      console.error('TTS stream error:', e);
      // Fallback to regular TTS
      await this.speak(text, options);
    }
  }

  /**
   * Play audio from a blob
   * @param {Blob} audioBlob - Audio blob to play
   */
  async playBlob(audioBlob) {
    return new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      this.currentAudio = new Audio(audioUrl);
      this.isPlaying = true;
      
      if (this.onPlaybackStart) {
        this.onPlaybackStart();
      }
      
      this.currentAudio.onended = () => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
        if (this.onPlaybackEnd) {
          this.onPlaybackEnd();
        }
        resolve();
      };
      
      this.currentAudio.onerror = (e) => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
        reject(e);
      };
      
      this.currentAudio.play().catch(reject);
    });
  }

  /**
   * Play audio from URL
   * @param {string} audioUrl - URL of audio to play
   */
  async playUrl(audioUrl) {
    return new Promise((resolve, reject) => {
      this.currentAudio = new Audio(audioUrl);
      this.isPlaying = true;
      
      if (this.onPlaybackStart) {
        this.onPlaybackStart();
      }
      
      this.currentAudio.onended = () => {
        this.isPlaying = false;
        if (this.onPlaybackEnd) {
          this.onPlaybackEnd();
        }
        resolve();
      };
      
      this.currentAudio.onerror = (e) => {
        this.isPlaying = false;
        reject(e);
      };
      
      this.currentAudio.play().catch(reject);
    });
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
      this.isPlaying = false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SPEECH-TO-TEXT (Recording)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Start recording user's voice
   */
  async startRecording() {
    if (this.isRecording) return false;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Determine supported MIME type
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }
      
      this.mediaRecorder = new MediaRecorder(stream, { mimeType });
      this.audioChunks = [];
      this.recordingStartTime = Date.now();
      this.isRecording = true;
      
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };
      
      this.mediaRecorder.start();
      
      if (this.onRecordingStart) {
        this.onRecordingStart();
      }
      
      return true;
      
    } catch (e) {
      console.error('Failed to start recording:', e);
      this._emitError('Microphone access denied', e);
      return false;
    }
  }

  /**
   * Stop recording and return audio blob
   * @returns {Promise<Blob|null>}
   */
  async stopRecording() {
    if (!this.isRecording || !this.mediaRecorder) {
      return null;
    }
    
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const duration = Date.now() - this.recordingStartTime;
        
        // Ignore very short recordings (< 500ms)
        if (duration < 500 || this.audioChunks.length === 0) {
          resolve(null);
          return;
        }
        
        const mimeType = this.mediaRecorder.mimeType;
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        
        // Stop all tracks
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        this.isRecording = false;
        this.audioChunks = [];
        
        if (this.onRecordingStop) {
          this.onRecordingStop();
        }
        
        resolve(audioBlob);
      };
      
      this.mediaRecorder.stop();
    });
  }

  /**
   * Cancel recording without returning audio
   */
  cancelRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.isRecording = false;
      this.audioChunks = [];
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // TRANSCRIPTION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Transcribe audio blob to text
   * @param {Blob} audioBlob - Audio to transcribe
   * @param {string} languageHint - Expected language
   * @returns {Promise<string|null>}
   */
  async transcribe(audioBlob, languageHint = null) {
    if (!audioBlob) return null;
    
    try {
      const result = await this.api.transcribe(audioBlob, languageHint || this.currentLanguage);
      
      const text = result.text || result.transcription;
      
      if (this.onTranscription && text) {
        this.onTranscription(text);
      }
      
      return text;
      
    } catch (e) {
      console.error('Transcription failed:', e);
      this._emitError('Transcription failed', e);
      return null;
    }
  }

  /**
   * Record and transcribe in one step
   * @param {number} maxDuration - Maximum recording duration in ms
   * @returns {Promise<string|null>}
   */
  async recordAndTranscribe(maxDuration = 10000) {
    const started = await this.startRecording();
    if (!started) return null;
    
    return new Promise((resolve) => {
      // Auto-stop after max duration
      const timeout = setTimeout(async () => {
        const blob = await this.stopRecording();
        if (blob) {
          const text = await this.transcribe(blob);
          resolve(text);
        } else {
          resolve(null);
        }
      }, maxDuration);
      
      // Allow manual stop
      this._recordingTimeout = timeout;
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // PRONUNCIATION ASSESSMENT
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Assess user's pronunciation
   * @param {Blob} audioBlob - User's recorded audio
   * @param {string} targetText - What they should have said
   * @param {string} language - Language code
   */
  async assessPronunciation(audioBlob, targetText, language = null) {
    if (!audioBlob || !targetText) return null;
    
    try {
      return await this.api.assessPronunciation(
        audioBlob,
        targetText,
        language || this.currentLanguage
      );
    } catch (e) {
      console.error('Pronunciation assessment failed:', e);
      return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // FULL CONVERSATION FLOW
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Full voice conversation turn:
   * 1. Record user
   * 2. Transcribe
   * 3. Get AI response
   * 4. Play response
   * 
   * @param {object} options - Conversation options
   * @returns {Promise<{transcription: string, response: string}>}
   */
  async voiceConversationTurn(options = {}) {
    const {
      language = this.currentLanguage,
      characterId = this.currentCharacter,
      difficultyLevel = 1,
      maxRecordingTime = 10000
    } = options;
    
    // Record user
    const started = await this.startRecording();
    if (!started) {
      throw new Error('Could not start recording');
    }
    
    // Wait for user to finish (they should call stopRecording externally)
    // Or auto-stop after maxRecordingTime
    await new Promise(resolve => setTimeout(resolve, maxRecordingTime));
    
    const audioBlob = await this.stopRecording();
    if (!audioBlob) {
      throw new Error('No audio recorded');
    }
    
    // Get full response with audio
    const result = await this.api.voiceConversationFull(audioBlob, {
      language,
      characterId,
      difficultyLevel
    });
    
    // Play response audio if available
    if (result.audio_url) {
      await this.playUrl(`http://localhost:8000${result.audio_url}`);
    }
    
    return {
      transcription: result.transcription,
      response: result.response,
      translation: result.translation,
      correction: result.correction,
      newVocabulary: result.new_vocabulary
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  getStatus() {
    return {
      isPlaying: this.isPlaying,
      isRecording: this.isRecording,
      isMuted: this.isMuted,
      currentLanguage: this.currentLanguage,
      currentCharacter: this.currentCharacter
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // INTERNAL HELPERS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  _cacheAudio(key, blob) {
    // Limit cache size
    if (this.voiceCache.size >= this.maxCacheSize) {
      const firstKey = this.voiceCache.keys().next().value;
      this.voiceCache.delete(firstKey);
    }
    this.voiceCache.set(key, blob);
  }

  _emitError(message, error) {
    if (this.onError) {
      this.onError({ message, error });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════════════
  
  dispose() {
    this.stop();
    this.cancelRecording();
    
    // Clear timeout if any
    if (this._recordingTimeout) {
      clearTimeout(this._recordingTimeout);
    }
    
    // Clear cache
    this.voiceCache.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export default VoiceManager;
