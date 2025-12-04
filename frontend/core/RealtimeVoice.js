// ═══════════════════════════════════════════════════════════════════════════════
// REALTIME VOICE - ElevenLabs Scribe v2 WebSocket Real-time Speech Recognition
// Words appear as you speak with confidence scores
// ═══════════════════════════════════════════════════════════════════════════════

// Get API key from environment or window config
const getApiKey = () => {
    // Try window config first (set by lingua-world.js)
    if (typeof window !== 'undefined' && window.ELEVENLABS_API_KEY) {
        return window.ELEVENLABS_API_KEY;
    }
    // Try Vite env
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ELEVENLABS_API_KEY) {
        return import.meta.env.VITE_ELEVENLABS_API_KEY;
    }
    return '';
};

export class RealtimeVoice {
    constructor() {
        this.ws = null;
        this.mediaRecorder = null;
        this.audioContext = null;
        this.workletNode = null;
        this.sourceNode = null;
        this.stream = null;
        
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
        
        // Settings
        this.language = 'en';
        this.sampleRate = 16000;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SET LANGUAGE
    // ═══════════════════════════════════════════════════════════════════════════
    setLanguage(langCode) {
        // Map our codes to ElevenLabs language codes
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
    // START REAL-TIME LISTENING
    // ═══════════════════════════════════════════════════════════════════════════
    async startListening() {
        if (this.isListening) return;
        
        try {
            // Reset state
            this.currentTranscript = '';
            this.words = [];
            this.confidenceScores = [];
            
            // Get microphone access
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: this.sampleRate,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
            
            // Setup AudioContext for raw PCM data
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: this.sampleRate
            });
            
            // Connect WebSocket to ElevenLabs Scribe v2 Realtime
            await this.connectWebSocket();
            
            // Setup audio processing
            await this.setupAudioProcessing();
            
            this.isListening = true;
            if (this.onListeningStart) this.onListeningStart();
            
            console.log('🎤 Real-time listening started');
            
        } catch (error) {
            console.error('Failed to start real-time listening:', error);
            if (this.onError) this.onError(error);
            this.cleanup();
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CONNECT WEBSOCKET TO ELEVENLABS
    // ═══════════════════════════════════════════════════════════════════════════
    connectWebSocket() {
        return new Promise((resolve, reject) => {
            const wsUrl = `wss://api.elevenlabs.io/v1/speech-to-text/realtime?model_id=scribe_v1&language_code=${this.language}`;
            
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('🔌 ElevenLabs WebSocket connected');
                
                // Send initial configuration
                this.ws.send(JSON.stringify({
                    type: 'config',
                    xi_api_key: getApiKey(),
                    audio_format: 'pcm_16000',
                    include_timestamps: true,
                    include_confidence: true,
                    language_code: this.language
                }));
                
                resolve();
            };
            
            this.ws.onmessage = (event) => {
                this.handleWebSocketMessage(event);
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                if (this.onError) this.onError(error);
                reject(error);
            };
            
            this.ws.onclose = (event) => {
                console.log('🔌 WebSocket closed:', event.code, event.reason);
                if (this.isListening) {
                    this.stopListening();
                }
            };
        });
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HANDLE WEBSOCKET MESSAGES
    // ═══════════════════════════════════════════════════════════════════════════
    handleWebSocketMessage(event) {
        try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
                case 'transcript':
                case 'partial_transcript':
                    // Partial transcript (words appearing as spoken)
                    this.handlePartialTranscript(data);
                    break;
                    
                case 'committed_transcript':
                case 'committed_transcript_with_timestamps':
                    // Final committed transcript with timestamps
                    this.handleFinalTranscript(data);
                    break;
                    
                case 'word':
                case 'word_with_confidence':
                    // Individual word with confidence
                    this.handleWord(data);
                    break;
                    
                case 'error':
                    console.error('ElevenLabs error:', data.message);
                    if (this.onError) this.onError(new Error(data.message));
                    break;
                    
                default:
                    console.log('📨 Received:', data.type, data);
            }
            
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HANDLE PARTIAL TRANSCRIPT (REAL-TIME)
    // ═══════════════════════════════════════════════════════════════════════════
    handlePartialTranscript(data) {
        const text = data.text || data.transcript || '';
        this.currentTranscript = text;
        
        // Extract words if available
        if (data.words && Array.isArray(data.words)) {
            data.words.forEach(wordData => {
                const word = {
                    text: wordData.word || wordData.text,
                    start: wordData.start || wordData.start_time,
                    end: wordData.end || wordData.end_time,
                    confidence: wordData.confidence || 0.9,
                    isNew: true
                };
                
                // Check if we already have this word
                const existingIndex = this.words.findIndex(w => 
                    w.start === word.start && w.text === word.text
                );
                
                if (existingIndex === -1) {
                    this.words.push(word);
                    
                    // Callback for new word
                    if (this.onWordReceived) {
                        this.onWordReceived(word, this.words.length - 1);
                    }
                }
            });
        }
        
        // Callback for transcript update
        if (this.onTranscriptUpdate) {
            this.onTranscriptUpdate(this.currentTranscript, this.words, false);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HANDLE FINAL TRANSCRIPT
    // ═══════════════════════════════════════════════════════════════════════════
    handleFinalTranscript(data) {
        const text = data.text || data.transcript || '';
        this.currentTranscript = text;
        
        // Process final words with timestamps
        if (data.words && Array.isArray(data.words)) {
            this.words = data.words.map(wordData => ({
                text: wordData.word || wordData.text,
                start: wordData.start || wordData.start_time,
                end: wordData.end || wordData.end_time,
                confidence: wordData.confidence || 0.9,
                isFinal: true
            }));
        }
        
        // Callback for final transcript
        if (this.onTranscriptUpdate) {
            this.onTranscriptUpdate(this.currentTranscript, this.words, true);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HANDLE INDIVIDUAL WORD
    // ═══════════════════════════════════════════════════════════════════════════
    handleWord(data) {
        const word = {
            text: data.word || data.text,
            start: data.start || data.start_time || 0,
            end: data.end || data.end_time || 0,
            confidence: data.confidence || 0.9,
            isNew: true
        };
        
        this.words.push(word);
        this.currentTranscript += (this.currentTranscript ? ' ' : '') + word.text;
        
        if (this.onWordReceived) {
            this.onWordReceived(word, this.words.length - 1);
        }
        
        if (this.onTranscriptUpdate) {
            this.onTranscriptUpdate(this.currentTranscript, this.words, false);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SETUP AUDIO PROCESSING (SEND RAW PCM TO WEBSOCKET)
    // ═══════════════════════════════════════════════════════════════════════════
    async setupAudioProcessing() {
        // Create source from microphone
        this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);
        
        // Use ScriptProcessor for compatibility (AudioWorklet preferred in production)
        const bufferSize = 4096;
        const scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
        
        scriptProcessor.onaudioprocess = (event) => {
            if (!this.isListening || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
                return;
            }
            
            const inputData = event.inputBuffer.getChannelData(0);
            
            // Convert Float32 to Int16 PCM
            const pcmData = this.float32ToInt16(inputData);
            
            // Send as base64
            const base64Audio = this.arrayBufferToBase64(pcmData.buffer);
            
            this.ws.send(JSON.stringify({
                type: 'input_audio_chunk',
                audio: base64Audio
            }));
        };
        
        this.sourceNode.connect(scriptProcessor);
        scriptProcessor.connect(this.audioContext.destination);
        
        this.workletNode = scriptProcessor;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY: CONVERT FLOAT32 TO INT16
    // ═══════════════════════════════════════════════════════════════════════════
    float32ToInt16(float32Array) {
        const int16Array = new Int16Array(float32Array.length);
        for (let i = 0; i < float32Array.length; i++) {
            const s = Math.max(-1, Math.min(1, float32Array[i]));
            int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return int16Array;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY: ARRAY BUFFER TO BASE64
    // ═══════════════════════════════════════════════════════════════════════════
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STOP LISTENING
    // ═══════════════════════════════════════════════════════════════════════════
    stopListening() {
        if (!this.isListening) return;
        
        console.log('🛑 Stopping real-time listening');
        
        // Send end of stream
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'end_of_stream' }));
        }
        
        this.cleanup();
        this.isListening = false;
        
        if (this.onListeningStop) {
            this.onListeningStop(this.currentTranscript, this.words);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CLEANUP RESOURCES
    // ═══════════════════════════════════════════════════════════════════════════
    cleanup() {
        if (this.workletNode) {
            this.workletNode.disconnect();
            this.workletNode = null;
        }
        
        if (this.sourceNode) {
            this.sourceNode.disconnect();
            this.sourceNode = null;
        }
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
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
}

// Singleton instance
export const realtimeVoice = new RealtimeVoice();

