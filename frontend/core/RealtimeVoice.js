// ═══════════════════════════════════════════════════════════════════════════════
// REALTIME VOICE - Speech Recognition via Backend API
// Records audio and sends to backend for transcription
// ═══════════════════════════════════════════════════════════════════════════════

// Get backend URL from environment or window config
const getBackendUrl = () => {
    if (typeof window !== 'undefined' && window.BACKEND_URL) {
        return window.BACKEND_URL;
    }
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL;
    }
    return 'http://localhost:8000';
};

export class RealtimeVoice {
    constructor() {
        this.mediaRecorder = null;
        this.audioContext = null;
        this.analyser = null;
        this.sourceNode = null;
        this.stream = null;
        this.audioChunks = [];
        
        // State
        this.isListening = false;
        this.currentTranscript = '';
        this.words = [];
        this.confidenceScores = [];
        
        // Callbacks
        this.onWordReceived = null;      // Called for each word with score
        this.onTranscriptUpdate = null;  // Called with full transcript
        this.onListeningStart = null;
        this.onListeningStop = null;
        this.onError = null;
        this.onAmplitudeUpdate = null;   // Called with amplitude for visualization
        
        // Settings
        this.language = 'en';
        this.sampleRate = 16000;
        this.backendUrl = getBackendUrl();
        
        // Amplitude visualization
        this.amplitudeData = new Uint8Array(256);
        this.animationFrame = null;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SET LANGUAGE
    // ═══════════════════════════════════════════════════════════════════════════
    setLanguage(langCode) {
        // Map our codes to language codes
        const langMap = {
            'french': 'fr',
            'fr': 'fr',
            'german': 'de',
            'de': 'de',
            'spanish': 'es',
            'es': 'es',
            'italian': 'it',
            'it': 'it',
            'japanese': 'ja',
            'ja': 'ja',
            'mandarin': 'zh',
            'zh': 'zh',
            'polish': 'pl',
            'pl': 'pl',
            'english': 'en',
            'en': 'en'
        };
        this.language = langMap[langCode] || 'en';
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // START LISTENING (Record audio)
    // ═══════════════════════════════════════════════════════════════════════════
    async startListening() {
        if (this.isListening) return;
        
        try {
            // Reset state
            this.currentTranscript = '';
            this.words = [];
            this.confidenceScores = [];
            this.audioChunks = [];
            
            // Get microphone access
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: this.sampleRate,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
            
            // Setup AudioContext for amplitude analysis
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: this.sampleRate
            });
            
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 512;
            this.analyser.smoothingTimeConstant = 0.8;
            this.amplitudeData = new Uint8Array(this.analyser.frequencyBinCount);
            
            this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);
            this.sourceNode.connect(this.analyser);
            
            // Start amplitude visualization
            this.startAmplitudeVisualization();
            
            // Setup MediaRecorder for audio capture
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
                ? 'audio/webm;codecs=opus' 
                : 'audio/webm';
            
            this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
            
            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.audioChunks.push(e.data);
                }
            };
            
            this.mediaRecorder.start(100); // Collect data every 100ms
            
            this.isListening = true;
            if (this.onListeningStart) this.onListeningStart();
            
            console.log('🎤 Recording started - speak now');
            
        } catch (error) {
            console.error('Failed to start listening:', error);
            if (this.onError) this.onError(error);
            this.cleanup();
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AMPLITUDE VISUALIZATION
    // ═══════════════════════════════════════════════════════════════════════════
    startAmplitudeVisualization() {
        const updateAmplitude = () => {
            if (!this.analyser || !this.isListening) return;
            
            this.analyser.getByteFrequencyData(this.amplitudeData);
            
            // Calculate average amplitude
            let sum = 0;
            for (let i = 0; i < this.amplitudeData.length; i++) {
                sum += this.amplitudeData[i];
            }
            const avgAmplitude = sum / this.amplitudeData.length;
            const normalizedAmplitude = avgAmplitude / 255;
            
            // Calculate peak amplitude
            const peakAmplitude = Math.max(...this.amplitudeData) / 255;
            
            // Callback with amplitude data
            if (this.onAmplitudeUpdate) {
                this.onAmplitudeUpdate({
                    average: normalizedAmplitude,
                    peak: peakAmplitude,
                    data: Array.from(this.amplitudeData),
                    isSpeaking: normalizedAmplitude > 0.1
                });
            }
            
            this.animationFrame = requestAnimationFrame(updateAmplitude);
        };
        
        updateAmplitude();
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STOP LISTENING AND TRANSCRIBE
    // ═══════════════════════════════════════════════════════════════════════════
    async stopListening() {
        if (!this.isListening) return;
        
        console.log('🛑 Stopping recording...');
        
        // Stop amplitude visualization
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Stop MediaRecorder and wait for final data
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            await new Promise((resolve) => {
                this.mediaRecorder.onstop = resolve;
                this.mediaRecorder.stop();
            });
        }
        
        this.isListening = false;
        
        // Send to backend for transcription
        if (this.audioChunks.length > 0) {
            await this.transcribeAudio();
        }
        
        this.cleanup();
        
        if (this.onListeningStop) {
            this.onListeningStop(this.currentTranscript, this.words);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // TRANSCRIBE AUDIO VIA BACKEND
    // ═══════════════════════════════════════════════════════════════════════════
    async transcribeAudio() {
        try {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            
            console.log('📤 Sending audio to backend for transcription...');
            
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            formData.append('language', this.language);
            
            const response = await fetch(`${this.backendUrl}/api/transcribe`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Transcription failed: ${response.status}`);
            }
            
            const result = await response.json();
            
            this.currentTranscript = result.text || result.transcription || '';
            
            // Parse words from transcript
            if (this.currentTranscript) {
                this.words = this.currentTranscript.split(/\s+/).filter(w => w).map((word, idx) => ({
                    text: word,
                    start: idx * 0.3,
                    end: (idx + 1) * 0.3,
                    confidence: result.confidence || 0.9,
                    isFinal: true
                }));
                
                // Notify about words
                this.words.forEach((word, idx) => {
                    if (this.onWordReceived) {
                        this.onWordReceived(word, idx);
                    }
                });
            }
            
            // Notify about transcript update
            if (this.onTranscriptUpdate) {
                this.onTranscriptUpdate(this.currentTranscript, this.words, true);
            }
            
            console.log('✅ Transcription complete:', this.currentTranscript);
            
        } catch (error) {
            console.error('Transcription error:', error);
            if (this.onError) this.onError(error);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CLEANUP RESOURCES
    // ═══════════════════════════════════════════════════════════════════════════
    cleanup() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        if (this.sourceNode) {
            this.sourceNode.disconnect();
            this.sourceNode = null;
        }
        
        if (this.analyser) {
            this.analyser.disconnect();
            this.analyser = null;
        }
        
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.mediaRecorder = null;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // GET RESULTS
    // ═══════════════════════════════════════════════════════════════════════════
    getTranscript() {
        return this.currentTranscript;
    }
    
    getWords() {
        return this.words;
    }
    
    getAverageConfidence() {
        if (this.words.length === 0) return 0;
        const sum = this.words.reduce((acc, w) => acc + (w.confidence || 0), 0);
        return sum / this.words.length;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // GET RECORDING BLOB
    // ═══════════════════════════════════════════════════════════════════════════
    getRecording() {
        if (this.audioChunks.length === 0) return null;
        return new Blob(this.audioChunks, { type: 'audio/webm' });
    }
}

// Singleton instance
export const realtimeVoice = new RealtimeVoice();

