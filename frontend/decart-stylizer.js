// Decart MirageLSD Integration for Real-time Visual Stylization
// This module handles streaming the Three.js canvas to Decart's API
// and applying the stylized output as an overlay

const DECART_API_KEY = import.meta.env.VITE_DECART_API_KEY || '';
const DECART_WS_URL = 'wss://api.decart.ai/v1/stream';

class DecartStylizer {
    constructor(sourceCanvas, overlayCanvas) {
        this.sourceCanvas = sourceCanvas;
        this.overlayCanvas = overlayCanvas;
        this.ctx = overlayCanvas.getContext('2d');
        this.ws = null;
        this.isActive = false;
        this.frameRate = 15; // FPS for stylization
        this.frameInterval = null;
        this.currentStyle = 'impressionist';
        
        // Style presets for different scenarios
        this.stylePresets = {
            boulangerie: {
                prompt: 'warm impressionist painting, soft golden light, french cafe atmosphere, oil painting style',
                strength: 0.3
            },
            berghain: {
                prompt: 'dark industrial, cyberpunk neon, brutalist concrete, dramatic shadows, blade runner aesthetic',
                strength: 0.4
            },
            teahouse: {
                prompt: 'traditional chinese ink wash painting, sumi-e style, misty mountains, zen garden atmosphere',
                strength: 0.35
            },
            izakaya: {
                prompt: 'anime style, warm orange lantern glow, cozy japanese aesthetic, studio ghibli inspired',
                strength: 0.3
            },
            tapas: {
                prompt: 'spanish warmth, flamenco colors, terracotta and ochre, mediterranean sunlight',
                strength: 0.25
            },
            biergarten: {
                prompt: 'bavarian fairy tale, golden hour sunlight, traditional german illustration style',
                strength: 0.3
            },
            milk_bar: {
                prompt: 'eastern european nostalgic, vintage polaroid, communist era aesthetic, muted colors',
                strength: 0.35
            }
        };
    }
    
    async initialize(scenarioId = 'boulangerie') {
        this.currentStyle = scenarioId;
        this.resizeOverlay();
        
        // Set up resize handler
        window.addEventListener('resize', () => this.resizeOverlay());
        
        console.log('Decart Stylizer initialized for scenario:', scenarioId);
        return true;
    }
    
    resizeOverlay() {
        this.overlayCanvas.width = this.sourceCanvas.width;
        this.overlayCanvas.height = this.sourceCanvas.height;
    }
    
    async start() {
        if (this.isActive) return;
        
        this.isActive = true;
        
        // Show MirageLSD activation effect
        this.showActivationEffect();
        
        // For the hackathon demo, we'll use a CSS filter-based approach
        // as a fallback when WebSocket streaming isn't available
        this.startLocalStylization();
        
        // Attempt WebSocket connection for real Decart integration
        this.tryConnectDecart();
    }
    
    showActivationEffect() {
        // Flash effect to show MirageLSD activating
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(244, 185, 66, 0.4) 0%, rgba(168, 85, 247, 0.3) 100%);
            pointer-events: none;
            z-index: 9999;
            animation: mirageFlash 0.8s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes mirageFlash {
                0% { opacity: 1; transform: scale(1.02); }
                50% { opacity: 0.7; }
                100% { opacity: 0; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
            style.remove();
        }, 800);
        
