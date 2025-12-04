// LinguaVerse World - Three.js + Mirage + ElevenLabs
import * as THREE from 'three';
import { EffectComposer, RenderPass, BloomEffect, SMAAEffect, EffectPass, VignetteEffect } from 'postprocessing';
import { startMirageStream, stopMirageStream, setMirageScenario, isMirageActive } from './mirage.js';

// ==================== CONFIGURATION ====================
const CONFIG = {
    ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
    ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    DECART_API_KEY: import.meta.env.VITE_DECART_API_KEY || ''
};

// ==================== GLOBAL STATE ====================
let scene, camera, renderer, composer;
let player, playerVelocity;
let npc = null;
let clock;
let keys = {};
let mouseX = 0, mouseY = 0;
let isPointerLocked = false;
let nearNPC = false;
let isConversationActive = false;
let conversationHistory = [];
let currentDifficulty = 1;
let glossary = [];

// Game state from session
let gameState = {
    language: 'french',
    scenario: null,
    lessonPlan: null
};

// Audio
let currentAudio = null;
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

// Mirage state
let mirageActive = false;

// Player character from customization
let playerCharacter = {
    name: 'Player',
    skinColor: '#ffd5b5',
    hairColor: '#2c1810',
    hairStyle: 0,
    outfit: 0,
    outfitColor: '#e74c3c',
    accessory: 0,
    hat: 0
};

// ElevenLabs voice IDs for different languages/characters
const VOICE_IDS = {
    french: {
        female: 'EXAVITQu4vr4xnSDxMaL', // Bella
        male: 'ErXwobaYiN019PkySvjV'     // Antoni
    },
    german: {
        female: 'ThT5KcBeYPX3keUQqHPh', // Dorothy
        male: 'VR6AewLTigWG4xSOukaG'    // Arnold
    },
    spanish: {
        female: 'EXAVITQu4vr4xnSDxMaL',
        male: 'ErXwobaYiN019PkySvjV'
    },
    mandarin: {
        female: 'ThT5KcBeYPX3keUQqHPh',
        male: 'VR6AewLTigWG4xSOukaG'
    },
    japanese: {
        female: 'EXAVITQu4vr4xnSDxMaL',
        male: 'ErXwobaYiN019PkySvjV'
    },
    polish: {
        female: 'EXAVITQu4vr4xnSDxMaL',
        male: 'ErXwobaYiN019PkySvjV'
    }
};

// ==================== DOM ELEMENTS ====================
const elements = {
    canvas: document.getElementById('gameCanvas'),
    mirageContainer: document.getElementById('mirage-container'),
    loadingScreen: document.getElementById('loadingScreen'),
    loadingEmoji: document.getElementById('loadingEmoji'),
    scenarioEmoji: document.getElementById('scenarioEmoji'),
    scenarioName: document.getElementById('scenarioName'),
    scenarioLevel: document.getElementById('scenarioLevel'),
    difficultyBar: document.getElementById('difficultyBar'),
    interactPrompt: document.getElementById('interactPrompt'),
    conversationPanel: document.getElementById('conversationPanel'),
    charAvatarSmall: document.getElementById('charAvatarSmall'),
    speechText: document.getElementById('speechText'),
    speechTranslation: document.getElementById('speechTranslation'),
    grammarCorrection: document.getElementById('grammarCorrection'),
    grammarText: document.getElementById('grammarText'),
    voiceBtn: document.getElementById('voiceBtn'),
    textInput: document.getElementById('textInput'),
    sendBtn: document.getElementById('sendBtn'),
    glossaryBtn: document.getElementById('glossaryBtn'),
    glossaryModal: document.getElementById('glossaryModal'),
    glossaryClose: document.getElementById('glossaryClose'),
    glossaryWords: document.getElementById('glossaryWords'),
    glossaryFalseFriends: document.getElementById('glossaryFalseFriends'),
    controlsHint: document.getElementById('controlsHint'),
    conversationClose: document.getElementById('conversationClose')
};

