// 3D Game World using Three.js
import { initHandTracker, getControlData, getHandshakeStatus, updateHandshakeUI } from './camera/handinput.js';

let scene, camera, renderer;
let player, playerVelocity;
let npcs = [];
let snowParticles = [];
let trees = [];
let houses = [];
let clock;
let keys = {};
let mouseX = 0, mouseY = 0;
let isPointerLocked = false;
let nearestNPC = null;
let currentDialogue = null;
let dialogueIndex = 0;

// Audio
const footstepSounds = [];
let lastFootstepTime = 0;
const FOOTSTEP_INTERVAL = 350; // ms between footsteps

// Sound effects
let ambientWind = null;
let dialogueOpenSound = null;
let dialogueAdvanceSound = null;
let interactPromptSound = null;
let catMeowSound = null;
let birdChirpSound = null;
let questCompleteSound = null;

// Track interact prompt state for sound
let wasPromptActive = false;

// Character data from customisation
let characterData = {
    name: 'Player',
    outfitColor: '#e74c3c',
    skinColor: '#ffd5b5',
    hairColor: '#2c1810'
};

// NPC dialogue data
const npcData = [
    {
        name: 'Elder Frost',
        color: 0x4a90d9,
        position: { x: 15, z: 15 },
        dialogue: [
            "Welcome to our village, traveler!",
            "The winter has been harsh this year...",
            "But we manage to keep warm with good company!",
            "Feel free to explore and meet everyone."
        ]
    },
    {
        name: 'Farmer Beet',
        color: 0x2ecc71,
        position: { x: -20, z: 10 },
        dialogue: [
            "Howdy there, stranger!",
            "Name's Beet. I grow the best turnips in the region!",
            "Even in winter, my greenhouse keeps producing.",
            "Stop by anytime for some fresh vegetables!"
        ]
    },
    {
        name: 'Blacksmith Ember',
        color: 0xe74c3c,
        position: { x: 25, z: -15 },
        dialogue: [
            "*clang clang* Oh! A visitor!",
            "I'm Ember, the village blacksmith.",
            "I forge the finest tools and weapons.",
            "Let me know if you need anything crafted!"
        ]
    },
    {
        name: 'Merchant Luna',
        color: 0x9b59b6,
        position: { x: -15, z: -20 },
        dialogue: [
            "Greetings, dear customer~",
            "I'm Luna, traveling merchant extraordinaire!",
            "I have wares from all across the land.",
            "Take a look around my shop when you're ready!"
        ]
    },
    {
        name: 'Guard Rex',
        color: 0xf39c12,
        position: { x: 0, z: 30 },
        dialogue: [
            "Halt! State your business!",
            "...Just kidding! Welcome to the village!",
            "I'm Rex, head of the village guard.",
            "It's pretty peaceful here, but I stay vigilant!"
        ]
    }
];

// Initialize
window.addEventListener('load', init);

function init() {
    // Load character data
    const savedData = localStorage.getItem('playerCharacter');
    if (savedData) {
        characterData = JSON.parse(savedData);
    }
    document.getElementById('playerName').textContent = characterData.name || 'Player';

    // Load all sounds
    loadAllSounds();

    // Setup Three.js
    setupScene();
    setupLighting();
    createGround();
    createPlayer();
    createNPCs();
    createTrees();
    createHouses();
    createSnow();

    // Setup controls
    setupControls();

    // Initialize Hand Tracker
    const videoElement = document.querySelector('.input_video');
    const canvasElement = document.querySelector('.output_canvas');
    if (videoElement && canvasElement) {
        initHandTracker(videoElement, canvasElement);
    }

    // Hide loading screen
    simulateLoading();

    // Start animation loop
    clock = new THREE.Clock();
    animate();
}