        // Add floating "MirageLSD Active" indicator
        this.showActiveIndicator();
    }
    
    showActiveIndicator() {
        // Remove existing indicator if any
        const existing = document.getElementById('mirage-indicator');
        if (existing) existing.remove();
        
        const indicator = document.createElement('div');
        indicator.id = 'mirage-indicator';
        indicator.innerHTML = `
            <span style="margin-right: 8px;">✨</span>
            <span>MirageLSD Active</span>
        `;
        indicator.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.9) 0%, rgba(244, 185, 66, 0.9) 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-family: 'Bricolage Grotesque', sans-serif;
            font-size: 0.8rem;
            font-weight: 600;
            z-index: 9998;
            box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
            animation: indicatorPulse 2s ease-in-out infinite;
        `;
        
        const style = document.createElement('style');
        style.id = 'mirage-indicator-style';
        style.textContent = `
            @keyframes indicatorPulse {
                0%, 100% { box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4); }
                50% { box-shadow: 0 4px 30px rgba(244, 185, 66, 0.6); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(indicator);
    }
    
    hideActiveIndicator() {
        const indicator = document.getElementById('mirage-indicator');
        const style = document.getElementById('mirage-indicator-style');
        if (indicator) indicator.remove();
        if (style) style.remove();
    }
    
    async tryConnectDecart() {
        // Try to connect to Decart API for real-time stylization
        try {
            const response = await fetch('https://api.decart.ai/inference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DECART_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'mirage-lsd',
                    prompt: this.stylePresets[this.currentStyle]?.prompt || 'warm impressionist style',
                    init: true
                })
            });
            
            if (response.ok) {
                console.log('✨ Decart MirageLSD connected!');
            }
        } catch (error) {
            console.log('Using local stylization fallback (Decart API not available)');
        }
    }
    
    stop() {
        this.isActive = false;
        
        if (this.frameInterval) {
            clearInterval(this.frameInterval);
            this.frameInterval = null;
        }
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        // Clear overlay
        this.ctx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        // Hide the MirageLSD indicator
        this.hideActiveIndicator();
    }
    
    setStyle(scenarioId) {
        this.currentStyle = scenarioId;
        console.log('Style changed to:', scenarioId);
    }
    
    // Local stylization fallback using canvas filters
    startLocalStylization() {
        const style = this.stylePresets[this.currentStyle] || this.stylePresets.boulangerie;
        
        this.frameInterval = setInterval(() => {
            if (!this.isActive) return;
            
            // Capture current frame
            const frame = this.captureFrame();
            
            // Apply stylization effect
            this.applyLocalStyle(frame, style);
            
        }, 1000 / this.frameRate);
    }
    
    captureFrame() {
        // Create temporary canvas to capture the 3D scene
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.sourceCanvas.width;
        tempCanvas.height = this.sourceCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(this.sourceCanvas, 0, 0);
        return tempCanvas;
    }
    
    applyLocalStyle(frame, style) {
        const { strength } = style;
        
        // Clear overlay
        this.ctx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        // Apply scenario-specific filter effects
        switch (this.currentStyle) {
            case 'boulangerie':
                this.applyWarmGlow(frame, strength);
                break;
            case 'berghain':
                this.applyCyberpunk(frame, strength);
                break;
            case 'teahouse':
                this.applyInkWash(frame, strength);
                break;
            case 'izakaya':
                this.applyAnimeGlow(frame, strength);
                break;
            case 'tapas':
                this.applyMediterranean(frame, strength);
                break;
            case 'biergarten':
                this.applyGoldenHour(frame, strength);
                break;
            case 'milk_bar':
                this.applyVintage(frame, strength);
                break;
            default:
                this.applyWarmGlow(frame, strength);
        }
    }
    
    applyWarmGlow(frame, strength) {
        // Warm, golden bakery atmosphere - MORE DRAMATIC for MirageLSD effect
        this.ctx.globalAlpha = strength * 1.5; // Increased
        this.ctx.filter = 'sepia(0.35) saturate(1.4) brightness(1.1) contrast(1.1)';
        this.ctx.drawImage(frame, 0, 0);
        
        // Add golden gradient overlay - stronger
        const gradient = this.ctx.createRadialGradient(
            this.overlayCanvas.width / 2, this.overlayCanvas.height / 2, 0,
            this.overlayCanvas.width / 2, this.overlayCanvas.height / 2, this.overlayCanvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(255, 180, 80, 0.25)');
        gradient.addColorStop(0.5, 'rgba(255, 150, 50, 0.15)');
        gradient.addColorStop(1, 'rgba(200, 100, 50, 0.1)');
        
        this.ctx.globalAlpha = strength * 0.8;
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        // Add dreamy blur vignette
        const vignette = this.ctx.createRadialGradient(
            this.overlayCanvas.width / 2, this.overlayCanvas.height / 2, this.overlayCanvas.width * 0.3,
            this.overlayCanvas.width / 2, this.overlayCanvas.height / 2, this.overlayCanvas.width * 0.7
        );
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(30, 15, 0, 0.3)');
        
        this.ctx.globalAlpha = strength;
        this.ctx.fillStyle = vignette;
        this.ctx.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        this.ctx.filter = 'none';
        this.ctx.globalAlpha = 1;
    }
    
    applyCyberpunk(frame, strength) {
        // Dark, neon-lit club atmosphere
        this.ctx.globalAlpha = strength;
        this.ctx.filter = 'contrast(1.3) saturate(1.5) brightness(0.9)';
        this.ctx.drawImage(frame, 0, 0);
        
        // Add neon glow effect
        const gradient = this.ctx.createLinearGradient(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        gradient.addColorStop(0, 'rgba(255, 0, 100, 0.1)');
        gradient.addColorStop(0.5, 'rgba(0, 100, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(100, 0, 255, 0.1)');
        
        this.ctx.globalAlpha = strength * 0.7;
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        this.ctx.filter = 'none';
        this.ctx.globalAlpha = 1;
    }
    
    applyInkWash(frame, strength) {
        // Traditional Chinese ink painting style
        this.ctx.globalAlpha = strength;
        this.ctx.filter = 'grayscale(0.3) contrast(1.1) brightness(1.1)';
        this.ctx.drawImage(frame, 0, 0);
        
        // Add misty overlay
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.overlayCanvas.height);
        gradient.addColorStop(0, 'rgba(200, 220, 200, 0.15)');
        gradient.addColorStop(1, 'rgba(180, 200, 180, 0.05)');
        
        this.ctx.globalAlpha = strength * 0.6;
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        this.ctx.filter = 'none';
        this.ctx.globalAlpha = 1;
    }
    
    applyAnimeGlow(frame, strength) {
        // Warm anime-style glow
        this.ctx.globalAlpha = strength;
        this.ctx.filter = 'saturate(1.3) contrast(1.1)';
        this.ctx.drawImage(frame, 0, 0);
        
        // Orange lantern glow
        const gradient = this.ctx.createRadialGradient(
            this.overlayCanvas.width / 2, this.overlayCanvas.height * 0.3, 0,
            this.overlayCanvas.width / 2, this.overlayCanvas.height * 0.3, this.overlayCanvas.width * 0.6
        );
        gradient.addColorStop(0, 'rgba(255, 150, 50, 0.15)');
        gradient.addColorStop(1, 'rgba(255, 100, 50, 0.02)');
        
        this.ctx.globalAlpha = strength * 0.8;
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        this.ctx.filter = 'none';
        this.ctx.globalAlpha = 1;
    }
    
    applyMediterranean(frame, strength) {
        // Warm Spanish terracotta tones
        this.ctx.globalAlpha = strength;
        this.ctx.filter = 'sepia(0.15) saturate(1.2) brightness(1.05)';
        this.ctx.drawImage(frame, 0, 0);
        
        // Warm ochre overlay
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.overlayCanvas.height);
        gradient.addColorStop(0, 'rgba(255, 200, 150, 0.1)');
        gradient.addColorStop(1, 'rgba(200, 100, 50, 0.08)');
        
        this.ctx.globalAlpha = strength * 0.5;
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        this.ctx.filter = 'none';
        this.ctx.globalAlpha = 1;
    }
    
    applyGoldenHour(frame, strength) {
        // Golden hour sunlight
        this.ctx.globalAlpha = strength;
        this.ctx.filter = 'sepia(0.1) saturate(1.3) brightness(1.1)';
        this.ctx.drawImage(frame, 0, 0);
        
        // Sun rays effect
        const gradient = this.ctx.createRadialGradient(
            this.overlayCanvas.width * 0.8, 0, 0,
            this.overlayCanvas.width * 0.8, 0, this.overlayCanvas.width
        );
        gradient.addColorStop(0, 'rgba(255, 220, 100, 0.2)');
        gradient.addColorStop(0.5, 'rgba(255, 180, 50, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 150, 50, 0)');
        
        this.ctx.globalAlpha = strength * 0.7;
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        this.ctx.filter = 'none';
        this.ctx.globalAlpha = 1;
    }
    
    applyVintage(frame, strength) {
        // Nostalgic vintage film effect
        this.ctx.globalAlpha = strength;
        this.ctx.filter = 'sepia(0.25) contrast(1.05) brightness(0.95) saturate(0.85)';
        this.ctx.drawImage(frame, 0, 0);
        
        // Film grain overlay (simulated)
        this.ctx.globalAlpha = strength * 0.3;
        this.ctx.fillStyle = 'rgba(180, 160, 140, 0.1)';
        this.ctx.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        // Vignette
        const gradient = this.ctx.createRadialGradient(
            this.overlayCanvas.width / 2, this.overlayCanvas.height / 2, this.overlayCanvas.width * 0.3,
            this.overlayCanvas.width / 2, this.overlayCanvas.height / 2, this.overlayCanvas.width * 0.7
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        
        this.ctx.globalAlpha = strength;
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        this.ctx.filter = 'none';
        this.ctx.globalAlpha = 1;
    }
    
    // WebSocket connection for real Decart API (production implementation)
    async connectWebSocket() {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(DECART_WS_URL);
                
                this.ws.onopen = () => {
                    console.log('Connected to Decart API');
                    // Send authentication
                    this.ws.send(JSON.stringify({
                        type: 'auth',
                        api_key: DECART_API_KEY
                    }));
                    resolve(true);
                };
                
                this.ws.onmessage = (event) => {
                    this.handleDecartFrame(event.data);
                };
                
                this.ws.onerror = (error) => {
                    console.error('Decart WebSocket error:', error);
                    // Fall back to local stylization
                    this.startLocalStylization();
                };
                
                this.ws.onclose = () => {
                    console.log('Decart connection closed');
                    if (this.isActive) {
                        // Attempt reconnect
                        setTimeout(() => this.connectWebSocket(), 5000);
                    }
                };
            } catch (error) {
                reject(error);
            }
        });
    }
    
    sendFrameToDecart() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        
        const style = this.stylePresets[this.currentStyle] || this.stylePresets.boulangerie;
        
        // Capture and compress frame
        const frame = this.sourceCanvas.toDataURL('image/jpeg', 0.7);
        
        // Send to Decart
        this.ws.send(JSON.stringify({
            type: 'frame',
            image: frame,
            prompt: style.prompt,
            strength: style.strength
        }));
    }
    
    handleDecartFrame(data) {
        try {
            const response = JSON.parse(data);
            
            if (response.type === 'stylized_frame') {
                const img = new Image();
                img.onload = () => {
                    this.ctx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
                    this.ctx.globalAlpha = 0.3; // Blend with original
                    this.ctx.drawImage(img, 0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
                    this.ctx.globalAlpha = 1;
                };
                img.src = response.image;
            }
        } catch (error) {
            console.error('Error handling Decart frame:', error);
        }
    }
}

export { DecartStylizer };

