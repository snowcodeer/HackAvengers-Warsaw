// LinguaVerse World - Three.js + Mirage + ElevenLabs
import * as THREE from 'three';
import { EffectComposer, RenderPass, BloomEffect, SMAAEffect, EffectPass, VignetteEffect } from 'postprocessing';
import { startMirageStream, stopMirageStream, setMirageScenario, isMirageActive } from './mirage.js';
import { audioManager } from './core/AudioManager.js';
import { LANGUAGE_CONFIG, getLanguageConfig, getDifficultyInstruction, getCharacterVoice } from './config/languages.js';
import { SceneBuilder } from './core/SceneBuilder.js';

// ==================== CONFIGURATION ====================
const CONFIG = {
    ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
    ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    DECART_API_KEY: import.meta.env.VITE_DECART_API_KEY || '',
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
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

// Voice IDs now pulled from extensive LANGUAGE_CONFIG
// Each character has unique voice settings with expression tags
const getVoiceForLanguage = (langCode) => {
    const config = getCharacterVoice(langCode);
    if (config) {
        return {
            voiceId: config.voiceId,
            style: config.style,
            speed: config.speed || 1.0,
            pitch: config.pitch || 1.0,
            expressionTags: config.expressionTags || {}
        };
    }
    // Fallback
    return { voiceId: 'EXAVITQu4vr4xnSDxMaL', style: 'warm', speed: 1.0, pitch: 1.0, expressionTags: {} };
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
    controlsHint: document.getElementById('controlsHint')
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
        
        // 🎵 Start background music for this language/country
        await audioManager.initialize();
        const language = gameState.language || 'french';
        await audioManager.setLanguageAudio(language);
        console.log(`🎵 Background music started for ${language}`);
    }, 2000);
    
    // Start animation loop
    clock = new THREE.Clock();
    animate();
}

function updateScenarioUI() {
    const language = gameState.language || 'french';
    const langConfig = getLanguageConfig(language);
    
    // Use extensive config if available
    const scene = langConfig?.scene || gameState.scenario;
    const character = langConfig?.character || gameState.scenario?.character;
    
    if (scene) {
        const emoji = langConfig?.flag || gameState.scenario?.emoji || '🌍';
        elements.loadingEmoji.textContent = emoji;
        elements.scenarioEmoji.textContent = emoji;
        elements.scenarioName.textContent = scene.name || gameState.scenario?.name || 'Learning Space';
        elements.charAvatarSmall.textContent = character?.emoji || '👤';
        
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = `Entering ${scene.name}...`;
        }
        
        // Log the rich scene data
        console.log('🎭 Scene loaded:', {
            name: scene.name,
            location: scene.location,
            character: character?.name,
            timeOfDay: scene.timeOfDay,
            weather: scene.weather
        });
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
// Scene builder instance for animated/interactive objects
let sceneBuilderInstance = null;

function buildWorld() {
    const language = gameState.language || 'french';
    const langConfig = getLanguageConfig(language);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // USE SCENEBUILDER WITH EXTENSIVE LANGUAGE_CONFIG
    // ═══════════════════════════════════════════════════════════════════════════
    if (langConfig && langConfig.scene) {
        console.log('🏗️ Building scene with SceneBuilder:', langConfig.scene.name);
        console.log('📍 Location:', langConfig.scene.location);
        console.log('🌤️ Weather:', langConfig.scene.weather);
        console.log('⏰ Time:', langConfig.scene.timeOfDay);
        
        try {
            // Use the detailed SceneBuilder with full config
            sceneBuilderInstance = new SceneBuilder(scene, langConfig);
            const buildResult = sceneBuilderInstance.build();
            
            console.log('✅ Scene built with:', {
                animatedObjects: buildResult.animated?.length || 0,
                interactiveObjects: buildResult.interactive?.length || 0,
                lights: buildResult.lights?.length || 0
            });
            
            return; // Scene built successfully with SceneBuilder
        } catch (error) {
            console.warn('⚠️ SceneBuilder failed, falling back to legacy builder:', error);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // FALLBACK: Legacy hardcoded scenes (if SceneBuilder fails or no config)
    // ═══════════════════════════════════════════════════════════════════════════
    console.log('🔧 Using legacy scene builder');
    
    const scenarioType = gameState.scenario?.id || language || 'french';
    
    // Default lighting for legacy scenes
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.4);
    scene.add(ambientLight);
    
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
    
    const warmLight1 = new THREE.PointLight(0xffaa44, 0.8, 15);
    warmLight1.position.set(-3, 3, -2);
    scene.add(warmLight1);
    
    const warmLight2 = new THREE.PointLight(0xff8844, 0.6, 12);
    warmLight2.position.set(3, 2.5, -3);
    scene.add(warmLight2);
    
    // Map language codes to legacy builders
    switch (scenarioType) {
        case 'french':
        case 'boulangerie':
            buildBoulangerie();
            break;
        case 'german':
        case 'berghain':
            buildBerghain();
            break;
        case 'japanese':
        case 'teahouse':
            buildTeahouse();
            break;
        case 'izakaya':
            buildIzakaya();
            break;
        case 'spanish':
        case 'tapas':
            buildTapasBar();
            break;
        case 'biergarten':
            buildBiergarten();
            break;
        case 'italian':
            buildItalianCafe();
            break;
        case 'mandarin':
            buildChineseTeaHouse();
            break;
        case 'polish':
            buildPolishMilkBar();
            break;
        default:
            buildBoulangerie();
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADDITIONAL LEGACY SCENE BUILDERS (for languages without SceneBuilder support)
// ═══════════════════════════════════════════════════════════════════════════════

function buildItalianCafe() {
    scene.fog = new THREE.Fog(0xffd700, 15, 60);
    
    // Terracotta floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xCD853F, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Ochre walls
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xDEB887 });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), wallMaterial);
    backWall.position.set(0, 4, -6);
    scene.add(backWall);
    
    // Espresso bar
    const barGeometry = new THREE.BoxGeometry(5, 1.1, 0.8);
    const barMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.position.set(0, 0.55, -4);
    bar.castShadow = true;
    scene.add(bar);
    
    // String lights
    const stringLightColor = 0xFFE4B5;
    for (let i = -3; i <= 3; i++) {
        const bulb = new THREE.PointLight(stringLightColor, 0.3, 5);
        bulb.position.set(i * 1.5, 3.5, -2);
        scene.add(bulb);
    }
}