function loadAllSounds() {
    // Footstep sounds
    const footstepFiles = [
        'sounds/footstep_snow_1.mp3',
        'sounds/footstep_snow_2.mp3',
        'sounds/footstep_snow_3.mp3',
        'sounds/footstep_snow_4.mp3'
    ];
    
    footstepFiles.forEach(file => {
        const audio = new Audio(file);
        audio.volume = 0.4;
        footstepSounds.push(audio);
    });
    
    // Ambient wind (looping)
    ambientWind = new Audio('sounds/ambient_wind.mp3');
    ambientWind.loop = true;
    ambientWind.volume = 0.3;
    
    // UI sounds
    dialogueOpenSound = new Audio('sounds/dialogue_open.mp3');
    dialogueOpenSound.volume = 0.5;
    
    dialogueAdvanceSound = new Audio('sounds/dialogue_advance.mp3');
    dialogueAdvanceSound.volume = 0.4;
    
    interactPromptSound = new Audio('sounds/interact_prompt.mp3');
    interactPromptSound.volume = 0.3;
    
    // Character sounds
    catMeowSound = new Audio('sounds/cat_meow.mp3');
    catMeowSound.volume = 0.6;
    
    birdChirpSound = new Audio('sounds/bird_chirp.mp3');
    birdChirpSound.volume = 0.5;
    
    // Quest sounds
    questCompleteSound = new Audio('sounds/quest_complete.mp3');
    questCompleteSound.volume = 0.6;
}

// Helper to play a sound (handles autoplay restrictions)
function playSound(sound) {
    if (sound) {
        const clone = sound.cloneNode();
        clone.volume = sound.volume;
        clone.play().catch(() => {});
    }
}

// Start ambient sounds (call after user interaction)
function startAmbientSounds() {
    if (ambientWind && ambientWind.paused) {
        ambientWind.play().catch(() => {});
    }
}

// Play cat meow (call when finding the cat)
function playCatMeow() {
    playSound(catMeowSound);
}

// Play bird chirp (call when helper bird appears)
function playBirdChirp() {
    playSound(birdChirpSound);
}

// Play quest complete sound
function playQuestComplete() {
    playSound(questCompleteSound);
}

function playFootstep() {
    const now = Date.now();
    if (now - lastFootstepTime < FOOTSTEP_INTERVAL) return;
    
    lastFootstepTime = now;
    const sound = footstepSounds[Math.floor(Math.random() * footstepSounds.length)];
    
    // Clone to allow overlapping sounds
    const clone = sound.cloneNode();
    clone.volume = 0.3 + Math.random() * 0.2;
    clone.playbackRate = 0.9 + Math.random() * 0.2;
    clone.play().catch(() => {}); // Ignore autoplay errors
}

function simulateLoading() {
    const loadingBar = document.getElementById('loadingBar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('loadingScreen').classList.add('hidden');
            }, 500);
        }
        loadingBar.style.width = progress + '%';
    }, 200);
}

function setupScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0xc8e8f8, 50, 150);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('gameCanvas'),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function setupLighting() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    // Directional light (sun)
    const sun = new THREE.DirectionalLight(0xfff4e0, 1);
    sun.position.set(50, 100, 50);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 200;
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.top = 50;
    sun.shadow.camera.bottom = -50;
    scene.add(sun);

    // Hemisphere light for natural sky color
    const hemi = new THREE.HemisphereLight(0x87ceeb, 0xffffff, 0.3);
    scene.add(hemi);
}

function createGround() {
    // Snow ground
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
        metalness: 0
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add some snow mounds
    for (let i = 0; i < 30; i++) {
        const moundGeometry = new THREE.SphereGeometry(
            Math.random() * 2 + 1,
            8,
            8,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        );
        const mound = new THREE.Mesh(moundGeometry, groundMaterial);
        mound.position.set(
            (Math.random() - 0.5) * 180,
            0,
            (Math.random() - 0.5) * 180
        );
        mound.receiveShadow = true;
        scene.add(mound);
    }
}

function createPlayer() {
    // Player group
    player = new THREE.Group();

    // Convert hex color string to number
    const outfitColorNum = parseInt(characterData.outfitColor.replace('#', ''), 16);
    const skinColorNum = parseInt(characterData.skinColor.replace('#', ''), 16);
    const hairColorNum = parseInt(characterData.hairColor.replace('#', ''), 16);

    // Body
    const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.6);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: outfitColorNum });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.75;
    body.castShadow = true;
    player.add(body);

    // Head
    const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const headMaterial = new THREE.MeshStandardMaterial({ color: skinColorNum });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.9;
    head.castShadow = true;
    player.add(head);

    // Hair
    const hairGeometry = new THREE.BoxGeometry(0.9, 0.4, 0.9);
    const hairMaterial = new THREE.MeshStandardMaterial({ color: hairColorNum });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 3.4;
    hair.castShadow = true;
    player.add(hair);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.35, 1, 0.35);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x3a3a5a });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, 0.5, 0);
    leftLeg.castShadow = true;
    player.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, 0.5, 0);
    rightLeg.castShadow = true;
    player.add(rightLeg);

    player.position.set(0, 0, 0);
    playerVelocity = new THREE.Vector3();
    scene.add(player);
}

