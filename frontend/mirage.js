// Real Decart MirageLSD Integration using official SDK
import { createDecartClient, models } from "@decartai/sdk";

let realtimeClient = null;
let stream = null;

// Style prompts for different scenarios
// OPTIMIZED: Keep prompts subtle and consistent to avoid over-stylization
// Focus on: lighting, color temperature, atmosphere, soft artistic touches
const STYLE_PROMPTS = {
    // 🇫🇷 French Bakery - Soft impressionist, Monet-inspired
    boulangerie: "Soft warm impressionist style, gentle golden morning light through lace curtains, subtle Monet-inspired brushstrokes, creamy beiges and warm honey tones, cozy intimate Parisian atmosphere, soft focus on edges, painterly but recognizable, calm and inviting",
    
    // 🇩🇪 German Club - Subtle cyberpunk, controlled neon
    berghain: "Dark industrial atmosphere, subtle cyberpunk aesthetic, controlled neon accents in blues and magentas, brutalist concrete textures, cinematic Blade Runner mood, dramatic shadows with detail, moody but navigable, consistent low-key lighting",
    
    // 🇨🇳 Chinese Tea House - Sumi-e ink wash, zen
    teahouse: "Traditional sumi-e ink wash painting style, soft misty atmosphere, minimalist zen aesthetic, gentle gradient washes, muted earth tones and jade greens, serene and meditative, watercolor softness, recognizable forms, peaceful continuity",
    
    // 🇯🇵 Japanese Izakaya - Studio Ghibli warmth
    izakaya: "Warm Studio Ghibli inspired atmosphere, soft orange lantern glow, cozy evening ambiance, gentle anime aesthetic, warm amber and soft reds, intimate and inviting, painterly but clear, nostalgic and comforting",
    
    // 🇪🇸 Spanish Tapas Bar - Mediterranean golden hour
    tapas: "Warm Mediterranean atmosphere, soft golden hour sunlight, gentle terracotta and ochre tones, subtle impressionist touches, cozy Spanish cafe ambiance, warm inviting light, painterly but recognizable, calm and relaxed",
    
    // 🇩🇪 German Beer Garden - Fairy tale forest
    biergarten: "Soft fairy tale forest aesthetic, dappled golden afternoon sunlight, gentle storybook illustration style, warm natural greens and browns, cozy outdoor atmosphere, painterly but clear, inviting and peaceful",
    
    // 🇵🇱 Polish Milk Bar - Nostalgic vintage
    milk_bar: "Nostalgic Eastern European aesthetic, soft muted colors, gentle polaroid warmth, vintage film grain, subtle retro atmosphere, warm amber undertones, recognizable but dreamy, calm and inviting",
    
    // 🇬🇧 British Pub - Cozy Victorian
    pub: "Warm cozy Victorian pub atmosphere, soft amber firelight glow, gentle wood and brass tones, subtle oil painting style, intimate and welcoming, rich browns and deep reds, painterly but clear, comfortable and nostalgic",
    
    // 🇮🇹 Italian Café - Renaissance warmth  
    cafe: "Warm Renaissance-inspired atmosphere, soft Tuscan golden light, gentle ochre and terracotta palette, subtle classical painting style, cozy Italian piazza feel, warm inviting tones, painterly but recognizable, elegant and relaxed"
};

/**
 * Start the Mirage real-time video transformation stream
 * @param {string} scenario - The scenario ID to determine the style prompt
 * @param {string} canvasId - The ID of the canvas element to capture
 */
export async function startMirageStream(scenario = "boulangerie", canvasId = "gameCanvas") {
    try {
        const model = models.realtime("mirage_v2");
        const canvas = document.getElementById(canvasId);
        
        if (!canvas) {
            console.error(`Canvas with ID ${canvasId} not found`);
            return false;
        }

        // Capture stream from the Three.js canvas
        const fps = model.fps || 30;
        stream = canvas.captureStream(fps);

        // Get API key from environment
        const apiKey = import.meta.env.VITE_DECART_API_KEY || '';
        
        if (!apiKey) {
            console.warn("Decart API key not found, Mirage disabled");
            return false;
        }

        // Create Decart client
        const client = createDecartClient({
            apiKey: apiKey
        });

        // Connect and transform the video stream
        realtimeClient = await client.realtime.connect(stream, {
            model,
            onRemoteStream: (transformedStream) => {
                // Display the transformed video
                const videoElement = document.querySelector("#mirage-video-output");
                if (videoElement) {
                    videoElement.srcObject = transformedStream;
                    videoElement.play().catch(e => console.error("Error playing Mirage video:", e));
                }
            }
        });

        // Set the style based on scenario
        const prompt = STYLE_PROMPTS[scenario] || STYLE_PROMPTS.boulangerie;
        realtimeClient.setPrompt(prompt);

        // Show the video container
        const container = document.getElementById('mirage-container');
        if (container) {
            container.classList.add('active');
        }

        console.log(`🎨 MirageLSD activated for scenario: ${scenario}`);
        return true;

    } catch (error) {
        console.error("Failed to start Mirage stream:", error);
        return false;
    }
}

/**
 * Stop the Mirage stream and clean up
 */
export function stopMirageStream() {
    if (realtimeClient) {
        realtimeClient.disconnect();
        realtimeClient = null;
    }

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    // Hide the video container
    const container = document.getElementById('mirage-container');
    if (container) {
        container.classList.remove('active');
    }

    const videoElement = document.querySelector("#mirage-video-output");
    if (videoElement) {
        videoElement.srcObject = null;
    }

    console.log("🎨 MirageLSD deactivated");
}

/**
 * Update the Mirage style prompt dynamically
 * @param {string} prompt - New style prompt
 */
export function updateMiragePrompt(prompt) {
    if (realtimeClient) {
        realtimeClient.setPrompt(prompt);
        console.log(`🎨 Mirage prompt updated: ${prompt}`);
    }
}

/**
 * Update style based on scenario
 * @param {string} scenario - Scenario ID
 */
export function setMirageScenario(scenario) {
    const prompt = STYLE_PROMPTS[scenario] || STYLE_PROMPTS.boulangerie;
    updateMiragePrompt(prompt);
}

/**
 * Check if Mirage is currently active
 */
export function isMirageActive() {
    return realtimeClient !== null;
}
