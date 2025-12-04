// DecartVisuals - Real-time visual enhancement using Decart API
// Uses Mirage LSD model for dreamlike visual effects

export class DecartVisuals {
  constructor(canvas, visualStyle) {
    this.canvas = canvas;
    this.style = visualStyle;
    this.isConnected = false;
    this.ws = null;
    this.frameBuffer = null;
    this.effectIntensity = 0.3;
    
    this.init();
  }

  async init() {
    // Setup canvas for overlay effects
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Handle resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
    
    // Try to connect to Decart for real-time effects
    await this.connectToDecart();
    
    // Fallback: Use CSS-based visual effects
    this.applyFallbackEffects();
  }

  async connectToDecart() {
    try {
      // Decart Mirage LSD WebSocket connection for real-time restyling
      const response = await fetch('/api/decart/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mirage-lsd',
          style: this.style.theme,
          resolution: '720p'
        })
      });
      
      if (response.ok) {
        const { sessionUrl } = await response.json();
        this.ws = new WebSocket(sessionUrl);
        
        this.ws.onopen = () => {
          this.isConnected = true;
          console.log('Connected to Decart visual enhancement');
          document.getElementById('decartOverlay').classList.add('active');
        };
        
        this.ws.onmessage = (event) => {
          this.handleFrame(event.data);
        };
        
        this.ws.onerror = () => {
          console.log('Decart connection error, using fallback effects');
          this.applyFallbackEffects();
        };
        
        this.ws.onclose = () => {
          this.isConnected = false;
        };
      }
    } catch (error) {
      console.log('Decart API unavailable, using CSS effects:', error.message);
      this.applyFallbackEffects();
    }
  }

  handleFrame(data) {
    // Handle incoming enhanced frame from Decart
    if (data instanceof Blob) {
      const url = URL.createObjectURL(data);
      const img = new Image();
      img.onload = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = this.effectIntensity;
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }

  sendFrame(imageData) {
    // Send current game frame to Decart for enhancement
    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(imageData);
    }
  }

  applyFallbackEffects() {
    // Apply CSS-based visual effects as fallback
    const overlay = document.getElementById('decartOverlay');
    
    // Create gradient overlay based on theme
    const theme = this.style.theme;
    let gradientStyle = '';
    
    if (theme.includes('morning') || theme.includes('parisian')) {
      // Warm, dreamy morning effect
      gradientStyle = `
        background: 
          radial-gradient(ellipse at 30% 20%, rgba(255, 200, 150, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(255, 220, 180, 0.1) 0%, transparent 40%);
        mix-blend-mode: overlay;
        animation: breathe 8s ease-in-out infinite;
      `;
    } else if (theme.includes('night') || theme.includes('industrial')) {
      // Dark, moody club effect with color shifts
      gradientStyle = `
        background: 
          radial-gradient(ellipse at 20% 30%, rgba(255, 0, 0, 0.1) 0%, transparent 40%),
          radial-gradient(ellipse at 80% 70%, rgba(0, 100, 255, 0.1) 0%, transparent 40%);
        mix-blend-mode: screen;
        animation: pulse-colors 4s ease-in-out infinite;
      `;
    } else if (theme.includes('zen') || theme.includes('oriental')) {
      // Serene, soft pink effect
      gradientStyle = `
        background: 
          radial-gradient(ellipse at 50% 30%, rgba(244, 114, 182, 0.08) 0%, transparent 50%);
        mix-blend-mode: soft-light;
        animation: float-effect 10s ease-in-out infinite;
      `;
    } else if (theme.includes('british') || theme.includes('cozy')) {
      // Warm, firelit effect
      gradientStyle = `
        background: 
          radial-gradient(ellipse at 30% 80%, rgba(255, 100, 0, 0.1) 0%, transparent 40%);
        mix-blend-mode: overlay;
        animation: flicker-effect 3s ease-in-out infinite;
      `;
    } else {
      // Default warm atmosphere
      gradientStyle = `
        background: 
          radial-gradient(ellipse at center, rgba(212, 175, 55, 0.05) 0%, transparent 60%);
        mix-blend-mode: overlay;
      `;
    }
    
    // Add CSS animations
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes breathe {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.02); }
      }
      
      @keyframes pulse-colors {
        0%, 100% { filter: hue-rotate(0deg); opacity: 0.4; }
        50% { filter: hue-rotate(30deg); opacity: 0.6; }
      }
      
      @keyframes float-effect {
        0%, 100% { transform: translateY(0); opacity: 0.3; }
        50% { transform: translateY(-5px); opacity: 0.4; }
      }
      
      @keyframes flicker-effect {
        0%, 100% { opacity: 0.3; }
        25% { opacity: 0.4; }
        50% { opacity: 0.25; }
        75% { opacity: 0.35; }
      }
      
      #decartOverlay.fallback-active {
        ${gradientStyle}
        opacity: 1 !important;
        pointer-events: none;
      }
    `;
    document.head.appendChild(styleEl);
    
    overlay.classList.add('fallback-active');
  }

  setIntensity(value) {
    this.effectIntensity = Math.max(0, Math.min(1, value));
    const overlay = document.getElementById('decartOverlay');
    if (overlay) {
      overlay.style.opacity = this.effectIntensity;
    }
  }

  setTheme(newTheme) {
    this.style.theme = newTheme;
    this.applyFallbackEffects();
    
    // Update Decart if connected
    if (this.isConnected) {
      this.ws.send(JSON.stringify({
        type: 'style_change',
        style: newTheme
      }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
    this.isConnected = false;
  }
}