// ==================== INITIALIZATION ====================
async function init() {
    // Load player character from localStorage (from Jazda customization)
    const savedCharacter = localStorage.getItem('playerCharacter');
    if (savedCharacter) {
        const parsed = JSON.parse(savedCharacter);
        playerCharacter = { ...playerCharacter, ...parsed };
        console.log('Loaded player character:', playerCharacter);
    }
    
    // Load game state from session
    const savedState = sessionStorage.getItem('linguaverse_state');
    if (savedState) {
        const parsed = JSON.parse(savedState);
        gameState = { ...gameState, ...parsed };
    } else {
        // Default to French boulangerie for demo
        gameState.scenario = {
            id: 'boulangerie',
            name: 'La Boulangerie',
            emoji: '🥐',
            character: {
                name: 'Marie Dupont',
                emoji: '👩‍🍳',
                role: 'Master Baker',
                bio: 'Marie has been running this family boulangerie for 30 years.'
            },
            falseFriends: [
                { word: 'pain', meaning: 'bread (not pain!)', trap: 'Sounds like English "pain"' }
            ]
        };
    }
    
    // Update UI with scenario info
    updateScenarioUI();
    
    // Initialize Three.js
    initThreeJS();
    
    // Build the world
    buildWorld();
    
    // Create NPC
    createNPC();
    
    // Create player with customization
    createPlayer();
    
    // Setup controls
    setupControls();
    
    // Setup conversation UI
    setupConversationUI();
    
    // Setup glossary
    setupGlossary();
    
    // Hide loading screen and start Mirage when world is ready
    setTimeout(async () => {
        elements.loadingScreen.classList.add('hidden');
        
        // Start Mirage real-time stylization when world loads
        const scenarioId = gameState.scenario?.id || 'boulangerie';
        mirageActive = await startMirageStream(scenarioId, 'gameCanvas');
        if (mirageActive) {
            console.log('🎨 Mirage MirageLSD activated - immersive world rendering');
        }
    }, 2000);
    
    // Start animation loop
    clock = new THREE.Clock();
    animate();
}

function updateScenarioUI() {
    if (gameState.scenario) {
        elements.loadingEmoji.textContent = gameState.scenario.emoji;
        elements.scenarioEmoji.textContent = gameState.scenario.emoji;
        elements.scenarioName.textContent = gameState.scenario.name;
        elements.charAvatarSmall.textContent = gameState.scenario.character.emoji;
        
        document.querySelector('.loading-text').textContent = `Entering ${gameState.scenario.name}...`;
    }
    updateDifficultyUI();
}

function updateDifficultyUI() {
    const pips = elements.difficultyBar.querySelectorAll('.difficulty-pip');
    pips.forEach((pip, i) => {
        pip.classList.toggle('active', i < currentDifficulty);
    });
    
    const levelNames = ['First Contact', 'Getting Comfortable', 'Conversational', 'Advanced', 'Fluent'];
    elements.scenarioLevel.textContent = `Level ${currentDifficulty}: ${levelNames[currentDifficulty - 1] || 'Master'}`;
}

