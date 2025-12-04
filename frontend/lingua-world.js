// LinguaVerse World - Three.js + Mirage + ElevenLabs
import * as THREE from 'three';
import { EffectComposer, RenderPass, BloomEffect, SMAAEffect, EffectPass, VignetteEffect } from 'postprocessing';
import { startMirageStream, stopMirageStream, setMirageScenario, isMirageActive } from './mirage.js';
import { audioManager } from './core/AudioManager.js';
import { LANGUAGE_CONFIG, getLanguageConfig, getDifficultyInstruction, getCharacterVoice } from './config/languages.js';
import { RealtimeVoice, realtimeVoice } from './core/RealtimeVoice.js';
import { RealtimeVoiceFeedback, voiceFeedback } from './core/RealtimeVoiceFeedback.js';
import { SceneBuilder } from './core/SceneBuilder.js';

// ==================== CONFIGURATION ====================
const CONFIG = {
    ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
    ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    DECART_API_KEY: import.meta.env.VITE_DECART_API_KEY || '',
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
};

// Make API keys and config available globally for RealtimeVoice module
if (typeof window !== 'undefined') {
    window.ELEVENLABS_API_KEY = CONFIG.ELEVENLABS_API_KEY;
    window.BACKEND_URL = CONFIG.BACKEND_URL;
}

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

// Camera zoom state (for NPC conversation close-up)
let isZoomedIn = false;
let originalCameraPos = null;
let targetCameraPos = null;
let targetLookAt = null;

// Speech highlighting state
let currentSpeechText = '';
let speechHighlightIndex = 0;
let speechHighlightInterval = null;

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
    chatHistory: document.getElementById('chatHistory'),
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
    practiceBtn: document.getElementById('practiceBtn'),
    replaySpeechBtn: document.getElementById('replaySpeechBtn'),
    // Pronunciation Trainer elements
    pronunciationTrainer: document.getElementById('pronunciationTrainer'),
    ptClose: document.getElementById('ptClose'),
    micIcon: document.getElementById('micIcon'),
    micLabel: document.getElementById('micLabel'),
    amplitudeBars: document.getElementById('amplitudeBars'),
    levelValue: document.getElementById('levelValue'),
    expectedText: document.getElementById('expectedText'),
    playExpectedBtn: document.getElementById('playExpectedBtn'),
    transcribedWords: document.getElementById('transcribedWords'),
    errorFeedback: document.getElementById('errorFeedback'),
    errorList: document.getElementById('errorList'),
    overallScore: document.getElementById('overallScore'),
    scoreCircle: document.getElementById('scoreCircle'),
    scoreValue: document.getElementById('scoreValue'),
    ptStartBtn: document.getElementById('ptStartBtn'),
    ptPlaybackBtn: document.getElementById('ptPlaybackBtn'),
    ptRetryBtn: document.getElementById('ptRetryBtn')
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
    
    // Setup pronunciation trainer
    initPronunciationTrainer();
    
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
    // Single click: toggle recording
    elements.voiceBtn.addEventListener('click', toggleRecording);
    
    // Double click: open pronunciation trainer with NPC's last message
    elements.voiceBtn.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const lastNPCText = elements.speechText?.textContent || '';
        if (lastNPCText) {
            openPronunciationTrainer(lastNPCText);
        }
    });
    
    // Practice button: open pronunciation trainer
    if (elements.practiceBtn) {
        elements.practiceBtn.addEventListener('click', () => {
            const phraseToLearn = elements.speechText?.textContent || '';
            if (phraseToLearn) {
                openPronunciationTrainer(phraseToLearn);
            }
        });
    }
    
    // Replay button: replay the NPC's last speech
    if (elements.replaySpeechBtn) {
        elements.replaySpeechBtn.addEventListener('click', async () => {
            const lastSpeech = elements.speechText?.textContent || '';
            if (lastSpeech) {
                elements.replaySpeechBtn.disabled = true;
                elements.replaySpeechBtn.textContent = '🔊...';
                await speakText(lastSpeech);
                elements.replaySpeechBtn.disabled = false;
                elements.replaySpeechBtn.textContent = '🔊 Replay';
            }
        });
    }
    
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
    
    // 🎥 Zoom camera to NPC for cinematic close-up
    zoomToNPC();
    
    // 🔊 Play dialogue open sound
    if (audioManager.playDialogueOpen) {
        audioManager.playDialogueOpen();
    }
    
    // Mirage is already running from world load - log conversation start
    if (isMirageActive()) {
        console.log('🎨 Conversation started - Mirage stylization active');
    }
    
    // Get initial greeting from character
    const greeting = await generateNPCResponse(null, true);
    displayNPCMessage(greeting.text, greeting.translation);
    
    // Speak the greeting with text highlighting
    await speakTextWithHighlight(greeting.text, greeting.expression || 'greeting');
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA ZOOM SYSTEM (from game.js)
// ═══════════════════════════════════════════════════════════════════════════════

function zoomToNPC() {
    if (!npc) return;
    
    // Store original camera position
    originalCameraPos = camera.position.clone();
    isZoomedIn = true;
    
    // Get NPC face position
    const npcPosition = npc.position.clone();
    const facePosition = npcPosition.clone();
    facePosition.y += 1.6; // Head height
    
    // Calculate camera position (close-up, slightly to the side)
    const faceDirection = new THREE.Vector3(0, 0, 1);
    faceDirection.applyQuaternion(npc.quaternion);
    
    targetCameraPos = facePosition.clone();
    targetCameraPos.add(faceDirection.clone().multiplyScalar(2.5)); // 2.5 units from face
    targetCameraPos.y = facePosition.y + 0.3; // Slightly above eye level
    
    // Slight side offset for cinematic feel
    const sideOffset = new THREE.Vector3(-0.5, 0, 0);
    sideOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), npc.rotation.y);
    targetCameraPos.add(sideOffset);
    
    // Look at NPC face
    targetLookAt = facePosition.clone();
    
    console.log('🎥 Camera zooming to NPC');
}

