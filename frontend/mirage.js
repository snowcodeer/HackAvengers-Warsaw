import { createDecartClient, models } from "@decartai/sdk";

let realtimeClient = null;
let stream = null;

export async function startMirageStream(prompt = "Cyberpunk city", canvasId = "gameCanvas") {
    try {
        const model = models.realtime("mirage_v2");
        const canvas = document.getElementById(canvasId);

        if (!canvas) {
            console.error(`Canvas with ID ${canvasId} not found`);
            return;
        }

        // Get stream from canvas
        // Use the model's FPS if available, otherwise default to 30
        stream = canvas.captureStream(model.fps || 30);

        // Create a client
        const client = createDecartClient({
            apiKey: "test_YnjzrXCPYMWBIzaXknpnpfIDhSOoWmmPVypWlxcIullrCmleQvhJuydFHxoqFyxh" // TODO: Replace with actual API key
        });

        // Connect and transform the video stream
        realtimeClient = await client.realtime.connect(stream, {
            model,
            onRemoteStream: (transformedStream) => {
                // Display the transformed video
                const videoElement = document.querySelector("#mirage-video-output");
                if (videoElement) {
                    videoElement.srcObject = transformedStream;
                    videoElement.play().catch(e => console.error("Error playing video:", e));
                }
            }
        });

        // Change the style on the fly
        realtimeClient.setPrompt(prompt);

        // Show the video container
        const container = document.getElementById('mirage-container');
        if (container) {
            container.classList.add('active');
        }

    } catch (error) {
        console.error("Failed to start Mirage stream:", error);
    }
}

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
}

export function updateMiragePrompt(prompt) {
    if (realtimeClient) {
        realtimeClient.setPrompt(prompt);
    }
}