// ==================== THREE.JS SETUP ====================
function initThreeJS() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 80);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 5);
    
    renderer = new THREE.WebGLRenderer({ 
        canvas: elements.canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    // Post-processing
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomEffect = new BloomEffect({
        intensity: 0.5,
        luminanceThreshold: 0.6,
        luminanceSmoothing: 0.3
    });
    
    const vignetteEffect = new VignetteEffect({
        darkness: 0.5,
        offset: 0.3
    });
    
    const smaaEffect = new SMAAEffect();
    
    const effectPass = new EffectPass(camera, bloomEffect, vignetteEffect, smaaEffect);
    composer.addPass(effectPass);
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ==================== WORLD BUILDING ====================
function buildWorld() {
    const scenarioType = gameState.scenario?.id || 'boulangerie';
    
    // Ambient lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.4);
    scene.add(ambientLight);
    
    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xfff0d4, 1.0);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -20;
    mainLight.shadow.camera.right = 20;
    mainLight.shadow.camera.top = 20;
    mainLight.shadow.camera.bottom = -20;
    scene.add(mainLight);
    
    // Point lights for warmth
    const warmLight1 = new THREE.PointLight(0xffaa44, 0.8, 15);
    warmLight1.position.set(-3, 3, -2);
    scene.add(warmLight1);
    
    const warmLight2 = new THREE.PointLight(0xff8844, 0.6, 12);
    warmLight2.position.set(3, 2.5, -3);
    scene.add(warmLight2);
    
    // Build environment based on scenario
    switch (scenarioType) {
        case 'boulangerie':
            buildBoulangerie();
            break;
        case 'berghain':
            buildBerghain();
            break;
        case 'teahouse':
            buildTeahouse();
            break;
        case 'izakaya':
            buildIzakaya();
            break;
        case 'tapas':
            buildTapasBar();
            break;
        case 'biergarten':
            buildBiergarten();
            break;
        default:
            buildBoulangerie();
    }
}

function buildBoulangerie() {
    // Floor - warm wooden tiles
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b6914,
        roughness: 0.8,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5e6d3,
        roughness: 0.9
    });
    
    // Back wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), wallMaterial);
    backWall.position.set(0, 4, -5);
    scene.add(backWall);
    
    // Side walls
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), wallMaterial);
    leftWall.position.set(-10, 4, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);
    
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), wallMaterial);
    rightWall.position.set(10, 4, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);
    
    // Counter
    const counterGeometry = new THREE.BoxGeometry(6, 1.2, 0.8);
    const counterMaterial = new THREE.MeshStandardMaterial({
        color: 0x5c4033,
        roughness: 0.6
    });
    const counter = new THREE.Mesh(counterGeometry, counterMaterial);
    counter.position.set(0, 0.6, -3);
    counter.castShadow = true;
    counter.receiveShadow = true;
    scene.add(counter);
    
    // Glass display case
    const displayGeometry = new THREE.BoxGeometry(5, 0.8, 0.6);
    const displayMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1
    });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.set(0, 1.6, -3);
    scene.add(display);
    
    // Bread shelves on back wall
    createBreadShelf(-2, 2, -4.8);
    createBreadShelf(0, 2, -4.8);
    createBreadShelf(2, 2, -4.8);
    createBreadShelf(-2, 3.5, -4.8);
    createBreadShelf(0, 3.5, -4.8);
    createBreadShelf(2, 3.5, -4.8);
    
    // Croissants on counter
    for (let i = 0; i < 5; i++) {
        createCroissant(-1.5 + i * 0.7, 1.3, -2.8);
    }
    
    // Baguettes in basket
    createBaguetteBasket(3, 0, -4);
    
    // Ceiling lights
    createHangingLight(-2, 5, -1);
    createHangingLight(2, 5, -1);
    
    // Decorative elements
    createChalkboardMenu(-4, 3, -4.9);
}

function createBreadShelf(x, y, z) {
    const shelfGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.4);
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8b6914 });
    const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
    shelf.position.set(x, y, z);
    shelf.castShadow = true;
    scene.add(shelf);
    
    // Add bread loaves
    for (let i = 0; i < 3; i++) {
        const loafGeometry = new THREE.CapsuleGeometry(0.12, 0.3, 4, 8);
        const loafMaterial = new THREE.MeshStandardMaterial({ color: 0xd4a574 });
        const loaf = new THREE.Mesh(loafGeometry, loafMaterial);
        loaf.position.set(x - 0.4 + i * 0.4, y + 0.15, z);
        loaf.rotation.z = Math.PI / 2;
        loaf.castShadow = true;
        scene.add(loaf);
    }
}

function createCroissant(x, y, z) {
    const croissantGeometry = new THREE.TorusGeometry(0.08, 0.03, 8, 12, Math.PI * 1.5);
    const croissantMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe8b86d,
        roughness: 0.6
    });
    const croissant = new THREE.Mesh(croissantGeometry, croissantMaterial);
    croissant.position.set(x, y, z);
    croissant.rotation.x = -Math.PI / 2;
    croissant.rotation.z = Math.random() * Math.PI;
    croissant.castShadow = true;
    scene.add(croissant);
}

function createBaguetteBasket(x, y, z) {
    // Basket
    const basketGeometry = new THREE.CylinderGeometry(0.4, 0.3, 0.8, 8);
    const basketMaterial = new THREE.MeshStandardMaterial({ color: 0xb8860b });
    const basket = new THREE.Mesh(basketGeometry, basketMaterial);
    basket.position.set(x, y + 0.4, z);
    scene.add(basket);
    
    // Baguettes
    for (let i = 0; i < 4; i++) {
        const baguetteGeometry = new THREE.CapsuleGeometry(0.05, 0.8, 4, 8);
        const baguetteMaterial = new THREE.MeshStandardMaterial({ color: 0xdeb887 });
        const baguette = new THREE.Mesh(baguetteGeometry, baguetteMaterial);
        baguette.position.set(x + (Math.random() - 0.5) * 0.2, y + 0.8 + i * 0.1, z + (Math.random() - 0.5) * 0.2);
        baguette.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
        baguette.rotation.z = Math.random() * 0.3;
        baguette.castShadow = true;
        scene.add(baguette);
    }
}

