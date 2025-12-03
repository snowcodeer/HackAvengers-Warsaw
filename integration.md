Integration Guide
Follow these steps to integrate the MediaPipe Hand Control into your teammate's existing Three.js project.

1. Install Dependencies
In your teammate's project directory, run:

npm install @mediapipe/hands @mediapipe/camera_utils @mediapipe/drawing_utils
2. Copy Files
Copy the following file from this project to the same location in the new project (e.g., src/):

src/handInput.js
3. Update HTML (
index.html
)
Add the MediaPipe container and UI elements to the <body> of the main HTML file. Ensure they are after the #app container but before the script tags.

<!-- MediaPipe Input/Output -->
<div id="mediapipe-container">
  <video class="input_video"></video>
  <canvas class="output_canvas" width="320px" height="240px"></canvas>
</div>
<!-- Joystick Visualization -->
<div id="joystick-container">
  <div id="joystick-center"></div>
  <div id="joystick-dot"></div>
</div>
<!-- Stats & Settings -->
<div id="stats-container">
  <div>Speed: <span id="stat-speed">0.00</span></div>
  <div>Angle: <span id="stat-angle">0.00</span>°</div>
  <div style="margin-top: 10px; font-size: 0.8em; text-align: left;">
    <label><input type="checkbox" id="invert-x" checked> Invert X</label><br>
    <label><input type="checkbox" id="invert-y"> Invert Y</label>
    <div style="margin-top: 5px;">
      <label>Neutral Y: <input type="range" id="offset-y" min="0" max="1" step="0.05" value="0.5"></label>
    </div>
  </div>
</div>
<!-- Handshake Notification -->
<div id="handshake-notification">🤝 Handshake Detected!</div>
4. Update CSS (
style.css
)
Copy the styles for the UI elements into the project's CSS file. You can copy everything except the #app and body styles if they already exist. Specifically, copy styles for:

#mediapipe-container
.input_video, .output_canvas
#joystick-container, #joystick-center, #joystick-dot
#stats-container
#handshake-notification
5. Integrate into Main Script (
main.js
)
In the main entry point where the Three.js loop is running:

Import the Hand Tracker:

import { initHandTracker, getControlData } from './handInput.js';
Initialize it (call this once at startup):

const videoElement = document.querySelector('.input_video');
const canvasElement = document.querySelector('.output_canvas');
initHandTracker(videoElement, canvasElement);
Update the Animation Loop: Inside the 
animate()
 or render() function:

function animate() {
  requestAnimationFrame(animate);
  // 1. Get Control Data
  const controlData = getControlData(); 
  // controlData is { x: -1 to 1, y: -1 to 1 }
  // 2. Apply to Character
  // Example:
  if (myCharacter) {
     myCharacter.position.x += controlData.x * speed;
     myCharacter.position.z += controlData.y * speed;
     
     // Handle Handshake
     // You might need to export a 'isHandshakeDetected()' function from handInput.js
     // or check the UI state if you want to trigger game logic.
  }
  renderer.render(scene, camera);
}
6. Customization
Speed: Multiply controlData.x and controlData.y by a speed factor (e.g., 0.1).
Deadzone: You might want to ignore small values (e.g., < 0.1) to prevent drifting.