function buildChineseTeaHouse() {
    scene.fog = new THREE.Fog(0xFFF8DC, 10, 50);
    
    // Wooden floor
    const floorGeometry = new THREE.PlaneGeometry(18, 18);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.7 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Paper walls
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xFFF5EE, transparent: true, opacity: 0.9 });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(18, 6), wallMaterial);
    backWall.position.set(0, 3, -6);
    scene.add(backWall);
    
    // Low tea table
    const tableGeometry = new THREE.BoxGeometry(2, 0.3, 1);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x3D2817 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(0, 0.15, -3);
    table.castShadow = true;
    scene.add(table);
    
    // Red lanterns
    for (let i = -2; i <= 2; i++) {
        const lanternLight = new THREE.PointLight(0xFF4500, 0.4, 8);
        lanternLight.position.set(i * 2, 3, -2);
        scene.add(lanternLight);
    }
}

function buildPolishMilkBar() {
    scene.fog = new THREE.Fog(0xFFF5E6, 10, 40);
    
    // Simple checkered floor
    const floorGeometry = new THREE.PlaneGeometry(16, 16);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xF5F5DC, roughness: 0.9 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Cream walls with photos
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFACD });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(16, 6), wallMaterial);
    backWall.position.set(0, 3, -5);
    scene.add(backWall);
    
    // Serving counter
    const counterGeometry = new THREE.BoxGeometry(6, 1, 0.8);
    const counterMaterial = new THREE.MeshStandardMaterial({ color: 0xDEB887 });
    const counter = new THREE.Mesh(counterGeometry, counterMaterial);
    counter.position.set(0, 0.5, -3);
    counter.castShadow = true;
    scene.add(counter);
    
    // Warm overhead lights
    const light1 = new THREE.PointLight(0xFFE4B5, 0.6, 10);
    light1.position.set(-2, 3, -2);
    scene.add(light1);
    const light2 = new THREE.PointLight(0xFFE4B5, 0.6, 10);
    light2.position.set(2, 3, -2);
    scene.add(light2);
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
            if (isConversationActive) {
                endConversation();
            } else if (elements.glossaryModal.classList.contains('active')) {
                elements.glossaryModal.classList.remove('active');
            } else {
                // Exit scene - go back to country selection
                window.location.href = 'country-selection.html';
            }
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
}