function createHangingLight(x, y, z) {
    // Lamp shade
    const shadeGeometry = new THREE.ConeGeometry(0.3, 0.4, 8, 1, true);
    const shadeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf4a460,
        side: THREE.DoubleSide,
        emissive: 0xffa500,
        emissiveIntensity: 0.2
    });
    const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    shade.position.set(x, y - 0.2, z);
    scene.add(shade);
    
    // Wire
    const wireGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1);
    const wireMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    wire.position.set(x, y + 0.3, z);
    scene.add(wire);
    
    // Light
    const light = new THREE.PointLight(0xffaa55, 0.5, 8);
    light.position.set(x, y - 0.3, z);
    scene.add(light);
}

function createChalkboardMenu(x, y, z) {
    const boardGeometry = new THREE.PlaneGeometry(1.5, 1);
    const boardMaterial = new THREE.MeshStandardMaterial({ color: 0x2d3436 });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.set(x, y, z);
    scene.add(board);
    
    // Frame
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8b6914 });
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.05), frameMaterial);
    frameTop.position.set(x, y + 0.52, z + 0.03);
    scene.add(frameTop);
    const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.05), frameMaterial);
    frameBottom.position.set(x, y - 0.52, z + 0.03);
    scene.add(frameBottom);
}

// Alternative scenario builders
function buildBerghain() {
    // Dark industrial nightclub exterior
    scene.fog = new THREE.Fog(0x0a0a0f, 5, 40);
    scene.background = new THREE.Color(0x0a0a0f);
    
    // Concrete floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.95
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Brutalist building facade
    const buildingGeometry = new THREE.BoxGeometry(20, 15, 2);
    const buildingMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a3a3a,
        roughness: 0.9
    });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(0, 7.5, -8);
    building.castShadow = true;
    scene.add(building);
    
    // Queue barriers
    for (let i = 0; i < 5; i++) {
        const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1);
        const postMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.position.set(-3 + i * 1.5, 0.5, 0);
        scene.add(post);
    }
    
    // Red rope
    const ropeGeometry = new THREE.CylinderGeometry(0.02, 0.02, 6);
    const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
    rope.position.set(0, 0.8, 0);
    rope.rotation.z = Math.PI / 2;
    scene.add(rope);
    
    // Neon sign
    const signLight = new THREE.PointLight(0xff00ff, 2, 15);
    signLight.position.set(0, 8, -6);
    scene.add(signLight);
}

function buildTeahouse() {
    // Traditional Chinese teahouse
    scene.fog = new THREE.Fog(0xd4e4d4, 10, 50);
    
    // Wooden floor
    const floorGeometry = new THREE.PlaneGeometry(15, 15);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x5c4033,
        roughness: 0.7
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Paper walls with wooden frames
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff8dc,
        roughness: 0.9,
        transparent: true,
        opacity: 0.9
    });
    
    // Back wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(15, 6), wallMaterial);
    backWall.position.set(0, 3, -5);
    scene.add(backWall);
    
    // Low tea table
    const tableGeometry = new THREE.BoxGeometry(2, 0.3, 1);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x3d2817 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(0, 0.15, -2);
    table.castShadow = true;
    scene.add(table);
    
    // Tea set
    createTeapot(0, 0.4, -2);
    createTeacup(-0.4, 0.35, -1.7);
    createTeacup(0.4, 0.35, -1.7);
    
    // Bamboo decoration
    for (let i = 0; i < 3; i++) {
        const bambooGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4);
        const bambooMaterial = new THREE.MeshStandardMaterial({ color: 0x6b8e23 });
        const bamboo = new THREE.Mesh(bambooGeometry, bambooMaterial);
        bamboo.position.set(5 + i * 0.3, 2, -4);
        scene.add(bamboo);
    }
    
    // Warm ambient lighting
    const lanternLight = new THREE.PointLight(0xffaa44, 1, 10);
    lanternLight.position.set(0, 3, -1);
    scene.add(lanternLight);
}

