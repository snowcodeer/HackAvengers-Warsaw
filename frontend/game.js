// 3D Game World using Three.js
import { initHandTracker, getControlData, getHandshakeStatus, updateHandshakeUI } from './camera/handinput.js';
import { startMirageStream, stopMirageStream } from './mirage.js';
import { audioManager } from './core/AudioManager.js';

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
let currentSpeaker = null;
let chatHistory = [];
let isZoomedIn = false;
let originalCameraPos = null;
let targetCameraPos = null;
let targetLookAt = null;

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
    hairColor: '#2c1810',
    hairStyle: 0,
    outfit: 0,
    accessory: 0,
    hat: 0
};

// Mock Journal Data
const journalData = {
    wordsLearned: [
        { polish: 'Cześć', english: 'Hello', pronunciation: 'cheshch' },
        { polish: 'Dziękuję', english: 'Thank you', pronunciation: 'jen-KOO-yeh' },
        { polish: 'Proszę', english: 'Please / You\'re welcome', pronunciation: 'PRO-sheh' },
        { polish: 'Tak', english: 'Yes', pronunciation: 'tahk' },
        { polish: 'Nie', english: 'No', pronunciation: 'nyeh' },
        { polish: 'Dzień dobry', english: 'Good day', pronunciation: 'jen DOB-ri' },
        { polish: 'Do widzenia', english: 'Goodbye', pronunciation: 'do vee-DZEN-ya' },
        { polish: 'Przepraszam', english: 'Excuse me / Sorry', pronunciation: 'psheh-PRA-shahm' },
    ],
    attempts: [
        { word: 'Cześć', accuracy: 92, status: 'good' },
        { word: 'Dziękuję', accuracy: 78, status: 'medium' },
        { word: 'Przepraszam', accuracy: 65, status: 'medium' },
        { word: 'Proszę', accuracy: 88, status: 'good' },
        { word: 'Do widzenia', accuracy: 45, status: 'poor' },
        { word: 'Dzień dobry', accuracy: 71, status: 'medium' },
    ]
};