function createNPCs() {
    npcData.forEach(data => {
        const npc = new THREE.Group();
        npc.userData = {
            name: data.name,
            dialogue: data.dialogue,
            isNPC: true
        };

        // Body
        const bodyGeometry = new THREE.BoxGeometry(1.2, 1.8, 0.7);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: data.color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.9;
        body.castShadow = true;
        npc.add(body);

        // Head
        const headGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffd5b5 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 3.3;
        head.castShadow = true;
        npc.add(head);

        // Eyes
        const eyeGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.1);
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.2, 3.4, 0.45);
        npc.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.2, 3.4, 0.45);
        npc.add(rightEye);

        // Name tag
        // (would use CSS2DRenderer for actual text, simplified here)

        // Legs
        const legGeometry = new THREE.BoxGeometry(0.4, 1.1, 0.4);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x4a4a4a });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.25, 0.55, 0);
        leftLeg.castShadow = true;
        npc.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.25, 0.55, 0);
        rightLeg.castShadow = true;
        npc.add(rightLeg);

        npc.position.set(data.position.x, 0, data.position.z);
        npcs.push(npc);
        scene.add(npc);
    });
}

function createTrees() {
    const treePositions = [
        { x: -30, z: 30 }, { x: -35, z: 20 }, { x: -40, z: 35 },
        { x: 30, z: 30 }, { x: 35, z: 25 }, { x: 40, z: 35 },
        { x: -30, z: -30 }, { x: -35, z: -25 }, { x: -40, z: -35 },
        { x: 30, z: -30 }, { x: 35, z: -35 }, { x: 25, z: -40 },
        { x: -50, z: 0 }, { x: 50, z: 0 }, { x: 0, z: -50 },
        { x: -45, z: 15 }, { x: 45, z: -15 }, { x: -20, z: -45 }
    ];

    treePositions.forEach(pos => {
        const tree = createTree();
        tree.position.set(pos.x + (Math.random() - 0.5) * 5, 0, pos.z + (Math.random() - 0.5) * 5);
        const scale = 0.8 + Math.random() * 0.6;
        tree.scale.set(scale, scale, scale);
        trees.push(tree);
        scene.add(tree);
    });
}

function createTree() {
    const tree = new THREE.Group();

    // Trunk
    const trunkGeometry = new THREE.BoxGeometry(1, 4, 1);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5c3d2e });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2;
    trunk.castShadow = true;
    tree.add(trunk);

    // Foliage layers (pine tree style)
    const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a3a });
    const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    const layers = [
        { y: 4, size: 3 },
        { y: 5.5, size: 2.5 },
        { y: 7, size: 2 },
        { y: 8.5, size: 1.5 },
        { y: 9.5, size: 0.8 }
    ];

    layers.forEach(layer => {
        const foliageGeometry = new THREE.ConeGeometry(layer.size, 2, 8);
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = layer.y;
        foliage.castShadow = true;
        tree.add(foliage);

        // Snow on top
        const snowGeometry = new THREE.ConeGeometry(layer.size * 0.7, 0.5, 8);
        const snow = new THREE.Mesh(snowGeometry, snowMaterial);
        snow.position.y = layer.y + 0.8;
        tree.add(snow);
    });

    return tree;
}

function createHouses() {
    const housePositions = [
        { x: -8, z: -8, rotation: 0 },
        { x: 10, z: -10, rotation: Math.PI / 4 },
        { x: -5, z: 20, rotation: -Math.PI / 6 }
    ];

    housePositions.forEach(pos => {
        const house = createHouse();
        house.position.set(pos.x, 0, pos.z);
        house.rotation.y = pos.rotation;
        houses.push(house);
        scene.add(house);
    });
}

