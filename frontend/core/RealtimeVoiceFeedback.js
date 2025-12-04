// ═══════════════════════════════════════════════════════════════════════════════
// REALTIME VOICE FEEDBACK - Complete pronunciation training system
// - Real-time amplitude visualization (mic check)
// - Word-by-word transcription with error detection
// - Pronunciation scoring and feedback
// - "How it should sound" playback via ElevenLabs
// ═══════════════════════════════════════════════════════════════════════════════

export class RealtimeVoiceFeedback {
    constructor() {
        // Audio context and nodes
        this.audioContext = null;
        this.analyser = null;
        this.sourceNode = null;
        this.stream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        
        // WebSocket for real-time transcription
        this.ws = null;
        
        // State
        this.isListening = false;
        this.isRecording = false;
        this.expectedText = '';
        this.transcribedWords = [];
        this.pronunciationErrors = [];
        
        // Amplitude visualization
        this.amplitudeData = new Uint8Array(256);
        this.animationFrame = null;
        
        // Callbacks
        this.onAmplitudeUpdate = null;
        this.onWordTranscribed = null;
        this.onPronunciationError = null;
        this.onTranscriptComplete = null;
        this.onMicConnected = null;
        this.onError = null;
        
        // Settings
        this.language = 'en';
        this.sampleRate = 16000;
        
        // ElevenLabs config
        this.elevenLabsApiKey = '';
        this.voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Default: Sarah
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INITIALIZE WITH API KEY
    // ═══════════════════════════════════════════════════════════════════════════
    init(apiKey, voiceId = null) {
        this.elevenLabsApiKey = apiKey || window.ELEVENLABS_API_KEY || '';
        if (voiceId) this.voiceId = voiceId;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SET LANGUAGE
    // ═══════════════════════════════════════════════════════════════════════════
    setLanguage(langCode) {
        const langMap = {
            'french': 'fr', 'fr': 'fr',
            'german': 'de', 'de': 'de',
            'spanish': 'es', 'es': 'es',
            'italian': 'it', 'it': 'it',
            'japanese': 'ja', 'ja': 'ja',
            'mandarin': 'zh', 'zh': 'zh',
            'polish': 'pl', 'pl': 'pl',
            'english': 'en', 'en': 'en'
        };
        this.language = langMap[langCode] || 'en';
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SET EXPECTED TEXT (what user should say)
    // ═══════════════════════════════════════════════════════════════════════════
    setExpectedText(text) {
        this.expectedText = text;
        this.expectedWords = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // START LISTENING WITH AMPLITUDE FEEDBACK
    // ═══════════════════════════════════════════════════════════════════════════
    async startListening(shouldRecord = true) {
        if (this.isListening) return;
        
        try {
            // Reset state
            this.transcribedWords = [];
            this.pronunciationErrors = [];
            this.recordedChunks = [];
            
            // Get microphone
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: this.sampleRate,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            
            // Setup audio context for amplitude analysis
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
            
            // Mic connected callback
            if (this.onMicConnected) {
                this.onMicConnected(true);
            }
            
            // Setup recording if requested
            if (shouldRecord) {
                this.setupRecording();
            }
            
            // Connect to ElevenLabs for real-time transcription
            await this.connectTranscriptionWebSocket();
            
            // Setup audio processing for WebSocket
            this.setupAudioProcessing();
            
            this.isListening = true;
            console.log('🎤 Real-time voice feedback started');
            
        } catch (error) {
            console.error('Failed to start listening:', error);
            if (this.onError) this.onError(error);
            if (this.onMicConnected) this.onMicConnected(false);
            this.cleanup();
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AMPLITUDE VISUALIZATION (shows mic is working)
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
            const normalizedAmplitude = avgAmplitude / 255; // 0-1 range
            
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
    // SETUP RECORDING
    // ═══════════════════════════════════════════════════════════════════════════
    setupRecording() {
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
            ? 'audio/webm;codecs=opus' 
            : 'audio/webm';
            
        this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
        this.recordedChunks = [];
        
        this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                this.recordedChunks.push(e.data);
            }
        };
        
        this.mediaRecorder.start(100); // Collect data every 100ms
        this.isRecording = true;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CONNECT TO ELEVENLABS TRANSCRIPTION WEBSOCKET
    // ═══════════════════════════════════════════════════════════════════════════
    connectTranscriptionWebSocket() {
        return new Promise((resolve, reject) => {
            const wsUrl = `wss://api.elevenlabs.io/v1/speech-to-text/realtime?model_id=scribe_v1&language_code=${this.language}`;
            
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('🔌 Transcription WebSocket connected');
                
                // Send config
                this.ws.send(JSON.stringify({
                    type: 'config',
                    xi_api_key: this.elevenLabsApiKey,
                    audio_format: 'pcm_16000',
                    include_timestamps: true,
                    include_word_confidence: true,
                    language_code: this.language
                }));
                
                resolve();
            };
            
            this.ws.onmessage = (event) => this.handleTranscriptionMessage(event);
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };
            
            this.ws.onclose = () => {
                console.log('WebSocket closed');
            };
        });
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HANDLE TRANSCRIPTION MESSAGES
    // ═══════════════════════════════════════════════════════════════════════════
    handleTranscriptionMessage(event) {
        try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'transcript' || data.type === 'partial_transcript' || 
                data.type === 'committed_transcript' || data.type === 'committed_transcript_with_timestamps') {
                
                // Process words
                if (data.words && Array.isArray(data.words)) {
                    data.words.forEach((wordData, idx) => {
                        const word = {
                            text: wordData.word || wordData.text || '',
                            confidence: wordData.confidence || 0.9,
                            start: wordData.start || wordData.start_time || 0,
                            end: wordData.end || wordData.end_time || 0,
                            isFinal: data.type.includes('committed')
                        };
                        
                        // Check if this word is new
                        const existingIdx = this.transcribedWords.findIndex(w => 
                            w.start === word.start && w.text === word.text
                        );
                        
                        if (existingIdx === -1 && word.text) {
                            // Check pronunciation against expected
                            const pronunciationResult = this.checkPronunciation(word, this.transcribedWords.length);
                            word.pronunciationResult = pronunciationResult;
                            
                            this.transcribedWords.push(word);
                            
                            // Callback for word transcribed
                            if (this.onWordTranscribed) {
                                this.onWordTranscribed(word, this.transcribedWords.length - 1, pronunciationResult);
                            }
                            
                            // Callback for pronunciation error
                            if (!pronunciationResult.isCorrect && this.onPronunciationError) {
                                this.onPronunciationError(pronunciationResult);
                            }
                        }
                    });
                }
                
                // Also handle plain text
                if (data.text && !data.words) {
                    const words = data.text.split(/\s+/).filter(w => w);
                    words.forEach((text, idx) => {
                        const word = {
                            text: text,
                            confidence: 0.85,
                            start: idx * 0.5,
                            end: (idx + 1) * 0.5,
                            isFinal: data.type.includes('committed')
                        };
                        
                        if (!this.transcribedWords.find(w => w.text === text && Math.abs(w.start - word.start) < 0.1)) {
                            const pronunciationResult = this.checkPronunciation(word, this.transcribedWords.length);
                            word.pronunciationResult = pronunciationResult;
                            this.transcribedWords.push(word);
                            
                            if (this.onWordTranscribed) {
                                this.onWordTranscribed(word, this.transcribedWords.length - 1, pronunciationResult);
                            }
                        }
                    });
                }
                
                // Final transcript
                if (data.type.includes('committed') && this.onTranscriptComplete) {
                    this.onTranscriptComplete(this.transcribedWords, this.pronunciationErrors);
                }
            }
        } catch (error) {
            console.error('Error handling transcription:', error);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CHECK PRONUNCIATION AGAINST EXPECTED
    // ═══════════════════════════════════════════════════════════════════════════
    checkPronunciation(word, index) {
        const spokenWord = word.text.toLowerCase().replace(/[^a-zàâäéèêëïîôùûüÿœæç]/gi, '');
        const expectedWord = this.expectedWords[index]?.toLowerCase().replace(/[^a-zàâäéèêëïîôùûüÿœæç]/gi, '') || '';
        
        // Calculate similarity (Levenshtein distance based)
        const similarity = this.calculateSimilarity(spokenWord, expectedWord);
        const isCorrect = similarity >= 0.8 || spokenWord === expectedWord;
        
        const result = {
            index: index,
            spoken: word.text,
            expected: this.expectedWords[index] || '',
            similarity: similarity,
            confidence: word.confidence,
            isCorrect: isCorrect,
            errorType: this.determineErrorType(spokenWord, expectedWord, similarity),
            suggestions: this.getPronunciationSuggestions(spokenWord, expectedWord)
        };
        
        if (!isCorrect) {
            this.pronunciationErrors.push(result);
        }
        
        return result;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CALCULATE STRING SIMILARITY
    // ═══════════════════════════════════════════════════════════════════════════
    calculateSimilarity(str1, str2) {
        if (!str1 || !str2) return 0;
        if (str1 === str2) return 1;
        
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1;
        
        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }
    
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // DETERMINE ERROR TYPE
    // ═══════════════════════════════════════════════════════════════════════════
    determineErrorType(spoken, expected, similarity) {
        if (!spoken || !expected) return 'missing';
        if (similarity >= 0.8) return 'none';
        if (similarity >= 0.5) return 'minor';
        if (spoken.length > expected.length * 1.5) return 'extra_syllables';
        if (spoken.length < expected.length * 0.5) return 'missing_syllables';
        return 'incorrect';
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // GET PRONUNCIATION SUGGESTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    getPronunciationSuggestions(spoken, expected) {
        const suggestions = [];
        
        if (!expected) return suggestions;
        
        // Common pronunciation issues by language
        const langHints = {
            'fr': {
                'r': 'French R is guttural, from the throat',
                'u': 'Round your lips like whistling for French U',
                'ou': 'Like "oo" in "food"',
                'eu': 'Like "uh" but with rounded lips',
                'on': 'Nasal sound, don\'t pronounce the N',
                'an': 'Nasal sound, keep mouth open',
                'in': 'Nasal sound, like "an" in "croissant"'
            },
            'de': {
                'ch': 'Soft "ch" after e,i,ä,ö,ü; hard after a,o,u',
                'r': 'German R is uvular, from the throat',
                'ü': 'Like "ee" but with rounded lips',
                'ö': 'Like "eh" but with rounded lips'
            },
            'es': {
                'rr': 'Roll the R with your tongue',
                'j': 'Like an English H, but stronger',
                'ñ': 'Like "ny" in "canyon"'
            }
        };
        
        const hints = langHints[this.language] || {};
        
        for (const [sound, hint] of Object.entries(hints)) {
            if (expected.includes(sound)) {
                suggestions.push(hint);
            }
        }
        
        if (suggestions.length === 0) {
            suggestions.push(`Try saying "${expected}" more slowly`);
        }
        
        return suggestions;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SETUP AUDIO PROCESSING FOR WEBSOCKET
    // ═══════════════════════════════════════════════════════════════════════════
    setupAudioProcessing() {
        const bufferSize = 4096;
        const scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
        
        scriptProcessor.onaudioprocess = (event) => {
            if (!this.isListening || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
                return;
            }
            
            const inputData = event.inputBuffer.getChannelData(0);
            const pcmData = this.float32ToInt16(inputData);
            const base64Audio = this.arrayBufferToBase64(pcmData.buffer);
            
            this.ws.send(JSON.stringify({
                type: 'input_audio_chunk',
                audio: base64Audio
            }));
        };
        
        this.sourceNode.connect(scriptProcessor);
        scriptProcessor.connect(this.audioContext.destination);
        
        this.scriptProcessor = scriptProcessor;
    }
    
    float32ToInt16(float32Array) {
        const int16Array = new Int16Array(float32Array.length);
        for (let i = 0; i < float32Array.length; i++) {
            const s = Math.max(-1, Math.min(1, float32Array[i]));
            int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return int16Array;
    }
    
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
        
        console.log('🛑 Stopping voice feedback');
        
        // Stop amplitude visualization
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Stop recording
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        
        // Send end of stream to WebSocket
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'end_of_stream' }));
        }
        
        this.isListening = false;
        this.isRecording = false;
        
        // Small delay then cleanup
        setTimeout(() => this.cleanup(), 500);
        
        return {
            transcribedWords: this.transcribedWords,
            pronunciationErrors: this.pronunciationErrors,
            recording: this.getRecording()
        };
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // GET RECORDING BLOB
    // ═══════════════════════════════════════════════════════════════════════════
    getRecording() {
        if (this.recordedChunks.length === 0) return null;
        return new Blob(this.recordedChunks, { type: 'audio/webm' });
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PLAY "HOW IT SHOULD SOUND" VIA ELEVENLABS
    // ═══════════════════════════════════════════════════════════════════════════
    async playCorrectPronunciation(text, voiceId = null) {
        const useVoiceId = voiceId || this.voiceId;
        
        try {
            console.log(`🔊 Playing correct pronunciation: "${text}"`);
            
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${useVoiceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': this.elevenLabsApiKey
                },
                body: JSON.stringify({
                    text: text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: 0.7,
                        similarity_boost: 0.8,
                        style: 0.2,
                        use_speaker_boost: true
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`TTS failed: ${response.status}`);
            }
            
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            return new Promise((resolve, reject) => {
                audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    resolve();
                };
                audio.onerror = reject;
                audio.play();
            });
            
        } catch (error) {
            console.error('Error playing correct pronunciation:', error);
            throw error;
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PLAY USER'S RECORDING
    // ═══════════════════════════════════════════════════════════════════════════
    playRecording() {
        const recording = this.getRecording();
        if (!recording) {
            console.warn('No recording available');
            return Promise.resolve();
        }
        
        const audioUrl = URL.createObjectURL(recording);
        const audio = new Audio(audioUrl);
        
        return new Promise((resolve) => {
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                resolve();
            };
            audio.play();
        });
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════════════════════
    cleanup() {
        if (this.scriptProcessor) {
            this.scriptProcessor.disconnect();
            this.scriptProcessor = null;
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
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // GET OVERALL SCORE
    // ═══════════════════════════════════════════════════════════════════════════
    getOverallScore() {
        if (this.transcribedWords.length === 0) return 0;
        
        const correctWords = this.transcribedWords.filter(w => 
            w.pronunciationResult?.isCorrect !== false
        ).length;
        
        return (correctWords / Math.max(this.expectedWords.length, this.transcribedWords.length)) * 100;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // GET DETAILED RESULTS
    // ═══════════════════════════════════════════════════════════════════════════
    getResults() {
        return {
            expectedText: this.expectedText,
            transcribedText: this.transcribedWords.map(w => w.text).join(' '),
            words: this.transcribedWords,
            errors: this.pronunciationErrors,
            overallScore: this.getOverallScore(),
            wordCount: this.transcribedWords.length,
            expectedWordCount: this.expectedWords.length,
            recording: this.getRecording()
        };
    }
}

// Singleton instance
export const voiceFeedback = new RealtimeVoiceFeedback();