// NPC dialogue data with Polish words - more detailed character designs
const npcData = [
    {
        name: 'Elder Frost',
        position: { x: 15, z: 15 },
        appearance: {
            skinColor: 0xffd5b5,
            outfitColor: 0x4a90d9,
            outfitSecondary: 0x8b6914,
            outfitStyle: 'robe',
            hairColor: 0xcccccc,
            hairStyle: 'bald',
            hat: 'none',
            accessory: 'glasses',
            hasBeard: true,
            pantsColor: 0x2c3e50
        },
        dialogue: [
            { speaker: 'npc', text: "Cześć! Welcome to our village, traveler!" },
            { speaker: 'player', text: "Hello! This place is beautiful." },
            { speaker: 'npc', text: "Dziękuję! The winter has been harsh..." },
            { speaker: 'npc', text: "But we manage with good company!" },
            { speaker: 'player', text: "I'd love to learn more about your culture." },
            { speaker: 'npc', text: "Feel free to explore! Do widzenia!" }
        ]
    },
    {
        name: 'Farmer Beet',
        position: { x: -20, z: 10 },
        appearance: {
            skinColor: 0xc68642,
            outfitColor: 0x3498db,
            outfitSecondary: 0x2980b9,
            outfitStyle: 'overalls',
            hairColor: 0x2c1810,
            hairStyle: 'short',
            hat: 'straw',
            accessory: 'none',
            hasBeard: false,
            pantsColor: 0x3498db
        },
        dialogue: [
            { speaker: 'npc', text: "Dzień dobry, stranger!" },
            { speaker: 'player', text: "Good morning! Nice farm you have." },
            { speaker: 'npc', text: "Dziękuję! I grow the best turnips!" },
            { speaker: 'npc', text: "Even in winter, my greenhouse works." },
            { speaker: 'player', text: "That's impressive dedication!" },
            { speaker: 'npc', text: "Proszę, stop by for vegetables anytime!" }
        ]
    },
    {
        name: 'Blacksmith Ember',
        position: { x: 25, z: -15 },
        appearance: {
            skinColor: 0x8d5524,
            outfitColor: 0x4a3020,
            outfitSecondary: 0x8b6914,
            outfitStyle: 'apron',
            hairColor: 0x1a1a1a,
            hairStyle: 'mohawk',
            hat: 'none',
            accessory: 'goggles',
            hasBeard: true,
            pantsColor: 0x2c1810
        },
        dialogue: [
            { speaker: 'npc', text: "*clang clang* Cześć! A visitor!" },
            { speaker: 'player', text: "Hello! What are you working on?" },
            { speaker: 'npc', text: "I forge the finest tools here." },
            { speaker: 'player', text: "Your craftsmanship looks amazing." },
            { speaker: 'npc', text: "Dziękuję! Let me know if you need anything crafted!" }
        ]
    },
    {
        name: 'Merchant Luna',
        position: { x: -15, z: -20 },
        appearance: {
            skinColor: 0xf5c09a,
            outfitColor: 0x9b59b6,
            outfitSecondary: 0x8e44ad,
            outfitStyle: 'dress',
            hairColor: 0xe91e63,
            hairStyle: 'long',
            hat: 'beret',
            accessory: 'earrings',
            hasBeard: false,
            pantsColor: 0x9b59b6
        },
        dialogue: [
            { speaker: 'npc', text: "Dzień dobry, dear customer~" },
            { speaker: 'player', text: "What do you sell here?" },
            { speaker: 'npc', text: "I have wares from across the land!" },
            { speaker: 'npc', text: "Proszę, take a look around~" },
            { speaker: 'player', text: "I'll definitely browse your collection." },
            { speaker: 'npc', text: "Dziękuję! Do widzenia!" }
        ]
    },
    {
        name: 'Guard Rex',
        position: { x: 0, z: 30 },
        appearance: {
            skinColor: 0xffd5b5,
            outfitColor: 0x2c3e50,
            outfitSecondary: 0xf1c40f,
            outfitStyle: 'uniform',
            hairColor: 0x2c1810,
            hairStyle: 'buzz',
            hat: 'police',
            accessory: 'badge',
            hasBeard: false,
            pantsColor: 0x2c3e50
        },
        dialogue: [
            { speaker: 'npc', text: "Halt! State your business!" },
            { speaker: 'player', text: "I'm just exploring the village..." },
            { speaker: 'npc', text: "...Just kidding! Cześć!" },
            { speaker: 'npc', text: "I'm Rex, head of the guard." },
            { speaker: 'player', text: "Is it safe around here?" },
            { speaker: 'npc', text: "Tak! Very peaceful. Stay vigilant though!" }
        ]
    },
    {
        name: 'Chef Pierre',
        position: { x: 35, z: 5 },
        appearance: {
            skinColor: 0xffd5b5,
            outfitColor: 0xffffff,
            outfitSecondary: 0xf1c40f,
            outfitStyle: 'chef',
            hairColor: 0x2c1810,
            hairStyle: 'curly',
            hat: 'chef',
            accessory: 'mustache',
            hasBeard: false,
            pantsColor: 0x1a1a2e
        },
        dialogue: [
            { speaker: 'npc', text: "Bon appetit! I mean... Cześć!" },
            { speaker: 'player', text: "Something smells delicious!" },
            { speaker: 'npc', text: "Dziękuję! I'm preparing pierogi today!" },
            { speaker: 'npc', text: "Polish cuisine is magnifique!" },
            { speaker: 'player', text: "I'd love to try some!" },
            { speaker: 'npc', text: "Proszę, visit me after cooking!" }
        ]
    },
    {
        name: 'Builder Kaz',
        position: { x: -30, z: -30 },
        appearance: {
            skinColor: 0xc68642,
            outfitColor: 0xf39c12,
            outfitSecondary: 0xcccccc,
            outfitStyle: 'vest',
            hairColor: 0x1a1a1a,
            hairStyle: 'flat',
            hat: 'hardhat',
            accessory: 'none',
            hasBeard: true,
            pantsColor: 0x34495e
        },
        dialogue: [
            { speaker: 'npc', text: "Cześć! Watch your step here!" },
            { speaker: 'player', text: "What are you building?" },
            { speaker: 'npc', text: "A new community center!" },
            { speaker: 'npc', text: "Everyone in the village helps out." },
            { speaker: 'player', text: "That's wonderful teamwork!" },
            { speaker: 'npc', text: "Tak! Do widzenia, stay safe!" }
        ]
    },
    {
        name: 'Artist Mila',
        position: { x: -40, z: 25 },
        appearance: {
            skinColor: 0xf5c09a,
            outfitColor: 0x1abc9c,
            outfitSecondary: 0x16a085,
            outfitStyle: 'smock',
            hairColor: 0x9b59b6,
            hairStyle: 'pigtails',
            hat: 'none',
            accessory: 'paintbrush',
            hasBeard: false,
            pantsColor: 0x8e44ad
        },
        dialogue: [
            { speaker: 'npc', text: "Dzień dobry, fellow creative!" },
            { speaker: 'player', text: "Your paintings are beautiful!" },
            { speaker: 'npc', text: "Dziękuję! Art captures the soul!" },
            { speaker: 'npc', text: "Would you like to see my gallery?" },
            { speaker: 'player', text: "I'd love that!" },
            { speaker: 'npc', text: "Proszę, follow me sometime!" }
        ]
    },
    {
        name: 'Sailor Jack',
        position: { x: 45, z: 25 },
        appearance: {
            skinColor: 0xdba97a,
            outfitColor: 0x1e3a5f,
            outfitSecondary: 0xffffff,
            outfitStyle: 'striped',
            hairColor: 0xf5e050,
            hairStyle: 'short',
            hat: 'cap',
            accessory: 'none',
            hasBeard: true,
            pantsColor: 0x1a1a2e
        },
        dialogue: [
            { speaker: 'npc', text: "Ahoy there! Cześć, landluber!" },
            { speaker: 'player', text: "A sailor? In a winter village?" },
            { speaker: 'npc', text: "Ha! The lake freezes, but sailors never rest!" },
            { speaker: 'npc', text: "Dziękuję for the company!" },
            { speaker: 'player', text: "Any stories from the waters?" },
            { speaker: 'npc', text: "Many! Come visit my boat sometime. Do widzenia!" }
        ]
    },
    {
        name: 'Nurse Rosa',
        position: { x: -50, z: -10 },
        appearance: {
            skinColor: 0xffecd2,
            outfitColor: 0xff69b4,
            outfitSecondary: 0xffffff,
            outfitStyle: 'scrubs',
            hairColor: 0xff6b6b,
            hairStyle: 'ponytail',
            hat: 'none',
            accessory: 'glasses',
            hasBeard: false,
            pantsColor: 0xff69b4
        },
        dialogue: [
            { speaker: 'npc', text: "Dzień dobry! Are you feeling well?" },
            { speaker: 'player', text: "I'm fine, just exploring!" },
            { speaker: 'npc', text: "That's wonderful! Stay warm out there." },
            { speaker: 'npc', text: "The cold can be harsh on newcomers." },
            { speaker: 'player', text: "Any health tips?" },
            { speaker: 'npc', text: "Drink warm tea! Proszę, visit if you need anything!" }
        ]
    },
    {
        name: 'Scholar Tym',
        position: { x: 50, z: -30 },
        appearance: {
            skinColor: 0xa56b3a,
            outfitColor: 0x4a148c,
            outfitSecondary: 0x8b6914,
            outfitStyle: 'robe',
            hairColor: 0x27ae60,
            hairStyle: 'wavy',
            hat: 'wizard',
            accessory: 'round_glasses',
            hasBeard: false,
            pantsColor: 0x2c1810
        },
        dialogue: [
            { speaker: 'npc', text: "Cześć, curious traveler!" },
            { speaker: 'player', text: "Are you a wizard?" },
            { speaker: 'npc', text: "A scholar! Though some call me... mysterious." },
            { speaker: 'npc', text: "Dziękuję for visiting the library!" },
            { speaker: 'player', text: "What do you study?" },
            { speaker: 'npc', text: "Languages! Polish is fascinating. Do widzenia!" }
        ]
    },
    {
        name: 'Thief Marcus',
        position: { x: -55, z: 40 },
        appearance: {
            skinColor: 0x5c3d2e,
            outfitColor: 0x1a1a1a,
            outfitSecondary: 0x2c3e50,
            outfitStyle: 'cloak',
            hairColor: 0x1a1a1a,
            hairStyle: 'slickback',
            hat: 'hood',
            accessory: 'eyepatch',
            hasBeard: true,
            pantsColor: 0x1a1a2e
        },
        dialogue: [
            { speaker: 'npc', text: "Psst... Cześć, stranger." },
            { speaker: 'player', text: "Who are you?" },
            { speaker: 'npc', text: "Just a... traveling merchant. Tak, that's it." },
            { speaker: 'npc', text: "I have rare items, if you're interested." },
            { speaker: 'player', text: "Sounds suspicious..." },
            { speaker: 'npc', text: "Nie, nie! Everything is legitimate! Do widzenia!" }
        ]
    },
    {
        name: 'Dancer Zofia',
        position: { x: 20, z: 45 },
        appearance: {
            skinColor: 0xf5c09a,
            outfitColor: 0xe74c3c,
            outfitSecondary: 0xf1c40f,
            outfitStyle: 'dress',
            hairColor: 0x2c1810,
            hairStyle: 'curly',
            hat: 'flower',
            accessory: 'earrings',
            hasBeard: false,
            pantsColor: 0xe74c3c
        },
        dialogue: [
            { speaker: 'npc', text: "Dzień dobry! Care to dance?" },
            { speaker: 'player', text: "I don't know how to dance..." },
            { speaker: 'npc', text: "That's okay! Feel the music in your heart!" },
            { speaker: 'npc', text: "Polish folk dances are beautiful!" },
            { speaker: 'player', text: "Maybe you could teach me sometime?" },
            { speaker: 'npc', text: "Tak! Dziękuję for your enthusiasm! Do widzenia!" }
        ]
    },
    {
        name: 'Miner Gus',
        position: { x: -25, z: 55 },
        appearance: {
            skinColor: 0x8d5524,
            outfitColor: 0x556b2f,
            outfitSecondary: 0x8b4513,
            outfitStyle: 'overalls',
            hairColor: 0x8b4513,
            hairStyle: 'buzz',
            hat: 'hardhat',
            accessory: 'goggles',
            hasBeard: true,
            pantsColor: 0x556b2f
        },
        dialogue: [
            { speaker: 'npc', text: "Cześć! Fresh from the mines!" },
            { speaker: 'player', text: "What do you mine here?" },
            { speaker: 'npc', text: "Precious gems and coal!" },
            { speaker: 'npc', text: "Dziękuję for asking! Most folks avoid us miners." },
            { speaker: 'player', text: "It sounds like hard work." },
            { speaker: 'npc', text: "Tak, but rewarding! Do widzenia, friend!" }
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

    // Setup Voice Input
    setupVoiceInput();

    // Setup Journal
    setupJournal();

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
        clone.play().catch(() => { });
    }
}

// Start ambient sounds (call after user interaction)
async function startAmbientSounds() {
    if (ambientWind && ambientWind.paused) {
        ambientWind.play().catch(() => { });
    }
    
    // 🎵 Start Polish background music using AudioManager
    await audioManager.initialize();
    await audioManager.playMusic('polish');
    console.log('🎵 Polish background music started');
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
    if (footstepSounds.length === 0) return;

    const sound = footstepSounds[Math.floor(Math.random() * footstepSounds.length)];

    // Clone to allow overlapping sounds
    const clone = sound.cloneNode();
    clone.volume = 0.3 + Math.random() * 0.2;
    clone.playbackRate = 0.9 + Math.random() * 0.2;
    clone.play().catch(() => { }); // Ignore autoplay errors
}

function setupJournal() {
    const journalBtn = document.getElementById('journalBtn');
    const journalBtnChat = document.getElementById('journalBtnChat');
    const journalModal = document.getElementById('journalModal');
    const journalClose = document.getElementById('journalClose');

    // Main journal button (when not in dialogue)
    journalBtn.addEventListener('click', () => {
        populateJournal();
        journalModal.classList.add('active');
    });

    // Journal button next to chat (during dialogue)
    journalBtnChat.addEventListener('click', () => {
        populateJournal();
        journalModal.classList.add('active');
    });

    journalClose.addEventListener('click', () => {
        journalModal.classList.remove('active');
    });

    journalModal.addEventListener('click', (e) => {
        if (e.target === journalModal) {
            journalModal.classList.remove('active');
        }
    });
}

function populateJournal() {
    // Populate words learned
    const wordList = document.getElementById('wordList');
    wordList.innerHTML = journalData.wordsLearned.map(word => `
        <div class="word-item">
            <div class="word-polish">${word.polish}</div>
            <div class="word-english">${word.english}</div>
            <div class="word-pronunciation">/${word.pronunciation}/</div>
        </div>
    `).join('');

    // Populate attempts
    const attemptList = document.getElementById('attemptList');
    attemptList.innerHTML = journalData.attempts.map(attempt => `
        <div class="attempt-item">
            <span class="attempt-word">${attempt.word}</span>
            <span class="attempt-accuracy ${attempt.status}">${attempt.accuracy}%</span>
        </div>
    `).join('');
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
    const ambient = new THREE.AmbientLight(0xb0c4de, 0.6);
    scene.add(ambient);

    // Directional light (sun)
    const sunlight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunlight.position.set(50, 100, 50);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.width = 2048;
    sunlight.shadow.mapSize.height = 2048;
    sunlight.shadow.camera.near = 0.5;
    sunlight.shadow.camera.far = 500;
    sunlight.shadow.camera.left = -100;
    sunlight.shadow.camera.right = 100;
    sunlight.shadow.camera.top = 100;
    sunlight.shadow.camera.bottom = -100;
    scene.add(sunlight);

    // Hemisphere light for nice sky color
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x98d98d, 0.4);
    scene.add(hemiLight);
}

