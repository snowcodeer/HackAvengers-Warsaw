// Real Decart MirageLSD Integration using official SDK
import { createDecartClient, models } from "@decartai/sdk";

let realtimeClient = null;
let stream = null;

// Style prompts for different scenarios
const STYLE_PROMPTS = {
    boulangerie: "Warm Parisian bakery, golden morning light streaming through windows, impressionist oil painting style, cozy French cafe atmosphere",
    berghain: "Dark industrial nightclub, cyberpunk neon lights, brutalist concrete, dramatic shadows, Blade Runner aesthetic",
    teahouse: "Traditional Chinese ink wash painting, sumi-e style, misty mountains, serene zen garden atmosphere",
    izakaya: "Anime style Japanese izakaya, warm orange lantern glow, cozy evening atmosphere, Studio Ghibli inspired",
    tapas: "Spanish tapas bar, warm flamenco colors, terracotta and ochre tones, Mediterranean golden hour sunlight",
    biergarten: "Bavarian beer garden, fairy tale forest setting, golden afternoon sunlight, traditional German illustration",
    milk_bar: "Eastern European milk bar, vintage nostalgic aesthetic, muted Soviet-era colors, polaroid warmth"
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