async function startConversation() {
    isConversationActive = true;
    document.exitPointerLock();
    
    elements.conversationPanel.classList.add('active');
    elements.interactPrompt.classList.remove('active');
    elements.controlsHint.style.display = 'none';
    
    // 🔊 Play dialogue open sound
    audioManager.playDialogueOpen();
    
    // Mirage is already running from world load - log conversation start
    if (isMirageActive()) {
        console.log('🎨 Conversation started - Mirage stylization active');
    }
    
    // Get initial greeting from character
    const greeting = await generateNPCResponse(null, true);
    displayNPCMessage(greeting.text, greeting.translation);
    
    // Speak the greeting with expression
    await speakText(greeting.text, greeting.expression || 'greeting');
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
    
    // Speak response with expression
    await speakText(response.text, response.expression || 'teaching');
    
    // Update difficulty
    if (response.shouldIncreaseDifficulty) {
        currentDifficulty = Math.min(5, currentDifficulty + 1);
        updateDifficultyUI();
        // 🎉 Play level up sound
        audioManager.playQuestComplete();
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
    const language = gameState.language || 'french';
    const langConfig = getLanguageConfig(language);
    
    // Use the extensive config, fallback to basic scenario data
    const character = langConfig?.character || gameState.scenario?.character || { name: 'Guide' };
    const scene = langConfig?.scene || gameState.scenario || {};
    const falseFriends = langConfig?.falseFriends || gameState.scenario?.falseFriends || [];
    const startingPhrases = langConfig?.startingPhrases || [];
    
    // Get difficulty instruction from extensive config
    const difficultyInstruction = getDifficultyInstruction(language, currentDifficulty) || 
        `Speak primarily in ${language} with some English based on level ${currentDifficulty}.`;
    
    // Build comprehensive personality from config
    const personality = character.personality || {};
    const traits = personality.traits?.join(', ') || 'warm, patient, encouraging';
    const quirks = personality.quirks?.join('. ') || '';
    const backstory = personality.backstory || character.bio || '';
    
    const systemPrompt = `You are ${character.name}, ${character.role || 'a language guide'} in an immersive language learning game.

CHARACTER BACKSTORY:
${backstory}

PERSONALITY: ${traits}
QUIRKS: ${quirks}

SCENE: ${scene.name || 'Learning environment'}
LOCATION: ${scene.location || 'Unknown'}
ATMOSPHERE: ${scene.description?.substring(0, 200) || 'A welcoming place for learning'}

LANGUAGE LEVEL (${currentDifficulty}/5):
${difficultyInstruction}

TEACHING RULES:
1. Stay deeply in character - you ARE this person
2. Be ${traits}
3. If the player makes a grammar mistake, gently correct them using your character's style
4. Naturally introduce vocabulary relevant to ${scene.name}
5. Keep responses conversational (2-4 sentences)
6. Use your expression style: greeting=${character.voice?.expressionTags?.greeting || '[warmly]'}, teaching=${character.voice?.expressionTags?.teaching || '[patiently]'}

STARTING PHRASES TO REFERENCE:
${startingPhrases.map(p => `- "${p.phrase}" (${p.translation}) - pronounced: ${p.pronunciation}`).join('\n')}

FALSE FRIENDS TO MENTION WHEN RELEVANT:
${falseFriends.map(f => `- "${f.word}" looks like "${f.looksLike || f.trap}" but means: ${f.actualMeaning || f.meaning}`).join('\n')}

RESPONSE FORMAT (JSON):
{
    "text": "Your response in the target language (with English mixed in based on difficulty)",
    "translation": "English translation if primarily in target language",
    "newWords": [{"word": "new word", "meaning": "meaning"}],
    "shouldIncreaseDifficulty": true/false (if player is doing well),
    "expression": "greeting|teaching|praising"
}

NOTE: Do NOT provide pronunciation feedback or grammar corrections. Keep responses encouraging and conversational.`;

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

function displayNPCMessage(text, translation, correction = null) {
    elements.speechText.textContent = text;
    elements.speechTranslation.textContent = translation || '';
    
    // Pronunciation/grammar correction DISABLED - keep it hidden
    if (elements.grammarCorrection) {
        elements.grammarCorrection.classList.add('hidden');
    }
}

// ==================== VOICE SYNTHESIS (ElevenLabs via Backend) ====================
async function speakText(text, expression = null) {
    // Stop any current audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    const language = gameState.language || 'french';
    const voiceConfig = getVoiceForLanguage(language);
    const langConfig = getLanguageConfig(language);
    const characterId = langConfig?.character?.name || 'default';
    
    // Apply expression tag if available
    let processedText = text;
    if (expression && voiceConfig.expressionTags[expression]) {
        processedText = `${voiceConfig.expressionTags[expression]} ${text}`;
    }
    
    try {
        // Try backend API first (preferred - keeps API keys server-side)
        const response = await fetch(`${CONFIG.BACKEND_URL}/api/speak`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: processedText,
                character_id: characterId,
                expression: expression
            })
        });
        
        if (response.ok) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            currentAudio = new Audio(audioUrl);
            await currentAudio.play();
            console.log(`🔊 Speaking via backend: "${text.substring(0, 50)}..."`);
            return;
        }
    } catch (backendError) {
        console.warn('Backend TTS failed, falling back to direct API:', backendError);
    }
    
    // Fallback to direct API (for when backend is not running)
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': CONFIG.ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: processedText,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.3,
                    use_speaker_boost: true
                }
            })
        });
        
        if (response.ok) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            currentAudio = new Audio(audioUrl);
            await currentAudio.play();
            console.log(`🔊 Speaking via direct API: "${text.substring(0, 50)}..."`);
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
    const elapsed = clock.getElapsedTime();
    
    if (!isConversationActive) {
        updatePlayer(delta);
        checkNPCProximity();
    }
    
    // Gentle NPC idle animation
    if (npc) {
        npc.position.y = Math.sin(elapsed * 2) * 0.02;
        npc.rotation.y = Math.sin(elapsed * 0.5) * 0.1;
    }
    
    // Update SceneBuilder animated objects (steam, flickering lights, etc.)
    if (sceneBuilderInstance && typeof sceneBuilderInstance.update === 'function') {
        sceneBuilderInstance.update(delta, elapsed);
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