function createGround() {
    // Snow-covered ground
    const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.8,
        metalness: 0.1
    });

    // Add some variation to ground
    const positions = groundGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        positions.setZ(i, Math.random() * 0.5);
    }
    groundGeometry.computeVertexNormals();

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grass patches peeking through
    for (let i = 0; i < 30; i++) {
        const patchGeometry = new THREE.CircleGeometry(1 + Math.random() * 2, 8);
        const patchMaterial = new THREE.MeshStandardMaterial({ color: 0x5a8a5a });
        const patch = new THREE.Mesh(patchGeometry, patchMaterial);
        patch.rotation.x = -Math.PI / 2;
        patch.position.set(
            (Math.random() - 0.5) * 150,
            0.01,
            (Math.random() - 0.5) * 150
        );
        scene.add(patch);
    }
}

function createPlayer() {
    player = new THREE.Group();

    const outfitColor = parseInt(characterData.outfitColor.replace('#', '0x'));
    const skinColor = parseInt(characterData.skinColor.replace('#', '0x'));
    const hairColor = parseInt(characterData.hairColor.replace('#', '0x'));

    const hairStyles = ['Spiky', 'Mohawk', 'Flat Top', 'Long', 'Short', 'Ponytail', 'Bald', 'Curly', 'Afro', 'Pigtails', 'Buzz Cut', 'Side Part'];
    const hats = ['None', 'Cap', 'Beanie', 'Top Hat', 'Cowboy', 'Hard Hat', 'Crown', 'Headphones', 'Police Cap', 'Beret'];
    const accessories = ['None', 'Glasses', 'Sunglasses', 'Round Glasses', 'Eye Patch', 'Monocle', 'Bandana', 'Scarf'];

    const currentHairStyle = hairStyles[characterData.hairStyle] || 'Spiky';
    const currentHat = hats[characterData.hat] || 'None';
    const currentAccessory = accessories[characterData.accessory] || 'None';

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x3a3a5a });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.35, 0.5, 0);
    leftLeg.castShadow = true;
    player.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.35, 0.5, 0);
    rightLeg.castShadow = true;
    player.add(rightLeg);

    // Shoes
    const shoeGeometry = new THREE.BoxGeometry(0.55, 0.25, 0.6);
    const shoeMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3020 });

    const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
    leftShoe.position.set(-0.35, 0.12, 0.05);
    player.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
    rightShoe.position.set(0.35, 0.12, 0.05);
    player.add(rightShoe);

    // Body
    const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: outfitColor });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 2;
    body.castShadow = true;
    player.add(body);

    // Arms
    const armGeometry = new THREE.BoxGeometry(0.4, 1.5, 0.4);
    const armMaterial = new THREE.MeshStandardMaterial({ color: skinColor });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.95, 2.2, 0);
    leftArm.castShadow = true;
    player.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.95, 2.2, 0);
    rightArm.castShadow = true;
    player.add(rightArm);

    // Hands
    const handGeometry = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const handMaterial = new THREE.MeshStandardMaterial({ color: skinColor });

    const leftHand = new THREE.Mesh(handGeometry, handMaterial);
    leftHand.position.set(-0.95, 1.3, 0);
    player.add(leftHand);

    const rightHand = new THREE.Mesh(handGeometry, handMaterial);
    rightHand.position.set(0.95, 1.3, 0);
    player.add(rightHand);

    // Head
    const headGeometry = new THREE.BoxGeometry(1, 1, 1);
    const headMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 3.5;
    head.castShadow = true;
    player.add(head);

    // Eyes
    const eyeGeometry = new THREE.BoxGeometry(0.18, 0.18, 0.1);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x2c2c2c });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.25, 3.55, 0.5);
    player.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.25, 3.55, 0.5);
    player.add(rightEye);

    // Eye highlights
    const highlightGeometry = new THREE.BoxGeometry(0.06, 0.06, 0.05);
    const highlightMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });

    const leftHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    leftHighlight.position.set(-0.22, 3.58, 0.55);
    player.add(leftHighlight);

    const rightHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    rightHighlight.position.set(0.28, 3.58, 0.55);
    player.add(rightHighlight);

    // Eyebrows
    const browGeometry = new THREE.BoxGeometry(0.22, 0.06, 0.1);
    const browMaterial = new THREE.MeshStandardMaterial({ color: hairColor });

    const leftBrow = new THREE.Mesh(browGeometry, browMaterial);
    leftBrow.position.set(-0.25, 3.72, 0.5);
    player.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeometry, browMaterial);
    rightBrow.position.set(0.25, 3.72, 0.5);
    player.add(rightBrow);

    // Mouth
    const mouthGeometry = new THREE.BoxGeometry(0.3, 0.08, 0.1);
    const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 3.25, 0.5);
    player.add(mouth);

    // Hair based on style
    const hairMaterial = new THREE.MeshStandardMaterial({ color: hairColor });

    if (currentHairStyle !== 'Bald') {
        if (currentHairStyle === 'Spiky') {
            const spikeGeometry = new THREE.BoxGeometry(0.2, 0.4, 0.2);
            const positions = [
                [-0.3, 4.2, 0.2], [0, 4.3, 0.2], [0.3, 4.2, 0.2],
                [-0.2, 4.15, -0.2], [0.2, 4.15, -0.2]
            ];
            positions.forEach(pos => {
                const spike = new THREE.Mesh(spikeGeometry, hairMaterial);
                spike.position.set(...pos);
                player.add(spike);
            });
        } else if (currentHairStyle === 'Short' || currentHairStyle === 'Buzz Cut') {
            const hairGeometry = new THREE.BoxGeometry(1.05, 0.3, 1.05);
            const hair = new THREE.Mesh(hairGeometry, hairMaterial);
            hair.position.set(0, 4.1, 0);
            player.add(hair);
        } else if (currentHairStyle === 'Mohawk') {
            const mohawkGeometry = new THREE.BoxGeometry(0.25, 0.7, 0.8);
            const mohawk = new THREE.Mesh(mohawkGeometry, hairMaterial);
            mohawk.position.set(0, 4.3, 0);
            player.add(mohawk);
        } else if (currentHairStyle === 'Long') {
            const topGeometry = new THREE.BoxGeometry(1.1, 0.3, 1.1);
            const top = new THREE.Mesh(topGeometry, hairMaterial);
            top.position.set(0, 4.1, 0);
            player.add(top);
            const sideGeometry = new THREE.BoxGeometry(0.2, 1.2, 1.1);
            const leftSide = new THREE.Mesh(sideGeometry, hairMaterial);
            leftSide.position.set(-0.55, 3.5, 0);
            player.add(leftSide);
            const rightSide = new THREE.Mesh(sideGeometry, hairMaterial);
            rightSide.position.set(0.55, 3.5, 0);
            player.add(rightSide);
        } else if (currentHairStyle === 'Curly' || currentHairStyle === 'Afro') {
            const size = currentHairStyle === 'Afro' ? 0.5 : 0.35;
            const puffGeometry = new THREE.BoxGeometry(size, size, size);
            const positions = [
                [-0.3, 4.15, 0.2], [0.3, 4.15, 0.2], [0, 4.2, 0.3],
                [-0.35, 4.1, -0.2], [0.35, 4.1, -0.2], [0, 4.15, -0.3]
            ];
            positions.forEach(pos => {
                const puff = new THREE.Mesh(puffGeometry, hairMaterial);
                puff.position.set(...pos);
                player.add(puff);
            });
        } else if (currentHairStyle === 'Ponytail') {
            const topGeometry = new THREE.BoxGeometry(1.05, 0.2, 1.05);
            const top = new THREE.Mesh(topGeometry, hairMaterial);
            top.position.set(0, 4.05, 0);
            player.add(top);
            const tailGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.25);
            const tail = new THREE.Mesh(tailGeometry, hairMaterial);
            tail.position.set(0, 3.5, -0.5);
            player.add(tail);
        } else if (currentHairStyle === 'Pigtails') {
            const topGeometry = new THREE.BoxGeometry(1.05, 0.2, 1.05);
            const top = new THREE.Mesh(topGeometry, hairMaterial);
            top.position.set(0, 4.05, 0);
            player.add(top);
            const tailGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.25);
            const leftTail = new THREE.Mesh(tailGeometry, hairMaterial);
            leftTail.position.set(-0.55, 3.5, 0);
            player.add(leftTail);
            const rightTail = new THREE.Mesh(tailGeometry, hairMaterial);
            rightTail.position.set(0.55, 3.5, 0);
            player.add(rightTail);
        } else if (currentHairStyle === 'Flat Top') {
            const flatGeometry = new THREE.BoxGeometry(1.1, 0.25, 1.1);
            const flat = new THREE.Mesh(flatGeometry, hairMaterial);
            flat.position.set(0, 4.1, 0);
            player.add(flat);
        } else if (currentHairStyle === 'Side Part') {
            const partGeometry = new THREE.BoxGeometry(1.1, 0.35, 1.05);
            const part = new THREE.Mesh(partGeometry, hairMaterial);
            part.position.set(-0.1, 4.1, 0);
            player.add(part);
        }
    }

    // Hats
    if (currentHat !== 'None') {
        if (currentHat === 'Cap') {
            const capGeometry = new THREE.BoxGeometry(1.1, 0.35, 1.1);
            const capMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
            const cap = new THREE.Mesh(capGeometry, capMaterial);
            cap.position.set(0, 4.15, 0);
            player.add(cap);
            const visorGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.4);
            const visor = new THREE.Mesh(visorGeometry, capMaterial);
            visor.position.set(0, 4.05, 0.6);
            player.add(visor);
        } else if (currentHat === 'Beanie') {
            const beanieGeometry = new THREE.BoxGeometry(1.1, 0.5, 1.1);
            const beanieMaterial = new THREE.MeshStandardMaterial({ color: 0x8e44ad });
            const beanie = new THREE.Mesh(beanieGeometry, beanieMaterial);
            beanie.position.set(0, 4.2, 0);
            player.add(beanie);
        } else if (currentHat === 'Crown') {
            const baseGeometry = new THREE.BoxGeometry(1.1, 0.2, 1.1);
            const crownMaterial = new THREE.MeshStandardMaterial({ color: 0xf1c40f, emissive: 0xf1c40f, emissiveIntensity: 0.2 });
            const base = new THREE.Mesh(baseGeometry, crownMaterial);
            base.position.set(0, 4.1, 0);
            player.add(base);
            const spikeGeometry = new THREE.BoxGeometry(0.15, 0.3, 0.15);
            const spikePos = [[-0.35, 4.35, 0], [0, 4.4, 0], [0.35, 4.35, 0]];
            spikePos.forEach(pos => {
                const spike = new THREE.Mesh(spikeGeometry, crownMaterial);
                spike.position.set(...pos);
                player.add(spike);
            });
        }
    }

    // Accessories
    if (currentAccessory !== 'None') {
        if (currentAccessory === 'Glasses' || currentAccessory === 'Round Glasses') {
            const frameGeometry = new THREE.BoxGeometry(0.9, 0.2, 0.1);
            const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(0, 3.55, 0.55);
            player.add(frame);
        } else if (currentAccessory === 'Sunglasses') {
            const lensGeometry = new THREE.BoxGeometry(0.28, 0.2, 0.1);
            const lensMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
            const leftLens = new THREE.Mesh(lensGeometry, lensMaterial);
            leftLens.position.set(-0.25, 3.55, 0.55);
            player.add(leftLens);
            const rightLens = new THREE.Mesh(lensGeometry, lensMaterial);
            rightLens.position.set(0.25, 3.55, 0.55);
            player.add(rightLens);
        } else if (currentAccessory === 'Scarf') {
            const scarfGeometry = new THREE.BoxGeometry(1.6, 0.3, 0.3);
            const scarfMaterial = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
            const scarf = new THREE.Mesh(scarfGeometry, scarfMaterial);
            scarf.position.set(0, 2.9, 0.3);
            player.add(scarf);
        }
    }

    player.position.set(0, 0, 0);
    scene.add(player);
}

