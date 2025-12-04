// ═══════════════════════════════════════════════════════════════════════════════
// VoiceManager - ElevenLabs TTS/STT Integration
// Handles all voice synthesis and recognition
// ═══════════════════════════════════════════════════════════════════════════════

export class VoiceManager {
  constructor() {
    // ElevenLabs configuration
    this.elevenLabsConfig = {
      model: 'eleven_multilingual_v2',
      defaultVoice: 'EXAVITQu4vr4xnSDxMaL', // Sarah
      stability: 0.6,
      similarityBoost: 0.8,
    };
    
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
    
    // Event callbacks
    this.onRecordingStart = null;
    this.onRecordingStop = null;
    this.onPlaybackStart = null;
    this.onPlaybackEnd = null;
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
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // TEXT-TO-SPEECH (ElevenLabs)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async speak(text, languageCode, voiceConfig = null) {
    if (this.isMuted || !text) return;
    
    // Stop any currently playing audio
    this.stop();
    
    try {
      // Get audio from backend (which calls ElevenLabs)
      const audioUrl = await this.generateSpeech(text, languageCode, voiceConfig);
      
      if (audioUrl) {
        await this.playAudio(audioUrl);
      }
    } catch (e) {
      console.error('TTS error:', e);
    }
  }

  async generateSpeech(text, languageCode, voiceConfig) {
    // Check cache first
    const cacheKey = `${text}_${languageCode}`;
    if (this.voiceCache.has(cacheKey)) {
      return this.voiceCache.get(cacheKey);
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: languageCode,
          voice_id: voiceConfig?.voiceId || this.elevenLabsConfig.defaultVoice,
          model: voiceConfig?.model || this.elevenLabsConfig.model,
          stability: voiceConfig?.stability || this.elevenLabsConfig.stability,
          similarity_boost: voiceConfig?.similarityBoost || this.elevenLabsConfig.similarityBoost,
        }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        
        // Cache the result
        this.voiceCache.set(cacheKey, audioUrl);
        
        // Limit cache size
        if (this.voiceCache.size > 50) {
          const firstKey = this.voiceCache.keys().next().value;
          URL.revokeObjectURL(this.voiceCache.get(firstKey));
          this.voiceCache.delete(firstKey);
        }
        
        return audioUrl;
      }
    } catch (e) {
      console.error('Speech generation failed:', e);
    }
    
    return null;
  }

  async playAudio(audioUrl) {
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
  
  async startRecording() {
    if (this.isRecording) return;
    
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
      return false;
    }
  }

  async stopRecording() {
    if (!this.isRecording || !this.mediaRecorder) {
      return null;
    }
    
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const duration = Date.now() - this.recordingStartTime;
        
        // Ignore very short recordings
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

  cancelRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.isRecording = false;
      this.audioChunks = [];
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // TRANSCRIPTION (ElevenLabs STT)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async transcribe(audioBlob) {
    if (!audioBlob) return null;
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      const response = await fetch('http://localhost:8000/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.text || data.transcription;
      }
    } catch (e) {
      console.error('Transcription failed:', e);
    }
    
    return null;
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
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════════════
  
  dispose() {
    this.stop();
    this.cancelRecording();
    
    // Clean up cached audio URLs
    this.voiceCache.forEach(url => URL.revokeObjectURL(url));
    this.voiceCache.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export default VoiceManager;