function zoomOutFromNPC() {
    isZoomedIn = false;
    targetCameraPos = null;
    targetLookAt = null;
    console.log('🎥 Camera zooming out');
}

function endConversation() {
    isConversationActive = false;
    elements.conversationPanel.classList.remove('active');
    elements.controlsHint.style.display = 'block';
    conversationHistory = [];
    
    // 🎥 Zoom camera back out
    zoomOutFromNPC();
    
    // Stop any speech highlighting
    if (speechHighlightInterval) {
        clearInterval(speechHighlightInterval);
        speechHighlightInterval = null;
    }
    
    // Mirage continues running - it's always on once world loads
    console.log('🎨 Conversation ended - returning to exploration');
}

async function sendTextMessage() {
    const text = elements.textInput.value.trim();
    if (!text) return;
    
    elements.textInput.value = '';
    elements.textInput.disabled = true;
    elements.sendBtn.disabled = true;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ARCHIVE PREVIOUS NPC MESSAGE & DISPLAY USER'S MESSAGE
    // ═══════════════════════════════════════════════════════════════════════════
    archiveCurrentNPCMessage();
    displayUserMessage(text);
    
    // Get NPC response
    const response = await generateNPCResponse(text);
    displayNPCMessage(response.text, response.translation, response.correction);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SPEAK WITH TEXT HIGHLIGHTING
    // ═══════════════════════════════════════════════════════════════════════════
    await speakTextWithHighlight(response.text, response.expression || 'teaching');
    
    // Update difficulty
    if (response.shouldIncreaseDifficulty) {
        currentDifficulty = Math.min(5, currentDifficulty + 1);
        updateDifficultyUI();
        // 🎉 Play level up sound
        if (audioManager.playQuestComplete) {
            audioManager.playQuestComplete();
        }
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

// ==================== TEXT HIGHLIGHTING DURING SPEECH ====================
async function speakTextWithHighlight(text, expression = null) {
    // Store the text for highlighting
    currentSpeechText = text;
    speechHighlightIndex = 0;
    
    // Clear any existing highlight interval
    if (speechHighlightInterval) {
        clearInterval(speechHighlightInterval);
        speechHighlightInterval = null;
    }
    
    // Show text dimmed initially (waiting for audio)
    const words = text.split(/\s+/);
    if (elements.speechText) {
        elements.speechText.innerHTML = words.map(w => 
            `<span class="word-pending" style="opacity: 0.3;">${w}</span>`
        ).join(' ');
    }
    
    // Generate and play the speech - this returns the audio element
    const audio = await speakTextAndGetAudio(text, expression);
    
    if (!audio) {
        // Fallback - just show text if audio fails
        if (elements.speechText) {
            elements.speechText.innerHTML = text;
        }
        return;
    }
    
    // Calculate timing based on audio duration
    const audioDuration = audio.duration || 5; // fallback 5 seconds
    const msPerWord = (audioDuration * 1000) / words.length;
    
    console.log(`🔊 Audio duration: ${audioDuration}s, ${words.length} words, ${msPerWord.toFixed(0)}ms/word`);
    
    // Start highlighting WHEN audio actually starts playing
    audio.addEventListener('play', () => {
        console.log('🎵 Audio started - beginning highlight sync');
        speechHighlightIndex = 0;
        
        speechHighlightInterval = setInterval(() => {
            if (speechHighlightIndex < words.length) {
                highlightWordInSpeech(words, speechHighlightIndex);
                speechHighlightIndex++;
            } else {
                clearInterval(speechHighlightInterval);
                speechHighlightInterval = null;
            }
        }, msPerWord);
    });
    
    // Cleanup when audio ends
    audio.addEventListener('ended', () => {
        console.log('🎵 Audio ended');
        if (speechHighlightInterval) {
            clearInterval(speechHighlightInterval);
            speechHighlightInterval = null;
        }
        // Show full text highlighted as "completed"
        if (elements.speechText) {
            elements.speechText.innerHTML = words.map(w => 
                `<span class="word-spoken" style="opacity: 1; color: #4ecdc4;">${w}</span>`
            ).join(' ');
        }
    });
    
    // Wait for audio to finish
    await new Promise(resolve => {
        audio.addEventListener('ended', resolve);
        audio.addEventListener('error', resolve);
    });
}

function highlightWordInSpeech(words, currentIndex) {
    if (!elements.speechText) return;
    
    const highlighted = words.map((word, i) => {
        if (i < currentIndex) {
            // Already spoken - teal color (learned)
            return `<span class="word-spoken" style="color: #4ecdc4; opacity: 0.9;">${word}</span>`;
        } else if (i === currentIndex) {
            // Currently speaking - bright yellow/gold glow
            return `<span class="word-current" style="
                color: #f4b942;
                font-weight: bold;
                text-shadow: 0 0 15px rgba(244, 185, 66, 0.8), 0 0 30px rgba(244, 185, 66, 0.4);
                animation: wordPulse 0.3s ease-in-out;
            ">${word}</span>`;
        } else {
            // Not yet spoken - dimmed
            return `<span class="word-pending" style="opacity: 0.4;">${word}</span>`;
        }
    }).join(' ');
    
    elements.speechText.innerHTML = highlighted;
}

// Separate function to get audio element for sync
async function speakTextAndGetAudio(text, expression = null) {
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
    if (expression && voiceConfig.expressionTags && voiceConfig.expressionTags[expression]) {
        processedText = `${voiceConfig.expressionTags[expression]} ${text}`;
    }
    
    try {
        // Try backend API first
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
            
            // Wait for metadata to load (to get duration)
            await new Promise((resolve) => {
                currentAudio.addEventListener('loadedmetadata', resolve);
                currentAudio.addEventListener('error', resolve);
                currentAudio.load();
            });
            
            // Start playing
            currentAudio.play().catch(e => console.error('Audio play error:', e));
            
            console.log(`🔊 Backend TTS: "${text.substring(0, 40)}..." duration: ${currentAudio.duration}s`);
            return currentAudio;
        }
    } catch (backendError) {
        console.warn('Backend TTS failed:', backendError);
    }
    
    // Fallback to direct ElevenLabs API
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
                    similarity_boost: 0.75
                }
            })
        });
        
        if (response.ok) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            currentAudio = new Audio(audioUrl);
            
            await new Promise((resolve) => {
                currentAudio.addEventListener('loadedmetadata', resolve);
                currentAudio.addEventListener('error', resolve);
                currentAudio.load();
            });
            
            currentAudio.play().catch(e => console.error('Audio play error:', e));
            
            console.log(`🔊 Direct TTS: "${text.substring(0, 40)}..." duration: ${currentAudio.duration}s`);
            return currentAudio;
        }
    } catch (error) {
        console.error('TTS error:', error);
    }
    
    return null;
}