function createNPCs() {
    npcData.forEach(data => {
        const npc = createNPC(data.appearance);
        npc.position.set(data.position.x, 0, data.position.z);
        npc.userData.name = data.name;
        npc.userData.dialogue = data.dialogue;
        npc.userData.appearance = data.appearance;
        npcs.push(npc);
        scene.add(npc);

        // Add name label
        createNameLabel(npc, data.name);
    });
}

function createNPC(appearance) {
    const npc = new THREE.Group();

    const { skinColor, outfitColor, outfitSecondary, outfitStyle, hairColor, hairStyle, hat, accessory, hasBeard, pantsColor } = appearance;

    // Legs with custom pants color
    const legGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const legMaterial = new THREE.MeshStandardMaterial({ color: pantsColor || 0x3a3a5a });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.35, 0.5, 0);
    leftLeg.castShadow = true;
    npc.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.35, 0.5, 0);
    rightLeg.castShadow = true;
    npc.add(rightLeg);

    // Shoes
    const shoeGeometry = new THREE.BoxGeometry(0.55, 0.25, 0.6);
    const shoeMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3020 });

    const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
    leftShoe.position.set(-0.35, 0.12, 0.05);
    npc.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
    rightShoe.position.set(0.35, 0.12, 0.05);
    npc.add(rightShoe);

    // Body - varies by outfit style
    let bodyWidth = 1.5;
    let bodyHeight = 2;

    if (outfitStyle === 'dress') {
        // Dress - wider at bottom
        const dressGeometry = new THREE.BoxGeometry(1.8, 2.2, 1);
        const dressMaterial = new THREE.MeshStandardMaterial({ color: outfitColor });
        const dress = new THREE.Mesh(dressGeometry, dressMaterial);
        dress.position.y = 2;
        dress.castShadow = true;
        npc.add(dress);
        // Dress trim
        const trimGeometry = new THREE.BoxGeometry(1.85, 0.15, 1.05);
        const trimMaterial = new THREE.MeshStandardMaterial({ color: outfitSecondary || 0xf1c40f });
        const trim = new THREE.Mesh(trimGeometry, trimMaterial);
        trim.position.y = 1;
        npc.add(trim);
    } else if (outfitStyle === 'striped') {
        // Striped shirt - multiple colored layers
        const bodyGeometry = new THREE.BoxGeometry(bodyWidth, bodyHeight, 1);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: outfitColor });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 2;
        body.castShadow = true;
        npc.add(body);
        // Add horizontal stripes
        const stripeColor = outfitSecondary || 0xffffff;
        for (let i = 0; i < 4; i++) {
            const stripeGeometry = new THREE.BoxGeometry(bodyWidth + 0.02, 0.25, 1.02);
            const stripeMaterial = new THREE.MeshStandardMaterial({ color: stripeColor });
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
            stripe.position.y = 1.3 + i * 0.5;
            npc.add(stripe);
        }
    } else if (outfitStyle === 'cloak') {
        // Dark cloak
        const cloakGeometry = new THREE.BoxGeometry(1.8, 2.3, 1.2);
        const cloakMaterial = new THREE.MeshStandardMaterial({ color: outfitColor });
        const cloak = new THREE.Mesh(cloakGeometry, cloakMaterial);
        cloak.position.y = 2;
        cloak.castShadow = true;
        npc.add(cloak);
    } else if (outfitStyle === 'scrubs') {
        // Medical scrubs
        const bodyGeometry = new THREE.BoxGeometry(bodyWidth, bodyHeight, 1);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: outfitColor });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 2;
        body.castShadow = true;
        npc.add(body);
        // V-neck collar
        const collarGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.1);
        const collarMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
        const collar = new THREE.Mesh(collarGeometry, collarMaterial);
        collar.position.set(0, 2.85, 0.5);
        npc.add(collar);
    } else {
        const bodyGeometry = new THREE.BoxGeometry(bodyWidth, bodyHeight, 1);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: outfitColor });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 2;
        body.castShadow = true;
        npc.add(body);
    }

    // Outfit details
    if (outfitStyle === 'overalls') {
        // Overalls straps
        const strapGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.1);
        const strapMaterial = new THREE.MeshStandardMaterial({ color: outfitColor });
        const leftStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        leftStrap.position.set(-0.4, 2.8, 0.5);
        npc.add(leftStrap);
        const rightStrap = new THREE.Mesh(strapGeometry, strapMaterial);
        rightStrap.position.set(0.4, 2.8, 0.5);
        npc.add(rightStrap);
    } else if (outfitStyle === 'uniform' || outfitStyle === 'chef') {
        // Buttons
        const buttonGeometry = new THREE.BoxGeometry(0.12, 0.12, 0.1);
        const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0xf1c40f });
        for (let i = 0; i < 3; i++) {
            const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
            button.position.set(0, 2.6 - i * 0.4, 0.55);
            npc.add(button);
        }
    } else if (outfitStyle === 'apron') {
        // Blacksmith apron
        const apronGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.15);
        const apronMaterial = new THREE.MeshStandardMaterial({ color: 0x8b6914 });
        const apron = new THREE.Mesh(apronGeometry, apronMaterial);
        apron.position.set(0, 1.8, 0.55);
        npc.add(apron);
    } else if (outfitStyle === 'vest') {
        // Construction vest stripes
        const stripeGeometry = new THREE.BoxGeometry(0.1, 1.5, 0.1);
        const stripeMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, emissive: 0x444444 });
        const leftStripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        leftStripe.position.set(-0.5, 2.2, 0.55);
        npc.add(leftStripe);
        const rightStripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        rightStripe.position.set(0.5, 2.2, 0.55);
        npc.add(rightStripe);
    } else if (outfitStyle === 'robe') {
        // Robe collar
        const collarGeometry = new THREE.BoxGeometry(1.6, 0.3, 0.3);
        const collarMaterial = new THREE.MeshStandardMaterial({ color: outfitSecondary || 0x8b6914 });
        const collar = new THREE.Mesh(collarGeometry, collarMaterial);
        collar.position.set(0, 2.85, 0.3);
        npc.add(collar);
    } else if (outfitStyle === 'smock') {
        // Artist smock - like a loose shirt with paint splatters
        const smockGeometry = new THREE.BoxGeometry(1.6, 2.1, 1);
        const smockMaterial = new THREE.MeshStandardMaterial({ color: outfitColor });
        const smock = new THREE.Mesh(smockGeometry, smockMaterial);
        smock.position.y = 2;
        smock.castShadow = true;
        npc.add(smock);
        // Paint splatters
        const splatterColors = [0xe74c3c, 0xf1c40f, 0x3498db, 0x9b59b6];
        const splatterPositions = [
            [-0.4, 2.3, 0.52], [0.3, 1.8, 0.52], [-0.2, 1.5, 0.52], [0.4, 2.5, 0.52]
        ];
        splatterPositions.forEach((pos, i) => {
            const splatterGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.05);
            const splatterMaterial = new THREE.MeshStandardMaterial({ color: splatterColors[i] });
            const splatter = new THREE.Mesh(splatterGeometry, splatterMaterial);
            splatter.position.set(...pos);
            npc.add(splatter);
        });
    }

    // Arms
    const armGeometry = new THREE.BoxGeometry(0.4, 1.5, 0.4);
    const armMaterial = new THREE.MeshStandardMaterial({ color: skinColor });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.65, 2.2, 0);
    leftArm.castShadow = true;
    npc.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.65, 2.2, 0);
    rightArm.castShadow = true;
    npc.add(rightArm);

    // Hands
    const handGeometry = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const handMaterial = new THREE.MeshStandardMaterial({ color: skinColor });

    const leftHand = new THREE.Mesh(handGeometry, handMaterial);
    leftHand.position.set(-0.65, 1.3, 0);
    npc.add(leftHand);

    const rightHand = new THREE.Mesh(handGeometry, handMaterial);
    rightHand.position.set(0.65, 1.3, 0);
    npc.add(rightHand);

    // Head
    const headGeometry = new THREE.BoxGeometry(1, 1, 1);
    const headMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 3.5;
    head.castShadow = true;
    npc.add(head);

    // Eyes
    const eyeGeometry = new THREE.BoxGeometry(0.18, 0.18, 0.1);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x2c2c2c });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.25, 3.55, 0.5);
    npc.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.25, 3.55, 0.5);
    npc.add(rightEye);

    // Eye highlights
    const highlightGeometry = new THREE.BoxGeometry(0.06, 0.06, 0.05);
    const highlightMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });

    const leftHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    leftHighlight.position.set(-0.22, 3.58, 0.55);
    npc.add(leftHighlight);

    const rightHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    rightHighlight.position.set(0.28, 3.58, 0.55);
    npc.add(rightHighlight);

    // Eyebrows
    const browGeometry = new THREE.BoxGeometry(0.22, 0.06, 0.1);
    const browMaterial = new THREE.MeshStandardMaterial({ color: hairColor });

    const leftBrow = new THREE.Mesh(browGeometry, browMaterial);
    leftBrow.position.set(-0.25, 3.72, 0.5);
    npc.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeometry, browMaterial);
    rightBrow.position.set(0.25, 3.72, 0.5);
    npc.add(rightBrow);

    // Mouth
    const mouthGeometry = new THREE.BoxGeometry(0.3, 0.08, 0.1);
    const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 3.25, 0.5);
    npc.add(mouth);

    // Beard (if has beard)
    if (hasBeard) {
        const beardGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.3);
        const beardMaterial = new THREE.MeshStandardMaterial({ color: hairColor });
        const beard = new THREE.Mesh(beardGeometry, beardMaterial);
        beard.position.set(0, 3.1, 0.4);
        npc.add(beard);
    }

    // Hair styles
    if (hairStyle !== 'bald') {
        const hairMaterial = new THREE.MeshStandardMaterial({ color: hairColor });

        if (hairStyle === 'short' || hairStyle === 'buzz') {
            const hairGeometry = new THREE.BoxGeometry(1.05, 0.3, 1.05);
            const hair = new THREE.Mesh(hairGeometry, hairMaterial);
            hair.position.set(0, 4.1, 0);
            npc.add(hair);
        } else if (hairStyle === 'mohawk') {
            const mohawkGeometry = new THREE.BoxGeometry(0.25, 0.7, 0.8);
            const mohawk = new THREE.Mesh(mohawkGeometry, hairMaterial);
            mohawk.position.set(0, 4.3, 0);
            npc.add(mohawk);
        } else if (hairStyle === 'long') {
            // Top
            const topGeometry = new THREE.BoxGeometry(1.1, 0.3, 1.1);
            const top = new THREE.Mesh(topGeometry, hairMaterial);
            top.position.set(0, 4.1, 0);
            npc.add(top);
            // Sides
            const sideGeometry = new THREE.BoxGeometry(0.2, 1.2, 1.1);
            const leftSide = new THREE.Mesh(sideGeometry, hairMaterial);
            leftSide.position.set(-0.55, 3.5, 0);
            npc.add(leftSide);
            const rightSide = new THREE.Mesh(sideGeometry, hairMaterial);
            rightSide.position.set(0.55, 3.5, 0);
            npc.add(rightSide);
            // Back
            const backGeometry = new THREE.BoxGeometry(1.1, 1.5, 0.2);
            const back = new THREE.Mesh(backGeometry, hairMaterial);
            back.position.set(0, 3.3, -0.55);
            npc.add(back);
        } else if (hairStyle === 'curly') {
            // Curly puffs
            const puffGeometry = new THREE.BoxGeometry(0.35, 0.35, 0.35);
            const positions = [
                [-0.3, 4.15, 0.2], [0.3, 4.15, 0.2], [0, 4.2, 0.3],
                [-0.35, 4.1, -0.2], [0.35, 4.1, -0.2], [0, 4.15, -0.3]
            ];
            positions.forEach(pos => {
                const puff = new THREE.Mesh(puffGeometry, hairMaterial);
                puff.position.set(...pos);
                npc.add(puff);
            });
        } else if (hairStyle === 'flat') {
            const flatGeometry = new THREE.BoxGeometry(1.1, 0.25, 1.1);
            const flat = new THREE.Mesh(flatGeometry, hairMaterial);
            flat.position.set(0, 4.1, 0);
            npc.add(flat);
        } else if (hairStyle === 'pigtails') {
            // Top
            const topGeometry = new THREE.BoxGeometry(1.05, 0.2, 1.05);
            const top = new THREE.Mesh(topGeometry, hairMaterial);
            top.position.set(0, 4.05, 0);
            npc.add(top);
            // Pigtails
            const tailGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.25);
            const leftTail = new THREE.Mesh(tailGeometry, hairMaterial);
            leftTail.position.set(-0.55, 3.5, 0);
            npc.add(leftTail);
            const rightTail = new THREE.Mesh(tailGeometry, hairMaterial);
            rightTail.position.set(0.55, 3.5, 0);
            npc.add(rightTail);
        } else if (hairStyle === 'wavy') {
            // Wavy hair
            const topGeometry = new THREE.BoxGeometry(1.1, 0.4, 1.1);
            const top = new THREE.Mesh(topGeometry, hairMaterial);
            top.position.set(0, 4.15, 0);
            npc.add(top);
            // Side waves
            const waveGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.8);
            const leftWave = new THREE.Mesh(waveGeometry, hairMaterial);
            leftWave.position.set(-0.55, 3.5, 0);
            npc.add(leftWave);
            const rightWave = new THREE.Mesh(waveGeometry, hairMaterial);
            rightWave.position.set(0.55, 3.5, 0);
            npc.add(rightWave);
        } else if (hairStyle === 'slickback') {
            // Slicked back hair
            const slickGeometry = new THREE.BoxGeometry(1.05, 0.25, 1.1);
            const slick = new THREE.Mesh(slickGeometry, hairMaterial);
            slick.position.set(0, 4.08, -0.05);
            npc.add(slick);
        } else if (hairStyle === 'ponytail') {
            // Top
            const topGeometry = new THREE.BoxGeometry(1.05, 0.2, 1.05);
            const top = new THREE.Mesh(topGeometry, hairMaterial);
            top.position.set(0, 4.05, 0);
            npc.add(top);
            // Ponytail
            const tailGeometry = new THREE.BoxGeometry(0.25, 0.9, 0.25);
            const tail = new THREE.Mesh(tailGeometry, hairMaterial);
            tail.position.set(0, 3.4, -0.5);
            npc.add(tail);
        }
    }

    // Hats
    if (hat !== 'none') {
        if (hat === 'straw') {
            // Straw hat brim
            const brimGeometry = new THREE.BoxGeometry(1.6, 0.15, 1.6);
            const brimMaterial = new THREE.MeshStandardMaterial({ color: 0xdaa520 });
            const brim = new THREE.Mesh(brimGeometry, brimMaterial);
            brim.position.set(0, 4.05, 0);
            npc.add(brim);
            // Crown
            const crownGeometry = new THREE.BoxGeometry(0.9, 0.5, 0.9);
            const crown = new THREE.Mesh(crownGeometry, brimMaterial);
            crown.position.set(0, 4.3, 0);
            npc.add(crown);
        } else if (hat === 'police') {
            const capGeometry = new THREE.BoxGeometry(1.1, 0.35, 1.1);
            const capMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
            const cap = new THREE.Mesh(capGeometry, capMaterial);
            cap.position.set(0, 4.15, 0);
            npc.add(cap);
            // Badge
            const badgeGeometry = new THREE.BoxGeometry(0.25, 0.2, 0.1);
            const badgeMaterial = new THREE.MeshStandardMaterial({ color: 0xf1c40f, emissive: 0xf1c40f, emissiveIntensity: 0.3 });
            const badge = new THREE.Mesh(badgeGeometry, badgeMaterial);
            badge.position.set(0, 4.2, 0.55);
            npc.add(badge);
            // Visor
            const visorGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.4);
            const visorMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
            const visor = new THREE.Mesh(visorGeometry, visorMaterial);
            visor.position.set(0, 4.05, 0.6);
            npc.add(visor);
        } else if (hat === 'chef') {
            const chefHatGeometry = new THREE.BoxGeometry(0.9, 0.8, 0.9);
            const chefHatMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const chefHat = new THREE.Mesh(chefHatGeometry, chefHatMaterial);
            chefHat.position.set(0, 4.4, 0);
            npc.add(chefHat);
            // Puff on top
            const puffGeometry = new THREE.BoxGeometry(1, 0.4, 1);
            const puff = new THREE.Mesh(puffGeometry, chefHatMaterial);
            puff.position.set(0, 4.9, 0);
            npc.add(puff);
        } else if (hat === 'hardhat') {
            const hardhatGeometry = new THREE.BoxGeometry(1.2, 0.5, 1.2);
            const hardhatMaterial = new THREE.MeshStandardMaterial({ color: 0xf39c12 });
            const hardhat = new THREE.Mesh(hardhatGeometry, hardhatMaterial);
            hardhat.position.set(0, 4.2, 0);
            npc.add(hardhat);
        } else if (hat === 'beret') {
            const beretGeometry = new THREE.BoxGeometry(1.1, 0.25, 1.1);
            const beretMaterial = new THREE.MeshStandardMaterial({ color: 0xc0392b });
            const beret = new THREE.Mesh(beretGeometry, beretMaterial);
            beret.position.set(0.1, 4.1, 0);
            beret.rotation.z = 0.15;
            npc.add(beret);
        } else if (hat === 'hood') {
            // Dark hood
            const hoodGeometry = new THREE.BoxGeometry(1.3, 0.8, 1.3);
            const hoodMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
            const hood = new THREE.Mesh(hoodGeometry, hoodMaterial);
            hood.position.set(0, 4, 0);
            npc.add(hood);
            // Hood overhang
            const overhangGeometry = new THREE.BoxGeometry(1.4, 0.3, 0.5);
            const overhang = new THREE.Mesh(overhangGeometry, hoodMaterial);
            overhang.position.set(0, 4.3, 0.5);
            npc.add(overhang);
        } else if (hat === 'wizard') {
            // Wizard hat
            const brimGeometry = new THREE.BoxGeometry(1.4, 0.15, 1.4);
            const wizardMaterial = new THREE.MeshStandardMaterial({ color: 0x4a148c });
            const brim = new THREE.Mesh(brimGeometry, wizardMaterial);
            brim.position.set(0, 4.05, 0);
            npc.add(brim);
            // Pointed top
            const coneGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.8);
            const cone = new THREE.Mesh(coneGeometry, wizardMaterial);
            cone.position.set(0, 4.7, 0);
            npc.add(cone);
            // Star decoration
            const starGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.1);
            const starMaterial = new THREE.MeshStandardMaterial({ color: 0xf1c40f, emissive: 0xf1c40f, emissiveIntensity: 0.3 });
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.set(0, 5.2, 0.4);
            npc.add(star);
        } else if (hat === 'flower') {
            // Flower crown
            const bandGeometry = new THREE.BoxGeometry(1.15, 0.2, 1.15);
            const bandMaterial = new THREE.MeshStandardMaterial({ color: 0x2ecc71 });
            const band = new THREE.Mesh(bandGeometry, bandMaterial);
            band.position.set(0, 4.05, 0);
            npc.add(band);
            // Flowers on crown
            const flowerColors = [0xe74c3c, 0xf1c40f, 0xff69b4, 0x9b59b6];
            const flowerPositions = [
                [-0.35, 4.2, 0.3], [0.35, 4.2, 0.3], [0, 4.25, 0.4],
                [-0.4, 4.15, -0.2], [0.4, 4.15, -0.2]
            ];
            flowerPositions.forEach((pos, i) => {
                const flowerGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.15);
                const flowerMaterial = new THREE.MeshStandardMaterial({ color: flowerColors[i % flowerColors.length] });
                const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
                flower.position.set(...pos);
                npc.add(flower);
            });
        } else if (hat === 'cap') {
            // Baseball cap
            const capGeometry = new THREE.BoxGeometry(1.1, 0.35, 1.1);
            const capMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
            const cap = new THREE.Mesh(capGeometry, capMaterial);
            cap.position.set(0, 4.15, 0);
            npc.add(cap);
            const visorGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.4);
            const visor = new THREE.Mesh(visorGeometry, capMaterial);
            visor.position.set(0, 4.05, 0.6);
            npc.add(visor);
        }
    }

    // Accessories
    if (accessory !== 'none') {
        if (accessory === 'glasses' || accessory === 'goggles') {
            const frameColor = accessory === 'goggles' ? 0x8b4513 : 0x333333;
            const frameGeometry = new THREE.BoxGeometry(0.9, 0.2, 0.1);
            const frameMaterial = new THREE.MeshStandardMaterial({ color: frameColor });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(0, 3.55, 0.55);
            npc.add(frame);

            // Lenses
            const lensGeometry = new THREE.BoxGeometry(0.25, 0.2, 0.08);
            const lensMaterial = new THREE.MeshStandardMaterial({
                color: accessory === 'goggles' ? 0x88ccff : 0xffffff,
                transparent: true,
                opacity: 0.5
            });
            const leftLens = new THREE.Mesh(lensGeometry, lensMaterial);
            leftLens.position.set(-0.25, 3.55, 0.58);
            npc.add(leftLens);
            const rightLens = new THREE.Mesh(lensGeometry, lensMaterial);
            rightLens.position.set(0.25, 3.55, 0.58);
            npc.add(rightLens);
        } else if (accessory === 'badge') {
            const badgeGeometry = new THREE.BoxGeometry(0.3, 0.35, 0.1);
            const badgeMaterial = new THREE.MeshStandardMaterial({ color: 0xf1c40f, emissive: 0xf1c40f, emissiveIntensity: 0.2 });
            const badge = new THREE.Mesh(badgeGeometry, badgeMaterial);
            badge.position.set(-0.5, 2.6, 0.55);
            npc.add(badge);
        } else if (accessory === 'earrings') {
            const earringGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.1);
            const earringMaterial = new THREE.MeshStandardMaterial({ color: 0xf1c40f, emissive: 0xf1c40f, emissiveIntensity: 0.3 });
            const leftEarring = new THREE.Mesh(earringGeometry, earringMaterial);
            leftEarring.position.set(-0.55, 3.35, 0);
            npc.add(leftEarring);
            const rightEarring = new THREE.Mesh(earringGeometry, earringMaterial);
            rightEarring.position.set(0.55, 3.35, 0);
            npc.add(rightEarring);
        } else if (accessory === 'mustache') {
            const mustacheGeometry = new THREE.BoxGeometry(0.5, 0.12, 0.15);
            const mustacheMaterial = new THREE.MeshStandardMaterial({ color: 0x2c1810 });
            const mustache = new THREE.Mesh(mustacheGeometry, mustacheMaterial);
            mustache.position.set(0, 3.32, 0.5);
            npc.add(mustache);
        } else if (accessory === 'paintbrush') {
            // Paintbrush in hand
            const handleGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.1);
            const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
            const handle = new THREE.Mesh(handleGeometry, handleMaterial);
            handle.position.set(0.95, 1.6, 0.3);
            handle.rotation.x = 0.5;
            npc.add(handle);
            // Brush tip
            const tipGeometry = new THREE.BoxGeometry(0.15, 0.25, 0.15);
            const tipMaterial = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
            const tip = new THREE.Mesh(tipGeometry, tipMaterial);
            tip.position.set(0.95, 1.95, 0.45);
            npc.add(tip);
        } else if (accessory === 'eyepatch') {
            // Eye patch
            const patchGeometry = new THREE.BoxGeometry(0.3, 0.25, 0.1);
            const patchMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
            const patch = new THREE.Mesh(patchGeometry, patchMaterial);
            patch.position.set(-0.25, 3.55, 0.55);
            npc.add(patch);
            // Strap
            const strapGeometry = new THREE.BoxGeometry(1.2, 0.08, 0.08);
            const strap = new THREE.Mesh(strapGeometry, patchMaterial);
            strap.position.set(0, 3.6, 0.3);
            npc.add(strap);
        } else if (accessory === 'round_glasses') {
            // Round glasses
            const frameGeometry = new THREE.BoxGeometry(0.9, 0.25, 0.1);
            const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xdaa520 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(0, 3.55, 0.55);
            npc.add(frame);
            // Circular lenses
            const lensGeometry = new THREE.BoxGeometry(0.28, 0.28, 0.08);
            const lensMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.4
            });
            const leftLens = new THREE.Mesh(lensGeometry, lensMaterial);
            leftLens.position.set(-0.25, 3.55, 0.58);
            npc.add(leftLens);
            const rightLens = new THREE.Mesh(lensGeometry, lensMaterial);
            rightLens.position.set(0.25, 3.55, 0.58);
            npc.add(rightLens);
        }
    }

    return npc;
}