function createTeapot(x, y, z) {
    // Simple teapot representation
    const bodyGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(x, y, z);
    body.scale.y = 0.7;
    scene.add(body);
    
    // Spout
    const spoutGeometry = new THREE.CylinderGeometry(0.02, 0.03, 0.15);
    const spout = new THREE.Mesh(spoutGeometry, bodyMaterial);
    spout.position.set(x + 0.15, y, z);
    spout.rotation.z = -Math.PI / 4;
    scene.add(spout);
    
    // Lid
    const lidGeometry = new THREE.SphereGeometry(0.08, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const lid = new THREE.Mesh(lidGeometry, bodyMaterial);
    lid.position.set(x, y + 0.1, z);
    scene.add(lid);
}

function createTeacup(x, y, z) {
    const cupGeometry = new THREE.CylinderGeometry(0.05, 0.04, 0.06, 16);
    const cupMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5dc });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.position.set(x, y, z);
    scene.add(cup);
}

function buildIzakaya() {
    // Cozy Japanese izakaya
    scene.fog = new THREE.Fog(0x1a1410, 5, 25);
    
    // Tatami-like floor
    const floorGeometry = new THREE.PlaneGeometry(12, 12);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xc8b896,
        roughness: 0.9
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    
    // Wooden bar counter
    const counterGeometry = new THREE.BoxGeometry(8, 1.1, 0.6);
    const counterMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a3728,
        roughness: 0.5
    });
    const counter = new THREE.Mesh(counterGeometry, counterMaterial);
    counter.position.set(0, 0.55, -3);
    counter.castShadow = true;
    scene.add(counter);
    
    // Red lanterns
    createLantern(-2, 2.5, -2, 0xff3333);
    createLantern(0, 2.5, -2, 0xff3333);
    createLantern(2, 2.5, -2, 0xff3333);
    
    // Sake bottles on shelf
    for (let i = 0; i < 6; i++) {
        const bottleGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.25);
        const bottleMaterial = new THREE.MeshStandardMaterial({ 
            color: i % 2 === 0 ? 0x8b4513 : 0x228b22 
        });
        const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
        bottle.position.set(-2 + i * 0.4, 2, -4.5);
        scene.add(bottle);
    }
}

function createLantern(x, y, z, color) {
    const lanternGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8);
    const lanternMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9
    });
    const lantern = new THREE.Mesh(lanternGeometry, lanternMaterial);
    lantern.position.set(x, y, z);
    scene.add(lantern);
    
    const light = new THREE.PointLight(color, 0.5, 5);
    light.position.set(x, y, z);
    scene.add(light);
}

function buildTapasBar() {
    // Spanish tapas bar
    scene.fog = new THREE.Fog(0x1a1510, 5, 30);
    
    // Terracotta floor
    const floorGeometry = new THREE.PlaneGeometry(15, 15);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    
    // White stucco walls
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xfff8dc });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(15, 6), wallMaterial);
    backWall.position.set(0, 3, -5);
    scene.add(backWall);
    
    // Wooden bar
    const barGeometry = new THREE.BoxGeometry(5, 1.1, 0.8);
    const barMaterial = new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.position.set(0, 0.55, -3);
    bar.castShadow = true;
    scene.add(bar);
    
    // Hanging jamón
    const jamonGeometry = new THREE.CapsuleGeometry(0.15, 0.5);
    const jamonMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    const jamon = new THREE.Mesh(jamonGeometry, jamonMaterial);
    jamon.position.set(2, 3, -4);
    scene.add(jamon);
    
    // Wine bottles
    for (let i = 0; i < 8; i++) {
        const bottleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.3);
        const bottleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4a0000,
            roughness: 0.3
        });
        const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
        bottle.position.set(-3 + i * 0.4, 2, -4.8);
        scene.add(bottle);
    }
}

function buildBiergarten() {
    // Bavarian beer garden
    scene.fog = new THREE.Fog(0x87ceeb, 20, 80);
    scene.background = new THREE.Color(0x87ceeb);
    
    // Grass floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x228b22,
        roughness: 0.9
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    
    // Wooden benches and tables
    createBeerTable(0, 0, -3);
    createBeerTable(-4, 0, -3);
    createBeerTable(4, 0, -3);
    
    // Chestnut tree
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.6, 4);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(6, 2, -6);
    scene.add(trunk);
    
    const foliageGeometry = new THREE.SphereGeometry(3, 8, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(6, 6, -6);
    scene.add(foliage);
    
    // Brighter outdoor lighting
    const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.5);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    scene.add(sunLight);
}