// ==================== VOICE SYNTHESIS (Simple version - no highlighting) ====================
async function speakText(text, expression = null) {
    // Use the full version but don't wait for completion
    const audio = await speakTextAndGetAudio(text, expression);
    if (audio) {
        // Wait for audio to finish
        await new Promise(resolve => {
            audio.addEventListener('ended', resolve);
            audio.addEventListener('error', resolve);
        });
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

// ═══════════════════════════════════════════════════════════════════════════════
// REAL-TIME VOICE LISTENING (ElevenLabs Scribe v2 WebSocket)
// ═══════════════════════════════════════════════════════════════════════════════

async function startRecording() {
    if (isRecording) return;
    isRecording = true;
    
    // Check if we have API key
    const hasApiKey = CONFIG.ELEVENLABS_API_KEY && CONFIG.ELEVENLABS_API_KEY.length > 10;
    
    if (!hasApiKey) {
        console.warn('═══════════════════════════════════════════════════════════════════');
        console.warn('⚠️ No ElevenLabs API key found!');
        console.warn('To enable voice transcription:');
        console.warn('1. Create a .env file in the frontend folder');
        console.warn('2. Add: VITE_ELEVENLABS_API_KEY=your_api_key_here');
        console.warn('3. Get your API key at: https://elevenlabs.io/');
        console.warn('═══════════════════════════════════════════════════════════════════');
    }
    
    // Use regular recording with post-recording transcription
    // (Real-time WebSocket STT requires enterprise access)
    await startRegularRecording();
}

function stopRecording() {
    if (!isRecording) return;
    isRecording = false;
    
    // Stop MediaRecorder
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    
    elements.voiceBtn.classList.remove('recording');
    elements.voiceBtn.textContent = '🎤';
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETUP REAL-TIME VOICE CALLBACKS
// ═══════════════════════════════════════════════════════════════════════════════
function setupRealtimeVoiceCallbacks() {
    // Called for each word as it's recognized
    realtimeVoice.onWordReceived = (word, index) => {
        console.log(`📝 Word ${index}: "${word.text}" (${(word.confidence * 100).toFixed(0)}%)`);
        addWordToRealtimeUI(word, index);
    };
    
    // Called when transcript updates
    realtimeVoice.onTranscriptUpdate = (transcript, words, isFinal) => {
        updateRealtimeTranscriptUI(transcript, words, isFinal);
        
        if (isFinal && transcript.trim()) {
            // Process the final transcript
            processRealtimeTranscript(transcript, words);
        }
    };
    
    // Called when listening starts
    realtimeVoice.onListeningStart = () => {
        console.log('🎤 Real-time listening active');
        elements.textInput.placeholder = 'Listening... speak now!';
    };
    
    // Called when listening stops
    realtimeVoice.onListeningStop = (transcript, words) => {
        console.log('🛑 Listening stopped. Transcript:', transcript);
        elements.textInput.placeholder = 'Type your response or click the mic to speak...';
        
        // Note: Don't call processRealtimeTranscript here!
        // It's already called from onTranscriptUpdate when isFinal=true
        // Calling it twice causes duplicate TTS responses
        
        // Hide real-time UI after a delay
        setTimeout(() => {
            hideRealtimeTranscriptUI();
        }, 2000);
    };
    
    // Called on error
    realtimeVoice.onError = (error) => {
        console.error('Real-time voice error:', error);
        elements.textInput.placeholder = 'Voice error - try typing';
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// REAL-TIME TRANSCRIPT UI
// ═══════════════════════════════════════════════════════════════════════════════
function showRealtimeTranscriptUI() {
    // Create or show the real-time transcript display
    let rtUI = document.getElementById('realtimeTranscript');
    if (!rtUI) {
        rtUI = document.createElement('div');
        rtUI.id = 'realtimeTranscript';
        rtUI.className = 'realtime-transcript';
        rtUI.innerHTML = `
            <div class="rt-header">
                <span class="rt-pulse"></span>
                <span class="rt-label">Listening...</span>
                <span class="rt-avg-score">--</span>
            </div>
            <div class="rt-words" id="rtWords"></div>
            <div class="rt-full-text" id="rtFullText"></div>
        `;
        elements.conversationPanel.querySelector('.conversation-content').insertBefore(
            rtUI,
            elements.conversationPanel.querySelector('.character-speaking')
        );
    }
    
    rtUI.style.display = 'block';
    rtUI.classList.add('active');
    
    // Clear previous words
    const wordsContainer = document.getElementById('rtWords');
    if (wordsContainer) wordsContainer.innerHTML = '';
    
    const fullText = document.getElementById('rtFullText');
    if (fullText) fullText.textContent = '';
}

function hideRealtimeTranscriptUI() {
    const rtUI = document.getElementById('realtimeTranscript');
    if (rtUI) {
        rtUI.classList.remove('active');
        setTimeout(() => {
            rtUI.style.display = 'none';
        }, 300);
    }
}

function addWordToRealtimeUI(word, index) {
    const wordsContainer = document.getElementById('rtWords');
    if (!wordsContainer) return;
    
    const wordEl = document.createElement('span');
    wordEl.className = 'rt-word';
    wordEl.dataset.confidence = word.confidence;
    
    // Color based on confidence score
    const confidence = word.confidence || 0.9;
    let colorClass = 'high';
    if (confidence < 0.7) colorClass = 'low';
    else if (confidence < 0.85) colorClass = 'medium';
    
    wordEl.classList.add(`confidence-${colorClass}`);
    wordEl.innerHTML = `
        <span class="word-text">${word.text}</span>
        <span class="word-score">${(confidence * 100).toFixed(0)}%</span>
    `;
    
    // Animate in
    wordEl.style.animation = 'wordAppear 0.3s ease forwards';
    
    wordsContainer.appendChild(wordEl);
    
    // Update average score
    updateAverageScore();
}

function updateRealtimeTranscriptUI(transcript, words, isFinal) {
    const fullText = document.getElementById('rtFullText');
    if (fullText) {
        fullText.textContent = transcript;
        fullText.classList.toggle('final', isFinal);
    }
    
    const rtLabel = document.querySelector('.rt-label');
    if (rtLabel) {
        rtLabel.textContent = isFinal ? 'Complete!' : 'Listening...';
    }
}

function updateAverageScore() {
    const avgScore = realtimeVoice.getAverageConfidence();
    const scoreEl = document.querySelector('.rt-avg-score');
    if (scoreEl && avgScore > 0) {
        scoreEl.textContent = `Avg: ${(avgScore * 100).toFixed(0)}%`;
        
        // Color based on score
        scoreEl.className = 'rt-avg-score';
        if (avgScore >= 0.85) scoreEl.classList.add('score-high');
        else if (avgScore >= 0.7) scoreEl.classList.add('score-medium');
        else scoreEl.classList.add('score-low');
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESS FINAL REAL-TIME TRANSCRIPT
// ═══════════════════════════════════════════════════════════════════════════════
let lastProcessedTranscript = '';
let isProcessingTranscript = false;

async function processRealtimeTranscript(transcript, words) {
    if (!transcript || !transcript.trim()) return;
    
    // Prevent duplicate processing of the same transcript
    if (isProcessingTranscript || transcript === lastProcessedTranscript) {
        console.log('⏭️ Skipping duplicate transcript processing');
        return;
    }
    
    isProcessingTranscript = true;
    lastProcessedTranscript = transcript;
    
    console.log('📝 Processing transcript:', transcript);
    console.log('📊 Words with scores:', words);
    
    // Archive previous NPC message and display user message
    archiveCurrentNPCMessage();
    displayUserMessageWithScores(transcript, words);
    
    // Get NPC response
    elements.textInput.disabled = true;
    elements.sendBtn.disabled = true;
    
    const response = await generateNPCResponse(transcript);
    displayNPCMessage(response.text, response.translation);
    
    // Speak with highlighting
    await speakTextWithHighlight(response.text, response.expression || 'teaching');
    
    // Update difficulty
    if (response.shouldIncreaseDifficulty) {
        currentDifficulty = Math.min(5, currentDifficulty + 1);
        updateDifficultyUI();
        if (audioManager.playQuestComplete) {
            audioManager.playQuestComplete();
        }
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
    
    // Reset processing flag
    isProcessingTranscript = false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISPLAY USER MESSAGE WITH WORD SCORES
// ═══════════════════════════════════════════════════════════════════════════════
function displayUserMessageWithScores(transcript, words) {
    if (!elements.chatHistory) return;
    
    const avgConfidence = words.length > 0 
        ? words.reduce((acc, w) => acc + (w.confidence || 0), 0) / words.length 
        : 0.9;
    
    // Create user message with word-by-word scores
    const userBubble = document.createElement('div');
    userBubble.className = 'user-message with-scores';
    
    // Build word HTML with individual scores
    const wordsHtml = words.length > 0 
        ? words.map(w => {
            const conf = w.confidence || 0.9;
            let colorClass = 'high';
            if (conf < 0.7) colorClass = 'low';
            else if (conf < 0.85) colorClass = 'medium';
            
            return `<span class="scored-word ${colorClass}" title="${(conf * 100).toFixed(0)}% confidence">${w.text}</span>`;
        }).join(' ')
        : transcript;
    
    userBubble.innerHTML = `
        <div class="user-label">
            You said: 
            <span class="overall-score ${avgConfidence >= 0.85 ? 'high' : avgConfidence >= 0.7 ? 'medium' : 'low'}">
                ${(avgConfidence * 100).toFixed(0)}% clarity
            </span>
        </div>
        <div class="user-text scored">${wordsHtml}</div>
    `;
    
    elements.chatHistory.appendChild(userBubble);
    elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REGULAR RECORDING WITH AMPLITUDE VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

let audioContext = null;
let analyser = null;
let animationFrameId = null;

async function startRegularRecording() {
    console.log('🎤 Starting recording with amplitude visualization...');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Setup MediaRecorder
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (e) => {
            audioChunks.push(e.data);
        };
        
        mediaRecorder.onstop = async () => {
            stopAmplitudeVisualization();
            hideAmplitudeUI();
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            await processAudioInput(audioBlob);
            stream.getTracks().forEach(track => track.stop());
        };
        
        // Setup Audio Context for amplitude analysis
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        
        // Show amplitude UI
        showAmplitudeUI();
        
        // Start visualization
        startAmplitudeVisualization();
        
        // Start recording
        mediaRecorder.start();
        
        elements.voiceBtn.classList.add('recording');
        elements.voiceBtn.innerHTML = '<span class="pulse-dot"></span>';
        
        console.log('✅ Recording started with visualization');
        
    } catch (error) {
        console.error('Error starting recording:', error);
        isRecording = false;
    }
}

function showAmplitudeUI() {
    // Create or show the amplitude visualization UI
    let ampUI = document.getElementById('amplitudeUI');
    if (!ampUI) {
        ampUI = document.createElement('div');
        ampUI.id = 'amplitudeUI';
        ampUI.innerHTML = `
            <div class="amp-container">
                <div class="amp-header">
                    <span class="amp-pulse"></span>
                    <span class="amp-label">🎤 Recording...</span>
                    <span class="amp-level">0%</span>
                </div>
                <div class="amp-bars" id="ampBars"></div>
                <div class="amp-waveform" id="ampWaveform">
                    <canvas id="waveformCanvas" width="300" height="60"></canvas>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #amplitudeUI {
                position: fixed;
                bottom: 120px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(15, 15, 25, 0.95);
                border: 2px solid rgba(78, 205, 196, 0.5);
                border-radius: 16px;
                padding: 16px;
                z-index: 1001;
                min-width: 320px;
                animation: slideUp 0.3s ease;
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            .amp-container { display: flex; flex-direction: column; gap: 12px; }
            .amp-header { display: flex; align-items: center; gap: 10px; }
            .amp-pulse {
                width: 12px; height: 12px;
                background: #ff6b6b;
                border-radius: 50%;
                animation: pulse 1s ease-in-out infinite;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.3); opacity: 0.7; }
            }
            .amp-label { flex: 1; color: #fff; font-size: 0.9rem; }
            .amp-level { 
                font-size: 1.2rem; font-weight: bold; 
                color: #4ecdc4; min-width: 50px; text-align: right;
            }
            .amp-bars {
                display: flex; align-items: flex-end;
                height: 40px; gap: 2px;
            }
            .amp-bar {
                flex: 1; background: linear-gradient(to top, #4ecdc4, #f4b942);
                border-radius: 2px; min-height: 2px;
                transition: height 0.05s ease;
            }
            .amp-waveform { margin-top: 8px; }
            #waveformCanvas {
                width: 100%; height: 60px;
                border-radius: 8px;
                background: rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(ampUI);
        
        // Create bars
        const barsContainer = document.getElementById('ampBars');
        for (let i = 0; i < 32; i++) {
            const bar = document.createElement('div');
            bar.className = 'amp-bar';
            barsContainer.appendChild(bar);
        }
    }
    
    ampUI.style.display = 'block';
}

function hideAmplitudeUI() {
    const ampUI = document.getElementById('amplitudeUI');
    if (ampUI) {
        ampUI.style.display = 'none';
    }
}

function startAmplitudeVisualization() {
    if (!analyser) return;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const bars = document.querySelectorAll('.amp-bar');
    const levelDisplay = document.querySelector('.amp-level');
    const canvas = document.getElementById('waveformCanvas');
    const ctx = canvas?.getContext('2d');
    
    // Waveform history
    const waveformHistory = [];
    const maxHistory = 150;
    
    function draw() {
        animationFrameId = requestAnimationFrame(draw);
        
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average amplitude
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const percent = Math.round((avg / 255) * 100);
        
        // Update level display
        if (levelDisplay) {
            levelDisplay.textContent = `${percent}%`;
            levelDisplay.style.color = percent > 50 ? '#4ecdc4' : percent > 20 ? '#f4b942' : '#ff6b6b';
        }
        
        // Update bars
        const step = Math.floor(bufferLength / bars.length);
        bars.forEach((bar, i) => {
            const value = dataArray[i * step] || 0;
            const height = Math.max(2, (value / 255) * 40);
            bar.style.height = `${height}px`;
        });
        
        // Draw waveform
        if (ctx && canvas) {
            waveformHistory.push(avg);
            if (waveformHistory.length > maxHistory) {
                waveformHistory.shift();
            }
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.beginPath();
            ctx.strokeStyle = '#4ecdc4';
            ctx.lineWidth = 2;
            
            const sliceWidth = canvas.width / maxHistory;
            let x = 0;
            
            waveformHistory.forEach((val, i) => {
                const y = canvas.height - (val / 255) * canvas.height;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                x += sliceWidth;
            });
            
            ctx.stroke();
            
            // Fill under the line
            ctx.lineTo(x, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fillStyle = 'rgba(78, 205, 196, 0.2)';
            ctx.fill();
        }
    }
    
    draw();
}

function stopAmplitudeVisualization() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
        audioContext = null;
    }
    
    analyser = null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRONUNCIATION TRAINER - Full real-time feedback system
// ═══════════════════════════════════════════════════════════════════════════════

let pronunciationTrainerActive = false;
let currentExpectedPhrase = '';

function initPronunciationTrainer() {
    // Initialize voice feedback with API key
    voiceFeedback.init(CONFIG.ELEVENLABS_API_KEY);
    
    // Create amplitude bars
    if (elements.amplitudeBars) {
        elements.amplitudeBars.innerHTML = '';
        for (let i = 0; i < 32; i++) {
            const bar = document.createElement('div');
            bar.className = 'amplitude-bar';
            bar.style.height = '4px';
            elements.amplitudeBars.appendChild(bar);
        }
    }
    
    // Setup callbacks
    voiceFeedback.onAmplitudeUpdate = handleAmplitudeUpdate;
    voiceFeedback.onWordTranscribed = handleWordTranscribed;
    voiceFeedback.onPronunciationError = handlePronunciationError;
    voiceFeedback.onTranscriptComplete = handleTranscriptComplete;
    voiceFeedback.onMicConnected = handleMicConnected;
    voiceFeedback.onError = handleVoiceFeedbackError;
    
    // Button event listeners
    if (elements.ptClose) {
        elements.ptClose.addEventListener('click', closePronunciationTrainer);
    }
    
    if (elements.ptStartBtn) {
        elements.ptStartBtn.addEventListener('click', togglePronunciationRecording);
    }
    
    if (elements.ptPlaybackBtn) {
        elements.ptPlaybackBtn.addEventListener('click', playUserRecording);
    }
    
    if (elements.ptRetryBtn) {
        elements.ptRetryBtn.addEventListener('click', retryPronunciation);
    }
    
    if (elements.playExpectedBtn) {
        elements.playExpectedBtn.addEventListener('click', playExpectedPronunciation);
    }
}

function openPronunciationTrainer(phrase) {
    if (!elements.pronunciationTrainer) return;
    
    currentExpectedPhrase = phrase;
    pronunciationTrainerActive = true;
    
    // Set language
    voiceFeedback.setLanguage(gameState.language || 'french');
    voiceFeedback.setExpectedText(phrase);
    
    // Get voice ID for this language
    const voiceConfig = getVoiceForLanguage(gameState.language);
    voiceFeedback.voiceId = voiceConfig.voiceId;
    
    // Reset UI
    resetPronunciationTrainerUI();
    
    // Show expected text with words
    const words = phrase.split(/\s+/);
    elements.expectedText.innerHTML = words.map((word, i) => 
        `<span class="word" data-index="${i}">${word}</span>`
    ).join(' ');
    
    // Show trainer
    elements.pronunciationTrainer.classList.add('active');
    
    console.log(`🎯 Pronunciation trainer opened: "${phrase}"`);
}

function closePronunciationTrainer() {
    if (!elements.pronunciationTrainer) return;
    
    pronunciationTrainerActive = false;
    voiceFeedback.stopListening();
    
    elements.pronunciationTrainer.classList.remove('active');
    
    console.log('🎯 Pronunciation trainer closed');
}

function resetPronunciationTrainerUI() {
    // Reset transcribed words
    if (elements.transcribedWords) {
        elements.transcribedWords.innerHTML = '<div style="color: rgba(255,255,255,0.4); font-style: italic;">Words will appear here as you speak...</div>';
    }
    
    // Reset error feedback
    if (elements.errorFeedback) {
        elements.errorFeedback.classList.add('hidden');
        elements.errorList.innerHTML = '';
    }
    
    // Reset score
    if (elements.overallScore) {
        elements.overallScore.classList.add('hidden');
    }
    
    // Reset expected text highlighting
    const words = elements.expectedText?.querySelectorAll('.word');
    words?.forEach(w => {
        w.classList.remove('matched', 'error', 'current');
    });
    
    // Reset buttons
    if (elements.ptStartBtn) {
        elements.ptStartBtn.innerHTML = '<span>🎤</span> Start Recording';
    }
    if (elements.ptPlaybackBtn) {
        elements.ptPlaybackBtn.disabled = true;
    }
    if (elements.ptRetryBtn) {
        elements.ptRetryBtn.disabled = true;
    }
    
    // Reset mic status
    if (elements.micIcon) {
        elements.micIcon.classList.remove('connected', 'speaking');
    }
    if (elements.micLabel) {
        elements.micLabel.textContent = 'Ready';
    }
}

async function togglePronunciationRecording() {
    if (voiceFeedback.isListening) {
        // Stop recording
        elements.ptStartBtn.innerHTML = '<span>⏳</span> Processing...';
        elements.ptStartBtn.disabled = true;
        
        const results = await voiceFeedback.stopListening();
        
        elements.ptStartBtn.innerHTML = '<span>🎤</span> Record Again';
        elements.ptStartBtn.disabled = false;
        elements.ptPlaybackBtn.disabled = false;
        elements.ptRetryBtn.disabled = false;
        
        // Show final score
        showFinalScore(results);
    } else {
        // Start recording
        resetPronunciationTrainerUI();
        elements.ptStartBtn.innerHTML = '<span>⏹</span> Stop Recording';
        
        try {
            await voiceFeedback.startListening(true);
        } catch (error) {
            console.error('Failed to start pronunciation trainer:', error);
            elements.ptStartBtn.innerHTML = '<span>🎤</span> Start Recording';
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRONUNCIATION TRAINER CALLBACKS
// ═══════════════════════════════════════════════════════════════════════════════

function handleAmplitudeUpdate(data) {
    // Update amplitude bars
    const bars = elements.amplitudeBars?.children;
    if (bars) {
        const step = Math.floor(data.data.length / bars.length);
        for (let i = 0; i < bars.length; i++) {
            const value = data.data[i * step] || 0;
            const height = Math.max(4, (value / 255) * 60);
            bars[i].style.height = `${height}px`;
        }
    }
    
    // Update level value
    if (elements.levelValue) {
        elements.levelValue.textContent = `${Math.round(data.average * 100)}%`;
    }
    
    // Update mic icon for speaking detection
    if (elements.micIcon) {
        elements.micIcon.classList.toggle('speaking', data.isSpeaking);
    }
}

function handleMicConnected(connected) {
    if (elements.micIcon) {
        elements.micIcon.classList.toggle('connected', connected);
    }
    if (elements.micLabel) {
        elements.micLabel.textContent = connected ? 'Connected' : 'Disconnected';
    }
}

function handleWordTranscribed(word, index, pronunciationResult) {
    // Clear placeholder
    if (index === 0 && elements.transcribedWords) {
        elements.transcribedWords.innerHTML = '';
    }
    
    // Add transcribed word to UI
    const wordEl = document.createElement('div');
    wordEl.className = `transcribed-word ${pronunciationResult.isCorrect ? 'correct' : 'incorrect'}`;
    
    const score = Math.round((pronunciationResult.similarity || word.confidence) * 100);
    
    wordEl.innerHTML = `
        <span class="tw-text">${word.text}</span>
        <span class="tw-score">${score}%</span>
        ${!pronunciationResult.isCorrect && pronunciationResult.expected ? 
            `<span class="tw-expected">Expected: ${pronunciationResult.expected}</span>` : ''}
    `;
    
    elements.transcribedWords?.appendChild(wordEl);
    
    // Update expected text highlighting
    const expectedWords = elements.expectedText?.querySelectorAll('.word');
    if (expectedWords && expectedWords[index]) {
        expectedWords[index].classList.add(pronunciationResult.isCorrect ? 'matched' : 'error');
        
        // Highlight next word as current
        if (expectedWords[index + 1]) {
            expectedWords[index + 1].classList.add('current');
        }
    }
}

function handlePronunciationError(error) {
    // Show error feedback section
    if (elements.errorFeedback) {
        elements.errorFeedback.classList.remove('hidden');
    }
    
    // Add error item
    const errorItem = document.createElement('div');
    errorItem.className = 'error-item';
    
    const suggestions = error.suggestions?.join(' ') || 'Try speaking more slowly and clearly.';
    
    errorItem.innerHTML = `
        <div class="error-icon">❌</div>
        <div class="error-details">
            <div class="error-comparison">
                <span class="error-spoken">You said: "${error.spoken}"</span>
                <span class="error-expected">Should be: "${error.expected}"</span>
            </div>
            <div class="error-suggestion">💡 ${suggestions}</div>
        </div>
        <button class="play-correct-btn" onclick="playWordPronunciation('${error.expected.replace(/'/g, "\\'")}')">
            🔊 Hear it
        </button>
    `;
    
    elements.errorList?.appendChild(errorItem);
}

function handleTranscriptComplete(words, errors) {
    console.log('📝 Transcript complete:', words.map(w => w.text).join(' '));
    console.log('⚠️ Errors:', errors.length);
}

function handleVoiceFeedbackError(error) {
    console.error('Voice feedback error:', error);
    if (elements.micLabel) {
        elements.micLabel.textContent = 'Error: ' + error.message;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRONUNCIATION TRAINER HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function showFinalScore(results) {
    if (!elements.overallScore) return;
    
    const score = results?.overallScore || voiceFeedback.getOverallScore();
    
    elements.overallScore.classList.remove('hidden');
    elements.scoreValue.textContent = `${Math.round(score)}%`;
    elements.scoreCircle.style.setProperty('--score-percent', `${score}%`);
    
    // Color based on score
    if (score >= 80) {
        elements.scoreCircle.style.background = `conic-gradient(var(--accent-teal) ${score}%, rgba(255,255,255,0.1) ${score}%)`;
    } else if (score >= 60) {
        elements.scoreCircle.style.background = `conic-gradient(var(--accent-gold) ${score}%, rgba(255,255,255,0.1) ${score}%)`;
    } else {
        elements.scoreCircle.style.background = `conic-gradient(var(--accent-coral) ${score}%, rgba(255,255,255,0.1) ${score}%)`;
    }
}

async function playExpectedPronunciation() {
    if (!currentExpectedPhrase) return;
    
    elements.playExpectedBtn.disabled = true;
    elements.playExpectedBtn.innerHTML = '🔊 Playing...';
    
    try {
        await voiceFeedback.playCorrectPronunciation(currentExpectedPhrase);
    } catch (error) {
        console.error('Error playing pronunciation:', error);
    }
    
    elements.playExpectedBtn.disabled = false;
    elements.playExpectedBtn.innerHTML = '🔊 Hear correct pronunciation';
}

// Global function for error item buttons
window.playWordPronunciation = async function(word) {
    try {
        await voiceFeedback.playCorrectPronunciation(word);
    } catch (error) {
        console.error('Error playing word pronunciation:', error);
    }
};

async function playUserRecording() {
    elements.ptPlaybackBtn.disabled = true;
    elements.ptPlaybackBtn.innerHTML = '<span>🔊</span> Playing...';
    
    try {
        await voiceFeedback.playRecording();
    } catch (error) {
        console.error('Error playing recording:', error);
    }
    
    elements.ptPlaybackBtn.disabled = false;
    elements.ptPlaybackBtn.innerHTML = '<span>🔁</span> Hear My Recording';
}

function retryPronunciation() {
    resetPronunciationTrainerUI();
}

async function processAudioInput(audioBlob) {
    elements.textInput.placeholder = 'Transcribing your voice...';
    elements.textInput.disabled = true;
    elements.sendBtn.disabled = true;
    
    const language = gameState.language || 'french';
    const langConfig = getLanguageConfig(language);
    
    try {
        // ═══════════════════════════════════════════════════════════════════════
        // TRANSCRIBE AUDIO USING ELEVENLABS STT API (with word timestamps)
        // ═══════════════════════════════════════════════════════════════════════
        
        let transcription = '';
        let wordsWithScores = [];
        
        if (CONFIG.ELEVENLABS_API_KEY) {
            console.log('🎤 Transcribing with ElevenLabs STT...');
            
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            
            const sttResponse = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
                method: 'POST',
                headers: {
                    'xi-api-key': CONFIG.ELEVENLABS_API_KEY
                },
                body: formData
            });
            
            if (sttResponse.ok) {
                const sttData = await sttResponse.json();
                transcription = sttData.text || '';
                
                // Extract word-level data if available
                if (sttData.words && Array.isArray(sttData.words)) {
                    wordsWithScores = sttData.words.map(w => ({
                        text: w.text || w.word,
                        confidence: w.confidence || 0.9,
                        start: w.start,
                        end: w.end
                    }));
                } else {
                    // Create word scores from text
                    wordsWithScores = transcription.split(/\s+/).filter(w => w).map(w => ({
                        text: w,
                        confidence: 0.85
                    }));
                }
                
                console.log('📝 Transcription:', transcription);
            } else {
                console.error('STT failed:', await sttResponse.text());
            }
        }
        
        // ═══════════════════════════════════════════════════════════════════════
        // FALLBACK: TRY BACKEND IF DIRECT STT FAILED
        // ═══════════════════════════════════════════════════════════════════════
        if (!transcription) {
            console.log('🎤 Trying backend transcription...');
            
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            formData.append('language', language);
            
            const backendResponse = await fetch(`${CONFIG.BACKEND_URL}/api/transcribe`, {
                method: 'POST',
                body: formData
            });
            
            if (backendResponse.ok) {
                const data = await backendResponse.json();
                transcription = data.text || data.transcription || '';
                wordsWithScores = transcription.split(/\s+/).filter(w => w).map(w => ({
                    text: w,
                    confidence: 0.85
                }));
            }
        }
        
        if (!transcription) {
            elements.textInput.placeholder = 'Could not transcribe - try again or type';
            elements.textInput.disabled = false;
            elements.sendBtn.disabled = false;
            return;
        }
        
        // ═══════════════════════════════════════════════════════════════════════
        // DISPLAY USER'S TRANSCRIPTION WITH WORD SCORES
        // ═══════════════════════════════════════════════════════════════════════
        archiveCurrentNPCMessage();
        displayUserMessageWithScores(transcription, wordsWithScores);
        
        // ═══════════════════════════════════════════════════════════════════════
        // GET NPC RESPONSE
        // ═══════════════════════════════════════════════════════════════════════
        const response = await generateNPCResponse(transcription);
        displayNPCMessage(response.text, response.translation);
        
        // Speak with highlighting
        await speakTextWithHighlight(response.text, response.expression || 'teaching');
        
        // Update difficulty if needed
        if (response.shouldIncreaseDifficulty) {
            currentDifficulty = Math.min(5, currentDifficulty + 1);
            updateDifficultyUI();
            if (audioManager.playQuestComplete) {
                audioManager.playQuestComplete();
            }
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
        
    } catch (error) {
        console.error('Voice processing error:', error);
        elements.textInput.placeholder = 'Voice error - try typing instead';
    }
    
    elements.textInput.disabled = false;
    elements.sendBtn.disabled = false;
    elements.textInput.placeholder = 'Type your response or click the mic to speak...';
    elements.textInput.focus();
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISPLAY USER'S MESSAGE (transcription)
// ═══════════════════════════════════════════════════════════════════════════════
function displayUserMessage(text) {
    if (!elements.chatHistory) return;
    
    // Create a user speech bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'user-message';
    userBubble.innerHTML = `
        <div class="user-label">You said:</div>
        <div class="user-text">${text}</div>
    `;
    
    // Add to chat history
    elements.chatHistory.appendChild(userBubble);
    
    // Scroll to show new message
    elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD PREVIOUS MESSAGE TO HISTORY (before showing new one)
// ═══════════════════════════════════════════════════════════════════════════════
function archiveCurrentNPCMessage() {
    if (!elements.chatHistory || !elements.speechText) return;
    
    const currentText = elements.speechText.textContent || elements.speechText.innerText;
    const currentTranslation = elements.speechTranslation?.textContent || '';
    
    if (!currentText || currentText === 'Bonjour! Bienvenue à ma boulangerie!') return; // Don't archive default
    
    // Create archived NPC message
    const npcArchive = document.createElement('div');
    npcArchive.className = 'npc-message-archived';
    npcArchive.style.cssText = `
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px 16px 16px 4px;
        padding: 12px 16px;
        max-width: 70%;
        opacity: 0.7;
        animation: slideInLeft 0.3s ease-out;
    `;
    npcArchive.innerHTML = `
        <div style="font-size: 0.9rem; color: #fff; margin-bottom: 4px;">${currentText}</div>
        ${currentTranslation ? `<div style="font-size: 0.8rem; color: #4ecdc4; font-style: italic;">${currentTranslation}</div>` : ''}
    `;
    
    elements.chatHistory.appendChild(npcArchive);
    elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
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
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CAMERA ZOOM ANIMATION (smooth lerp to NPC during conversation)
    // ═══════════════════════════════════════════════════════════════════════════
    if (isZoomedIn && targetCameraPos && targetLookAt) {
        // Smoothly move camera to target position
        camera.position.lerp(targetCameraPos, 0.05);
        
        // Smoothly look at NPC
        camera.lookAt(targetLookAt);
    } else if (!isZoomedIn && originalCameraPos && !isConversationActive) {
        // Smoothly return to original position when zooming out
        // (handled by updatePlayer when not in conversation)
    }
    
    // Gentle NPC idle animation (more pronounced during conversation)
    if (npc) {
        const idleIntensity = isConversationActive ? 0.03 : 0.02;
        npc.position.y = Math.sin(elapsed * 2) * idleIntensity;
        
        // NPC looks at player during conversation
        if (isConversationActive && player) {
            const lookTarget = player.position.clone();
            lookTarget.y = npc.position.y + 1.6;
            // Gentle rotation toward player
            const targetRotation = Math.atan2(
                player.position.x - npc.position.x,
                player.position.z - npc.position.z
            );
            npc.rotation.y += (targetRotation - npc.rotation.y) * 0.05;
        } else {
            npc.rotation.y = Math.sin(elapsed * 0.5) * 0.1;
        }
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