function createNameLabel(npc, name) {
    // Name labels handled in HTML overlay now
}

function createTrees() {
    const treePositions = [
        { x: -40, z: -30 }, { x: -50, z: 20 }, { x: 45, z: -40 },
        { x: 60, z: 30 }, { x: -30, z: 50 }, { x: 35, z: 55 },
        { x: -60, z: -50 }, { x: 70, z: -20 }, { x: -45, z: 40 },
        { x: 55, z: 45 }, { x: -70, z: 10 }, { x: 40, z: -60 }
    ];

    treePositions.forEach(pos => {
        const tree = createTree();
        tree.position.set(pos.x, 0, pos.z);
        trees.push(tree);
        scene.add(tree);
    });
}

function createTree() {
    const tree = new THREE.Group();

    // Trunk
    const trunkGeometry = new THREE.BoxGeometry(1.5, 6, 1.5);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x6a4420 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 3;
    trunk.castShadow = true;
    tree.add(trunk);

    // Foliage layers (pixelated look)
    const foliageColors = [0x2d5a2d, 0x3a7a3a, 0x4a9a4a];
    for (let i = 0; i < 4; i++) {
        const size = 5 - i * 0.8;
        const foliageGeometry = new THREE.BoxGeometry(size, 2, size);
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: foliageColors[i % 3]
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 6 + i * 1.8;
        foliage.castShadow = true;
        tree.add(foliage);

        // Snow on foliage
        const snowGeometry = new THREE.BoxGeometry(size + 0.3, 0.4, size + 0.3);
        const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const snow = new THREE.Mesh(snowGeometry, snowMaterial);
        snow.position.y = 7 + i * 1.8;
        tree.add(snow);
    }

    return tree;
}