function createBeerTable(x, y, z) {
    // Table
    const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b6914 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(x, y + 0.75, z);
    table.castShadow = true;
    scene.add(table);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.1, 0.75, 0.1);
    const positions = [
        [x - 0.9, y + 0.375, z - 0.4],
        [x + 0.9, y + 0.375, z - 0.4],
        [x - 0.9, y + 0.375, z + 0.4],
        [x + 0.9, y + 0.375, z + 0.4]
    ];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, tableMaterial);
        leg.position.set(...pos);
        scene.add(leg);
    });
    
    // Benches
    const benchGeometry = new THREE.BoxGeometry(2, 0.08, 0.3);
    const bench1 = new THREE.Mesh(benchGeometry, tableMaterial);
    bench1.position.set(x, y + 0.45, z - 0.7);
    scene.add(bench1);
    const bench2 = new THREE.Mesh(benchGeometry, tableMaterial);
    bench2.position.set(x, y + 0.45, z + 0.7);
    scene.add(bench2);
    
    // Beer steins on table
    const steinGeometry = new THREE.CylinderGeometry(0.08, 0.07, 0.2, 8);
    const steinMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        roughness: 0.3
    });
    const stein = new THREE.Mesh(steinGeometry, steinMaterial);
    stein.position.set(x + 0.3, y + 0.9, z);
    scene.add(stein);
}

// ==================== NPC CREATION ====================
function createNPC() {
    const character = gameState.scenario?.character || {
        name: 'Guide',
        emoji: '👤'
    };
    
    npc = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4a90d9 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.0;
    body.castShadow = true;
    npc.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffd5b5 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.7;
    head.castShadow = true;
    npc.add(head);
    
    // Simple hair
    const hairGeometry = new THREE.SphereGeometry(0.27, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 1.75;
    npc.add(hair);
    
    // Position NPC
    npc.position.set(0, 0, -3.5);
    scene.add(npc);
}

// ==================== PLAYER CREATION ====================
function createPlayer() {
    player = new THREE.Group();
    playerVelocity = new THREE.Vector3();
    player.position.set(0, 0, 3);
    scene.add(player);
    
    // Attach camera to player
    player.add(camera);
    camera.position.set(0, 1.6, 0);
}

// ==================== CONTROLS ====================
function setupControls() {
    // Keyboard
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        
        if (e.code === 'KeyE' && nearNPC && !isConversationActive) {
            startConversation();
        }
        
        if (e.code === 'KeyG') {
            toggleGlossary();
        }
        
        if (e.code === 'Escape') {
            // Priority: Close active modals/conversations first
            if (isConversationActive) {
                endConversation();
                return;
            }
            if (elements.glossaryModal.classList.contains('active')) {
                elements.glossaryModal.classList.remove('active');
                return;
            }
            // If nothing is open, exit to country selection
            window.location.href = 'country-selection.html';
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });
    
    // Mouse look
    elements.canvas.addEventListener('click', () => {
        if (!isConversationActive) {
            elements.canvas.requestPointerLock();
        }
    });
    
    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = document.pointerLockElement === elements.canvas;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isPointerLocked && !isConversationActive) {
            mouseX -= e.movementX * 0.002;
            mouseY -= e.movementY * 0.002;
            mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseY));
        }
    });
}

// ==================== CONVERSATION SYSTEM ====================
function setupConversationUI() {
    elements.voiceBtn.addEventListener('click', toggleRecording);
    elements.sendBtn.addEventListener('click', sendTextMessage);
    elements.textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendTextMessage();
    });
    elements.conversationClose.addEventListener('click', endConversation);
}

async function startConversation() {
    isConversationActive = true;
    document.exitPointerLock();
    
    elements.conversationPanel.classList.add('active');
    elements.interactPrompt.classList.remove('active');
    elements.controlsHint.style.display = 'none';
    
    // Mirage is already running from world load - log conversation start
    if (isMirageActive()) {
        console.log('🎨 Conversation started - Mirage stylization active');
    }
    
    // Get initial greeting from character
    const greeting = await generateNPCResponse(null, true);
    displayNPCMessage(greeting.text, greeting.translation);
    
    // Speak the greeting
    await speakText(greeting.text);
}

