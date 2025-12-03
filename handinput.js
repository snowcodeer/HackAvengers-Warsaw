import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

let hands;
let camera;
let controlData = { x: 0, y: 0 };
let isHandshakeDetected = false;

// Configuration
const config = {
    speed: 1.0,
    invertX: true,
    invertY: false,
    neutralY: 0.5,
    deadzone: 0.1
};

export function initHandTracker(videoElement, canvasElement) {
    const canvasCtx = canvasElement.getContext('2d');

    hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });

    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults((results) => {
        onResults(results, canvasElement, canvasCtx);
    });

    camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 320,
        height: 240
    });
    camera.start();

    // Setup UI listeners if they exist
    setupUIListeners();
}

function onResults(results, canvasElement, canvasCtx) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                { color: '#00FF00', lineWidth: 5 });
            drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
        }

        // Process control data from the first hand
        if (results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            updateControlData(landmarks);
        } else {
            // Reset if no hands
            controlData.x = 0;
            controlData.y = 0;
            updateJoystickVisual(0, 0);
        }

        // Check for handshake (if 2 hands are present)
        if (results.multiHandLandmarks.length === 2) {
            checkHandshake(results.multiHandLandmarks[0], results.multiHandLandmarks[1]);
        } else {
            isHandshakeDetected = false;
            updateHandshakeUI(false);
        }
    }
    canvasCtx.restore();
}

function updateControlData(landmarks) {
    // Use Index Finger Tip (landmark 8) for control
    const indexTip = landmarks[8];

    // Normalize to -1 to 1 range
    // MediaPipe x is 0 (left) to 1 (right)
    // MediaPipe y is 0 (top) to 1 (bottom)

    let x = (indexTip.x - 0.5) * 2;
    let y = (indexTip.y - config.neutralY) * 2;

    if (config.invertX) x = -x;
    if (config.invertY) y = -y;

    // Apply deadzone
    if (Math.abs(x) < config.deadzone) x = 0;
    if (Math.abs(y) < config.deadzone) y = 0;

    // Clamp
    x = Math.max(-1, Math.min(1, x));
    y = Math.max(-1, Math.min(1, y));

    controlData.x = x * config.speed;
    controlData.y = y * config.speed;

    updateJoystickVisual(x, y);
    updateStats(controlData.x, controlData.y);
}

function checkHandshake(hand1, hand2) {
    // Simple proximity check between wrist points (landmark 0)
    const wrist1 = hand1[0];
    const wrist2 = hand2[0];

    const distance = Math.sqrt(
        Math.pow(wrist1.x - wrist2.x, 2) +
        Math.pow(wrist1.y - wrist2.y, 2)
    );

    // Threshold for "touching"
    if (distance < 0.15) {
        isHandshakeDetected = true;
    } else {
        isHandshakeDetected = false;
    }
    updateHandshakeUI(isHandshakeDetected);
}

// UI Updates
function updateJoystickVisual(x, y) {
    const joystickDot = document.getElementById('joystick-dot');
    if (joystickDot) {
        // Map -1..1 to pixels (assuming container is 100x100, center is 50,50)
        const maxOffset = 35;
        const left = 50 + (x * maxOffset);
        const top = 50 + (y * maxOffset); // y is inverted in CSS usually, but here +y is down
        joystickDot.style.left = `${left}px`;
        joystickDot.style.top = `${top}px`;
    }
}

function updateStats(x, y) {
    const speedEl = document.getElementById('stat-speed');
    const angleEl = document.getElementById('stat-angle');

    if (speedEl) {
        const speed = Math.sqrt(x * x + y * y).toFixed(2);
        speedEl.textContent = speed;
    }

    if (angleEl) {
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        angleEl.textContent = angle.toFixed(0);
    }
}

function updateHandshakeUI(detected) {
    const notification = document.getElementById('handshake-notification');
    if (notification) {
        notification.style.display = detected ? 'block' : 'none';
    }
}

function setupUIListeners() {
    const invertX = document.getElementById('invert-x');
    const invertY = document.getElementById('invert-y');
    const offsetY = document.getElementById('offset-y');

    if (invertX) invertX.addEventListener('change', (e) => config.invertX = e.target.checked);
    if (invertY) invertY.addEventListener('change', (e) => config.invertY = e.target.checked);
    if (offsetY) offsetY.addEventListener('input', (e) => config.neutralY = parseFloat(e.target.value));
}

export function getControlData() {
    return controlData;
}

export function getHandshakeStatus() {
    return isHandshakeDetected;
}