function createHouse() {
    const house = new THREE.Group();

    // Base
    const baseGeometry = new THREE.BoxGeometry(8, 5, 6);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xa86020 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 2.5;
    base.castShadow = true;
    base.receiveShadow = true;
    house.add(base);

    // Roof
    const roofGeometry = new THREE.BoxGeometry(9, 1, 7);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xc04040 });
    const roof1 = new THREE.Mesh(roofGeometry, roofMaterial);
    roof1.position.y = 5.5;
    roof1.castShadow = true;
    house.add(roof1);

    const roofGeometry2 = new THREE.BoxGeometry(7, 1, 5);
    const roof2 = new THREE.Mesh(roofGeometry2, roofMaterial);
    roof2.position.y = 6.5;
    roof2.castShadow = true;
    house.add(roof2);

    const roofGeometry3 = new THREE.BoxGeometry(5, 1, 3);
    const roof3 = new THREE.Mesh(roofGeometry3, roofMaterial);
    roof3.position.y = 7.5;
    roof3.castShadow = true;
    house.add(roof3);

    // Snow on roof
    const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const snowGeometry = new THREE.BoxGeometry(9.5, 0.5, 7.5);
    const snow = new THREE.Mesh(snowGeometry, snowMaterial);
    snow.position.y = 8;
    house.add(snow);

    // Door
    const doorGeometry = new THREE.BoxGeometry(1.5, 3, 0.2);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3020 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 1.5, 3.1);
    house.add(door);

    // Windows
    const windowGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.2);
    const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        emissive: 0xffff88,
        emissiveIntensity: 0.3
    });

    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
    window1.position.set(-2.5, 3, 3.1);
    house.add(window1);

    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
    window2.position.set(2.5, 3, 3.1);
    house.add(window2);

    return house;
}

function createSnow() {
    const snowGeometry = new THREE.BufferGeometry();
    const snowCount = 2000;
    const positions = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 150;
        positions[i + 1] = Math.random() * 50;
        positions[i + 2] = (Math.random() - 0.5) * 150;
    }

    snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const snowMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.3,
        transparent: true,
        opacity: 0.8
    });

    const snow = new THREE.Points(snowGeometry, snowMaterial);
    snow.userData.velocities = [];

    for (let i = 0; i < snowCount; i++) {
        snow.userData.velocities.push({
            y: Math.random() * 0.02 + 0.01,
            x: (Math.random() - 0.5) * 0.01
        });
    }

    snowParticles.push(snow);
    scene.add(snow);
}

function setupControls() {
    // Keyboard
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;

        // Interact with NPC
        if (e.key.toLowerCase() === 'e' && nearestNPC && !currentDialogue) {
            startDialogue(nearestNPC);
        }

        // Continue dialogue
        if (e.key === ' ' && currentDialogue) {
            e.preventDefault();
            advanceDialogue();
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    // Mouse look
    document.addEventListener('click', () => {
        // Start ambient sounds on first click (browser autoplay policy)
        startAmbientSounds();
        
        if (!currentDialogue) {
            document.body.requestPointerLock();
        }
    });

    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = document.pointerLockElement === document.body;
    });

    document.addEventListener('mousemove', (e) => {
        if (isPointerLocked && !currentDialogue) {
            mouseX += e.movementX * 0.002;
            mouseY += e.movementY * 0.002;
            mouseY = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, mouseY));
        }
    });
}

function startDialogue(npc) {
    currentDialogue = npc.userData.dialogue;
    dialogueIndex = 0;

    // Play dialogue open sound
    playSound(dialogueOpenSound);

    document.getElementById('dialogueName').textContent = npc.userData.name;
    document.getElementById('dialogueText').textContent = currentDialogue[dialogueIndex];
    document.getElementById('dialogueBox').classList.add('active');
    document.getElementById('interactPrompt').classList.remove('active');

    document.exitPointerLock();
}

function advanceDialogue() {
    dialogueIndex++;

    if (dialogueIndex >= currentDialogue.length) {
        endDialogue();
    } else {
        // Play page turn sound
        playSound(dialogueAdvanceSound);
        document.getElementById('dialogueText').textContent = currentDialogue[dialogueIndex];
    }
}