function endConversation() {
    isConversationActive = false;
    elements.conversationPanel.classList.remove('active');
    elements.controlsHint.style.display = 'block';
    conversationHistory = [];
    
    // Mirage continues running - it's always on once world loads
    console.log('🎨 Conversation ended - returning to exploration');
}

async function sendTextMessage() {
    const text = elements.textInput.value.trim();
    if (!text) return;
    
    elements.textInput.value = '';
    elements.textInput.disabled = true;
    elements.sendBtn.disabled = true;
    
    // Get NPC response
    const response = await generateNPCResponse(text);
    displayNPCMessage(response.text, response.translation, response.correction);
    
    // Speak response
    await speakText(response.text);
    
    // Update difficulty
    if (response.shouldIncreaseDifficulty) {
        currentDifficulty = Math.min(5, currentDifficulty + 1);
        updateDifficultyUI();
    }
    
    // Add new words to glossary
    if (response.newWords) {
        response.newWords.forEach(word => {
            if (!glossary.find(w => w.word === word.word)) {
                glossary.push(word);
            }
        });
        updateGlossaryUI();
    }
    
    elements.textInput.disabled = false;
    elements.sendBtn.disabled = false;
    elements.textInput.focus();
}

async function generateNPCResponse(playerText, isGreeting = false) {
    const character = gameState.scenario?.character || { name: 'Guide' };
    const language = gameState.language || 'french';
    
    const difficultyInstructions = {
        1: `Speak mostly in English, but introduce 2-3 key ${language} words. Always provide translations in parentheses.`,
        2: `Mix ${language} and English equally. Use simple ${language} sentences. Translate new words.`,
        3: `Speak primarily in ${language}. Only use English for clarification. Grammar should be simple.`,
        4: `Speak in ${language}. Only use English if absolutely necessary. Include more complex grammar.`,
        5: `Speak naturally and fluently in ${language}. Use idioms and natural expressions.`
    };
    
    const systemPrompt = `You are ${character.name}, ${character.role || 'a character'} in an immersive language learning game.
${character.bio || ''}

LANGUAGE LEVEL (${currentDifficulty}/5): ${difficultyInstructions[currentDifficulty]}

RULES:
1. Stay in character at all times
2. Be warm, encouraging, and patient
3. If the player makes a grammar mistake, gently correct them
4. Naturally introduce vocabulary relevant to the scenario
5. Keep responses conversational (2-4 sentences)

FALSE FRIENDS TO MENTION WHEN RELEVANT:
${(gameState.scenario?.falseFriends || []).map(f => `- "${f.word}": ${f.meaning} (${f.trap})`).join('\n')}

RESPONSE FORMAT (JSON):
{
    "text": "Your response in the target language (with English mixed in based on difficulty)",
    "translation": "English translation if primarily in target language",
    "correction": "Grammar correction if player made a mistake (or null)",
    "newWords": [{"word": "new word", "meaning": "meaning", "pronunciation": "pronunciation guide"}],
    "shouldIncreaseDifficulty": true/false (if player is doing well)
}`;

    const messages = isGreeting 
        ? [{ role: 'user', content: 'The player has just approached you. Greet them warmly and introduce yourself.' }]
        : [
            ...conversationHistory,
            { role: 'user', content: playerText }
        ];
    
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CONFIG.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 500,
                system: systemPrompt,
                messages: messages
            })
        });
        
        const data = await response.json();
        const content = data.content[0].text;
        
        // Update conversation history
        if (!isGreeting) {
            conversationHistory.push({ role: 'user', content: playerText });
        }
        conversationHistory.push({ role: 'assistant', content: content });
        
        // Parse JSON response
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            // If not valid JSON, return raw text
            return { text: content, translation: '' };
        }
        
        return { text: content, translation: '' };
    } catch (error) {
        console.error('Error generating response:', error);
        return { 
            text: 'Bonjour! Welcome!', 
            translation: 'Hello! Welcome!' 
        };
    }
}

function displayNPCMessage(text, translation, correction) {
    elements.speechText.textContent = text;
    elements.speechTranslation.textContent = translation || '';
    
    if (correction) {
        elements.grammarCorrection.classList.remove('hidden');
        elements.grammarText.textContent = correction;
    } else {
        elements.grammarCorrection.classList.add('hidden');
    }
}

