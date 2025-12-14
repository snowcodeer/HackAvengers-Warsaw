/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * REAL-TIME TRANSCRIPTION CLIENT
 * Connects to ElevenLabs-powered WebSocket for live word-by-word transcription
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class RealtimeTranscription {
    constructor(options = {}) {
        this.wsUrl = options.wsUrl || 'ws://localhost:8000/api/transcribe/realtime';
        this.language = options.language || null; // Auto-detect if null
        this.sampleRate = options.sampleRate || 16000;
        
        this.ws = null;
        this.mediaStream = null;
        this.audioContext = null;
        this.processor = null;
        this.isRecording = false;
        
        // Callbacks
        this.onPartialTranscript = options.onPartialTranscript || (() => {});
        this.onFinalTranscript = options.onFinalTranscript || (() => {});
        this.onError = options.onError || console.error;
        this.onConnected = options.onConnected || (() => {});
        this.onDisconnected = options.onDisconnected || (() => {});
    }

    /**
     * Start real-time transcription from microphone
     */
    async start() {
        try {
            // Request microphone access
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: this.sampleRate,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
            
            // Connect to WebSocket
            await this._connectWebSocket();
            
            // Set up audio processing
            await this._setupAudioProcessing();
            
            this.isRecording = true;
            console.log('🎤 Real-time transcription started');
            
        } catch (error) {
            this.onError(error);
            throw error;
        }
    }

    /**
     * Stop transcription and cleanup
     */
    async stop() {
        this.isRecording = false;
        
        // Send end of stream
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'eos' }));
            
            // Wait briefly for final transcripts
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.ws.close();
        }
        
        // Stop audio processing
        if (this.processor) {
            this.processor.disconnect();
            this.processor = null;
        }
        
        if (this.audioContext) {
            await this.audioContext.close();
            this.audioContext = null;
        }
        
        // Stop media stream
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
        
        console.log('🛑 Real-time transcription stopped');
    }

    /**
     * Update language configuration
     */
    setLanguage(language) {
        this.language = language;
        
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'config',
                language: this.language,
                sample_rate: this.sampleRate
            }));
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PRIVATE METHODS
    // ═══════════════════════════════════════════════════════════════════════════

    async _connectWebSocket() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.wsUrl);
            
            this.ws.onopen = () => {
                console.log('📡 WebSocket connected');
                
                // Send initial configuration
                this.ws.send(JSON.stringify({
                    type: 'config',
                    language: this.language,
                    sample_rate: this.sampleRate
                }));
            };
            
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this._handleMessage(data);
                
                // Resolve on connection confirmation
                if (data.type === 'connected' || data.type === 'config_updated') {
                    this.onConnected();
                    resolve();
                }
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.onError(error);
                reject(error);
            };
            
            this.ws.onclose = () => {
                console.log('📡 WebSocket disconnected');
                this.onDisconnected();
            };
        });
    }

    _handleMessage(data) {
        switch (data.type) {
            case 'partial':
                this.onPartialTranscript({
                    text: data.text || '',
                    words: data.words || [],
                    isFinal: false
                });
                break;
                
            case 'final':
                this.onFinalTranscript({
                    text: data.text || '',
                    words: data.words || [],
                    language: data.language,
                    isFinal: true
                });
                break;
                
            case 'utterance_end':
                // Utterance boundary detected
                break;
                
            case 'error':
                this.onError(new Error(data.message || 'Transcription error'));
                break;
                
            case 'connected':
            case 'config_updated':
            case 'eos_received':
                // Status messages
                console.log(`📡 ${data.type}: ${data.message || ''}`);
                break;
        }
    }

    async _setupAudioProcessing() {
        this.audioContext = new AudioContext({ sampleRate: this.sampleRate });
        
        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        
        // Use ScriptProcessor (deprecated but widely supported)
        // or AudioWorklet for modern browsers
        const bufferSize = 4096;
        this.processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
        
        this.processor.onaudioprocess = (event) => {
            if (!this.isRecording || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
                return;
            }
            
            // Get audio data
            const inputData = event.inputBuffer.getChannelData(0);
            
            // Convert Float32 to Int16 PCM
            const pcmData = this._float32ToInt16(inputData);
            
            // Convert to base64
            const base64Audio = this._arrayBufferToBase64(pcmData.buffer);
            
            // Send to server
            this.ws.send(JSON.stringify({
                type: 'audio',
                data: base64Audio
            }));
        };
        
        source.connect(this.processor);
        this.processor.connect(this.audioContext.destination);
    }

    _float32ToInt16(float32Array) {
        const int16Array = new Int16Array(float32Array.length);
        for (let i = 0; i < float32Array.length; i++) {
            const s = Math.max(-1, Math.min(1, float32Array[i]));
            int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return int16Array;
    }

    _arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// USAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════════

/*
// Initialize the transcription client
const transcriber = new RealtimeTranscription({
    wsUrl: 'ws://localhost:8000/api/transcribe/realtime',
    language: 'fr',  // French (or null for auto-detect)
    
    // Called with partial (in-progress) transcriptions
    onPartialTranscript: (result) => {
        document.getElementById('partialText').textContent = result.text;
    },
    
    // Called with final, confirmed transcriptions
    onFinalTranscript: (result) => {
        document.getElementById('finalText').textContent = result.text;
        console.log('Words:', result.words);
    },
    
    onError: (error) => {
        console.error('Transcription error:', error);
    },
    
    onConnected: () => {
        document.getElementById('status').textContent = '🟢 Connected';
    },
    
    onDisconnected: () => {
        document.getElementById('status').textContent = '🔴 Disconnected';
    }
});

// Start transcription (requires user gesture for microphone access)
document.getElementById('startBtn').onclick = async () => {
    await transcriber.start();
};

// Stop transcription
document.getElementById('stopBtn').onclick = async () => {
    await transcriber.stop();
};

// Change language mid-session
document.getElementById('languageSelect').onchange = (e) => {
    transcriber.setLanguage(e.target.value);
};
*/


// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RealtimeTranscription };
}

// Also attach to window for script tag usage
if (typeof window !== 'undefined') {
    window.RealtimeTranscription = RealtimeTranscription;
}