function createHouses() {
    const housePositions = [
        { x: -35, z: -10 }, { x: 40, z: 10 }, { x: 10, z: -35 },
        { x: -10, z: 40 }
    ];

    housePositions.forEach(pos => {
        const house = createHouse();
        house.position.set(pos.x, 0, pos.z);
        house.rotation.y = Math.random() * Math.PI * 2;
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

        // Voice Input (Hold Space)
        if (e.key === ' ' && currentDialogue && !isRecording) {
            e.preventDefault();
            startRecording();
        }

        // Close journal with Escape
        if (e.key === 'Escape') {
            document.getElementById('journalModal').classList.remove('active');
        }

        // Open journal with F
        if (e.key.toLowerCase() === 'f') {
            populateJournal();
            document.getElementById('journalModal').classList.add('active');
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;

        // Stop Voice Input
        if (e.key === ' ' && currentDialogue && isRecording) {
            e.preventDefault();
            stopRecording();
        }
    });

    // Mouse look
    document.addEventListener('click', (e) => {
        // Start ambient sounds on first click (browser autoplay policy)
        startAmbientSounds();

        if (!currentDialogue && !e.target.closest('.journal-btn') && !e.target.closest('.journal-modal')) {
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
    
    // Mobile Virtual Joystick
    const joystick = document.getElementById('mobile-joystick');
    const joystickThumb = document.getElementById('joystickThumb');
    
    if (joystick && joystickThumb) {
        let joystickActive = false;
        let joystickStartX = 0;
        let joystickStartY = 0;
        const maxDistance = 40;
        
        function handleJoystickStart(e) {
            e.preventDefault();
            joystickActive = true;
            joystickThumb.classList.add('active');
            const touch = e.touches ? e.touches[0] : e;
            const rect = joystick.getBoundingClientRect();
            joystickStartX = rect.left + rect.width / 2;
            joystickStartY = rect.top + rect.height / 2;
        }
        
        function handleJoystickMove(e) {
            if (!joystickActive) return;
            e.preventDefault();
            
            const touch = e.touches ? e.touches[0] : e;
            let deltaX = touch.clientX - joystickStartX;
            let deltaY = touch.clientY - joystickStartY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (distance > maxDistance) {
                deltaX = (deltaX / distance) * maxDistance;
                deltaY = (deltaY / distance) * maxDistance;
            }
            
            joystickThumb.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
            
            const deadzone = 10;
            keys['w'] = deltaY < -deadzone;
            keys['s'] = deltaY > deadzone;
            keys['a'] = deltaX < -deadzone;
            keys['d'] = deltaX > deadzone;
        }
        
        function handleJoystickEnd(e) {
            e.preventDefault();
            joystickActive = false;
            joystickThumb.classList.remove('active');
            joystickThumb.style.transform = 'translate(-50%, -50%)';
            keys['w'] = false;
            keys['s'] = false;
            keys['a'] = false;
            keys['d'] = false;
        }
        
        joystick.addEventListener('touchstart', handleJoystickStart, { passive: false });
        document.addEventListener('touchmove', handleJoystickMove, { passive: false });
        document.addEventListener('touchend', handleJoystickEnd, { passive: false });
        
        joystick.addEventListener('mousedown', handleJoystickStart);
        document.addEventListener('mousemove', handleJoystickMove);
        document.addEventListener('mouseup', handleJoystickEnd);
    }
    
    // Mobile tap-to-talk on interact prompt
    const interactPrompt = document.getElementById('interactPrompt');
    if (interactPrompt) {
        interactPrompt.addEventListener('click', () => {
            if (nearestNPC && !currentDialogue) {
                startDialogue(nearestNPC);
            }
        });
        
        interactPrompt.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (nearestNPC && !currentDialogue) {
                startDialogue(nearestNPC);
            }
        });
    }
    
    // Mobile Mic Action Button
    const mobileMicBtn = document.getElementById('mobile-mic-btn');
    if (mobileMicBtn) {
        // Touch start - begin recording or start dialogue
        mobileMicBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (currentDialogue) {
                // In dialogue - start recording
                if (!isRecording) {
                    startRecording();
                    mobileMicBtn.classList.add('recording');
                }
            } else if (nearestNPC) {
                // Near NPC but not in dialogue - start it
                startDialogue(nearestNPC);
            }
        }, { passive: false });
        
        // Touch end - stop recording
        mobileMicBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (currentDialogue && isRecording) {
                stopRecording();
                mobileMicBtn.classList.remove('recording');
            }
        }, { passive: false });
        
        // Mouse events for desktop testing
        mobileMicBtn.addEventListener('mousedown', () => {
            if (currentDialogue && !isRecording) {
                startRecording();
                mobileMicBtn.classList.add('recording');
            } else if (nearestNPC && !currentDialogue) {
                startDialogue(nearestNPC);
            }
        });
        
        mobileMicBtn.addEventListener('mouseup', () => {
            if (currentDialogue && isRecording) {
                stopRecording();
                mobileMicBtn.classList.remove('recording');
            }
        });
    }
}