// ==================== VOICE SYNTHESIS (ElevenLabs) ====================
async function speakText(text) {
    // Stop any current audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    const language = gameState.language || 'french';
    const voiceId = VOICE_IDS[language]?.female || 'EXAVITQu4vr4xnSDxMaL';
    
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': CONFIG.ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });
        
        if (response.ok) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            currentAudio = new Audio(audioUrl);
            await currentAudio.play();
        }
    } catch (error) {
        console.error('Error with TTS:', error);
    }
}

// ==================== VOICE RECORDING ====================
async function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (e) => {
            audioChunks.push(e.data);
        };
        
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            await processAudioInput(audioBlob);
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        isRecording = true;
        elements.voiceBtn.classList.add('recording');
        elements.voiceBtn.textContent = '⏹';
    } catch (error) {
        console.error('Error starting recording:', error);
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        elements.voiceBtn.classList.remove('recording');
        elements.voiceBtn.textContent = '🎤';
    }
}

async function processAudioInput(audioBlob) {
    // For now, we'll use text input as fallback
    // In production, this would use ElevenLabs Speech-to-Text
    elements.textInput.placeholder = 'Voice processing... (type instead for now)';
    setTimeout(() => {
        elements.textInput.placeholder = 'Type your response or click the mic to speak...';
    }, 2000);
}

// ==================== GLOSSARY ====================
function setupGlossary() {
    elements.glossaryBtn.addEventListener('click', toggleGlossary);
    elements.glossaryClose.addEventListener('click', () => {
        elements.glossaryModal.classList.remove('active');
    });
    
    // Initialize with false friends
    if (gameState.scenario?.falseFriends) {
        gameState.scenario.falseFriends.forEach(ff => {
            glossary.push({
                word: ff.word,
                meaning: ff.meaning,
                pronunciation: '',
                isFalseFriend: true,
                warning: ff.trap
            });
        });
    }
    
    updateGlossaryUI();
}

function toggleGlossary() {
    elements.glossaryModal.classList.toggle('active');
}

function updateGlossaryUI() {
    const regularWords = glossary.filter(w => !w.isFalseFriend);
    const falseFriends = glossary.filter(w => w.isFalseFriend);
    
    elements.glossaryWords.innerHTML = regularWords.map(w => `
        <div class="glossary-item">
            <div class="glossary-word">${w.word}</div>
            <div class="glossary-meaning">${w.meaning}</div>
            ${w.pronunciation ? `<div class="glossary-pronunciation">/${w.pronunciation}/</div>` : ''}
        </div>
    `).join('') || '<p style="color: rgba(255,255,255,0.5)">No words learned yet. Start talking!</p>';
    
    elements.glossaryFalseFriends.innerHTML = falseFriends.map(w => `
        <div class="glossary-item false-friend-item">
            <div class="glossary-word">${w.word}</div>
            <div class="glossary-meaning">${w.meaning}</div>
            <div class="false-friend-warning">⚠️ ${w.warning}</div>
        </div>
    `).join('');
}

// ==================== ANIMATION LOOP ====================
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
    if (!isConversationActive) {
        updatePlayer(delta);
        checkNPCProximity();
    }
    
    // Gentle NPC idle animation
    if (npc) {
        npc.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.02;
        npc.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
    
    composer.render();
}

function updatePlayer(delta) {
    const moveSpeed = 4;
    const direction = new THREE.Vector3();
    
    if (keys['KeyW']) direction.z -= 1;
    if (keys['KeyS']) direction.z += 1;
    if (keys['KeyA']) direction.x -= 1;
    if (keys['KeyD']) direction.x += 1;
    
    direction.normalize();
    
    // Rotate direction based on camera
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), mouseX);
    
    playerVelocity.x = direction.x * moveSpeed * delta;
    playerVelocity.z = direction.z * moveSpeed * delta;
    
    player.position.add(playerVelocity);
    
    // Clamp player position
    player.position.x = Math.max(-8, Math.min(8, player.position.x));
    player.position.z = Math.max(-4, Math.min(8, player.position.z));
    
    // Update camera rotation
    player.rotation.y = mouseX;
    camera.rotation.x = mouseY;
}

function checkNPCProximity() {
    if (!npc) return;
    
    const distance = player.position.distanceTo(npc.position);
    nearNPC = distance < 3;
    
    elements.interactPrompt.classList.toggle('active', nearNPC && !isConversationActive);
}

// ==================== START ====================
document.addEventListener('DOMContentLoaded', init);