function endDialogue() {
    currentDialogue = null;
    dialogueIndex = 0;
    document.getElementById('dialogueBox').classList.remove('active');
}

function updatePlayer(delta) {
    if (currentDialogue) return;

    const speed = 15;
    const direction = new THREE.Vector3();

    // Get camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));

    if (keys['w']) direction.add(cameraDirection);
    if (keys['s']) direction.sub(cameraDirection);
    if (keys['a']) direction.sub(right);
    if (keys['d']) direction.add(right);

    // Hand Control
    const handControl = getControlData();
    if (handControl.x !== 0 || handControl.y !== 0) {
        // Map hand x/y to movement relative to camera
        // hand y is forward/backward (cameraDirection)
        // hand x is left/right (right vector)

        // Note: handControl.y is negative for up (forward), positive for down (backward)
        // So we subtract cameraDirection * handControl.y (if y is -1 (up), we add direction)
        // Actually, let's check the coordinate system.
        // Usually joystick up (y < 0) means move forward.

        const forwardMove = cameraDirection.clone().multiplyScalar(-handControl.y);
        const sideMove = right.clone().multiplyScalar(handControl.x);

        direction.add(forwardMove);
        direction.add(sideMove);
    }

    if (direction.length() > 0) {
        direction.normalize();
        player.position.add(direction.multiplyScalar(speed * delta));

        // Face movement direction
        player.rotation.y = Math.atan2(direction.x, direction.z);
        
        // Play footstep sound
        playFootstep();
    }

    // Keep player in bounds
    player.position.x = Math.max(-90, Math.min(90, player.position.x));
    player.position.z = Math.max(-90, Math.min(90, player.position.z));
}

function updateCamera() {
    // Third person camera
    const cameraOffset = new THREE.Vector3(0, 8, 12);

    // Rotate offset based on mouse
    const rotatedOffset = cameraOffset.clone();
    rotatedOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -mouseX);

    camera.position.copy(player.position).add(rotatedOffset);
    camera.position.y = player.position.y + 8 - mouseY * 5;
    camera.lookAt(player.position.x, player.position.y + 3, player.position.z);
}

function updateNPCs() {
    // Check distance to NPCs
    let closest = null;
    let closestDist = Infinity;

    npcs.forEach(npc => {
        const dist = player.position.distanceTo(npc.position);

        // Make NPC face player when close
        if (dist < 10) {
            const angle = Math.atan2(
                player.position.x - npc.position.x,
                player.position.z - npc.position.z
            );
            npc.rotation.y = angle;
        }

        if (dist < 5 && dist < closestDist) {
            closest = npc;
            closestDist = dist;
        }
    });

    nearestNPC = closest;

    // Show/hide interact prompt
    const prompt = document.getElementById('interactPrompt');
    const isPromptActive = nearestNPC && !currentDialogue;
    
    if (isPromptActive) {
        prompt.classList.add('active');
        // Play sound when prompt first appears
        if (!wasPromptActive) {
            playSound(interactPromptSound);
        }
    } else {
        prompt.classList.remove('active');
    }

    wasPromptActive = isPromptActive;

    // Handshake Logic
    const isGestureDetected = getHandshakeStatus();
    // Only show handshake if gesture is detected AND we are close to an NPC (e.g. < 10 units)
    if (isGestureDetected && nearestNPC && closestDist < 10) {
        updateHandshakeUI(true);
    } else {
        updateHandshakeUI(false);
    }
}

function updateSnow(delta) {
    snowParticles.forEach(snow => {
        const positions = snow.geometry.attributes.position.array;
        const velocities = snow.userData.velocities;

        for (let i = 0; i < positions.length; i += 3) {
            const idx = i / 3;
            positions[i] += velocities[idx].x;
            positions[i + 1] -= velocities[idx].y;

            // Reset snowflake when it hits ground
            if (positions[i + 1] < 0) {
                positions[i + 1] = 50;
                positions[i] = (Math.random() - 0.5) * 150;
                positions[i + 2] = (Math.random() - 0.5) * 150;
            }
        }

        snow.geometry.attributes.position.needsUpdate = true;
    });
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    updatePlayer(delta);
    updateCamera();
    updateNPCs();
    updateSnow(delta);

    renderer.render(scene, camera);
}