function startDialogue(npc) {
    currentDialogue = npc.userData.dialogue;
    currentSpeaker = npc;
    dialogueIndex = 0;
    chatHistory = [];

    // Play dialogue open sound
    playSound(dialogueOpenSound);

    // Make player and NPC face each other
    const angleToNPC = Math.atan2(
        npc.position.x - player.position.x,
        npc.position.z - player.position.z
    );
    player.rotation.y = angleToNPC;

    const angleToPlayer = Math.atan2(
        player.position.x - npc.position.x,
        player.position.z - npc.position.z
    );
    npc.rotation.y = angleToPlayer;

    // Hide UI elements
    document.getElementById('playerInfo').classList.add('hidden');
    document.getElementById('miniMap').classList.add('hidden');
    document.getElementById('controlsHint').classList.add('hidden');
    document.getElementById('interactPrompt').classList.remove('active');
    document.getElementById('journalBtn').classList.add('hidden');

    // Activate chat wrapper and journal button
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    document.getElementById('chatWrapper').classList.add('active');
    document.getElementById('journalBtnChat').classList.add('active');

    // Store original camera position
    originalCameraPos = camera.position.clone();
    isZoomedIn = true;

    // Zoom to NPC (stays on NPC the whole time)
    zoomToNPC();

    document.exitPointerLock();

    // Show first message
    showCurrentMessage();

    // Show voice prompt
    const voicePrompt = document.getElementById('voicePrompt');
    if (voicePrompt) voicePrompt.classList.add('active');

    // Start MirageLSD Stream
    // Construct a prompt based on the NPC
    const npcName = npc.userData.name || "Villager";
    // Extract role if possible (e.g. "Chef Pierre" -> "Chef")
    const role = npcName.split(' ')[0] || "Villager";

    // Get selected country from localStorage (default to Poland if not set)
    const country = localStorage.getItem('selectedCountry') || 'Poland';

    let prompt = "";

    if (country === 'China') {
        prompt = `A realistic ${role} wearing traditional Chinese Hanfu clothing standing on the Great Wall of China, green mountains background, misty atmosphere, high quality`;
    } else if (country === 'France') {
        prompt = `A realistic ${role} wearing 19th century French fashion standing near the Eiffel Tower in Paris, romantic atmosphere, high quality`;
    } else if (country === 'Japan') {
        prompt = `A realistic ${role} wearing traditional Japanese Kimono standing near a Torii gate and cherry blossoms, Kyoto atmosphere, high quality`;
    } else {
        // Default (Poland)
        prompt = `A realistic ${role} standing in front of a majestic Polish monument statue in Warsaw, winter atmosphere, high quality, detailed architecture`;
    }

    startMirageStream(prompt, "gameCanvas");
}

function zoomToNPC() {
    // Always focus on the NPC
    const target = currentSpeaker;

    // Head/face position
    const facePosition = new THREE.Vector3();
    facePosition.copy(target.position);
    facePosition.y = target.position.y + 3.5; // Head height

    // Get the direction the character is facing
    const faceDirection = new THREE.Vector3(0, 0, 1);
    faceDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), target.rotation.y);

    // Position camera very close to NPC face for extreme close-up
    targetCameraPos = facePosition.clone();
    targetCameraPos.add(faceDirection.clone().multiplyScalar(2.5)); // 2.5 units from face - very close
    targetCameraPos.y = facePosition.y + 1.2; // Higher up so NPC appears lower in frame

    // Add slight offset to the side for cinematic feel
    const sideOffset = new THREE.Vector3(-1, 0, 0);
    sideOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), target.rotation.y);
    targetCameraPos.add(sideOffset.multiplyScalar(0.3));

    // Look at face (NPC will appear in lower portion of screen)
    targetLookAt = facePosition.clone();
}

function zoomOut() {
    isZoomedIn = false;
    targetCameraPos = null;
    targetLookAt = null;
}

function showCurrentMessage() {
    if (!currentDialogue || dialogueIndex >= currentDialogue.length) return;

    const msg = currentDialogue[dialogueIndex];
    const chatContainer = document.getElementById('chatContainer');

    // Create chat bubble (keep previous messages)
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${msg.speaker}`;

    const speakerName = msg.speaker === 'npc' ? currentSpeaker.userData.name : (characterData.name || 'Player');

    bubble.innerHTML = `
        <div class="speaker-name">${speakerName}</div>
        <div class="message-text">${msg.text}</div>
    `;

    chatContainer.appendChild(bubble);

    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Show continue prompt
    // document.getElementById('continuePrompt').classList.add('active');
}

function advanceDialogue() {
    dialogueIndex++;

    if (dialogueIndex >= currentDialogue.length) {
        endDialogue();
    } else {
        // Play page turn sound
        playSound(dialogueAdvanceSound);
        showCurrentMessage();
    }
}

function endDialogue() {
    // Hide UI elements
    const voicePrompt = document.getElementById('voicePrompt');
    if (voicePrompt) voicePrompt.classList.remove('active');

    currentDialogue = null;
    currentSpeaker = null;
    dialogueIndex = 0;

    // Hide chat wrapper and journal chat button
    document.getElementById('chatWrapper').classList.remove('active');
    document.getElementById('journalBtnChat').classList.remove('active');
    document.getElementById('continuePrompt').classList.remove('active');

    // Show UI elements
    document.getElementById('playerInfo').classList.remove('hidden');
    document.getElementById('miniMap').classList.remove('hidden');
    document.getElementById('controlsHint').classList.remove('hidden');
    document.getElementById('journalBtn').classList.remove('hidden');

    // Zoom out
    zoomOut();

    // Stop MirageLSD Stream
    stopMirageStream();
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
    if (isZoomedIn && targetCameraPos && targetLookAt) {
        // Smoothly move camera to target for close-up
        camera.position.lerp(targetCameraPos, 0.08);

        // Smoothly look at the speaker's face
        const currentLookAt = new THREE.Vector3();
        camera.getWorldDirection(currentLookAt);
        currentLookAt.add(camera.position);
        currentLookAt.lerp(targetLookAt, 0.08);
        camera.lookAt(targetLookAt);
    } else {
        // Normal third person camera
        const cameraOffset = new THREE.Vector3(0, 8, 12);

        // Rotate offset based on mouse
        const rotatedOffset = cameraOffset.clone();
        rotatedOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -mouseX);

        camera.position.copy(player.position).add(rotatedOffset);
        camera.position.y = player.position.y + 8 - mouseY * 5;
        camera.lookAt(player.position.x, player.position.y + 3, player.position.z);
    }
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

// Voice Input Logic
let mediaRecorder;
let audioChunks = [];
let recordingStartTime = 0;
let isRecording = false;
const MIN_RECORDING_DURATION = 500; // ms

function setupVoiceInput() {
    const micBtn = document.getElementById('micBtn');

    if (!micBtn) return;

    // Mouse events (Hold to speak)
    micBtn.addEventListener('mousedown', startRecording);
    micBtn.addEventListener('mouseup', stopRecording);
    micBtn.addEventListener('mouseleave', stopRecording);

    // Touch events
    micBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startRecording();
    });
    micBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopRecording();
    });
}

async function startRecording() {
    if (!currentSpeaker || isRecording) return;

    const micBtn = document.getElementById('micBtn');
    const status = document.getElementById('recordingStatus');
    const voicePrompt = document.getElementById('voicePrompt');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Setup Recorder
        let mimeType = 'audio/webm';
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
        }

        mediaRecorder = new MediaRecorder(stream, { mimeType });
        audioChunks = [];
        recordingStartTime = Date.now();
        isRecording = true;

        mediaRecorder.addEventListener("dataavailable", event => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        });

        mediaRecorder.addEventListener("stop", sendAudioToBackend);

        mediaRecorder.start();

        if (micBtn) micBtn.classList.add('recording');
        if (status) {
            status.classList.remove('hidden');
            status.textContent = "RECORDING...";
        }
        if (voicePrompt) {
            voicePrompt.textContent = "Listening...";
            voicePrompt.style.color = "#e74c3c";
            voicePrompt.style.borderColor = "#e74c3c";
        }

    } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Could not access microphone. Please allow permissions.");
        isRecording = false;
    }
}

function stopRecording() {
    if (!isRecording) return;

    const micBtn = document.getElementById('micBtn');
    const status = document.getElementById('recordingStatus');
    const voicePrompt = document.getElementById('voicePrompt');

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        const duration = Date.now() - recordingStartTime;

        if (duration < MIN_RECORDING_DURATION) {
            // Too short, cancel
            mediaRecorder.stop();
            // Clear chunks
            audioChunks = [];
            console.log("Recording too short, cancelled.");
        } else {
            mediaRecorder.stop();
        }

        // Stop all tracks
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }

    isRecording = false;
    if (micBtn) micBtn.classList.remove('recording');
    if (status) status.classList.add('hidden');

    if (voicePrompt) {
        voicePrompt.textContent = "Hold SPACE to Speak";
        voicePrompt.style.color = "#f8e038";
        voicePrompt.style.borderColor = "#f8e038";
    }
}

async function sendAudioToBackend() {
    if (!currentSpeaker || audioChunks.length === 0) return;

    const mimeType = mediaRecorder.mimeType;
    // Ensure we use a compatible extension
    let extension = 'webm';
    if (mimeType.includes('mp4')) extension = 'm4a';
    if (mimeType.includes('mpeg')) extension = 'mp3';
    if (mimeType.includes('wav')) extension = 'wav';

    const audioBlob = new Blob(audioChunks, { type: mimeType });

    // Log blob size for debugging
    console.log(`Sending audio: ${audioBlob.size} bytes, type: ${mimeType}`);

    const formData = new FormData();
    formData.append("audio", audioBlob, `recording.${extension}`);

    const npcName = currentSpeaker.userData.name;
    const npcId = npcName.toLowerCase().replace(' ', '_');
    formData.append("npc_id", npcId);

    const chatContainer = document.getElementById('chatContainer');
    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'chat-bubble player';
    loadingBubble.innerHTML = '<div class="message-text">...</div>';
    chatContainer.appendChild(loadingBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const response = await fetch('http://localhost:8000/api/conversation/respond', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || "Server error");
        }

        const data = await response.json();

        // Remove loading bubble
        if (loadingBubble.parentNode) {
            chatContainer.removeChild(loadingBubble);
        }

        // Show Player Transcription
        if (data.transcription) {
            const playerBubble = document.createElement('div');
            playerBubble.className = 'chat-bubble player';
            playerBubble.innerHTML = `
                <div class="speaker-name">${characterData.name || 'Player'}</div>
                <div class="message-text">${data.transcription}</div>
            `;
            chatContainer.appendChild(playerBubble);
        }

        // Show NPC Response
        if (data.response) {
            const npcBubble = document.createElement('div');
            npcBubble.className = 'chat-bubble npc';
            npcBubble.innerHTML = `
                <div class="speaker-name">${npcName}</div>
                <div class="message-text">${data.response}</div>
            `;
            chatContainer.appendChild(npcBubble);

            // Play Audio
            if (data.audio_url) {
                const audio = new Audio('http://localhost:8000' + data.audio_url);
                audio.play().catch(e => console.error("Audio play error:", e));
            }
        }

        chatContainer.scrollTop = chatContainer.scrollHeight;

    } catch (error) {
        console.error("Error sending audio:", error);
        loadingBubble.innerHTML = `<div class="message-text" style="color:red">${error.message}</div>`;
    }
}
